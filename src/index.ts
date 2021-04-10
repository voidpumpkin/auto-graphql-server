import { createApp } from './createApp';

import config from './config.json';

(async () => {
    const app = await createApp({ config });
    app.listen(config.port);
    console.log(`👂 Listening at http://localhost:${config.port}`);
})();
