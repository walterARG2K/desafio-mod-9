import Airtable from "airtable";
export const airtableBase = new Airtable({ apiKey: process.env.AIRTABLE_KEY }).base(
    process.env.AIRTABLE_BASE
);
