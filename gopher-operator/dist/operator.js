import * as Async from 'async';
import * as FS from 'fs';
import * as k8s from '@kubernetes/client-node';
import * as https from 'https';
import { loadYaml, Watch, } from '@kubernetes/client-node';
import { instance as gaxios } from 'gaxios';
class NullLogger {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    debug(message) {
        // no-op
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    info(message) {
        // no-op
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    warn(message) {
        // no-op
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    error(message) {
        // no-op
    }
}
/**
 * The resource event type.
 */
export var ResourceEventType;
(function (ResourceEventType) {
    ResourceEventType["Added"] = "ADDED";
    ResourceEventType["Modified"] = "MODIFIED";
    ResourceEventType["Deleted"] = "DELETED";
})(ResourceEventType || (ResourceEventType = {}));
export class ResourceMetaImpl {
    static createWithId(id, object) {
        return new ResourceMetaImpl(id, object);
    }
    static createWithPlural(plural, object) {
        return new ResourceMetaImpl(`${plural}.${object.apiVersion}`, object);
    }
    constructor(id, object) {
        var _a, _b;
        if (!((_a = object.metadata) === null || _a === void 0 ? void 0 : _a.name) || !((_b = object.metadata) === null || _b === void 0 ? void 0 : _b.resourceVersion) || !object.apiVersion || !object.kind) {
            throw Error(`Malformed event object for '${id}'`);
        }
        this.id = id;
        this.name = object.metadata.name;
        this.namespace = object.metadata.namespace;
        this.resourceVersion = object.metadata.resourceVersion;
        this.apiVersion = object.apiVersion;
        this.kind = object.kind;
    }
}
/**
 * Base class for an operator.
 */
export default class Operator {
    /**
     * Constructs an operator.
     */
    constructor(logger) {
        this.resourcePathBuilders = {};
        this.watchRequests = {};
        this.kubeConfig = new k8s.KubeConfig();
        this.kubeConfig.loadFromDefault();
        this.k8sApi = this.kubeConfig.makeApiClient(k8s.CoreV1Api);
        this.logger = logger || new NullLogger();
        // Use an async queue to make sure we treat each incoming event sequentially using async/await
        this.eventQueue = Async.queue(async (args) => await args.onEvent(args.event));
    }
    /**
     * Run the operator, typically called from main().
     */
    async start() {
        await this.init();
    }
    stop() {
        for (const req of Object.values(this.watchRequests)) {
            req.abort();
        }
    }
    /**
     * Register a custom resource defintion.
     * @param crdFile The path to the custom resource definition's YAML file
     */
    async registerCustomResourceDefinition(crdFile) {
        var _a, _b;
        const crd = loadYaml(FS.readFileSync(crdFile, 'utf8'));
        try {
            const apiVersion = crd.apiVersion;
            if (!apiVersion || !apiVersion.startsWith('apiextensions.k8s.io/')) {
                throw new Error("Invalid CRD yaml (expected 'apiextensions.k8s.io')");
            }
            await this.kubeConfig.makeApiClient(k8s.ApiextensionsV1Api).createCustomResourceDefinition(crd);
            this.logger.info(`registered custom resource definition '${(_a = crd.metadata) === null || _a === void 0 ? void 0 : _a.name}'`);
        }
        catch (err) {
            // API returns a 409 Conflict if CRD already exists.
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            if (((_b = err.response) === null || _b === void 0 ? void 0 : _b.statusCode) !== 409) {
                throw err;
            }
        }
        return {
            group: crd.spec.group,
            versions: crd.spec.versions,
            plural: crd.spec.names.plural,
        };
    }
    /**
     * Get uri to the API for your custom resource.
     * @param group The group of the custom resource
     * @param version The version of the custom resource
     * @param plural The plural name of the custom resource
     * @param namespace Optional namespace to include in the uri
     */
    getCustomResourceApiUri(group, version, plural, namespace) {
        let path = group ? `/apis/${group}/${version}/` : `/api/${version}/`;
        if (namespace) {
            path += `namespaces/${namespace}/`;
        }
        path += plural;
        return this.k8sApi.basePath + path;
    }
    /**
     * Watch a Kubernetes resource.
     * @param group The group of the resource or an empty string for core resources
     * @param version The version of the resource
     * @param plural The plural name of the resource
     * @param onEvent The async callback for added, modified or deleted events on the resource
     * @param namespace The namespace of the resource (optional)
     */
    async watchResource(group, version, plural, onEvent, namespace) {
        const apiVersion = group ? `${group}/${version}` : `${version}`;
        const id = `${plural}.${apiVersion}`;
        this.resourcePathBuilders[id] = (meta) => this.getCustomResourceApiUri(group, version, plural, meta.namespace);
        //
        // Create "infinite" watch so we automatically recover in case the stream stops or gives an error.
        //
        let uri = group ? `/apis/${group}/${version}/` : `/api/${version}/`;
        if (namespace) {
            uri += `namespaces/${namespace}/`;
        }
        uri += plural;
        const watch = new Watch(this.kubeConfig);
        const startWatch = () => watch
            .watch(uri, {}, (phase, obj) => this.eventQueue.push({
            event: {
                meta: ResourceMetaImpl.createWithPlural(plural, obj),
                object: obj,
                type: phase,
            },
            onEvent,
        }), (err) => {
            if (err) {
                this.logger.error(`watch on resource ${id} failed: ${this.errorToJson(err)}`);
                process.exit(1);
            }
            this.logger.debug(`restarting watch on resource ${id}`);
            setTimeout(startWatch, 200);
        })
            .catch((reason) => {
            this.logger.error(`watch on resource ${id} failed: ${this.errorToJson(reason)}`);
            process.exit(1);
        })
            .then((req) => (this.watchRequests[id] = req));
        await startWatch();
        this.logger.info(`watching resource ${id}`);
    }
    /**
     * Set the status subresource of a custom resource (if it has one defined).
     * @param meta The resource to update
     * @param status The status body to set
     */
    async setResourceStatus(meta, status) {
        return await this.resourceStatusRequest('PUT', meta, status);
    }
    /**
     * Patch the status subresource of a custom resource (if it has one defined).
     * @param meta The resource to update
     * @param status The status body to set in JSON Merge Patch format (https://tools.ietf.org/html/rfc7386)
     */
    async patchResourceStatus(meta, status) {
        return await this.resourceStatusRequest('PATCH', meta, status);
    }
    /**
     * Handle deletion of resource using a unique finalizer. Call this when you receive an added or modified event.
     *
     * If the resource doesn't have the finalizer set yet, it will be added. If the finalizer is set and the resource
     * is marked for deletion by Kubernetes your 'deleteAction' action will be called and the finalizer will be removed.
     * @param event The added or modified event.
     * @param finalizer Your unique finalizer string
     * @param deleteAction An async action that will be called before your resource is deleted.
     * @returns True if no further action is needed, false if you still need to process the added or modified event yourself.
     */
    async handleResourceFinalizer(event, finalizer, deleteAction) {
        var _a;
        const metadata = event.object.metadata;
        if (!metadata || (event.type !== ResourceEventType.Added && event.type !== ResourceEventType.Modified)) {
            return false;
        }
        if (!metadata.deletionTimestamp && (!metadata.finalizers || !metadata.finalizers.includes(finalizer))) {
            // Make sure our finalizer is added when the resource is first created.
            const finalizers = (_a = metadata.finalizers) !== null && _a !== void 0 ? _a : [];
            finalizers.push(finalizer);
            await this.setResourceFinalizers(event.meta, finalizers);
            return true;
        }
        else if (metadata.deletionTimestamp) {
            if (metadata.finalizers && metadata.finalizers.includes(finalizer)) {
                // Resource is marked for deletion with our finalizer still set. So run the delete action
                // and clear the finalizer, so the resource will actually be deleted by Kubernetes.
                await deleteAction(event);
                const finalizers = metadata.finalizers.filter((f) => f !== finalizer);
                await this.setResourceFinalizers(event.meta, finalizers);
            }
            // Resource is marked for deletion, so don't process it further.
            return true;
        }
        return false;
    }
    /**
     * Set (or clear) the finalizers of a resource.
     * @param meta The resource to update
     * @param finalizers The array of finalizers for this resource
     */
    async setResourceFinalizers(meta, finalizers) {
        const options = {
            method: 'PATCH',
            url: `${this.resourcePathBuilders[meta.id](meta)}/${meta.name}`,
            data: {
                metadata: {
                    finalizers,
                },
            },
            headers: {
                'Content-Type': 'application/merge-patch+json',
            },
        };
        await this.applyGaxiosKubeConfigAuth(options);
        await gaxios.request(options).catch((error) => {
            if (error) {
                this.logger.error(this.errorToJson(error));
                return;
            }
        });
    }
    /**
     * Apply authentication to an axios request config.
     * @param request the axios request config
     */
    async applyAxiosKubeConfigAuth(request) {
        var _a, _b;
        const opts = {};
        await this.kubeConfig.applyToHTTPSOptions(opts);
        if ((_a = opts.headers) === null || _a === void 0 ? void 0 : _a.Authorization) {
            request.headers = (_b = request.headers) !== null && _b !== void 0 ? _b : {};
            request.headers.Authorization = opts.headers.Authorization;
        }
        if (opts.auth) {
            const userPassword = opts.auth.split(':');
            request.auth = {
                username: userPassword[0],
                password: userPassword[1],
            };
        }
        if (opts.ca || opts.cert || opts.key) {
            request.httpsAgent = new https.Agent({
                ca: opts.ca,
                cert: opts.cert,
                key: opts.key,
            });
        }
    }
    /**
     * Apply authentication to an axios request config.
     * @param options the axios request config
     */
    async applyGaxiosKubeConfigAuth(options) {
        var _a, _b, _c;
        const opts = {};
        await this.kubeConfig.applyToHTTPSOptions(opts);
        if ((_a = opts.headers) === null || _a === void 0 ? void 0 : _a.Authorization) {
            options.headers = (_b = options.headers) !== null && _b !== void 0 ? _b : {};
            options.headers.Authorization = opts.headers.Authorization;
        }
        else if (opts.auth) {
            options.headers = (_c = options.headers) !== null && _c !== void 0 ? _c : {};
            options.headers.Authorization = `Basic ${Buffer.from(opts.auth).toString('base64')}`;
        }
        if (opts.ca || opts.cert || opts.key) {
            options.agent = new https.Agent({
                ca: opts.ca,
                cert: opts.cert,
                key: opts.key,
            });
        }
    }
    async resourceStatusRequest(method, meta, status) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const body = {
            apiVersion: meta.apiVersion,
            kind: meta.kind,
            metadata: {
                name: meta.name,
                resourceVersion: meta.resourceVersion,
            },
            status,
        };
        if (meta.namespace) {
            body.metadata.namespace = meta.namespace;
        }
        const options = {
            method,
            url: this.resourcePathBuilders[meta.id](meta) + `/${meta.name}/status`,
            data: body,
        };
        if (method === 'PATCH') {
            options.headers = {
                'Content-Type': 'application/merge-patch+json',
            };
        }
        await this.applyGaxiosKubeConfigAuth(options);
        try {
            const response = await gaxios.request(options);
            return response ? ResourceMetaImpl.createWithId(meta.id, response.data) : null;
        }
        catch (err) {
            this.logger.error(this.errorToJson(err));
            return null;
        }
    }
    errorToJson(err) {
        if (typeof err === 'string') {
            return err;
        }
        else if ((err === null || err === void 0 ? void 0 : err.message) && err.stack) {
            return JSON.stringify(err, ['name', 'message', 'stack']);
        }
        return JSON.stringify(err);
    }
}
//# sourceMappingURL=operator.js.map