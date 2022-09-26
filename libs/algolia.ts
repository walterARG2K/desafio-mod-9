import algoliasearch from "algoliasearch";

const client = algoliasearch("9IEGYRS7OJ", "4aa9f1c69742f9b7e70e3933ae679b4a");
export const algoliaIndex = client.initIndex("products");
