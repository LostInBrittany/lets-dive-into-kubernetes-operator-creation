/*
#### Step 06

Making it deployable in the cluster
*/
import Operator, { ResourceEventType }  from './operator.js';
import { KubernetesObject } from '@kubernetes/client-node';
import fetch from 'node-fetch';
import https from 'node:https';
import fs from 'node:fs';

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


let apiSpec:GopherApiSpec;

export default class GopherOperator extends Operator {
    protected async init() {
        console.log('Running operator');
        await this.watchResource('lostinbrittany.dev', 'v1alpha1', 'gopherapis', async (e) => {
            const object = e.object as GopherApi;
            apiSpec = {
                endpoint: object.spec.endpoint,
                apiKey: object.spec.apiKey
            }
            console.log('Current GopherAPI', JSON.stringify(apiSpec));
            try {
                await this.deleteAllGophers(apiSpec);
            } catch(error) {

            }
        });


        await this.watchResource('', 'v1', 'pods', async (e) => {
            const object = e.object;
            const metadata = object.metadata;

            // Reading only the random-gopher pods' related events        
            if (!metadata?.name?.match('random-gopher')) {
                return;
            }

            console.log('------------------------------------------------------------');
            console.log(`Received pod event - ${e.type}`);
            let gopher:Gopher;


            switch (e.type) {
                case ResourceEventType.Added:
                    console.log('random-gopher pod added', metadata?.name);
                    // If GopherAPI is defined, send data to the API
                    if (apiSpec.endpoint.length>0) {
                        try {
                            try {
                                gopher = await this.getGopherInfo(metadata.name, 
                                   metadata?.namespace);
               
                               console.log('Get Gopher info', gopher);
                           } catch(error) {
                               console.error('Unable to get Gopher info', error);
                               return;
                           }
                            await this.sendGopher(gopher,'POST',apiSpec);
                        } catch(error) {
                            console.error(error);
                            return;
                        }
                    }
                    break;
                case ResourceEventType.Modified:
                    console.log('random-gopher pod modified', metadata?.name);
                    // If GopherAPI is defined, send data to the API
                    if (apiSpec.endpoint.length>0) {
                        try {
                            try {
                                gopher = await this.getGopherInfo(metadata.name, 
                                   metadata?.namespace);
               
                               console.log('Get Gopher info', gopher);
                           } catch(error) {
                               console.error('Unable to get Gopher info', error);
                               return;
                           }
                            await this.sendGopher(gopher,'PUT',apiSpec);
                        } catch(error) {
                            console.log('REFUCK')
                            console.error(error);
                            return;
                        }
                    }
                    break;
                case ResourceEventType.Deleted:
                    console.log('random-gopher pod deleted', metadata?.name);
                    // If GopherAPI is defined, send data to the API
                    if (apiSpec.endpoint.length>0) {
                        try {
                            await this.deleteGopher(metadata.name,apiSpec);
                        } catch(error) {
                            console.error(error);
                            return;
                        }
                    }
                    break;
            }
        });
    }
    getServiceAccountToken(): string {
        let currentUser = this.kubeConfig.getCurrentUser();
        if (!currentUser || currentUser.name != 'inClusterUser') {
            return '';
        }
        let tokenFile = currentUser.authProvider?.config.tokenFile;
        return fs.readFileSync(tokenFile).toString();
    }
    async getGopherInfo(pod: string, namespace:string|any): Promise<Gopher> {
        
        // Preparing the credentials for K8s API
        const opts:https.RequestOptions = {};
        this.kubeConfig.applyToHTTPSOptions(opts);
        const agent = new https.Agent({ 
            ca:opts.ca,
            cert: opts.cert,
            key: opts.key,
        });
        let headers:any = {};
        let bearerToken = this.getServiceAccountToken();
        if (bearerToken) {
            headers['Authorization']= `Bearer ${bearerToken}`;
        };

        let gopherName:string ;
        // Recovering the Gopher
        try {
            let response = await fetch(`${this.kubeConfig.getCurrentCluster()?.server}/api/v1/namespaces/${
                namespace}/pods/${pod}/proxy/gopher/name`,
                { agent: agent,
                  headers: headers}
            );
            if (response.status != 200) {
                let message = await(response.text())
                throw `${response.status} - ${message}`;
            }
            gopherName = await response.text();

        } catch(error) {
            throw error;
        }

        let gopher:Gopher = {
            id: pod,
            name: gopherName,
            displayname: pod,
            url: `https://github.com/scraly/gophers/blob/main/${gopherName}?raw=true`
        }
        console.log('Gopher', JSON.stringify(gopher));
        return gopher;
    }

    async deleteAllGophers(api: GopherApiSpec){
        console.log(`Deleting all gophers`);

        try {
            let response = await fetch(`${api.endpoint}/gophers`, {
                method: 'DELETE',
                headers: {
                    'x-api-key': api.apiKey,
                    'Content-Type': 'application/json'
                },
            });
            if (response.status != 200) {
                let message = await(response.text())
                throw `${response.status} - ${message}`;
            }
            let responseJSON = await response.json();
            console.log('API response', response.status, JSON.stringify(responseJSON));
        } catch(error) {
            throw error;
        }
    }
    async deleteGopher(id: String, api: GopherApiSpec){
        console.log(`Deleting gopher ${id}`);

        try {
            let response = await fetch(`${api.endpoint}/gopher?id=${id}`, {
                method: 'DELETE',
                headers: {
                    'x-api-key': api.apiKey,
                    'Content-Type': 'application/json'
                },
            });
            if (response.status != 200) {
                let message = await(response.text())
                throw `${response.status} - ${message}`;
            }
            let responseText = await response.text();
            console.log('API response', response.status, JSON.stringify(responseText));
        } catch(error) {
            throw error;
        }
        
    }
    async sendGopher(gopher: Gopher, method:string, api: GopherApiSpec) {

        console.log(`Sending gopher ${gopher.id} - ${gopher.name}, method ${method}`);

        try {
            let response = await fetch(`${api.endpoint}/gopher`, {
                method: method,
                headers: {
                    'x-api-key': api.apiKey,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(gopher),
              }
            );

            if (response.status != 200) {
                let message = await(response.text())
                throw `${response.status} - ${message}`;
            }
            let responseJSON = await response.json();
            console.log('API response', response.status, responseJSON);
        } catch(error) {
            throw error;
        }
    }
}

const operator = new GopherOperator(console);
await operator.start();

console.log('Operator started');

const exit = (reason: string) => {
    operator.stop();
    process.exit(0);
};

process.on('SIGTERM', () => exit('SIGTERM'))
    .on('SIGINT', () => exit('SIGINT'));