import { createApp } from './createApp';
import { readDataFiles } from './readDataFiles/readDataFiles';
import { log } from './logger';

(async () => {
    const { config, typeDefs, customResolverBuilderMap } = await readDataFiles();
    const port = process.env.PORT || config.port;

    const { app } = await createApp({ config, typeDefs, customResolverBuilderMap });

    app.listen(port);
    log('👂👂👂', `Listening at \x1b[1m\x1b[34mhttp://localhost:${port}`);
})();
