const express = require('express');
const dotenv = require('dotenv');
const helmet = require('helmet');
const { body, validationResult } = require('express-validator');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

class Router {
  constructor() {}

  static use(path, middleware) {
    Router.addRoute('use', path, middleware);
  }
  static useGlobleMiddleware(middleware) {
    app.use(middleware);
  }

  static prefixGet(pathPrefix, callback) {
    callback(Router);
  }

  static get(path, handlers) {
    Router.addRoute('get', path, handlers);
  }

  static post(path, handlers) {
    Router.addRoute('post', path, handlers);
  }

  static put(path, handlers) {
    Router.addRoute('put', path, handlers);
  }

  static delete(path, handlers) {
    Router.addRoute('delete', path, handlers);
  }

  static patch(path, handlers) {
    Router.addRoute('patch', path, handlers);
  }

  static all(path, handlers) {
    Router.addRoute('all', path, handlers);
  }

  static addRoute(method, path, handlers) {
    const paramNames = [];
    const parsedPath = path.replace(/:(\w+)/g, (match, paramName) => {
      paramNames.push(paramName);
      return '([^\\/]+)';
    });
  
    let middlewareFunctions = [];
    let routeHandler;
  
    if (Array.isArray(handlers) && handlers.length === 2) {
      middlewareFunctions = Array.isArray(handlers[0]) ? handlers[0] : [handlers[0]];
      routeHandler = handlers[1].main || ((req, res) => res.send('No main handler defined for this route.'));
    }else{
            routeHandler = handlers.main || ((req, res) => res.send('No main handler defined for this route.'));

    }
  
    const finalMiddleware = (req, res, next) => {
      const params = {};
      const matches = req.url.match(new RegExp(parsedPath));
      matches.shift();
      matches.forEach((match, index) => {
        params[paramNames[index]] = match;
      });
      req.params = params;
  
      // Execute middleware functions in sequence
      const executeMiddleware = (index) => {
        if (index < middlewareFunctions.length) {
          middlewareFunctions[index].main(req, res, (err) => {
            if (err) {
              return next(err);
            }
            executeMiddleware(index + 1);
          });
        } else {
          // Execute the route handler
          routeHandler(req, res, next);
        }
      };
  
      executeMiddleware(0);
    };
  
    // Use app.route(path) to define the route and specify the method
    app.route(parsedPath)[method](finalMiddleware);
  }
  

  static validateInput() {
    return [
      body('param').isString().escape(),
    ];
  }

  static handleValidationResults(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }

  static start() {
    app.use(express.json());
    app.use(helmet());

    app.use((err, req, res, next) => {
      console.error(err.stack);
      res.status(500).send('Internal Server Error');
    });

    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  }
}

module.exports = Router;
