import Operator, { ResourceEventType, ResourceEvent }  from './operator.js';
import request from 'request';
import fetch from 'node-fetch';
import https from 'node:https';

export default class MyOperator extends Operator {
    protected async init() {
        await this.watchResource('', 'v1', 'pods', async (e) => {
            const object = e.object;
            const metadata = object.metadata;

              
            switch (e.type) {
                case ResourceEventType.Added:
                    console.log('Pod added', metadata?.name);

                    // Let's read only the Random Gopher pods related events

                    if (!metadata?.name?.match('random-gopher')) {
                        return;
                    }
                    console.log(`Pod ${metadata?.namespace||'default'}/${metadata?.name}`);

                    const opts:https.RequestOptions = {};
                    this.kubeConfig.applyToHTTPSOptions(opts);

                    try {
                        let response = await fetch(`${this.kubeConfig.getCurrentCluster()?.server}/api/v1/namespaces/${
                            metadata?.namespace}/pods/${metadata?.name}/proxy/gopher/name`,
                            { agent:  new https.Agent({ 
                                    ca:opts.ca,
                                    cert: opts.cert,
                                    key: opts.key,
                                }),
                            }
                        );
                        let body = await response.text();
                        console.log(`Response`, body);

                    } catch(error) {
                        console.log(error);
                    }
                    break;
                case ResourceEventType.Modified:
                    break;
                case ResourceEventType.Deleted:
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