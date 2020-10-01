import { Shell } from "../../../src/models/Shell";

export const mockShellExecution = (callback: (command: string) => string | number) =>
  jest
    .spyOn(Shell, "execute")
    .mockImplementationOnce(({ command }) => callback(command));
