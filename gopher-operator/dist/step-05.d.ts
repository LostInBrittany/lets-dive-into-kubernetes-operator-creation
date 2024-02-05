import Operator from './operator.js';
import { KubernetesObject } from '@kubernetes/client-node';
export interface Gopher {
    id: string;
    name: string;
    displayname: string;
    url: string;
}
export interface GopherApi extends KubernetesObject {
    spec: GopherApiSpec;
}
export interface GopherApiSpec {
    endpoint: string;
    apiKey: string;
}
export default class GopherOperator extends Operator {
    protected init(): Promise<void>;
    getGopherInfo(pod: string, namespace: string | any): Promise<Gopher>;
    deleteAllGophers(api: GopherApiSpec): Promise<void>;
    deleteGopher(id: String, api: GopherApiSpec): Promise<void>;
    sendGopher(gopher: Gopher, method: string, api: GopherApiSpec): Promise<void>;
}
