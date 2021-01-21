import { FrontendConfig, DeployConfig, Environment } from "../../config";
import { SSHManager, Shell } from "../index";

export const FrontendManager = {
  removeServedHtml: () => {
    const { sshAddress, hostname } = DeployConfig;
    const sshCommand = SSHManager.command(sshAddress);
    try {
      return Shell.execute({ command: `${sshCommand} rm -rf /var/www/${hostname}/html/*` });
    } catch (e) {
      return "";
    }
  },
  deployHtml: () => {
    const { sshAddress, hostname } = DeployConfig;
    const { gitRepository: { location } } = FrontendConfig;
    const sourceDirectory = `${location}/build/*`;
    const destinationDirectory = `${sshAddress}:/var/www/${hostname}/html/`;
    return Shell.execute({ command: SSHManager.copy({ sourceDirectory, destinationDirectory }) });
  },
  buildHtml: () => {
    const { gitRepository: { location }, publicUrl } = FrontendConfig;
    const environment = Environment.NODE_ENV();
    const goToRepositoryLocation = `cd ${location}`;
    const installDependencies = "yarn install";
    const build = `REACT_APP_STAGE=${environment} PUBLIC_URL=${publicUrl} yarn build`;
    const command = `${goToRepositoryLocation} && ${installDependencies} && ${build}`;
    return Shell.execute({ command });
  }
};
