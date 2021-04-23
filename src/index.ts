import { createApp } from './createApp';
import { readDataFiles } from './readDataFiles/readDataFiles';
import { log } from './logger';

(async () => {
    const { config, typeDefs, customResolverBuilderMap } = await readDataFiles();

    const { app } = await createApp({ config, typeDefs, customResolverBuilderMap });

    app.listen(process.env.PORT || config.port);
    log('👂👂👂', `\x1b[1m\x1b[34mauto-graphql-server in now listening`);
})();
