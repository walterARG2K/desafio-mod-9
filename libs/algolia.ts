import algoliasearch from "algoliasearch";

const client = algoliasearch(process.env.ALGOLIA_KEY, process.env.ALGOLIA_VALUE);
export const algoliaIndex = client.initIndex("products");
