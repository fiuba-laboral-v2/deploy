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

if (shell.exec(`ssh -o "StrictHostKeyChecking no" ${sshAddress} cd ${location}`).code !== 0) {
    shell.echo(`git clone -b ${branch} ${repository} ${location}`);
    shell.exec(`ssh -o "StrictHostKeyChecking no" ${sshAddress} git clone -b ${branch} ${repository} ${location}`);

    shell.echo("building container");
    shell.exec(`ssh -o "StrictHostKeyChecking no" ${sshAddress} 'cd ${location} && docker-compose up -d --build'`);

    shell.echo("Creating database");
    shell.exec(`ssh -o "StrictHostKeyChecking no" ${sshAddress} docker exec ${containerName} yarn db:create`);
} else {
    shell.echo(`cd ${location} && git pull origin ${branch}`);
    shell.exec(`ssh -o "StrictHostKeyChecking no" ${sshAddress} cd ${location} && git pull origin ${branch}`);

    shell.echo(`docker exec ${containerName} yarn install`);
    shell.exec(`ssh -o "StrictHostKeyChecking no" ${sshAddress} docker exec ${containerName} yarn install`);
}
shell.echo(`docker exec ${containerName} yarn db:migrate`);
shell.exec(`ssh -o "StrictHostKeyChecking no" ${sshAddress} docker exec ${containerName} yarn db:migrate`);

