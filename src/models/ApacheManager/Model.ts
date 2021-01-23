import { DeployConfig } from "../../config";
import { SSHManager, Shell } from "../index";

export class ApacheManager {
  private readonly sshAddress: string;
  private readonly hostname: string;
  private readonly frontendPath: string;
  private readonly user: string;
  private readonly scriptsFolder: string;
  private readonly withSSHConnection: boolean;

  constructor({ withSSHConnection }: IAttributes) {
    this.sshAddress = DeployConfig.sshAddress;
    this.hostname = DeployConfig.hostname;
    this.frontendPath = DeployConfig.frontendPath;
    this.user = DeployConfig.user;
    this.scriptsFolder = "fiuba_laboral_v2_scripts";
    this.withSSHConnection = withSSHConnection;
  }

  public copyScriptsToTheServer() {
    const destinationDirectory = `${this.sshAddress}:~/${this.scriptsFolder}`;
    const command = SSHManager.copy({ sourceDirectory: "scripts", destinationDirectory });
    return Shell.execute({ command });
  }

  public executeApacheSetup() {
    const userVariable = `USER=${this.user}`;
    const hostnameVariable = `HOSTNAME=${this.hostname}`;
    const frontendPathVariable = `FRONTEND_PATH=${this.frontendPath}`;
    const variables = `${userVariable} ${hostnameVariable} ${frontendPathVariable}`;
    const bashCommand = `bash ~/${this.scriptsFolder}/setup.sh`;
    const command = this.buildSshCommandWithTtyOption(`${variables} ${bashCommand}`);
    return Shell.execute({ command });
  }

  public removeScriptsDirectory() {
    const command = this.buildSshCommand(`rm -rf ~/${this.scriptsFolder}`);
    return Shell.execute({ label: "finished! removing scripts from server", command });
  }

  private buildSshCommand(command: string) {
    if (!this.withSSHConnection) return command;

    return `${SSHManager.command(this.sshAddress)} '${command}'`;
  }

  private buildSshCommandWithTtyOption(command: string) {
    if (!this.withSSHConnection) return command;

    return `${SSHManager.command(this.sshAddress)} -tt '${command}'`;
  }
}

interface IAttributes {
  withSSHConnection: boolean;
}
