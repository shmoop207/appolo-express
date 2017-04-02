"use strict";
import _ = require('lodash');
import {IDefinition} from "../IDefinition";
import {Define as DefineAppolo} from "appolo";
import {Util} from "../util/util";
import {IRouteOptions} from "../IRouteOptions";
import {Controller} from "../controller/controller";
import    router  from '../routes/router';


export class Define extends DefineAppolo {


    public routes(routes: IRouteOptions | IRouteOptions[]): this {

        if (this._klass === Controller || this._klass.prototype instanceof Controller) {

            if (router && _.isArray(routes)) {

                router.addRoutes(this.id, routes);
            }

            if (router && _.isObject(routes)) {

                router.addRoutes(this.id, [routes]);
            }
        }

        return this;

    }


}