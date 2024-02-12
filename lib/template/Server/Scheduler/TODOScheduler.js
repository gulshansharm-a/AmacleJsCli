
const cron = require('node-cron');

/**
 * Class representing a scheduler with cron jobs.
 */
class TODOScheduler {

    // Property to indicate if the cron job is active
    static isJobActive = false;

    /**
     * Function to perform a task that needs to be scheduled.
     * @param {string} TODO - Name of the task.
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
            console.log('TODO Cron job started.');
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
            console.log('TODO Cron job stopped.');
            this.isJobActive = false;
        } else {
            console.log('TODO Cron job is not active.');
        }
    }
}

module.exports = TODOScheduler;
        
