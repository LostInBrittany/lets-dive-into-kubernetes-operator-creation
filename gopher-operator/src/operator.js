"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResourceMetaImpl = exports.ResourceEventType = void 0;
var Async = require("async");
var FS = require("fs");
var k8s = require("@kubernetes/client-node");
var https = require("https");
var client_node_1 = require("@kubernetes/client-node");
var gaxios_1 = require("gaxios");
var NullLogger = /** @class */ (function () {
    function NullLogger() {
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    NullLogger.prototype.debug = function (message) {
        // no-op
    };
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    NullLogger.prototype.info = function (message) {
        // no-op
    };
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    NullLogger.prototype.warn = function (message) {
        // no-op
    };
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    NullLogger.prototype.error = function (message) {
        // no-op
    };
    return NullLogger;
}());
/**
 * The resource event type.
 */
var ResourceEventType;
(function (ResourceEventType) {
    ResourceEventType["Added"] = "ADDED";
    ResourceEventType["Modified"] = "MODIFIED";
    ResourceEventType["Deleted"] = "DELETED";
})(ResourceEventType || (exports.ResourceEventType = ResourceEventType = {}));
var ResourceMetaImpl = /** @class */ (function () {
    function ResourceMetaImpl(id, object) {
        var _a, _b;
        if (!((_a = object.metadata) === null || _a === void 0 ? void 0 : _a.name) || !((_b = object.metadata) === null || _b === void 0 ? void 0 : _b.resourceVersion) || !object.apiVersion || !object.kind) {
            throw Error("Malformed event object for '".concat(id, "'"));
        }
        this.id = id;
        this.name = object.metadata.name;
        this.namespace = object.metadata.namespace;
        this.resourceVersion = object.metadata.resourceVersion;
        this.apiVersion = object.apiVersion;
        this.kind = object.kind;
    }
    ResourceMetaImpl.createWithId = function (id, object) {
        return new ResourceMetaImpl(id, object);
    };
    ResourceMetaImpl.createWithPlural = function (plural, object) {
        return new ResourceMetaImpl("".concat(plural, ".").concat(object.apiVersion), object);
    };
    return ResourceMetaImpl;
}());
exports.ResourceMetaImpl = ResourceMetaImpl;
/**
 * Base class for an operator.
 */
var Operator = /** @class */ (function () {
    /**
     * Constructs an operator.
     */
    function Operator(logger) {
        var _this = this;
        this.resourcePathBuilders = {};
        this.watchRequests = {};
        this.kubeConfig = new k8s.KubeConfig();
        this.kubeConfig.loadFromDefault();
        this.k8sApi = this.kubeConfig.makeApiClient(k8s.CoreV1Api);
        this.logger = logger || new NullLogger();
        // Use an async queue to make sure we treat each incoming event sequentially using async/await
        this.eventQueue = Async.queue(function (args) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, args.onEvent(args.event)];
                case 1: return [2 /*return*/, _a.sent()];
            }
        }); }); });
    }
    /**
     * Run the operator, typically called from main().
     */
    Operator.prototype.start = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.init()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    Operator.prototype.stop = function () {
        for (var _i = 0, _a = Object.values(this.watchRequests); _i < _a.length; _i++) {
            var req = _a[_i];
            req.abort();
        }
    };
    /**
     * Register a custom resource defintion.
     * @param crdFile The path to the custom resource definition's YAML file
     */
    Operator.prototype.registerCustomResourceDefinition = function (crdFile) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function () {
            var crd, apiVersion, err_1;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        crd = (0, client_node_1.loadYaml)(FS.readFileSync(crdFile, 'utf8'));
                        _c.label = 1;
                    case 1:
                        _c.trys.push([1, 3, , 4]);
                        apiVersion = crd.apiVersion;
                        if (!apiVersion || !apiVersion.startsWith('apiextensions.k8s.io/')) {
                            throw new Error("Invalid CRD yaml (expected 'apiextensions.k8s.io')");
                        }
                        return [4 /*yield*/, this.kubeConfig.makeApiClient(k8s.ApiextensionsV1Api).createCustomResourceDefinition(crd)];
                    case 2:
                        _c.sent();
                        this.logger.info("registered custom resource definition '".concat((_a = crd.metadata) === null || _a === void 0 ? void 0 : _a.name, "'"));
                        return [3 /*break*/, 4];
                    case 3:
                        err_1 = _c.sent();
                        // API returns a 409 Conflict if CRD already exists.
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        if (((_b = err_1.response) === null || _b === void 0 ? void 0 : _b.statusCode) !== 409) {
                            throw err_1;
                        }
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/, {
                            group: crd.spec.group,
                            versions: crd.spec.versions,
                            plural: crd.spec.names.plural,
                        }];
                }
            });
        });
    };
    /**
     * Get uri to the API for your custom resource.
     * @param group The group of the custom resource
     * @param version The version of the custom resource
     * @param plural The plural name of the custom resource
     * @param namespace Optional namespace to include in the uri
     */
    Operator.prototype.getCustomResourceApiUri = function (group, version, plural, namespace) {
        var path = group ? "/apis/".concat(group, "/").concat(version, "/") : "/api/".concat(version, "/");
        if (namespace) {
            path += "namespaces/".concat(namespace, "/");
        }
        path += plural;
        return this.k8sApi.basePath + path;
    };
    /**
     * Watch a Kubernetes resource.
     * @param group The group of the resource or an empty string for core resources
     * @param version The version of the resource
     * @param plural The plural name of the resource
     * @param onEvent The async callback for added, modified or deleted events on the resource
     * @param namespace The namespace of the resource (optional)
     */
    Operator.prototype.watchResource = function (group, version, plural, onEvent, namespace) {
        return __awaiter(this, void 0, void 0, function () {
            var apiVersion, id, uri, watch, startWatch;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        apiVersion = group ? "".concat(group, "/").concat(version) : "".concat(version);
                        id = "".concat(plural, ".").concat(apiVersion);
                        this.resourcePathBuilders[id] = function (meta) {
                            return _this.getCustomResourceApiUri(group, version, plural, meta.namespace);
                        };
                        uri = group ? "/apis/".concat(group, "/").concat(version, "/") : "/api/".concat(version, "/");
                        if (namespace) {
                            uri += "namespaces/".concat(namespace, "/");
                        }
                        uri += plural;
                        watch = new client_node_1.Watch(this.kubeConfig);
                        startWatch = function () {
                            return watch
                                .watch(uri, {}, function (phase, obj) {
                                return _this.eventQueue.push({
                                    event: {
                                        meta: ResourceMetaImpl.createWithPlural(plural, obj),
                                        object: obj,
                                        type: phase,
                                    },
                                    onEvent: onEvent,
                                });
                            }, function (err) {
                                if (err) {
                                    _this.logger.error("watch on resource ".concat(id, " failed: ").concat(_this.errorToJson(err)));
                                    process.exit(1);
                                }
                                _this.logger.debug("restarting watch on resource ".concat(id));
                                setTimeout(startWatch, 200);
                            })
                                .catch(function (reason) {
                                _this.logger.error("watch on resource ".concat(id, " failed: ").concat(_this.errorToJson(reason)));
                                process.exit(1);
                            })
                                .then(function (req) { return (_this.watchRequests[id] = req); });
                        };
                        return [4 /*yield*/, startWatch()];
                    case 1:
                        _a.sent();
                        this.logger.info("watching resource ".concat(id));
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Set the status subresource of a custom resource (if it has one defined).
     * @param meta The resource to update
     * @param status The status body to set
     */
    Operator.prototype.setResourceStatus = function (meta, status) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.resourceStatusRequest('PUT', meta, status)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /**
     * Patch the status subresource of a custom resource (if it has one defined).
     * @param meta The resource to update
     * @param status The status body to set in JSON Merge Patch format (https://tools.ietf.org/html/rfc7386)
     */
    Operator.prototype.patchResourceStatus = function (meta, status) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.resourceStatusRequest('PATCH', meta, status)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
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
    Operator.prototype.handleResourceFinalizer = function (event, finalizer, deleteAction) {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var metadata, finalizers, finalizers;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        metadata = event.object.metadata;
                        if (!metadata || (event.type !== ResourceEventType.Added && event.type !== ResourceEventType.Modified)) {
                            return [2 /*return*/, false];
                        }
                        if (!(!metadata.deletionTimestamp && (!metadata.finalizers || !metadata.finalizers.includes(finalizer)))) return [3 /*break*/, 2];
                        finalizers = (_a = metadata.finalizers) !== null && _a !== void 0 ? _a : [];
                        finalizers.push(finalizer);
                        return [4 /*yield*/, this.setResourceFinalizers(event.meta, finalizers)];
                    case 1:
                        _b.sent();
                        return [2 /*return*/, true];
                    case 2:
                        if (!metadata.deletionTimestamp) return [3 /*break*/, 6];
                        if (!(metadata.finalizers && metadata.finalizers.includes(finalizer))) return [3 /*break*/, 5];
                        // Resource is marked for deletion with our finalizer still set. So run the delete action
                        // and clear the finalizer, so the resource will actually be deleted by Kubernetes.
                        return [4 /*yield*/, deleteAction(event)];
                    case 3:
                        // Resource is marked for deletion with our finalizer still set. So run the delete action
                        // and clear the finalizer, so the resource will actually be deleted by Kubernetes.
                        _b.sent();
                        finalizers = metadata.finalizers.filter(function (f) { return f !== finalizer; });
                        return [4 /*yield*/, this.setResourceFinalizers(event.meta, finalizers)];
                    case 4:
                        _b.sent();
                        _b.label = 5;
                    case 5: 
                    // Resource is marked for deletion, so don't process it further.
                    return [2 /*return*/, true];
                    case 6: return [2 /*return*/, false];
                }
            });
        });
    };
    /**
     * Set (or clear) the finalizers of a resource.
     * @param meta The resource to update
     * @param finalizers The array of finalizers for this resource
     */
    Operator.prototype.setResourceFinalizers = function (meta, finalizers) {
        return __awaiter(this, void 0, void 0, function () {
            var options;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        options = {
                            method: 'PATCH',
                            url: "".concat(this.resourcePathBuilders[meta.id](meta), "/").concat(meta.name),
                            data: {
                                metadata: {
                                    finalizers: finalizers,
                                },
                            },
                            headers: {
                                'Content-Type': 'application/merge-patch+json',
                            },
                        };
                        return [4 /*yield*/, this.applyGaxiosKubeConfigAuth(options)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, gaxios_1.instance.request(options).catch(function (error) {
                                if (error) {
                                    _this.logger.error(_this.errorToJson(error));
                                    return;
                                }
                            })];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Apply authentication to an axios request config.
     * @param request the axios request config
     */
    Operator.prototype.applyAxiosKubeConfigAuth = function (request) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function () {
            var opts, userPassword;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        opts = {};
                        return [4 /*yield*/, this.kubeConfig.applyToHTTPSOptions(opts)];
                    case 1:
                        _c.sent();
                        if ((_a = opts.headers) === null || _a === void 0 ? void 0 : _a.Authorization) {
                            request.headers = (_b = request.headers) !== null && _b !== void 0 ? _b : {};
                            request.headers.Authorization = opts.headers.Authorization;
                        }
                        if (opts.auth) {
                            userPassword = opts.auth.split(':');
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
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Apply authentication to an axios request config.
     * @param options the axios request config
     */
    Operator.prototype.applyGaxiosKubeConfigAuth = function (options) {
        var _a, _b, _c;
        return __awaiter(this, void 0, void 0, function () {
            var opts;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        opts = {};
                        return [4 /*yield*/, this.kubeConfig.applyToHTTPSOptions(opts)];
                    case 1:
                        _d.sent();
                        if ((_a = opts.headers) === null || _a === void 0 ? void 0 : _a.Authorization) {
                            options.headers = (_b = options.headers) !== null && _b !== void 0 ? _b : {};
                            options.headers.Authorization = opts.headers.Authorization;
                        }
                        else if (opts.auth) {
                            options.headers = (_c = options.headers) !== null && _c !== void 0 ? _c : {};
                            options.headers.Authorization = "Basic ".concat(Buffer.from(opts.auth).toString('base64'));
                        }
                        if (opts.ca || opts.cert || opts.key) {
                            options.agent = new https.Agent({
                                ca: opts.ca,
                                cert: opts.cert,
                                key: opts.key,
                            });
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    Operator.prototype.resourceStatusRequest = function (method, meta, status) {
        return __awaiter(this, void 0, void 0, function () {
            var body, options, response, err_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        body = {
                            apiVersion: meta.apiVersion,
                            kind: meta.kind,
                            metadata: {
                                name: meta.name,
                                resourceVersion: meta.resourceVersion,
                            },
                            status: status,
                        };
                        if (meta.namespace) {
                            body.metadata.namespace = meta.namespace;
                        }
                        options = {
                            method: method,
                            url: this.resourcePathBuilders[meta.id](meta) + "/".concat(meta.name, "/status"),
                            data: body,
                        };
                        if (method === 'PATCH') {
                            options.headers = {
                                'Content-Type': 'application/merge-patch+json',
                            };
                        }
                        return [4 /*yield*/, this.applyGaxiosKubeConfigAuth(options)];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 4, , 5]);
                        return [4 /*yield*/, gaxios_1.instance.request(options)];
                    case 3:
                        response = _a.sent();
                        return [2 /*return*/, response ? ResourceMetaImpl.createWithId(meta.id, response.data) : null];
                    case 4:
                        err_2 = _a.sent();
                        this.logger.error(this.errorToJson(err_2));
                        return [2 /*return*/, null];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    Operator.prototype.errorToJson = function (err) {
        if (typeof err === 'string') {
            return err;
        }
        else if ((err === null || err === void 0 ? void 0 : err.message) && err.stack) {
            return JSON.stringify(err, ['name', 'message', 'stack']);
        }
        return JSON.stringify(err);
    };
    return Operator;
}());
exports.default = Operator;
