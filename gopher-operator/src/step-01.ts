/*
#### Step 01

Operator that watches pods
*/
import Operator, { ResourceEventType, ResourceEvent }  from './operator.js';
import fetch from 'node-fetch';
import https from 'node:https';
import fs from 'node:fs';

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