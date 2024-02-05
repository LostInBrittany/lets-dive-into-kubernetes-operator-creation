/*
#### Step 04

Operator who monitors GopherAPI Objects


Before running this operator, we need to deploy in the cluster
the CRD for the Gopher API (/manifests/gopher-api-crd.yaml).

Then we can deploy Gopher API CRs (like the one in /manifests/gopher-api-cr.yaml)
*/
import Operator, { ResourceEventType } from './operator.js';
let apiSpec;
export default class GopherOperator extends Operator {
    async init() {
        await this.watchResource('', 'v1', 'pods', async (e) => { });
        await this.watchResource('lostinbrittany.dev', 'v1alpha1', 'gopherapis', async (e) => {
            const object = e.object;
            apiSpec = {
                endpoint: object.spec.endpoint,
                apiKey: object.spec.apiKey
            };
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
const exit = (reason) => {
    operator.stop();
    process.exit(0);
};
process.on('SIGTERM', () => exit('SIGTERM'))
    .on('SIGINT', () => exit('SIGINT'));
//# sourceMappingURL=step-04.js.map