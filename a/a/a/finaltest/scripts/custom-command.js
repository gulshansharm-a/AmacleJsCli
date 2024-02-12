const { program } = require('commander');
const CMD = require('./CMD');
const path = "./src/Amacle";
const readline = require('readline');
const cronValidator = require('cron-validator');
const cronstrue = require('cronstrue');

program
  .command('create:migration [name]')
  .description('Create a new migration file')
  .action((name) => {
    CMD.createMigration(name, path);
  });

program
  .command('migrate [name]')
  .description('Run a specific migration')
  .action((name) => {
    CMD.runOneMigration("src/Amacle/migrations/", name);
  });

program
  .command('migrate:action [name]')
  .description('Run a specific migration')
  .action((name) => {
    CMD.runOneMigrationAction("src/Amacle/migrations/", name);
  });

program
  .command('migrate:all')
  .description('Run all pending migrations')
  .action(() => {
    CMD.runAllMigrations("src/Amacle/migrations/");
  });

program
  .command('create:model [name]')
  .description('Create a new database model')
  .action((name) => {
    CMD.createModel(name, path);
  });

  program
  .command('create:controller [name]')
  .description('Create a new Api controller')
  .action((name) => {
    CMD.apiController(name, './Server/Apis');
  });

program
  .command('create:middleware [name]')
  .description('Create a new Api controller')
  .action((name) => {
    CMD.apiMiddleware(name, './Server/Apis');
  });

program
.command('create:scheduler [name]')
.description('Create a new schedule')
.action(async (name) => {
  const time = await promptUser(`
    The schedule for a job is defined by five fields, each representing a unit of time. The fields, in order, are:
    * * * * *
    | | | | |
    | | | | +-- Day of the week (0 - 6) (Sunday to Saturday; 7 is also Sunday)
    | | | +---- Month (1 - 12)
    | | +------ Day of the month (1 - 31)
    | +-------- Hour (0 - 23)
    +---------- Minute (0 - 59)

    Run every minute:  * * * * *
    Run every 5 minute:  */5 * * * *
    Run every 3 minute:  */3 * * * *
    Run every hour at minute 30:  30 * * * *
    Run daily at midnight:  0 0 * * *
    Run on Sundays at 3:30 PM:  30 15 * * 0
    Run every weekday at 9 AM:  0 9 * * 1-5
    Run every month on the 15th at 4:45 AM:  45 4 15 * *
    Run every quarter (January, April, July, October) on the 1st at midnight:  0 0 1 1,4,7,10 *

    Enter the cron schedule for the job: `);

  const isValid = cronValidator.isValidCron(time);

  if (isValid) {
    const readableDescription = cronstrue.toString(time);
    console.log(`Valid cron schedule: ${time}`);
    console.log(`Human-readable description: Your code will run ${readableDescription}`);

    const confirm = await promptUser('Do you want to proceed? (Y/N): ');

    if (confirm.toLowerCase() === 'y') {
      CMD.createCron(name,"./Server",time)
      console.log('Processing...');
    } else {
      console.error('Operation canceled.');
    }
  } else {
    console.error('Invalid cron schedule. Please enter a valid schedule.');
  }

});

async function promptUser(question) {
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

return new Promise((resolve) => {
  rl.question(question, (answer) => {
    rl.close();
    resolve(answer.trim());
  });
});
}

program.parse(process.argv);