import { Config, FrontendConfig } from "../src/config"
import shell from "shelljs";

function sshCommand(sshAddress) {
    return `ssh -o "StrictHostKeyChecking no" ${sshAddress}`;
}

function throwErrorIfFails(code) {
    if (code !== 0 ) throw { code };
}

function removeRepository() {
    const { gitRepository: { location } } = FrontendConfig;
    const command = `rm -rf ${location}`;
    shell.echo(command);
    const code = shell.exec(command).code;
    throwErrorIfFails(code);
}

function cloneRepository() {
    const { gitRepository: { location, url, branch } } = FrontendConfig;
    const command = `git clone -b ${branch} ${url} ${location}`;
    shell.echo(command);
    const code = shell.exec(`${command}`).code;
    throwErrorIfFails(code);
}

function buildHtml() {
    const { gitRepository: { location }, publicUrl } = FrontendConfig;
    const environment = process.env.NODE_ENV as "production" | "staging";
    const goToRepositoryLocation = `cd ${location}`;
    const installDependencies = "yarn install";
    const build = `REACT_APP_STAGE=${environment} PUBLIC_URL=${publicUrl} yarn build`;
    const command = `${goToRepositoryLocation} && ${installDependencies} && ${build}`;
    shell.echo(command);
    const code = shell.exec(command).code;
    throwErrorIfFails(code);
}

function removeServedHtml() {
    const { sshAddress, hostname } = Config;
    const command = `${sshCommand(sshAddress)} rm -rf /var/www/${hostname}/html/*`;
    shell.echo(command);
    const code = shell.exec(command).code;
    throwErrorIfFails(code);
}

function deployHtml() {
    const { sshAddress, hostname } = Config;
    const { gitRepository: { location } } = FrontendConfig;
    const command = `scp -o "StrictHostKeyChecking no" -r ${location}/build/* ${sshAddress}:/var/www/${hostname}/html/`;
    shell.echo(command);
    const code = shell.exec(command).code;
    throwErrorIfFails(code);
}

try {
    removeRepository();
    cloneRepository();
    buildHtml();
    removeServedHtml();
    deployHtml();
    removeRepository();
    shell.exit(0);
} catch (e) {
    shell.exit(e.code || 1);
}
