

const Middleware = require("../../../src/Amacle/api/Middleware");

/**
 * TestMiddleware class extends Middleware for handling test-related functionality.
 *
 * @class TestMiddleware
 * @extends {Middleware}
 */
class TestMiddleware extends Middleware {

    /**
     * Main method of the TestMiddleware class.
     *
     * @static
     * @param {express.Request} req - The Express request object.
     * @param {express.Response} res - The Express response object.
     * @param {function} next - The callback function to pass control to the next middleware.
     * @returns {void}
     *
     * @description
     * This middleware logs a message, allowing modification of the request or response objects if needed,
     * and then calls the next middleware in the stack.
     *
     * @example
     * // Usage in Express application
     * app.use(TestMiddleware.main);
     */

    static main(req, res, next) {
        console.log('Middleware executed!');
        // You can modify req or res if needed
        // Call the next middleware in the stack
        next();
    }
}

module.exports = TestMiddleware;
        
