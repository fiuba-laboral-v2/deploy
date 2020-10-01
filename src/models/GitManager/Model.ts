import { Config, IRepository } from "../../config";
import { Shell, SSHManager } from "../index";

export class GitManager {
  private readonly repositoryConfig: IRepository;
  private readonly withSSHConnection: boolean;

  constructor({ repositoryConfig, withSSHConnection }: IGitManagerAttributes) {
    this.repositoryConfig = repositoryConfig;
    this.withSSHConnection = withSSHConnection;
  }

  public repositoryWasNotCloned() {
    try {
      Shell.execute({ command: `${this.sshCommand()} cd ${this.repositoryConfig.location}` })
      return true;
    } catch (error) {
      return false;
    }
  }

  public cloneRepository() {
    const { location, url, branch } = this.repositoryConfig;
    Shell.execute({ command: `git clone -b ${branch} ${url} ${location}` })
  }

  public removeRepository() {
    Shell.execute({ command: `rm -rf ${this.repositoryConfig.location}` })
  }

  public checkoutToBranch() {
    const { location, branch } = this.repositoryConfig;
    const command = `cd ${location} && git checkout ${branch}`;
    Shell.execute({ command: `${this.sshCommand()} '${command}'` })
  }

  public pull() {
    const { branch, location } = this.repositoryConfig;
    const command = `cd ${location} && git pull origin ${branch}`;
    Shell.execute({ command: `${this.sshCommand()} '${command}'` });
  }

  private sshCommand() {
    if (!this.withSSHConnection) return "";
    return SSHManager.command(Config.sshAddress);
  }
}

interface IGitManagerAttributes {
  repositoryConfig: IRepository;
  withSSHConnection: boolean
}
