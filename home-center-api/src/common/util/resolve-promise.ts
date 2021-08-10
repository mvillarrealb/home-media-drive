/**
 * Resolves a promise and return the results as two dimension array
 * where index 0 is the promise resolution (or null if a error occurs)
 * and index 1 is the error(or null if the promises resolves successfully)
 * @param promise 
 * @returns 
 */
export async function resolvePromise(promise: Promise<any>) {
    let response = null;
    try {
        const result = await promise;
        response = [result, null];
    } catch(error) {
        response = [ null, error];
    }
    return response;
}