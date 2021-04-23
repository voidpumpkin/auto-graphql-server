import fs from 'fs';
import path from 'path';
import { validateCustomResolverBuilderMap } from './validateCustomResolverBuilderMap';

export const DATA_FOLDER_PATH = path.join(__dirname, '../../data/');
const REQUIRED_FILES = { TYPEDEFS: 'schema.graphql', CONFIG: 'config.json' };
export const OPTIONAL_FILES = { RESOLVERS: 'resolvers.js' };

export async function readDataFiles(): Promise<{
    config: Config;
    typeDefs: string;
    customResolverBuilderMap?: CustomResolverBuilderMap;
}> {
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
    const config = await import(DATA_FOLDER_PATH + REQUIRED_FILES.CONFIG);

    const hasResolversFile = fs.existsSync(DATA_FOLDER_PATH + OPTIONAL_FILES.RESOLVERS);
    if (!hasResolversFile) {
        return { config, typeDefs };
    }
    const customResolverBuilderMap: unknown = (
        await import(DATA_FOLDER_PATH + OPTIONAL_FILES.RESOLVERS)
    ).default;
    if (!validateCustomResolverBuilderMap(customResolverBuilderMap)) {
        throw Error(`❓ ${DATA_FOLDER_PATH + OPTIONAL_FILES.RESOLVERS} is not valid`);
    }
    return { config, typeDefs, customResolverBuilderMap };
}
