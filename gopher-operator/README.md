# Gopher operator


## Let's understand how to create an operator


### Operator that watches pods

```typescript

Operator that watches pods
*/
import Operator, { ResourceEventType, ResourceEvent }  from './operator.js';

export default class GopherOperator extends Operator {
    protected async init() {
        await this.watchResource('', 'v1', 'pods', async (e) => {
            const object = e.object;
            const metadata = object.metadata;

            switch (e.type) {
                case ResourceEventType.Added:
                    console.log("Pod added, name", metadata?.name);
                    break;
                case ResourceEventType.Modified:
                    console.log("Pod modified, name", metadata?.name);
                    break;
                case ResourceEventType.Deleted:
                    console.log("Pod deleted, name", metadata?.name);
                    break;
            }
        });
    }
}

const operator = new GopherOperator();
await operator.start();

console.log("Operator started")

const exit = (reason: string) => {
    operator.stop();
    console.log("Operator stopped")
    process.exit(0);
};

process.on('SIGTERM', () => exit('SIGTERM'))
    .on('SIGINT', () => exit('SIGINT'));
```

#### Operator that watcher Random Gopher pods


```typescript
import Operator, { ResourceEventType }  from './operator.js';

export default class GopherOperator extends Operator {
    protected async init() {
        await this.watchResource('', 'v1', 'pods', async (e) => {
            const object = e.object;
            const metadata = object.metadata;
            
            if (!metadata?.name?.match('random-gopher')) {
                return;
            }

            switch (e.type) {
                case ResourceEventType.Added:
                    console.log('random-gopher pod added', metadata?.name);
                    break;
                case ResourceEventType.Modified:
                    console.log('random-gopher pod modified', metadata?.name);
                    break;
                case ResourceEventType.Deleted:
                    console.log('random-gopher pod deleted', metadata?.name);
                    break;
            }
        });
    }
}

const operator = new GopherOperator();
await operator.start();

const exit = (reason: string) => {
    operator.stop();
    process.exit(0);
};

process.on('SIGTERM', () => exit('SIGTERM'))
    .on('SIGINT', () => exit('SIGINT'));
```


#### Operator that contacts K8s API to get the random-gopher pod's details

```typescript
import Operator, { ResourceEventType }  from './operator.js';
import fetch from 'node-fetch';
import https from 'node:https';


export default class GopherOperator extends Operator {
    protected async init() {
        await this.watchResource('', 'v1', 'pods', async (e) => {
            const object = e.object;
            const metadata = object.metadata;

            // Reading only the random-gopher pods' related events        
            if (!metadata?.name?.match('random-gopher')) {
                return;
            }

            // Preparing the credentials for K8s API
            const opts:https.RequestOptions = {};
            this.kubeConfig.applyToHTTPSOptions(opts);
            const agent = new https.Agent({ 
                ca:opts.ca,
                cert: opts.cert,
                key: opts.key,
            });

            let gopher:string;
            // Recovering the Gopher
            try {
                console.log(`Asking info about pod ${metadata?.name}`)
                let response = await fetch(`${this.kubeConfig.getCurrentCluster()?.server}/api/v1/namespaces/${
                    metadata?.namespace}/pods/${metadata?.name}/proxy/gopher/name`,
                    { agent: agent }
                );
                gopher = await response.text();
                console.log(`Pod ${metadata?.name} is gopher ${gopher}`)

            } catch(error) {
                console.log(error);
            }
              
            switch (e.type) {
                case ResourceEventType.Added:
                    // console.log('random-gopher pod added', metadata?.name);
                    break;
                case ResourceEventType.Modified:
                    // console.log('random-gopher pod modified', metadata?.name);
                    break;
                case ResourceEventType.Deleted:
                    // console.log('random-gopher pod deleted', metadata?.name);
                    break;
            }
        });
    }
}

const operator = new GopherOperator();
await operator.start();

const exit = (reason: string) => {
    operator.stop();
    process.exit(0);
};

process.on('SIGTERM', () => exit('SIGTERM'))
    .on('SIGINT', () => exit('SIGINT'));
```

#### Operator who monitors GopherAPI Objects


Before running this operator, we need to deploy in the cluster 
the CRD for the Gopher API (`/manifests/gopher-api-crd.yaml`).

Then we can deploy Gopher API CRs (like the one in `/manifests/gopher-api-cr.yaml`).

```typescript
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
```


#### The complete operator

```js
import Operator, { ResourceEventType }  from './operator.js';
import { KubernetesObject } from '@kubernetes/client-node';
import fetch from 'node-fetch';
import https from 'node:https';
import { Url } from 'node:url';

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
    async getGopherInfo(pod: string, namespace:string|any): Promise<Gopher> {
        // Preparing the credentials for K8s API
        const opts:https.RequestOptions = {};
        this.kubeConfig.applyToHTTPSOptions(opts);
        const agent = new https.Agent({ 
            ca:opts.ca,
            cert: opts.cert,
            key: opts.key,
        });
        let gopherName:string ;
        // Recovering the Gopher
        try {
            let response = await fetch(`${this.kubeConfig.getCurrentCluster()?.server}/api/v1/namespaces/${
                namespace}/pods/${pod}/proxy/gopher/name`,
                { agent: agent }
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
```

#### Making it deployable on the cluster

```ts
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


let api:GopherApiSpec;

export default class GopherOperator extends Operator {
    protected async init() {
        console.log('Running operator');
        await this.watchResource('lostinbrittany.dev', 'v1alpha1', 'gopherapis', async (e) => {
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

            console.log('Current GopherAPI', JSON.stringify(api));
        });


        await this.watchResource('', 'v1', 'pods', async (e) => {
            console.log('Watching pods');
            const object = e.object;
            const metadata = object.metadata;

            // Reading only the random-gopher pods' related events        
            if (!metadata?.name?.match('random-gopher')) {
                return;
            }

            let gopher:Gopher;

            try {
                 gopher = await this.getGopherInfo(metadata.name, 
                    metadata?.namespace);
            } catch(error) {
                console.error(error);
                return;
            }

              
            switch (e.type) {
                case ResourceEventType.Added:
                    console.log('random-gopher pod added', metadata?.name);
                    // If GopherAPI is defined, send data to the API
                    if (api.endpoint.length>0) {
                        try {
                            this.sendGopher(gopher,'POST',api);
                        } catch(error) {
                            console.error(error);
                            return;
                        }
                    }
                    break;
                case ResourceEventType.Modified:
                    console.log('random-gopher pod modified', metadata?.name);
                    // If GopherAPI is defined, send data to the API
                    if (api.endpoint.length>0) {
                        try {
                            this.sendGopher(gopher,'PUT',api);
                        } catch(error) {
                            console.error(error);
                            return;
                        }
                    }
                    break;
                case ResourceEventType.Deleted:
                    console.log('random-gopher pod deleted', metadata?.name);
                    // If GopherAPI is defined, send data to the API
                    if (api.endpoint.length>0) {
                        try {
                            this.sendGopher(gopher,'DELETE',api);
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

        let headers:any = {};
        let bearerToken = this.getServiceAccountToken();
        if (bearerToken) {
            headers['Authorization']= `Bearer ${bearerToken}`;
        };

        const agent = new https.Agent({ 
            ca:opts.ca,
            cert: opts.cert,
            key: opts.key,
        });
        let gopherName:string ;
        // Recovering the Gopher
        try {
            let response = await fetch(`${this.kubeConfig.getCurrentCluster()?.server}/api/v1/namespaces/${
                namespace}/pods/${pod}/proxy/gopher/name`,
                { agent: agent,
                  headers: headers}
            );
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
    async sendGopher(gopher: Gopher, method:string, api: GopherApiSpec) {
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
                throw new Error();
            }
            let responseJSON = await response.json();
            console.log('API response', response.status, JSON.stringify(responseJSON));
        } catch(error) {
            throw error;
        }
    }
}

const operator = new GopherOperator();
await operator.start();

console.log('Operator started');

const exit = (reason: string) => {
    operator.stop();
    process.exit(0);
};

process.on('SIGTERM', () => exit('SIGTERM'))
    .on('SIGINT', () => exit('SIGINT'));
```