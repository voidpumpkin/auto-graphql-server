/* eslint-disable @typescript-eslint/no-unused-vars */
import { exec } from 'child_process';
import config from '../testConfig';

export async function removeDBClient(): Promise<void> {
    if (config.database.client === 'mysql2') {
        await createMySQLClient();
    }
}
async function createMySQLClient(): Promise<void> {
    console.log('\x1b[2mTrinamas mysql konteineris...');
    await new Promise<void>((resolve) => {
        exec('docker container rm -v -f mysql_test', (_error, _stdout, _stderr) => {
            // if (_error) {
            //     console.log(_error);
            //     return;
            // }
            // if (_stderr) {
            //     console.log(_stderr);
            //     return;
            // }
            // console.log(_stdout);
            resolve();
        });
    });
}
