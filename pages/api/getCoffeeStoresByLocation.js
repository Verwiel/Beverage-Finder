import { fetchCoffeeStores } from "@/lib/coffee-stores"

const getCoffeeStoresByLocation = async (req, res) => {
  const { latLong, limit } = req.query
  // we dont need to vheck for query since its handled in fetchCoffeeStores
  try {
    const response = await fetchCoffeeStores(latLong, limit)
    res.status(200).json(response)
  } catch (err) {
    console.error("There was an error", err)
    res.status(500).json({ message: "Oh no! Something went wrong", err })
  }
}

export default getCoffeeStoresByLocation
