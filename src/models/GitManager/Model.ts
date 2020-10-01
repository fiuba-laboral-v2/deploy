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
      this.execute(`cd ${this.repositoryConfig.location}`);
      return false;
    } catch (error) {
      return true;
    }
  }

  public cloneRepository() {
    const { location, url, branch } = this.repositoryConfig;
    return this.execute(`git clone -b ${branch} ${url} ${location}`);
  }

  public removeRepository() {
    return this.execute(`rm -rf ${this.repositoryConfig.location}`);
  }

  public checkoutToBranch() {
    const { location, branch } = this.repositoryConfig;
    return this.execute(`cd ${location} && git checkout ${branch}`);
  }

  public pull() {
    const { branch, location } = this.repositoryConfig;
    return this.execute(`cd ${location} && git pull origin ${branch}`);
  }

  private execute(command: string) {
    if (!this.withSSHConnection) return Shell.execute({ command });

    return Shell.execute({ command: `${SSHManager.command(Config.sshAddress)} '${command}'` });
  }
}

interface IGitManagerAttributes {
  repositoryConfig: IRepository;
  withSSHConnection: boolean
}
