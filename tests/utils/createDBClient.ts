import { spawn } from 'child_process';
import config from '../testConfig';

export async function createDBClient(): Promise<void> {
    if (config.database.client === 'mysql2') {
        await createMySQLClient();
    } else if (config.database.client === 'pg') {
        await createPostgreClient();
    }
}
async function createMySQLClient(): Promise<void> {
    console.log('\x1b[2mRoušiamas mysql konteineris...\x1b[0m');
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
async function createPostgreClient(): Promise<void> {
    console.log('\x1b[2mRoušiamas postgres konteineris...\x1b[0m');
    await new Promise<void>((resolve) => {
        const initProccessDoneRef = { val: false };
        const run = spawn(
            'docker container run',
            [
                '--name postgre_test',
                '-e POSTGRES_USER=testuser',
                '-e POSTGRES_PASSWORD=testpassword',
                '-e POSTGRES_DB=testdb',
                '-p 5432:5432',
                'postgres',
            ],
            { shell: true }
        );
        run.stdout.setEncoding('utf8');
        run.stdout.on('data', (data) => {
            // console.log(`docker container run stdout: ${data}`);
            if (data.includes('PostgreSQL init process complete; ready for start up.')) {
                initProccessDoneRef.val = true;
            }
        });
        run.stderr.on('data', (data) => {
            // console.log(`docker container run stderr: ${data}`);
            if (
                initProccessDoneRef.val &&
                data.includes('database system is ready to accept connections')
            ) {
                resolve();
            }
        });
    });
}
