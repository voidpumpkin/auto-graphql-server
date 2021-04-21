import fs from 'fs';
import { createApp } from './createApp';
import { log } from './logger';

(async () => {
    let config: Config = {};
    try {
        const configFile = fs.readFileSync('./data/config.json', 'utf8');
        config = JSON.parse(configFile);
    } catch (e) {
        console.error(
            '🙀 Something is wrong with your config file, did you forget to include it in the volume?\n More error details below'
        );
    }
    const PORT = process.env.PORT || config.port;

    const { app } = await createApp({ config });
    app.listen(PORT);
    log('👂👂👂', `Listening at \x1b[1m\x1b[34mhttp://localhost:${PORT}`);
})();
