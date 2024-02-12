const TestController = require('./Controller/TestController');
const TestMiddleware = require("./Middleware/TestMiddleware");
const Test2Middleware = require("./Middleware/Test2Middleware");
const Router = require("../../src/Amacle/api/Router")

Router.addRoute('get', '/user/:id', [[TestMiddleware,Test2Middleware], TestController ]);
Router.addRoute('get', '/user2/:id', TestController );

Router.start();
