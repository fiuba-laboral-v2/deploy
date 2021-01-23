import { DockerManager } from "../../../src/models";
import { mockShellExecution } from "../../mocks/models/Shell";
import { Environment } from "../../../src/config";

describe("DockerManager", () => {
  const repositoryConfig = {
    location: "./directory",
    branch: "master",
    url: "https://github.com/organization-name/repository-name.git"
  };
  const containerName = "someContainerName";
  const sshAddress = "someSHHAddress@test.fi.uba.ar";

  it("runs the migrations", async () => {
    const dockerManager = new DockerManager({ containerName, repositoryConfig, sshAddress });
    mockShellExecution(command => command);
    expect(dockerManager.dbMigrate()).toEqual(
      "ssh -o \"StrictHostKeyChecking no\" someSHHAddress@test.fi.uba.ar " +
      "docker exec someContainerName yarn db:migrate"
    );
  });

  it("builds the image and compose the container", async () => {
    const dockerManager = new DockerManager({ containerName, repositoryConfig, sshAddress });
    mockShellExecution(command => command);
    expect(dockerManager.dockerComposeUp()).toEqual(
      "ssh -o \"StrictHostKeyChecking no\" " +
      "someSHHAddress@test.fi.uba.ar " +
      "'cd ./directory && docker-compose up -d --build'" +
      ""
    );
  });

  it("builds the image and compose the container for production environment", async () => {
    const dockerManager = new DockerManager({ containerName, repositoryConfig, sshAddress });
    jest.spyOn(Environment, "isProduction").mockImplementation(() => true);
    mockShellExecution(command => command);
    expect(dockerManager.dockerComposeUp()).toEqual(
      "ssh -o \"StrictHostKeyChecking no\" " +
      "someSHHAddress@test.fi.uba.ar " +
      "'cd ./directory && docker-compose up someContainerName -d --build'" +
      ""
    );
  });

  it("creates the database", async () => {
    const dockerManager = new DockerManager({ containerName, repositoryConfig, sshAddress });
    mockShellExecution(command => command);
    expect(dockerManager.createDatabase()).toEqual(
      "ssh -o \"StrictHostKeyChecking no\" " +
      "someSHHAddress@test.fi.uba.ar " +
      "docker exec someContainerName yarn db:create" +
      ""
    );
  });

  it("removes unused images", async () => {
    const dockerManager = new DockerManager({ containerName, repositoryConfig, sshAddress });
    mockShellExecution(command => command);
    expect(dockerManager.removeUnusedImages()).toEqual(
      "ssh -o \"StrictHostKeyChecking no\" " +
      "someSHHAddress@test.fi.uba.ar " +
      "'docker image prune --force'" +
      ""
    );
  });
});
