"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Manager2 {
    static get $config() {
        return {
            id: 'manager2',
            singleton: true
        };
    }
    get name() {
        return this.constructor.name;
    }
}
exports.Manager2 = Manager2;
module.exports = Manager2;
//# sourceMappingURL=manager2.js.map