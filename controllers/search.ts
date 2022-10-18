import { algoliaIndex } from "libs/algolia";

export async function searchProductsByQuery(query, queryOffset, queryLimit) {
    const aBuscar = query || "";

    const response = await algoliaIndex.search(aBuscar, {
        offset: queryOffset,
        length: queryLimit <= 12 ? queryLimit : 12,
    });
    return {
        results: response.hits,
        pagination: {
            offset: response.offset,
            limit: response.length,
            total: response.nbHits,
        },
    };
}

export async function findProductById(productId) {
    try {
        const product = (await algoliaIndex.findObject((hit) => hit.objectID === productId)) as any;
        return product.object.results;
    } catch (error) {
        throw error;
    }
}
