const Knight = require('./knight');
import routerKnight from "./knight";
import { Express } from "express";
function route(app: Express){
    app.use('/v1/api', routerKnight);
}

export default route;