import Operator, { ResourceEventType, ResourceEvent }  from './operator.js';
import { KubernetesObject } from '@kubernetes/client-node';


export interface Gopher {
    id: string,
    name: string,
    displayname: string,
    url: string
}

export interface GopherApi extends KubernetesObject {
    spec: GopherApiSpec;
}

export interface GopherApiSpec {
    endpoint: string;
    apiKey: string;
}


let api:GopherApiSpec;

export default class MyOperator extends Operator {
    protected async init() {

        await this.watchResource('lostinbrittany.dev', 'v1alpha1', 'gopherapis', async (e) => {

            console.log('Watching GopherAPI');
            const object = e.object as GopherApi;

            switch (e.type) {
                case ResourceEventType.Added:
                    api = {
                        endpoint: object.spec.endpoint,
                        apiKey: object.spec.apiKey
                    }
                    break;
                case ResourceEventType.Modified:
                    api = {
                        endpoint: object.spec.endpoint,
                        apiKey: object.spec.apiKey
                    }
                    break;
                case ResourceEventType.Deleted:
                    api = {
                        endpoint: '',
                        apiKey: ''
                    }
                    break;
            }
        });
        await this.watchResource('', 'v1', 'pods', async (e) => {
            const object = e.object;
            const metadata = object.metadata;

            switch (e.type) {
                case ResourceEventType.Added:
                    // do something useful here
                    break;
                case ResourceEventType.Modified:
                    // do something useful here
                    break;
                case ResourceEventType.Deleted:
                    // do something useful here
                    break;
            }
        });
    }
}

const operator = new MyOperator();
await operator.start();

const exit = (reason: string) => {
    operator.stop();
    process.exit(0);
};

process.on('SIGTERM', () => exit('SIGTERM'))
    .on('SIGINT', () => exit('SIGINT'));