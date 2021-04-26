export default async function queryGraphql(query) {
    console.log('%c' + query, 'font-weight: bold; font-size: 2em; font-family: monospace;');
    const response = await fetch('/graphql', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
        },
        body: JSON.stringify({ query }),
    });
    if (!response) {
        return {};
    }
    const responseJson = await response.json();
    if (responseJson?.errors) {
        console.error(responseJson?.errors);
    }
    return responseJson;
}
