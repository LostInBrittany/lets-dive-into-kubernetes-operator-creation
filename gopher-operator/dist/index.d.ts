import Operator from './operator.js';
export default class MyOperator extends Operator {
    protected init(): Promise<void>;
}
