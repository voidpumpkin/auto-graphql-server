import fs from 'fs';

const DATA_FOLDER_PATH = './data/';
const REQUIRED_FILES = { TYPEDEFS: 'schema.graphql', CONFIG: 'config.json' };

export function readDataFiles(): { config: Config; typeDefs: string } {
    const missingRequiredFiles = Object.values(REQUIRED_FILES).filter(
        (fileName) => !fs.existsSync(DATA_FOLDER_PATH + fileName)
    );
    if (missingRequiredFiles.length) {
        missingRequiredFiles.forEach((fileName) => {
            console.error(`🔍 File ${DATA_FOLDER_PATH}${fileName} not found`);
        });
        throw Error('❓ Include the missing files in the data volume');
    }
    const typeDefs = fs.readFileSync(DATA_FOLDER_PATH + REQUIRED_FILES.TYPEDEFS, 'utf8');
    const configFile = fs.readFileSync(DATA_FOLDER_PATH + REQUIRED_FILES.CONFIG, 'utf8');
    const config = JSON.parse(configFile);
    return { config, typeDefs };
}
