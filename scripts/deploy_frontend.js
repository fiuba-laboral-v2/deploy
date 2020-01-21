const deployJSON = require("$config/deploy.json");
const shell = require("shelljs");

const env = process.env.NODE_ENV;
const config = deployJSON.frontend[env];
if (config === undefined) {
    shell.echo(`NODE_ENV should be either 'production' or 'staging'`);
    shell.exit(1);
}

const hostname = config.hostname;
const location = config.location;
const repository = config.repository;
const branch = config.branch;
const publicURL = config.PUBLIC_URL;
const sshAddress = config.ssh_address;

let code;

code = shell.exec(`rm -rf ${location}`).code;
if (code !== 0) return code;

code = shell.exec(`git clone -b ${branch} ${repository} ${location}`).code;
if (code !== 0) shell.exit(code);

code = shell.exec(`cd ${location} &&  yarn install && PUBLIC_URL=${publicURL} yarn build`).code;
if (code !== 0) shell.exit(code);

code = shell.exec(`ssh -o "StrictHostKeyChecking no" ${sshAddress} rm -rf /var/www/${hostname}/html/*`).code;
if (code !== 0) shell.exit(code);

code = shell.exec(`scp -o "StrictHostKeyChecking no" -r ${location}/build/* ${sshAddress}:/var/www/${hostname}/html/`).code;
if (code !== 0) shell.exit(code);

code = shell.exec(`rm -rf ${location}`).code;
if (code !== 0) shell.exit(code);

shell.exit(0);
