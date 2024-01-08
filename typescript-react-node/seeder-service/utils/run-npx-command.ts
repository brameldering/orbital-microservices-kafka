import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export const runCommand = async (command: string): Promise<void> => {
  try {
    const { stdout, stderr } = await execAsync(command);
    console.log(stdout);
    if (stderr) {
      console.error(`Stderr: ${stderr}`);
    }
  } catch (error: any) {
    console.error(`Error: ${error.message}`);
    throw error;
  }
};
