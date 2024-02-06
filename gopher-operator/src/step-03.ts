/* 
#### Step 02

Operator that contacts K8s API to get the random-gopher pod's details 
*/

import Operator, { ResourceEventType }  from './operator.js';
import fetch from 'node-fetch';
import https from 'node:https';
import fs from 'node:fs';


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