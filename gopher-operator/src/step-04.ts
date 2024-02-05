/*
#### Step 04

Operator who monitors GopherAPI Objects


Before running this operator, we need to deploy in the cluster 
the CRD for the Gopher API (/manifests/gopher-api-crd.yaml).

Then we can deploy Gopher API CRs (like the one in /manifests/gopher-api-cr.yaml)
*/
import Operator, { ResourceEventType }  from './operator.js';
import { KubernetesObject } from '@kubernetes/client-node';
import fetch from 'node-fetch';
import https from 'node:https';


export interface GopherApi extends KubernetesObject {
    spec: GopherApiSpec;
}

export interface GopherApiSpec {
    endpoint: string;
    apiKey: string;
}

let apiSpec:GopherApiSpec;

export default class GopherOperator extends Operator {
    protected async init() {


        await this.watchResource('', 'v1', 'pods', async (e) => {});
        
        await this.watchResource('lostinbrittany.dev', 'v1alpha1', 'gopherapis', async (e) => {
            const object = e.object as GopherApi;
            apiSpec = {
                endpoint: object.spec.endpoint,
                apiKey: object.spec.apiKey
            }
            switch (e.type) {
                case ResourceEventType.Added:
                    console.log(`Added Gopher API:`, apiSpec);
                    break;
                case ResourceEventType.Modified:
                    console.log(`Modified Gopher API`, apiSpec);
                    break;
                case ResourceEventType.Deleted:
                    console.log(`Deleted Gopher API`, apiSpec);
                    break;
            }
        });
    }
}

const operator = new GopherOperator(console);
await operator.start();
console.log(`Operator started`);

const exit = (reason: string) => {
    operator.stop();
    process.exit(0);
};

process.on('SIGTERM', () => exit('SIGTERM'))
    .on('SIGINT', () => exit('SIGINT'));