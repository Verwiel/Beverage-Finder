const Airtable = require('airtable')

const base = new Airtable({apiKey: process.env.AIRTABLE_TOKEN}).base(process.env.AIRTABLE_BASE)

export const table = base("coffee-stores")

export const findStoreById = async (id) => {
  const findStoreRecords = await table.select({
    filterByFormula: `id="${id}"`
  }).firstPage()

  if(findStoreRecords.length !== 0) {
    const records = findStoreRecords.map(record => (
      {...record.fields}
    ))
    return records
  } else {
    return []
  }
}
