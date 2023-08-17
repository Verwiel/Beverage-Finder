import { table, findStoreById } from "@/lib/airtable"

const createCoffeeStore = async (req, res) => {
  // Only run if its a POST
  if(req.method === 'POST'){
    try {      
      const incomingCoffeeShop = req.body

      const createCoffeeStoreRecord = async (incomingCoffeeShop) => {
        if(incomingCoffeeShop.name){
          try {
            let createRecord = await table.create(incomingCoffeeShop)
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
      if(incomingCoffeeShop.id){
        // Check for existing record
        const coffeeStoreRecord = await findStoreById(incomingCoffeeShop.id)
      
        // Run functions depending on if a store exists or not
        if(coffeeStoreRecord.length !== 0) {
          res.json(coffeeStoreRecord[0])
        } else {
          await createCoffeeStoreRecord(incomingCoffeeShop)
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

export default createCoffeeStore
