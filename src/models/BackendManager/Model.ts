import { BackendConfig, Config } from "../../config";
import { SSHManager, Shell } from "../index";
import { InvalidNodeEnvVariableError } from "../Errors";

export class BackendManager {
  private readonly nodeEnv: string;
  private readonly sshAddress: string;

  constructor(nodeEnv: string) {
    this.nodeEnv = nodeEnv;
    this.sshAddress = Config.sshAddress;
    this.validate();
  }

  public initializeEnvFile() {
    const { location } = BackendConfig.gitRepository;
    this.execute(`cd ${location} && touch .env`);
    this.execute(`cd ${location} && echo NODE_ENV=${this.nodeEnv} > .env`);
  }

  private execute(command: string) {
    return Shell.execute({ command: `${SSHManager.command(this.sshAddress)} '${command}'` });
  }

  private validate() {
    if (["production", "staging"].includes(this.nodeEnv)) return;
    throw new InvalidNodeEnvVariableError();
  }
}
