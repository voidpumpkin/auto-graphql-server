import { DATA_FOLDER_PATH, OPTIONAL_FILES } from './readDataFiles';

export function validateCustomResolverBuilderMap(
    customResolverBuilderMap: unknown
): customResolverBuilderMap is CustomResolverBuilderMap {
    if (!customResolverBuilderMap) {
        throw Error(`❓ ${DATA_FOLDER_PATH + OPTIONAL_FILES.RESOLVERS} is falsy`);
    }
    if (!isObject(customResolverBuilderMap)) {
        throw Error(`❓ ${DATA_FOLDER_PATH + OPTIONAL_FILES.RESOLVERS} is not an object`);
    }
    if (!areObjectValuesObjects(customResolverBuilderMap)) {
        throw Error(
            `❓ ${
                DATA_FOLDER_PATH + OPTIONAL_FILES.RESOLVERS
            } some of type resolvers are not an object`
        );
    }
    const isValid = !Object.values(customResolverBuilderMap).some((fieldResolverMap) =>
        Object.values(fieldResolverMap).some(
            (customResovler) => !isCustomResolverBuilder(customResovler)
        )
    );
    if (!isValid) {
        throw Error(
            `❓ ${
                DATA_FOLDER_PATH + OPTIONAL_FILES.RESOLVERS
            } some of type field resolvers are not an function`
        );
    }
    return true;
}

function isObject(type: unknown): type is Record<string, unknown> {
    return typeof type === 'object';
}

function areObjectValuesObjects(
    type: Record<string, unknown>
): type is Record<string, Record<string, unknown>> {
    return !Object.values(type).some((v) => typeof v !== 'object');
}

function isCustomResolverBuilder(type: unknown): type is CustomResolverBuilder {
    return typeof type === 'function';
}
