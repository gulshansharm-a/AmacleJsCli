
const Blueprint = require("../schema/Blueprint");
const DB = require("../schema/DB");
const Migrations = require("../schema/Migration");

/**
 * Migration class represents a migration for creating the User table.
 * @extends Migrations
 */
class UserMigration extends Migrations {
    /**
     * Initializes the migration by creating the User table using a Blueprint.
     * @override
     * @returns {void}
     */
    initialize() {
        // Create a new table in the database using a Blueprint
        DB.create((table = new Blueprint()) => {
            // Define the structure of the 'User' table
            table.name("User");
            // Write your code here
            table.char("name",100).notnull().unique()
            table.char("pass",200).notnull()
            table.integer("age").notnull()
            table.timestamps("created_at")
            table.timestamps("updated_at")
            // Execute the SQL query to create the table
            table.create();
        });
    }
    
    /**
     * Placeholder for additional actions after the migration.
     * @override
     * @returns {void}
     */
    action() { 
        // You can add specific actions or modifications here
    }
}

module.exports = UserMigration;


