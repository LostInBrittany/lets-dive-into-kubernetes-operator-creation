import Operator, { ResourceEventType } from './operator.js';
import fetch from 'node-fetch';
import https from 'node:https';
export default class MyOperator extends Operator {
    async init() {
        await this.watchResource('', 'v1', 'pods', async (e) => {
            var _a, _b;
            const object = e.object;
            const metadata = object.metadata;
            switch (e.type) {
                case ResourceEventType.Added:
                    console.log('Pod added', metadata === null || metadata === void 0 ? void 0 : metadata.name);
                    // Let's read only the Random Gopher pods related events
                    if (!((_a = metadata === null || metadata === void 0 ? void 0 : metadata.name) === null || _a === void 0 ? void 0 : _a.match('random-gopher'))) {
                        return;
                    }
                    console.log(`Pod ${(metadata === null || metadata === void 0 ? void 0 : metadata.namespace) || 'default'}/${metadata === null || metadata === void 0 ? void 0 : metadata.name}`);
                    const opts = {};
                    this.kubeConfig.applyToHTTPSOptions(opts);
                    try {
                        let response = await fetch(`${(_b = this.kubeConfig.getCurrentCluster()) === null || _b === void 0 ? void 0 : _b.server}/api/v1/namespaces/${metadata === null || metadata === void 0 ? void 0 : metadata.namespace}/pods/${metadata === null || metadata === void 0 ? void 0 : metadata.name}/proxy/gopher/name`, { agent: new https.Agent({
                                ca: opts.ca,
                                cert: opts.cert,
                                key: opts.key,
                            }),
                        });
                        let body = await response.text();
                        console.log(`Response`, body);
                    }
                    catch (error) {
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
const exit = (reason) => {
    operator.stop();
    process.exit(0);
};
process.on('SIGTERM', () => exit('SIGTERM'))
    .on('SIGINT', () => exit('SIGINT'));
//# sourceMappingURL=index.js.map