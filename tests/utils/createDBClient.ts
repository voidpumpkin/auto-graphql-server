import { spawn } from 'child_process';
import config from '../testConfig';

export async function createDBClient(): Promise<void> {
    if (config.database.client === 'mysql2') {
        await createMySQLClient();
    }
}
async function createMySQLClient(): Promise<void> {
    console.log('\x1b[2mRoušiamas mysql konteineris...');
    await new Promise<void>((resolve) => {
        const initProccessDoneRef = { val: false };
        const run = spawn(
            'docker container run',
            [
                '--name mysql_test',
                '-e MYSQL_ROOT_USER=root',
                '-e MYSQL_ROOT_PASSWORD=testpassword',
                '-e MYSQL_USER=testuser',
                '-e MYSQL_PASSWORD=testpassword',
                '-e MYSQL_DATABASE=testdb',
                '-p 3306:3306',
                'mysql',
            ],
            { shell: true }
        );
        run.stdout.setEncoding('utf8');
        run.stdout.on('data', (data) => {
            // console.log(`docker container run stdout: ${data}`);
            if (data.includes('MySQL init process done.')) {
                initProccessDoneRef.val = true;
            }
        });
        run.stderr.setEncoding('utf8');
        run.stderr.on('data', (data) => {
            // console.log(`docker container run stderr: ${data}`);
            if (
                initProccessDoneRef.val &&
                data.includes('/usr/sbin/mysqld: ready for connections')
            ) {
                resolve();
            }
        });
    });
}
