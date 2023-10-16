import { createApi } from "unsplash-js"

const unsplashApi = createApi({
  accessKey: process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY
})

const generateFoursquareQuery = (latLong, categories, limit, hideChains, isOpen) => {
  return `https://api.foursquare.com/v3/places/search?ll=${latLong}&categories=${categories}&sort=DISTANCE&limit=${limit}&exclude_all_chains=${hideChains}&open_now=${isOpen}`
}

const getListOfStorePhotos = async (limit) => {
  const photos = await unsplashApi.search.getPhotos({
    query: "coffee shop",
    perPage: limit,
  });
  const unsplashResults = photos.response?.results || [];
  return unsplashResults.map((result) => result.urls["small"]);
};

// Getting 4SQ image - API heavy
// const appendShopsPhoto = async (id) => {
//   let placeholderImage= 'https://images.unsplash.com/photo-1504753793650-d4a2b783c15e?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80'

  // try {
  //   let response = await fetch(`https://api.foursquare.com/v3/places/${id}/photos?limit=1&sort=POPULAR`, fsOptions)
  //   let data = await response.json()
  //   if(data.length > 0){
  //     return `${data[0].prefix}original${data[0].suffix}`
  //   }
  //   return placeholderImage
  // } catch (error) {
  //   return placeholderImage
  // }
// }

async function updateStoresData(stores) {
  for (let i = 0; i < stores.length; i++) {
    let store = stores[i]
    store.address = ''
    store.parent = ''
    store.votes = 0
    if(store.location){
      store.address = store.location.formatted_address
    }
    if(store.related_places.parent) {
      store.parent = store.related_places.parent.name
    }
    // let photo = await appendShopsPhoto(store.fsq_id)
    // store.imgUrl = photo
  }
}

const fsOptions = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: process.env.NEXT_PUBLIC_FOURSQUARE_API_KEY
  }
};

export const fetchStores = async (latLong = '40.76%2C-111.89', limit='6', hideChains=true, isOpen=true) => {
  
  try {
    const photos = await getListOfStorePhotos(limit);
    // Brewery: 13029
    // Coffee: 13035
    let response = await fetch(generateFoursquareQuery(latLong, '13035', limit, hideChains, isOpen), fsOptions)
    let data = await response.json()
    await updateStoresData(data.results)
    let returnData = data.results.map((obj, idx) => { 
      return {
        id: `${obj.fsq_id}`,
        name: obj.name,
        address: obj.address,
        parent: obj.parent,
        imgUrl: photos.length > 0 ? photos[idx] : null,
        votes: obj.votes
      } 
    })
    return returnData
  } catch (err) {
    console.error(err)
    return []
  }
}
