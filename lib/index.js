// File: lib/index.js

const { execSync } = require('child_process');
const fs = require('fs');

function createReactApp(projectName) {
  execSync(`npx create-react-app ${projectName}`, { stdio: 'inherit' });
}

const fs1 = require('fs-extra');
const path = require('path');

function mergeFolders(sourcePath, destinationPath) {
  try {
    // if (!fs1.existsSync(sourcePath)) {
    //   throw new Error('Source  folder does not exist'+sourcePath);
    // }
    if (!fs1.existsSync(destinationPath)) {
      throw new Error(' destination folder does not exist'+destinationPath);
    }

    // Read the content of the source folder
    const sourceItems = fs1.readdirSync(sourcePath);

    // Iterate through each item in the source folder
    sourceItems.forEach(item => {
      const sourceItemPath = path.join(sourcePath, item);
      const destinationItemPath = path.join(destinationPath, item);

      // Check if the item is a file or folder
      if (fs1.statSync(sourceItemPath).isFile()) {
        // If it's a file, copy and replace it in the destination folder
        fs1.copyFileSync(sourceItemPath, destinationItemPath);
        console.log(`File '${item}' copied and replaced.`);
      } else {
        // If it's a folder, recursively merge the folders
        fs1.ensureDirSync(destinationItemPath); // Ensure destination folder exists
        mergeFolders(sourceItemPath, destinationItemPath);
        console.log(`Folder '${item}' merged.`);
      }
    });

    console.log('Merge completed successfully.');
  } catch (error) {
    console.error(`Error: ${error.message}`);
  }
}

function addAdditionalFiles(projectName) {
  const libDirectory = __dirname;
  const sourceFolder = path.resolve(libDirectory,'./template');  
  const destinationFolder = path.resolve(`${projectName}`);

  mergeFolders(sourceFolder, destinationFolder);

}

function upadateJson(projectName) {

// Specify the path to the package.json file
const packageJsonPath = path.resolve( projectName+'/package.json'); // Replace with the actual path

// Read the package.json file
fs.readFile(packageJsonPath, 'utf8', (err, data) => {
    if (err) {
        console.error(`Error reading package.json: ${err.message}`);
        return;
    }

    // Parse the JSON data
    const packageJson = JSON.parse(data);

    // Add the new script
    packageJson.scripts = {
      "serve": "npm-run-all --parallel amacleserver start",
      "artisan": "node scripts/custom-command.js",
      "amacleserver": "node main.js",
        ...packageJson.scripts
    };

    // Convert back to JSON string
    const updatedPackageJson = JSON.stringify(packageJson, null, 2);

    // Write the updated package.json file
    fs.writeFile(packageJsonPath, updatedPackageJson, 'utf8', (err) => {
        if (err) {
            console.error(`Error writing package.json: ${err.message}`);
            return;
        }

        console.log('Custom script added to package.json');
    });
});

}
upadateJson("finaltest")

function main() {
  const projectName = process.argv[2];

  if (!projectName) {
    console.error('Please provide a project name.');
    process.exit(1);
  }

  try {
    // Step 1: Create React App
    createReactApp(projectName);
    
    // Step 2: Add additional files
    addAdditionalFiles(projectName);

    console.log('Project setup complete!');
  } catch (error) {
    console.error('Error during project setup:', error);
    process.exit(1);
  }
}

module.exports = { main };
