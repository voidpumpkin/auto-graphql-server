import { exec } from 'child_process';
import config from './testConfig';

(async () => {
    if (config.database.client === 'mysql2') {
        await pullMySQLImage();
    }
})();

async function pullMySQLImage(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
        console.log('\x1b[2mPulling mysql image');
        exec('docker pull mysql', (error, stdout, stderr) => {
            if (error) {
                reject(error);
                return;
            }
            if (stderr) {
                reject(stderr);
                return;
            }
            console.log(stdout);
            resolve();
        });
    });
}
