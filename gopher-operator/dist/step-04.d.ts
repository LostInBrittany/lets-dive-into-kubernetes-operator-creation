import Operator from './operator.js';
import { KubernetesObject } from '@kubernetes/client-node';
export interface GopherApi extends KubernetesObject {
    spec: GopherApiSpec;
}
export interface GopherApiSpec {
    endpoint: string;
    apiKey: string;
}
export default class GopherOperator extends Operator {
    protected init(): Promise<void>;
}
