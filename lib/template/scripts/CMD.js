const fs = require('fs');
const path = require('path');
class CMD {

    static createMigration(nameOfTable, basePath) {
        const migrationsPath = path.join(basePath, 'Migrations');
        const filePath = path.join(migrationsPath, `${nameOfTable}Migration.js`);

        const dataToWrite = `
const Blueprint = require("../schema/Blueprint");
const DB = require("../schema/DB");
const Migrations = require("../schema/Migration");

/**
 * Migration class represents a migration for creating the ${nameOfTable} table.
 * @extends Migrations
 */
class ${nameOfTable}Migration extends Migrations {
    /**
     * Initializes the migration by creating the ${nameOfTable} table using a Blueprint.
     * @override
     * @returns {void}
     */
    initialize() {
        // Create a new table in the database using a Blueprint
        DB.create((table = new Blueprint()) => {
            // Define the structure of the '${nameOfTable}' table
            table.name("${nameOfTable}");
            table.id("id");
            // Write your code here
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

module.exports = ${nameOfTable}Migration;


`;
        if (!fs.existsSync(migrationsPath)) {
            fs.mkdirSync(migrationsPath, { recursive: true });
        }

        fs.writeFile(filePath, dataToWrite, (err) => {
            if (err) {
                console.error('Error Creating Migration:', err);
            } else {
                console.log(`Migration created successfully: ${filePath}`);
            }
        });
    }
    static runAllMigrations(basePath) {
        const migrationsPath = basePath;
        fs.readdir(migrationsPath, (err, files) => {
            if (err) {
                console.error('Error [Migration Folder NotFound]:', err);
                return;
            }

            console.log('Running Migrations:');

            files.forEach((file) => {
                const className = file.replace('.js', '');
                console.log(path.join(migrationsPath, file))
                const modulePath = require.resolve(path.join("../" + migrationsPath, file));
                const MigrationClass = require(modulePath);

                if (MigrationClass && typeof MigrationClass === 'function') {
                    // Instantiate the class
                    const instance = new MigrationClass();
                    instance.initialize();
                } else {
                    console.error(`Class '${className}' not found in module.`);
                }
                console.log(className);
            });
        });
    }
    static runOneMigration(basePath, name) {
        const migrationsPath = basePath;
        fs.readdir(migrationsPath, (err, files) => {
            if (err) {
                console.error('Error [Migration Folder NotFound]:', err);
                return;
            }

            console.log('Running Migrations:');

            const className = name;
            console.log(path.join(migrationsPath, name))
            const modulePath = require.resolve(path.join("../" + migrationsPath, name + "Migration"));
            const MigrationClass = require(modulePath);

            if (MigrationClass && typeof MigrationClass === 'function') {
                // Instantiate the class
                const instance = new MigrationClass();
                instance.initialize();
            } else {
                console.error(`Class '${className}' not found in module.`);
            }
        });
    }
    static runOneMigrationAction(basePath, name) {
        const migrationsPath = basePath;
        fs.readdir(migrationsPath, (err, files) => {
            if (err) {
                console.error('Error [Migration Folder NotFound]:', err);
                return;
            }

            console.log('Running Migrations:');

            const className = name;
            console.log(path.join(migrationsPath, name))
            const modulePath = require.resolve(path.join("../" + migrationsPath, name + "Migration"));
            const MigrationClass = require(modulePath);

            if (MigrationClass && typeof MigrationClass === 'function') {
                // Instantiate the class
                const instance = new MigrationClass();
                instance.action();
            } else {
                console.error(`Class '${className}' not found in module.`);
            }
        });
    }

    // Model 
    static createModel(nameOfTable, basePath) {
        const migrationsPath = path.join(basePath, 'Models');
        const filePath = path.join(migrationsPath, `${nameOfTable}.js`);

        const dataToWrite = `
const Model = require('../data_access/Model');

/**
 * ${nameOfTable} class representing a data model.
 * @class
 * @extends Model
 */
class ${nameOfTable} extends Model {
    // You can add specific properties or methods relevant to your ${nameOfTable} model here.
}

/**
 * Exports the ${nameOfTable} class to make it available for use in other modules.
 * @module
 * @exports ${nameOfTable}
 */
module.exports = ${nameOfTable};

`;

        // Ensure the migrations directory exists
        if (!fs.existsSync(migrationsPath)) {
            fs.mkdirSync(migrationsPath, { recursive: true });
        }

        fs.writeFile(filePath, dataToWrite, (err) => {
            if (err) {
                console.error('Error Creating Model:', err);
            } else {
                console.log(`Model created successfully: ${filePath}`);
            }
        });
    }

    //Server
    static createCron(nameOfScheduler, basePath, time) {
        const migrationsPath = path.join(basePath, 'Scheduler');
        const filePath = path.join(migrationsPath, `${nameOfScheduler}Scheduler.js`);

        const dataToWrite = `
const cron = require('node-cron');

/**
 * Class representing a scheduler with cron jobs.
 */
class ${nameOfScheduler}Scheduler {

    // Property to indicate if the cron job is active
    static isJobActive = false;

    /**
     * Function to perform a task that needs to be scheduled.
     * @param {string} ${nameOfScheduler} - Name of the task.
     * @returns {void}
     */
    static performTask() {
        // Add your task logic here
        console.log('Task performed.');
    }

    /**
     * Schedule a cron job for a specific task if it's not already active.
     * @param {string} cronExpression - Cron expression for scheduling.
     * @returns {void}
     */
    static main() {
        // Check if the cron job is not already active
        if (!this.isJobActive) {
            cron.schedule('* * * * *', () => {
                this.performTask();
            });

            this.isJobActive = true;
            console.log('${nameOfScheduler} Cron job started.');
        }
    }

    /**
     * Stop the cron job.
     * @returns {void}
     */
    static stop() {
        if (this.isJobActive) {
            // Stop the cron job
            // You need to implement logic to stop the scheduled task
            console.log('${nameOfScheduler} Cron job stopped.');
            this.isJobActive = false;
        } else {
            console.log('${nameOfScheduler} Cron job is not active.');
        }
    }
}

module.exports = ${nameOfScheduler}Scheduler;
        
`;

        // Ensure the migrations directory exists
        if (!fs.existsSync(migrationsPath)) {
            fs.mkdirSync(migrationsPath, { recursive: true });
        }

        fs.writeFile(filePath, dataToWrite, (err) => {
            if (err) {
                console.error('Error Creating schedules:', err);
            } else {
                console.log(`schedules created successfully: ${filePath}`);
            }
        });
    }

    static apiMiddleware(middlewarename, basePath) {
        const middlewarePath = path.join(basePath, 'Middleware');
        const filePath = path.join(middlewarePath, `${middlewarename}.js`);

        const dataToWrite = `

const Middleware = require("../../../src/Amacle/api/Middleware");

/**
 * ${middlewarename} class extends Middleware for handling test-related functionality.
 *
 * @class ${middlewarename}
 * @extends {Middleware}
 */
class ${middlewarename} extends Middleware {

    /**
     * Main method of the ${middlewarename} class.
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
     * app.use(${middlewarename}.main);
     */

    static main(req, res, next) {
        console.log('Middleware executed!');
        // You can modify req or res if needed
        // Call the next middleware in the stack
        next();
    }
}

module.exports = ${middlewarename};
        
`;

        // Ensure the migrations directory exists
        if (!fs.existsSync(middlewarePath)) {
            fs.mkdirSync(middlewarePath, { recursive: true });
        }

        fs.writeFile(filePath, dataToWrite, (err) => {
            if (err) {
                console.error('Error Creating Middleware:', err);
            } else {
                console.log(`Middleware created successfully: ${filePath}`);
            }
        });
    }

    static apiController(controllernmae, basePath) {
        const controllerPath = path.join(basePath, 'Controller');
        const filePath = path.join(controllerPath, `${controllernmae}.js`);

        const dataToWrite = `

const Controller = require("../../../src/Amacle/api/Controller");

class ${controllernmae} extends Controller {
    /**
     * Handle the main request for the ${controllernmae} route.
     * @static
     * @param {express.Request} req - The Express request object.
     * @param {express.Response} res - The Express response object.
     * @returns {void}
     */
    static main(req, res) {

        // Write your code here
         res.send('Hello!');
     }
}
        
module.exports = ${controllernmae};
        

`;

        // Ensure the migrations directory exists
        if (!fs.existsSync(controllerPath)) {
            fs.mkdirSync(controllerPath, { recursive: true });
        }

        fs.writeFile(filePath, dataToWrite, (err) => {
            if (err) {
                console.error('Error Creating Controller:', err);
            } else {
                console.log(`Controller created successfully: ${filePath}`);
            }
        });
    }

}


module.exports = CMD;

