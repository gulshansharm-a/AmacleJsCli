const fs = require('fs');
const path = require('path');

function runSchedulers() {
    const timestamp = new Date().toISOString();
    const serverFolderPath = path.join(__dirname, './Scheduler');
    const logFilePath = path.join(__dirname, 'schedulerLog.log');
    const logStream = fs.createWriteStream(logFilePath, { flags: 'a' });

    logStream.write(`[${timestamp}] Scheduler run:\n`);

    fs.readdirSync(serverFolderPath).forEach(file => {
        if (file.endsWith('.js')) {
            try {
                const SchedulerClass = require(path.join(serverFolderPath, file));

                if (typeof SchedulerClass.main === 'function') {
                    if (!SchedulerClass.isJobActive) {
                        SchedulerClass.main();
                        logStream.write(`[${timestamp}] Cron job in ${file} started.\n`);

                    } else {
                        logStream.write(`[${timestamp}] Cron job in ${file} is already active.\n`);
                    }
                } else {
                    logStream.write(`[${timestamp}] Error: 'main' method not found in ${file}\n`);
                }
            } catch (error) {
                logStream.write(`[${timestamp}] Error loading ${file}: ${error.message}\n`);
            }
        }
    });

    logStream.end();
}

// Run the code every 1 minute (60 seconds)
runSchedulers()

setInterval(runSchedulers, 60 * 1000);

// Add a function to stop the jobs
function stopSchedulers() {
    const serverFolderPath = path.join(__dirname, './Scheduler');

    fs.readdirSync(serverFolderPath).forEach(file => {
        if (file.endsWith('.js')) {
            try {
                const SchedulerClass = require(path.join(serverFolderPath, file));

                if (typeof SchedulerClass.stop === 'function') {
                    SchedulerClass.stop();
                    console.log(`Cron job in ${file} stopped.`);
                } else {
                    console.log(`Error: 'stop' method not found in ${file}`);
                }
            } catch (error) {
                console.error(`Error stopping ${file}: ${error.message}`);
            }
        }
    });
}
