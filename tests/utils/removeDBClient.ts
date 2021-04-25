/* eslint-disable @typescript-eslint/no-unused-vars */
import { exec } from 'child_process';
import config from '../testConfig';

export async function removeDBClient(): Promise<void> {
    if (config.database.client === 'mysql2') {
        await removeMySQLClient();
    } else if (config.database.client === 'pg') {
        await removePostgreClient();
    }
}
async function removeMySQLClient(): Promise<void> {
    console.log('\x1b[2mTrinamas mysql konteineris...\x1b[0m');
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
async function removePostgreClient(): Promise<void> {
    console.log('\x1b[2mTrinamas postgres konteineris...\x1b[0m');
    await new Promise<void>((resolve) => {
        exec('docker container rm -v -f postgre_test', (_error, _stdout, _stderr) => {
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
