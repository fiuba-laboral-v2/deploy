const deployJSON = require("$config/environment.json");
const shell = require("shelljs");

const env = process.env.NODE_ENV;
const config = deployJSON.frontend[env];

const hostname = config.hostname;
const user = config.user;
const sshAddress = config.ssh_address;

shell.exec(`ssh -o "StrictHostKeyChecking no" -t ${sshAddress} USER=${user} HOSTNAME=${hostname} bash scripts/setup.sh`);
