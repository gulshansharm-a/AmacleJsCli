const DB = require('../schema/DB');

class Migration {

  // Define the changes to be applied to the database
  up() {
    throw new Error('Method not implemented. You should override the "up" method in your migration.');
  }

  // Define how to revert the changes made in the "up" method
  down() {
    throw new Error('Method not implemented. You should override the "down" method in your migration.');
  }
}

module.exports = Migration;
