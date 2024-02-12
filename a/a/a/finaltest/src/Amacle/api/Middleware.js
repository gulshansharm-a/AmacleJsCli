class Middleware {
  static main(req, res, next) {
    console.log('Middleware executed!');
    next();
  }
}

module.exports = Middleware;
