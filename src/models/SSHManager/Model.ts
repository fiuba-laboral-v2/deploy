export const SSHManager = {
  command: (sshAddress: string) => `ssh -o "StrictHostKeyChecking no" ${sshAddress}`
}
