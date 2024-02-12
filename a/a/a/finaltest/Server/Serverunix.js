const cron = require('node-cron');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

const LOG_FILE = './log_file.log'; // Use a relative path for the log file

// Create the log file if it doesn't exist
fs.writeFileSync(LOG_FILE, '');

const cronJobs = [];

const folderPath = 'Server/Scheduler';

fs.readdir(folderPath, (err, files) => {
    if (err) {
        console.error('Error reading folder:', err);
        return;
    }

    console.log('Files in the folder:');
    files.forEach(file => {
        cronJobs.push({ name: file.replace('.js', ''), scriptPath: path.join(folderPath, file) });
        console.log(file);
    });
});

const logToFile = (message) => {
    fs.appendFileSync(LOG_FILE, `${new Date().toLocaleString()}: ${message}\n`);
};

const checkAndRestart = () => {
    cronJobs.forEach(cronJob => {
        console.log("I am in")
        const scriptName = path.basename(cronJob.scriptPath);
        const commandToCheck = `pgrep -fl "${scriptName}"`;

        exec(commandToCheck, (error, stdout, stderr) => {
            if (error) {
                logToFile(`Error checking ${cronJob.name}: ${error.message}`);
                return;
            }

            const isRunning = (typeof stdout === 'string' && stdout.trim() !== '');

            if (isRunning) {
                logToFile(`${cronJob.name} is running, nothing to do.`);
            } else {
                logToFile(`${cronJob.name} is not running, restarting...`);

                exec(`node ${cronJob.scriptPath}`, (error, stdout, stderr) => {
                    if (error) {
                        logToFile(`Error restarting ${cronJob.name}: ${error.message}`);
                    } else {
                        logToFile(`${cronJob.name} restarted.`);
                    }
                });
            }
        });
    });
};

cron.schedule('* * * * *', checkAndRestart);
console.log('Cron job scheduled successfully.');
