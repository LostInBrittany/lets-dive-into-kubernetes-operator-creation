"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var operator_js_1 = require("./operator.js");
var node_fetch_1 = require("node-fetch");
var node_https_1 = require("node:https");
var node_fs_1 = require("node:fs");
var api;
var GopherOperator = /** @class */ (function (_super) {
    __extends(GopherOperator, _super);
    function GopherOperator() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    GopherOperator.prototype.init = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log('Running operator');
                        return [4 /*yield*/, this.watchResource('lostinbrittany.dev', 'v1alpha1', 'gopherapis', function (e) { return __awaiter(_this, void 0, void 0, function () {
                                var object;
                                return __generator(this, function (_a) {
                                    object = e.object;
                                    switch (e.type) {
                                        case operator_js_1.ResourceEventType.Added:
                                            api = {
                                                endpoint: object.spec.endpoint,
                                                apiKey: object.spec.apiKey
                                            };
                                            break;
                                        case operator_js_1.ResourceEventType.Modified:
                                            api = {
                                                endpoint: object.spec.endpoint,
                                                apiKey: object.spec.apiKey
                                            };
                                            break;
                                        case operator_js_1.ResourceEventType.Deleted:
                                            api = {
                                                endpoint: '',
                                                apiKey: ''
                                            };
                                            break;
                                    }
                                    console.log('Current GopherAPI', JSON.stringify(api));
                                    return [2 /*return*/];
                                });
                            }); })];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.watchResource('', 'v1', 'pods', function (e) { return __awaiter(_this, void 0, void 0, function () {
                                var object, metadata, gopher, error_1;
                                var _a;
                                return __generator(this, function (_b) {
                                    switch (_b.label) {
                                        case 0:
                                            console.log('Watching pods');
                                            object = e.object;
                                            metadata = object.metadata;
                                            // Reading only the random-gopher pods' related events        
                                            if (!((_a = metadata === null || metadata === void 0 ? void 0 : metadata.name) === null || _a === void 0 ? void 0 : _a.match('random-gopher'))) {
                                                return [2 /*return*/];
                                            }
                                            _b.label = 1;
                                        case 1:
                                            _b.trys.push([1, 3, , 4]);
                                            return [4 /*yield*/, this.getGopherInfo(metadata.name, metadata === null || metadata === void 0 ? void 0 : metadata.namespace)];
                                        case 2:
                                            gopher = _b.sent();
                                            return [3 /*break*/, 4];
                                        case 3:
                                            error_1 = _b.sent();
                                            console.error(error_1);
                                            return [2 /*return*/];
                                        case 4:
                                            switch (e.type) {
                                                case operator_js_1.ResourceEventType.Added:
                                                    console.log('random-gopher pod added', metadata === null || metadata === void 0 ? void 0 : metadata.name);
                                                    // If GopherAPI is defined, send data to the API
                                                    if (api.endpoint.length > 0) {
                                                        try {
                                                            this.sendGopher(gopher, 'POST', api);
                                                        }
                                                        catch (error) {
                                                            console.error(error);
                                                            return [2 /*return*/];
                                                        }
                                                    }
                                                    break;
                                                case operator_js_1.ResourceEventType.Modified:
                                                    console.log('random-gopher pod modified', metadata === null || metadata === void 0 ? void 0 : metadata.name);
                                                    // If GopherAPI is defined, send data to the API
                                                    if (api.endpoint.length > 0) {
                                                        try {
                                                            this.sendGopher(gopher, 'PUT', api);
                                                        }
                                                        catch (error) {
                                                            console.error(error);
                                                            return [2 /*return*/];
                                                        }
                                                    }
                                                    break;
                                                case operator_js_1.ResourceEventType.Deleted:
                                                    console.log('random-gopher pod deleted', metadata === null || metadata === void 0 ? void 0 : metadata.name);
                                                    // If GopherAPI is defined, send data to the API
                                                    if (api.endpoint.length > 0) {
                                                        try {
                                                            this.sendGopher(gopher, 'DELETE', api);
                                                        }
                                                        catch (error) {
                                                            console.error(error);
                                                            return [2 /*return*/];
                                                        }
                                                    }
                                                    break;
                                            }
                                            return [2 /*return*/];
                                    }
                                });
                            }); })];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    GopherOperator.prototype.getServiceAccountToken = function () {
        var _a;
        var currentUser = this.kubeConfig.getCurrentUser();
        if (!currentUser || currentUser.name != 'inClusterUser') {
            return '';
        }
        var tokenFile = (_a = currentUser.authProvider) === null || _a === void 0 ? void 0 : _a.config.tokenFile;
        return node_fs_1.default.readFileSync(tokenFile).toString();
    };
    GopherOperator.prototype.getGopherInfo = function (pod, namespace) {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var opts, headers, bearerToken, agent, gopherName, response, error_2, gopher;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        opts = {};
                        this.kubeConfig.applyToHTTPSOptions(opts);
                        headers = {};
                        bearerToken = this.getServiceAccountToken();
                        if (bearerToken) {
                            headers['Authorization'] = "Bearer ".concat(bearerToken);
                        }
                        ;
                        agent = new node_https_1.default.Agent({
                            ca: opts.ca,
                            cert: opts.cert,
                            key: opts.key,
                        });
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 4, , 5]);
                        return [4 /*yield*/, (0, node_fetch_1.default)("".concat((_a = this.kubeConfig.getCurrentCluster()) === null || _a === void 0 ? void 0 : _a.server, "/api/v1/namespaces/").concat(namespace, "/pods/").concat(pod, "/proxy/gopher/name"), { agent: agent,
                                headers: headers })];
                    case 2:
                        response = _b.sent();
                        return [4 /*yield*/, response.text()];
                    case 3:
                        gopherName = _b.sent();
                        return [3 /*break*/, 5];
                    case 4:
                        error_2 = _b.sent();
                        throw error_2;
                    case 5:
                        gopher = {
                            id: pod,
                            name: gopherName,
                            displayname: pod,
                            url: "https://github.com/scraly/gophers/blob/main/".concat(gopherName, "?raw=true")
                        };
                        console.log('Gopher', JSON.stringify(gopher));
                        return [2 /*return*/, gopher];
                }
            });
        });
    };
    GopherOperator.prototype.sendGopher = function (gopher, method, api) {
        return __awaiter(this, void 0, void 0, function () {
            var response, responseJSON, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, (0, node_fetch_1.default)("".concat(api.endpoint, "/gopher"), {
                                method: method,
                                headers: {
                                    'x-api-key': api.apiKey,
                                    'Content-Type': 'application/json'
                                },
                                body: JSON.stringify(gopher),
                            })];
                    case 1:
                        response = _a.sent();
                        if (response.status != 200) {
                            throw new Error();
                        }
                        return [4 /*yield*/, response.json()];
                    case 2:
                        responseJSON = _a.sent();
                        console.log('API response', response.status, JSON.stringify(responseJSON));
                        return [3 /*break*/, 4];
                    case 3:
                        error_3 = _a.sent();
                        throw error_3;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    return GopherOperator;
}(operator_js_1.default));
exports.default = GopherOperator;
var operator = new GopherOperator();
await operator.start();
console.log('Operator started');
var exit = function (reason) {
    operator.stop();
    process.exit(0);
};
process.on('SIGTERM', function () { return exit('SIGTERM'); })
    .on('SIGINT', function () { return exit('SIGINT'); });
