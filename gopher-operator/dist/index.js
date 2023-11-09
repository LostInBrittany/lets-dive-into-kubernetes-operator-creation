import Operator, { ResourceEventType } from './operator.js';
import fetch from 'node-fetch';
import https from 'node:https';
import fs from 'node:fs';
let api;
export default class GopherOperator extends Operator {
    async init() {
        console.log('Running operator');
        await this.watchResource('lostinbrittany.dev', 'v1alpha1', 'gopherapis', async (e) => {
            const object = e.object;
            switch (e.type) {
                case ResourceEventType.Added:
                    api = {
                        endpoint: object.spec.endpoint,
                        apiKey: object.spec.apiKey
                    };
                    break;
                case ResourceEventType.Modified:
                    api = {
                        endpoint: object.spec.endpoint,
                        apiKey: object.spec.apiKey
                    };
                    break;
                case ResourceEventType.Deleted:
                    api = {
                        endpoint: '',
                        apiKey: ''
                    };
                    break;
            }
            console.log('Current GopherAPI', JSON.stringify(api));
        });
        await this.watchResource('', 'v1', 'pods', async (e) => {
            var _a;
            console.log('Watching pods');
            const object = e.object;
            const metadata = object.metadata;
            // Reading only the random-gopher pods' related events        
            if (!((_a = metadata === null || metadata === void 0 ? void 0 : metadata.name) === null || _a === void 0 ? void 0 : _a.match('random-gopher'))) {
                return;
            }
            let gopher;
            try {
                gopher = await this.getGopherInfo(metadata.name, metadata === null || metadata === void 0 ? void 0 : metadata.namespace);
            }
            catch (error) {
                console.error(error);
                return;
            }
            switch (e.type) {
                case ResourceEventType.Added:
                    console.log('random-gopher pod added', metadata === null || metadata === void 0 ? void 0 : metadata.name);
                    // If GopherAPI is defined, send data to the API
                    if (api.endpoint.length > 0) {
                        try {
                            this.sendGopher(gopher, 'POST', api);
                        }
                        catch (error) {
                            console.error(error);
                            return;
                        }
                    }
                    break;
                case ResourceEventType.Modified:
                    console.log('random-gopher pod modified', metadata === null || metadata === void 0 ? void 0 : metadata.name);
                    // If GopherAPI is defined, send data to the API
                    if (api.endpoint.length > 0) {
                        try {
                            this.sendGopher(gopher, 'PUT', api);
                        }
                        catch (error) {
                            console.error(error);
                            return;
                        }
                    }
                    break;
                case ResourceEventType.Deleted:
                    console.log('random-gopher pod deleted', metadata === null || metadata === void 0 ? void 0 : metadata.name);
                    // If GopherAPI is defined, send data to the API
                    if (api.endpoint.length > 0) {
                        try {
                            this.sendGopher(gopher, 'DELETE', api);
                        }
                        catch (error) {
                            console.error(error);
                            return;
                        }
                    }
                    break;
            }
        });
    }
    getServiceAccountToken() {
        var _a;
        let currentUser = this.kubeConfig.getCurrentUser();
        if (!currentUser || currentUser.name != 'inClusterUser') {
            return '';
        }
        let tokenFile = (_a = currentUser.authProvider) === null || _a === void 0 ? void 0 : _a.config.tokenFile;
        return fs.readFileSync(tokenFile).toString();
    }
    async getGopherInfo(pod, namespace) {
        var _a;
        // Preparing the credentials for K8s API
        const opts = {};
        this.kubeConfig.applyToHTTPSOptions(opts);
        let headers = {};
        let bearerToken = this.getServiceAccountToken();
        if (bearerToken) {
            headers['Authorization'] = `Bearer ${bearerToken}`;
        }
        ;
        const agent = new https.Agent({
            ca: opts.ca,
            cert: opts.cert,
            key: opts.key,
        });
        let gopherName;
        // Recovering the Gopher
        try {
            let response = await fetch(`${(_a = this.kubeConfig.getCurrentCluster()) === null || _a === void 0 ? void 0 : _a.server}/api/v1/namespaces/${namespace}/pods/${pod}/proxy/gopher/name`, { agent: agent,
                headers: headers });
            gopherName = await response.text();
        }
        catch (error) {
            throw error;
        }
        let gopher = {
            id: pod,
            name: gopherName,
            displayname: pod,
            url: `https://github.com/scraly/gophers/blob/main/${gopherName}?raw=true`
        };
        console.log('Gopher', JSON.stringify(gopher));
        return gopher;
    }
    async sendGopher(gopher, method, api) {
        try {
            let response = await fetch(`${api.endpoint}/gopher`, {
                method: method,
                headers: {
                    'x-api-key': api.apiKey,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(gopher),
            });
            if (response.status != 200) {
                throw new Error();
            }
            let responseJSON = await response.json();
            console.log('API response', response.status, JSON.stringify(responseJSON));
        }
        catch (error) {
            throw error;
        }
    }
}
const operator = new GopherOperator();
await operator.start();
console.log('Operator started');
const exit = (reason) => {
    operator.stop();
    process.exit(0);
};
process.on('SIGTERM', () => exit('SIGTERM'))
    .on('SIGINT', () => exit('SIGINT'));
//# sourceMappingURL=index.js.map