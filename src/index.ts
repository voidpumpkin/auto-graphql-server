import { createApp } from './createApp';
import config from './config.json';
import { log } from './logger';

(async () => {
    const { app } = await createApp({ config });
    app.listen(config.port);
    log('👂👂👂', `Listening at \x1b[1m\x1b[34mhttp://localhost:${config.port}`);
})();
