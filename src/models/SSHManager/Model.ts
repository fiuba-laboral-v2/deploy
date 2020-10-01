export const SSHManager = {
  command: (sshAddress: string) => `ssh -o "StrictHostKeyChecking no" ${sshAddress}`,
  copy: ({ sourceDirectory, destinationDirectory }: ICopyArguments) =>
    `scp -o "StrictHostKeyChecking no" -r ${sourceDirectory} ${destinationDirectory}`
}

interface ICopyArguments {
  sourceDirectory: string;
  destinationDirectory: string;
}
