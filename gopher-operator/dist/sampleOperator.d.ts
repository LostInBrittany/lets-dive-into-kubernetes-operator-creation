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
export default class MyOperator extends Operator {
    protected init(): Promise<void>;
}
