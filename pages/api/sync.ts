import { NextApiRequest, NextApiResponse } from "next";
import methods from "micro-method-router";
import { airtableBase } from "libs/airtable";
import { algoliaIndex } from "libs/algolia";

module.exports = methods({
    async post(req: NextApiRequest, res: NextApiResponse) {
        airtableBase("Furniture")
            .select({})
            .eachPage(async function page(records, fetchNextPage) {
                const collectionProducts = records.map((r) => {
                    return { objectID: r.id, results: r.fields };
                });
                await algoliaIndex.saveObjects(collectionProducts);
            });
        //response
        return res.json({ message: "productos sincronizados entre airtable y algolia" });
    },
});
