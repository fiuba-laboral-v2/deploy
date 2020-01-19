const deployJSON = require("$config/deploy.json");
const shell = require("shelljs");

const env = process.env.NODE_ENV;
const config = deployJSON.backend[env];
if (config === undefined) {
    shell.echo(`NODE_ENV should be either 'production' or 'staging'`);
    shell.exit(1);
}

const location = config.location;
const repository = config.repository;
const branch = config.branch;
const sshAddress = config.ssh_address;

shell.exec(`ssh -o "StrictHostKeyChecking no" ${sshAddress} rm -rf ${location}`);
shell.exec(`ssh -o "StrictHostKeyChecking no" ${sshAddress} git clone -b ${branch} ${repository} ${location}`);
shell.exec(`ssh -o "StrictHostKeyChecking no" ${sshAddress} 'cd ${location} && docker-compose up --build'`);
shell.exec(`ssh -o "StrictHostKeyChecking no" ${sshAddress} docker exec fiuba-laboral-v2-backend yarn db:create`);
shell.exec(`ssh -o "StrictHostKeyChecking no" ${sshAddress} docker exec fiuba-laboral-v2-backend yarn db:migrate`);
shell.exec(`ssh -o "StrictHostKeyChecking no" ${sshAddress} rm -rf ${location}`);
