import { FrontendConfig, Config } from "../../config";
import { SSHManager, Shell } from "../index";

export const FrontendManager = {
  removeServedHtml: () => {
    const { sshAddress, hostname } = Config;
    const sshCommand = SSHManager.command(sshAddress);
    Shell.execute({ command: `${sshCommand} rm -rf /var/www/${hostname}/html/*` });
  },
  deployHtml: () => {
    const { sshAddress, hostname } = Config;
    const { gitRepository: { location } } = FrontendConfig;
    const sourceDirectory = `${location}/build/*`;
    const destinationDirectory = `${sshAddress}:/var/www/${hostname}/html/`;
    SSHManager.copy({ sourceDirectory, destinationDirectory });
    Shell.execute({ command: SSHManager.copy({ sourceDirectory, destinationDirectory }) });
  },
  buildHtml: () => {
    const { gitRepository: { location }, publicUrl } = FrontendConfig;
    const environment = process.env.NODE_ENV as "production" | "staging";
    const goToRepositoryLocation = `cd ${location}`;
    const installDependencies = "yarn install";
    const build = `REACT_APP_STAGE=${environment} PUBLIC_URL=${publicUrl} yarn build`;
    const command = `${goToRepositoryLocation} && ${installDependencies} && ${build}`;
    Shell.execute({ command });
  }
}
