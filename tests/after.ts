import { exec } from 'child_process';
import config from './testConfig';

(async () => {
    if (config.database.client === 'mysql2') {
        // await removeMySQLImage();
    }
})();

async function removeMySQLImage(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
        console.log('\x1b[2mRemoving mysql image');
        exec('docker image rm mysql', (error, stdout, stderr) => {
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
