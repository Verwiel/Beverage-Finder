import { fetchStores } from "@/lib/coffee-stores"

const getStoresByLocation = async (req, res) => {
  const { latLong, limit } = req.query
  // we dont need to check for query since its handled in fetchStores
  try {
    const response = await fetchStores(latLong, limit)
    res.status(200).json(response)
  } catch (err) {
    console.error("There was an error", err)
    res.status(500).json({ message: "Oh no! Something went wrong", err })
  }
}

export default getStoresByLocation
