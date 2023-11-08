# Gopher operator


## Let's understand how to create an operator


### Operator that watches pods

```typescript
import Operator, { ResourceEventType, ResourceEvent }  from './operator.js';

export default class GopherOperator extends Operator {
    protected async init() {
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

const operator = new GopherOperator();
await operator.start();

const exit = (reason: string) => {
    operator.stop();
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
                let response = await fetch(`${this.kubeConfig.getCurrentCluster()?.server}/api/v1/namespaces/${
                    metadata?.namespace}/pods/${metadata?.name}/proxy/gopher/name`,
                    { agent: agent }
                );
                gopher = await response.text();

            } catch(error) {
                console.log(error);
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

#### Operator who monitors GopherAPI Objects

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

let api:GopherApiSpec;

export default class GopherOperator extends Operator {
    protected async init() {
        await this.watchResource('', 'v1', 'pods', async (e) => {});

        await this.watchResource('lostinbrittany.dev', 'v1alpha1', 'GopherAPI', async (e) => {
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