import { SSHManager, Shell } from "../index";
import { Environment, IRepository } from "../../config";

export class DockerManager {
  private readonly sshAddress: string;
  private readonly containerName: string;
  private readonly repositoryConfig: IRepository;

  constructor({ sshAddress, containerName, repositoryConfig }: IDockerManagerAttributes) {
    this.containerName = containerName;
    this.sshAddress = sshAddress;
    this.repositoryConfig = repositoryConfig;
  }

  public dbMigrate() {
    const dockerCommand = `docker exec ${this.containerName} yarn db:migrate`;
    return Shell.execute({ command: `${this.sshCommand()} ${dockerCommand}` });
  }

  public dockerComposeUp() {
    const service = Environment.isProduction() ? ` ${this.containerName} ` : " ";
    const { location } = this.repositoryConfig;
    const locationCommand = `cd ${location}`;
    const composeCommand = `docker-compose up${service}-d --build`;
    const command = `${this.sshCommand()} '${locationCommand} && ${composeCommand}'`;
    return Shell.execute({ command, label: "building container" });
  }

  public createDatabase() {
    const command = `${this.sshCommand()} docker exec ${this.containerName} yarn db:create`;
    return Shell.execute({ command, label: "Creating database" });
  }

  public removeUnusedImages() {
    const command = `${this.sshCommand()} 'docker image prune --force'`;
    return Shell.execute({ command, label: "Removing unused images" });
  }

  private sshCommand() {
    return `${SSHManager.command(this.sshAddress)}`;
  }
}

interface IDockerManagerAttributes {
  repositoryConfig: IRepository;
  sshAddress: string;
  containerName: string;
}
