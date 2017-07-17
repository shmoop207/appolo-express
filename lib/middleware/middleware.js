"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Middleware {
    constructor(req, res, next, route) {
        this.req = req;
        this.res = res;
        this.next = next;
        this.route = route;
    }
    getModel() {
        return this.req.model;
    }
    run(req, res, next, route) {
        next();
    }
    sendServerError(error, code) {
        this.res.status(500).jsonp({
            status: 500,
            statusText: "Internal Server Error",
            error: error,
            code: code
        });
    }
    sendBadRequest(error, code) {
        this.res.status(400).jsonp({
            status: 400,
            statusText: "Bad Request",
            error: error,
            code: code
        });
    }
    sendUnauthorized(error, code) {
        this.res.status(401).jsonp({
            status: 401,
            statusText: "Unauthorized",
            error: error,
            code: code
        });
    }
    sendNotFound(error, code) {
        this.res.status(404).jsonp({
            status: 404,
            statusText: "Not Found",
            error: error,
            code: code
        });
    }
}
exports.Middleware = Middleware;
//# sourceMappingURL=middleware.js.map