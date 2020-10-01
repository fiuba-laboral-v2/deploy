import { Config, BackendConfig } from "../src/config"
import shell from "shelljs";

const throwErrorIfFails = (code) => {
    if (code !== 0) throw { code };
}

const sshCommand = (sshAddress) => {
    return `ssh -o "StrictHostKeyChecking no" ${sshAddress}`;
}

const dbMigrate = () => {
    const { sshAddress } = Config;
    const { containerName } = BackendConfig;
    const code = shell.exec(`${sshCommand(sshAddress)} docker exec ${containerName} yarn db:migrate`).code;
    throwErrorIfFails(code);
}

const gitCheckoutToBranch = () => {
    const { location, branch } = BackendConfig.gitRepository;
    const { sshAddress } = Config;
    const command = `cd ${location} && git checkout ${branch}`;
    shell.echo(command);
    const code = shell.exec(`${sshCommand(sshAddress)} '${command}'`).code;
    throwErrorIfFails(code);
}

const gitPull = () => {
    const { gitRepository: { branch, location } } = BackendConfig;
    const { sshAddress } = Config;
    const command = `cd ${location} && git pull origin ${branch}`;
    shell.echo(command);
    const code = shell.exec(`${sshCommand(sshAddress)} '${command}'`).code;
    throwErrorIfFails(code);
}

const cloneRepository = () => {
    const { gitRepository: { branch, location, url } } = BackendConfig;
    const { sshAddress } = Config;
    const command = `git clone -b ${branch} ${url} ${location}`;
    shell.echo(command);
    const code = shell.exec(`${sshCommand(sshAddress)} ${command}`).code;
    throwErrorIfFails(code);
}

const dockerComposeUp = () => {
    const { gitRepository: { location } } = BackendConfig;
    const { sshAddress } = Config;
    shell.echo("building container");
    const code = shell.exec(`${sshCommand(sshAddress)} 'cd ${location} && docker-compose up -d --build'`).code;
    throwErrorIfFails(code);
}

const createDatabase = () => {
    const { containerName } = BackendConfig;
    const { sshAddress } = Config;
    shell.echo("Creating database");
    const code = shell.exec(`${sshCommand(sshAddress)} docker exec ${containerName} yarn db:create`).code;
    throwErrorIfFails(code);
}

const repositoryWasNotCloned = () => {
    const { gitRepository: { location } } = BackendConfig;
    const { sshAddress } = Config;
    return shell.exec(`${sshCommand(sshAddress)} cd ${location}`).code !== 0;
}

try {
    const isFirstDeploy = repositoryWasNotCloned();
    if (isFirstDeploy) cloneRepository();
    gitCheckoutToBranch();
    gitPull();
    dockerComposeUp();
    if (isFirstDeploy) createDatabase();
    dbMigrate();
    shell.exit(0);
} catch (error) {
    shell.exit(error.code || 1);
}
