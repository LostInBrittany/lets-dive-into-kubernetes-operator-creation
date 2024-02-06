/*
#### Step 02

Operator that watcher Random Gopher pods
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