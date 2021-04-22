import { createApp } from './createApp';
import { readDataFiles } from './readDataFiles';
import { log } from './logger';

(async () => {
    const { config, typeDefs } = readDataFiles();
    const port = process.env.PORT || config.port;

    const { app } = await createApp({ config, typeDefs });

    app.listen(port);
    log('👂👂👂', `Listening at \x1b[1m\x1b[34mhttp://localhost:${port}`);
})();
