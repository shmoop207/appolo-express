import {IDefinition} from 'appolo';
import {IRouteOptions} from "./IRouteOptions";

export interface IDefinition extends IDefinition{
   routes?:IRouteOptions[]

}