import { table, findStoreById } from "@/lib/airtable"

const createStore = async (req, res) => {
  // Only run if its a POST
  if(req.method === 'POST'){
    try {      
      const incomingShop = req.body
      
      const createStoreRecord = async (incomingShop) => {
        if(incomingShop.name){
          try {
            let createRecord = await table.create(incomingShop)
            res.status(200).json(createRecord.fields)
            return createRecord.fields
          } catch (err) {
            console.error('Could not create store', err)
            res.status(500).json({ message: 'Could not create store', err })
          }
        } else {
          res.status(400).json({ message: 'Stores name is missing' })
        }
      }
      
      // Only continue if there is an Id coming in
      if(incomingShop.id){
        // Check for existing record
        const storeRecord = await findStoreById(incomingShop.id)
        
        // Run functions depending on if a store exists or not
        if(storeRecord.length !== 0) {
          res.json(storeRecord[0])
        } else {
          await createStoreRecord(incomingShop)
        }
      } else {
        res.status(400).json({ message: 'Id is missing' })
      }
    } catch (err) {
      console.error('Error finding store', err)
      res.status(500).json({ message: 'Error finding store', err })
    }
  } 
}

export default createStore
