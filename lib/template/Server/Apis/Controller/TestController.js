
/**
 * TestController class.
 * @class
 * @extends Controller
 */
const Controller = require("../../../src/Amacle/api/Controller");
class TestController extends Controller {
    /**
     * Handle the main request for the Test route.
     * @static
     * @param {express.Request} req - The Express request object.
     * @param {express.Response} res - The Express response object.
     * @returns {void}
     */
    static main(req, res) {
        console.log(`TestController executed with id: ${req.params.id}`);
        res.send('Hello!');
    }
}
        
module.exports = TestController;
        

