import { DeployConfig } from "../../config";
import { SSHManager, Shell } from "../index";

export class ApacheManager {
  private readonly sshAddress: string;
  private readonly hostname: string;
  private readonly frontendPath: string;
  private readonly user: string;
  private readonly scriptsFolder: string;

  constructor() {
    this.sshAddress = DeployConfig.sshAddress;
    this.hostname = DeployConfig.hostname;
    this.frontendPath = DeployConfig.frontendPath;
    this.user = DeployConfig.user;
    this.scriptsFolder = "fiuba_laboral_v2_scripts";
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
    const command = `${this.sshCommand()} -tt '${variables} ${bashCommand}'`;
    return Shell.execute({ command });
  }

  public removeScriptsDirectory() {
    const command = `${this.sshCommand()} 'rm -rf ~/${this.scriptsFolder}'`;
    return Shell.execute({ label: "finished! removing scripts from server", command });
  }

  private sshCommand() {
    return `${SSHManager.command(this.sshAddress)}`;
  }
}
