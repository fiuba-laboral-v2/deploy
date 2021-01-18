import { BackendManager } from "../../../src/models";
import { mockShellExecution } from "../../mocks/models/Shell";

describe("BackendManager", () => {
  it("initialize the env file for staging", async () => {
    const manager = new BackendManager("staging");
    const sshCommand = "ssh -o \"StrictHostKeyChecking no\" test@antiguos.fi.uba.ar";
    mockShellExecution(command => {
      expect(command).toEqual(`${sshCommand} 'cd ./directory && touch .env'`);
      return command;
    });
    mockShellExecution(command => {
      expect(command).toEqual(`${sshCommand} 'cd ./directory && echo NODE_ENV=staging > .env'`);
      return command;
    });
    manager.initializeEnvFile();
  });

  it("initialize the env file for production", async () => {
    const manager = new BackendManager("production");
    const sshCommand = "ssh -o \"StrictHostKeyChecking no\" test@antiguos.fi.uba.ar";
    mockShellExecution(command => {
      expect(command).toEqual(`${sshCommand} 'cd ./directory && touch .env'`);
      return command;
    });
    mockShellExecution(command => {
      expect(command).toEqual(`${sshCommand} 'cd ./directory && echo NODE_ENV=production > .env'`);
      return command;
    });
    manager.initializeEnvFile();
  });
});
