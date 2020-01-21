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
const containerName = config.container_name;

let code;

if (shell.exec(`ssh -o "StrictHostKeyChecking no" ${sshAddress} cd ${location}`).code !== 0) {
    shell.echo(`git clone -b ${branch} ${repository} ${location}`);
    code = shell.exec(`ssh -o "StrictHostKeyChecking no" ${sshAddress} git clone -b ${branch} ${repository} ${location}`).code;
    if (code !== 0) return code;

    shell.echo("building container");
    code = shell.exec(`ssh -o "StrictHostKeyChecking no" ${sshAddress} 'cd ${location} && docker-compose up -d --build'`).code;
    if (code !== 0) return code;

    shell.echo("Creating database");
    code = shell.exec(`ssh -o "StrictHostKeyChecking no" ${sshAddress} docker exec ${containerName} yarn db:create`).code;
    if (code !== 0) return code;
} else {
    shell.echo(`cd ${location} && git pull origin ${branch}`);
    code = shell.exec(`ssh -o "StrictHostKeyChecking no" ${sshAddress} 'cd ${location} && git pull origin ${branch}'`).code;
    if (code !== 0) return code;

    shell.echo("building container");
    code = shell.exec(`ssh -o "StrictHostKeyChecking no" ${sshAddress} 'cd ${location} && docker-compose up -d --build'`).code;
    if (code !== 0) return code;
}
shell.echo(`docker exec ${containerName} yarn db:migrate`);
code = shell.exec(`ssh -o "StrictHostKeyChecking no" ${sshAddress} docker exec ${containerName} yarn db:migrate`).code;
if (code !== 0) return code;
