/*
#### Step 02

Operator that watcher Random Gopher pods
*/
import Operator, { ResourceEventType } from './operator.js';
export default class GopherOperator extends Operator {
    async init() {
        await this.watchResource('', 'v1', 'pods', async (e) => {
            var _a;
            const object = e.object;
            const metadata = object.metadata;
            if (!((_a = metadata === null || metadata === void 0 ? void 0 : metadata.name) === null || _a === void 0 ? void 0 : _a.match('random-gopher'))) {
                return;
            }
            switch (e.type) {
                case ResourceEventType.Added:
                    console.log('random-gopher pod added', metadata === null || metadata === void 0 ? void 0 : metadata.name);
                    break;
                case ResourceEventType.Modified:
                    console.log('random-gopher pod modified', metadata === null || metadata === void 0 ? void 0 : metadata.name);
                    break;
                case ResourceEventType.Deleted:
                    console.log('random-gopher pod deleted', metadata === null || metadata === void 0 ? void 0 : metadata.name);
                    break;
            }
        });
    }
}
const operator = new GopherOperator();
await operator.start();
const exit = (reason) => {
    operator.stop();
    process.exit(0);
};
process.on('SIGTERM', () => exit('SIGTERM'))
    .on('SIGINT', () => exit('SIGINT'));
//# sourceMappingURL=step-02.js.map