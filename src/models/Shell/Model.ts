import shell from "shelljs";

export const Shell = {
  execute: ({ command, label }: { command: string; label?: string; }) => {
    shell.echo(label || command);
    const code = shell.exec(command).code;
    if (code !== 0) throw { code };
  },
  exitSuccess: () => shell.exit(0),
  exit: (code?: number) => shell.exit(code || 1)
};
