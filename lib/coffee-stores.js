const generateFoursquareQuery = (latLong, categories, limit) => {
  return `https://api.foursquare.com/v3/places/search?ll=${latLong}&categories=${categories}&sort=DISTANCE&limit=${limit}`
}

const appendShopsPhoto = async (id) => {
  let placeholderImage= 'https://images.unsplash.com/photo-1504753793650-d4a2b783c15e?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80'
  try {
    let response = await fetch(`https://api.foursquare.com/v3/places/${id}/photos?limit=1&sort=POPULAR`, fsOptions)
    let data = await response.json()
    if(data.length > 0){
      return `${data[0].prefix}original${data[0].suffix}`
    }
    return placeholderImage
  } catch (error) {
    return placeholderImage
  }
}

async function appendAllStorePhotos(stores) {
  for (let i = 0; i < stores.length; i++) {
    let store = stores[i]
    let photo = await appendShopsPhoto(store.fsq_id)
    store.imgUrl = photo
  }
}

const fsOptions = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: process.env.NEXT_PUBLIC_FOURSQUARE_API_KEY
  }
};

export const fetchCoffeeStores = async (latLong = '40.76%2C-111.89', limit='6') => {
  try {
    let response = await fetch(generateFoursquareQuery(latLong, '13035', limit), fsOptions)
    let data = await response.json()
    await appendAllStorePhotos(data.results)
    return data.results
  } catch (error) {
    console.error(err)
    return []
  }
}
