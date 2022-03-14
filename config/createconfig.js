const fs = require('fs');
const paths = require('./paths');
const dotenv = require('dotenv');

const fileName = 'app-config.js';
const NODE_ENV = process.env.NODE_ENV;

/*
  When building for production, an app-config.js is created
  with variable values replaced with a placeholder with the format
  [:variable_name]
*/
/*
if (NODE_ENV === 'production') {
  Object.keys(dotenvContent).forEach(key => {
    dotenvContent[key] = `[:${key.toLocaleLowerCase()}]`;
  });
}
*/

const defaultDestination = NODE_ENV === 'production' ? paths.appBuild : paths.appPublic;

function readEnvFile(envSuffix) {
  const dotenvFile = `${paths.dotenv}.${envSuffix}`;
  let dotenvContent = {};

  if (fs.existsSync(dotenvFile)) {
    dotenvContent = dotenv.config({ path: dotenvFile }).parsed
  } else {
    throw new Error(`${dotenvFile} file doesn't exists.`);
  }
  return dotenvContent;
}

function createAppConfigJs(envSuffix = NODE_ENV, dest = defaultDestination) {
  const fileToWrite = `${dest}/${fileName}`;
  const dotenvContent = readEnvFile(envSuffix);
  const configuration = `window.__APP_CONFIG = ${JSON.stringify(dotenvContent)};`;

  try {
    fs.writeFileSync(fileToWrite, configuration, 'utf8')
  } catch (err) {
    console.log(`Error while writing ${fileName} file:`, err.message);
    process.exit(1);
  }
}

module.exports = createAppConfigJs;
