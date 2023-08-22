import { table, findStoreById, minifyRecord } from "@/lib/airtable"

const upvoteStore = async (req, res) => {
  if (req.method === "PUT") {
    try {
      const { id } = req.body

      if (id) {
        const records = await findStoreById(id)

        if (records.length !== 0) {
          let record = records[0]
          let incrementedVotes = +record.votes + 1

          const updateRecord = await table.update(record.recordId,
            { votes: incrementedVotes },
          )

          if (updateRecord) {
            res.status(200).json(updateRecord.fields)
          } else {
            res.status(500).json({ message: "Error upvoting coffee store", err })
          }
        } else {
          res.status(400).json({ message: "Coffee store id doesn't exist", id })
        }
      } else {
        res.status(400).json({ message: "Id is missing" })
      }
    } catch (err) {
      res.status(500).json({ message: "Error upvoting coffee store", err })
    }
  }
}

export default upvoteStore
