import { findStoreById } from "@/lib/airtable"

const getStoreById = async (req, res) => {
  try {
    const { id } = req.query
    if(id){
      let response = await findStoreById(id)
      if(response.length !== 0){
        res.status(200).json(response[0])
      } else {
        res.status(400).json({message: 'Unable to find a store with that Id'})
      }
    } else {
      res.status(400).json({ message: 'Id is missing' })
    }
  } catch (err) {
    console.error("There was an error getting the store", err)
    res.status(500).json({msg: 'Unable to retrieve store', err})
  }
}

export default getStoreById
