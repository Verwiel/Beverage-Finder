const generateFoursquareQuery = (latLong, categories, limit) => {
  return `https://api.foursquare.com/v3/places/search?ll=${latLong}&categories=${categories}&sort=DISTANCE&limit=${limit}`
}

const appendShopsPhoto = async (id) => {
  let response = await fetch(`https://api.foursquare.com/v3/places/${id}/photos?limit=1&sort=POPULAR`, fsOptions)
  let data = await response.json()
  if(data.length > 0){
    return `${data[0].prefix}original${data[0].suffix}`
  }
  return ''
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
    Authorization: process.env.FOURSQUARE_API_KEY
  }
};

export const fetchCoffeeStores = async () => {
  // try {
    let response = await fetch(generateFoursquareQuery('40.76%2C-111.89', '13035', '6'), fsOptions)
    let data = await response.json()
    await appendAllStorePhotos(data.results)
  // } catch (error) {
  //   console.error(err)
  // }

  return data.results
}


export const fetchCoffeeStore = async (id) => {
  // try {
    let response = await fetch(`https://api.foursquare.com/v3/places/${id}`, fsOptions)
    let data = await response.json()
    let photo = await appendShopsPhoto(id)
    data.imgUrl = photo
  // } catch (error) {
  //   console.error(err)
  // }
  // console.log(data)

  return data
}