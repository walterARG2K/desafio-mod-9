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

export async function findProductById(productIds) {
    try {
        var arrProducts = productIds;
        if (typeof productIds === "string") arrProducts = arrProducts.split();

        const products = (await algoliaIndex.getObjects(arrProducts)) as any;
        return products.results;
    } catch (error) {
        throw error;
    }
}
