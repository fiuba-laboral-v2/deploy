import { Config, IRepository } from "../../config";
import { Shell } from "../index";

export class GitManager {
  private repositoryConfig: IRepository;
  private readonly withSSHConnection: boolean;

  constructor({ repositoryConfig, withSSHConnection }: IGitManagerAttributes) {
    this.repositoryConfig = repositoryConfig;
    this.withSSHConnection = withSSHConnection;
  }

  public repositoryWasNotCloned() {
    Shell.execute({
      command: `${this.sshCommand()} cd ${this.repositoryConfig.location}`
    })
  }

  private sshCommand() {
    if (!this.withSSHConnection) return "";
    return `ssh -o "StrictHostKeyChecking no" ${Config.sshAddress}`;
  }
}

interface IGitManagerAttributes {
  repositoryConfig: IRepository;
  withSSHConnection: boolean
}
