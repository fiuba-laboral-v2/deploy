import shell from "shelljs";

export const Shell = {
  execute: ({ command, label }: { command: string; label?: string; }) => {
    shell.echo(label || command);
    const result = shell.exec(command);
    if (result.code !== 0) throw { code: result.code };
    return result;
  },
  exitSuccess: () => shell.exit(0),
  exit: (code?: number) => shell.exit(code || 1)
};
