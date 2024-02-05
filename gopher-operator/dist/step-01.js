/*
#### Step 01

Operator that watches pods
*/
import Operator, { ResourceEventType } from './operator.js';
export default class GopherOperator extends Operator {
    async init() {
        await this.watchResource('', 'v1', 'pods', async (e) => {
            const object = e.object;
            const metadata = object.metadata;
            switch (e.type) {
                case ResourceEventType.Added:
                    console.log("Pod added, name", metadata === null || metadata === void 0 ? void 0 : metadata.name);
                    break;
                case ResourceEventType.Modified:
                    console.log("Pod modified, name", metadata === null || metadata === void 0 ? void 0 : metadata.name);
                    break;
                case ResourceEventType.Deleted:
                    console.log("Pod deleted, name", metadata === null || metadata === void 0 ? void 0 : metadata.name);
                    break;
            }
        });
    }
}
const operator = new GopherOperator();
await operator.start();
console.log("Operator started");
const exit = (reason) => {
    operator.stop();
    console.log("Operator stopped");
    process.exit(0);
};
process.on('SIGTERM', () => exit('SIGTERM'))
    .on('SIGINT', () => exit('SIGINT'));
//# sourceMappingURL=step-01.js.map