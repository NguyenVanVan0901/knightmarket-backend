const Knight = require('./knight');
import routerKnight from "./knight";
function route(app){
    app.use('/v1/api', routerKnight);
}

export default route;