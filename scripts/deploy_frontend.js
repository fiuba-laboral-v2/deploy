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

shell.exec(`rm -rf ${location}`);
shell.exec(`git clone -b ${branch} ${repository} ${location}`);
shell.exec(`cd ${location} &&  yarn install && PUBLIC_URL=${publicURL} yarn build`);
// shell.exec(`ssh -o "StrictHostKeyChecking no" ${sshAddress} rm -rf /var/www/${hostname}/html/*`);
// shell.exec(`scp -o "StrictHostKeyChecking no" -r ${location}/build/* ${sshAddress}:/var/www/${hostname}/html/`);
shell.exec(`ssh -o "StrictHostKeyChecking no" ${sshAddress} mkdir test`);
shell.exec(`ssh -o "StrictHostKeyChecking no" ${sshAddress} rm -rf test/*`);
shell.exec(`scp -o "StrictHostKeyChecking no" -r ${location}/build/* ${sshAddress}:test/`);
shell.exec(`rm -rf ${location}`);
