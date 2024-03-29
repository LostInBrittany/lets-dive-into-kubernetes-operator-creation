import * as k8s from '@kubernetes/client-node';
import { KubernetesObject, V1CustomResourceDefinitionVersion } from '@kubernetes/client-node';
import { Headers } from 'gaxios';
/**
 * Logger interface.
 */
export interface OperatorLogger {
    debug(message: string): void;
    info(message: string): void;
    warn(message: string): void;
    error(message: string): void;
}
/**
 * The resource event type.
 */
export declare enum ResourceEventType {
    Added = "ADDED",
    Modified = "MODIFIED",
    Deleted = "DELETED"
}
/**
 * An event on a Kubernetes resource.
 */
export interface ResourceEvent {
    meta: ResourceMeta;
    type: ResourceEventType;
    object: KubernetesObject;
}
/**
 * Some meta information on the resource.
 */
export interface ResourceMeta {
    name: string;
    namespace?: string;
    id: string;
    resourceVersion: string;
    apiVersion: string;
    kind: string;
}
export declare class ResourceMetaImpl implements ResourceMeta {
    static createWithId(id: string, object: KubernetesObject): ResourceMeta;
    static createWithPlural(plural: string, object: KubernetesObject): ResourceMeta;
    id: string;
    name: string;
    namespace?: string;
    resourceVersion: string;
    apiVersion: string;
    kind: string;
    private constructor();
}
/**
 * Base class for an operator.
 */
export default abstract class Operator {
    protected kubeConfig: k8s.KubeConfig;
    protected k8sApi: k8s.CoreV1Api;
    protected logger: OperatorLogger;
    private resourcePathBuilders;
    private watchRequests;
    private eventQueue;
    /**
     * Constructs an operator.
     */
    constructor(logger?: OperatorLogger);
    /**
     * Run the operator, typically called from main().
     */
    start(): Promise<void>;
    stop(): void;
    /**
     * Initialize the operator, add your resource watchers here.
     */
    protected abstract init(): Promise<void>;
    /**
     * Register a custom resource defintion.
     * @param crdFile The path to the custom resource definition's YAML file
     */
    protected registerCustomResourceDefinition(crdFile: string): Promise<{
        group: string;
        versions: V1CustomResourceDefinitionVersion[];
        plural: string;
    }>;
    /**
     * Get uri to the API for your custom resource.
     * @param group The group of the custom resource
     * @param version The version of the custom resource
     * @param plural The plural name of the custom resource
     * @param namespace Optional namespace to include in the uri
     */
    protected getCustomResourceApiUri(group: string, version: string, plural: string, namespace?: string): string;
    /**
     * Watch a Kubernetes resource.
     * @param group The group of the resource or an empty string for core resources
     * @param version The version of the resource
     * @param plural The plural name of the resource
     * @param onEvent The async callback for added, modified or deleted events on the resource
     * @param namespace The namespace of the resource (optional)
     */
    protected watchResource(group: string, version: string, plural: string, onEvent: (event: ResourceEvent) => Promise<void>, namespace?: string): Promise<void>;
    /**
     * Set the status subresource of a custom resource (if it has one defined).
     * @param meta The resource to update
     * @param status The status body to set
     */
    protected setResourceStatus(meta: ResourceMeta, status: unknown): Promise<ResourceMeta | null>;
    /**
     * Patch the status subresource of a custom resource (if it has one defined).
     * @param meta The resource to update
     * @param status The status body to set in JSON Merge Patch format (https://tools.ietf.org/html/rfc7386)
     */
    protected patchResourceStatus(meta: ResourceMeta, status: unknown): Promise<ResourceMeta | null>;
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
    protected handleResourceFinalizer(event: ResourceEvent, finalizer: string, deleteAction: (event: ResourceEvent) => Promise<void>): Promise<boolean>;
    /**
     * Set (or clear) the finalizers of a resource.
     * @param meta The resource to update
     * @param finalizers The array of finalizers for this resource
     */
    protected setResourceFinalizers(meta: ResourceMeta, finalizers: string[]): Promise<void>;
    /**
     * Apply authentication to an axios request config.
     * @param request the axios request config
     */
    protected applyAxiosKubeConfigAuth(request: {
        headers?: Record<string, string | number | boolean>;
        httpsAgent?: any;
        auth?: {
            username: string;
            password: string;
        };
    }): Promise<void>;
    /**
     * Apply authentication to an axios request config.
     * @param options the axios request config
     */
    protected applyGaxiosKubeConfigAuth(options: {
        headers?: Headers;
        agent?: any;
    }): Promise<void>;
    private resourceStatusRequest;
    private errorToJson;
}
