import { useEffect, useState } from 'react'
import Head from 'next/head'
import Image from 'next/image'
import Banner from '../components/banner'
import Card from '../components/card'
import styles from '../styles/Home.module.css'
import { fetchCoffeeStores } from '../lib/coffee-stores'
import useTrackLocation from '@/hooks/use-track-location'

export async function getStaticProps(context) {
  const data = await fetchCoffeeStores()
  return {
    props: {
      coffeeStores: data,
    },
  }
}


export default function Home({ coffeeStores }) {
  const [coffeeStoresNearby, setCoffeeStoresNearby] = useState([])
  const [coffeeStoresError, setCoffeeStoresError] = useState(null)
  const { latLong, handleTrackLocation, locationErrorMsg, isFindingLocation } = useTrackLocation()

  const handleOnButtonClick = () => {
    handleTrackLocation()
  }

  useEffect(() => {
    async function displayCoffeeStoresByLocation() {
      if (latLong) {
        try {
          const fetchedCoffeeStores = await fetchCoffeeStores(latLong, 30)
          setCoffeeStoresNearby(fetchedCoffeeStores)
        } catch (error) {
          console.log({ error })
          setCoffeeStoresError(error.message)
        }
      }
    }
    displayCoffeeStoresByLocation()
  }, [latLong])

  return (
    <>
      <Head>
        <title>Coffee Connoisseur</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <Banner 
          buttonText={isFindingLocation ? "Locating..." : "View stores nearby" }
          handleOnClick={handleOnButtonClick} 
        />

        {locationErrorMsg &&
          <p>Something went wrong: {locationErrorMsg}</p>
        }

        {coffeeStoresError &&
          <p>Something went wrong: {coffeeStoresError}</p>
        }

        <Image 
          src='/static/hero-image.png' 
          width={700} 
          height={400} 
          className={styles.heroImage}
          alt='coffee hero'
          priority={true}
        />

        {coffeeStoresNearby.length > 0 &&
        <>
          <h2 className={styles.heading2}>Coffee Stores near me</h2>
          <div className={styles.cardLayout}>
            {coffeeStoresNearby.map(store => (
              <Card 
                key={store.fsq_id}
                className={styles.card}
                name={store.name}
                imgUrl={store.imgUrl || 'https://images.unsplash.com/photo-1504753793650-d4a2b783c15e?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80'}
                href={`coffee-store/${store.fsq_id}`}
              />
            ))}
          </div>
        </>
        }

        {coffeeStores.length > 0 &&
        <>
          <h2 className={styles.heading2}>Salt Lake City Coffee Stores</h2>
          <div className={styles.cardLayout}>
            {coffeeStores.map(store => (
              <Card 
                key={store.fsq_id}
                className={styles.card}
                name={store.name}
                imgUrl={store.imgUrl || 'https://images.unsplash.com/photo-1504753793650-d4a2b783c15e?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80'}
                href={`coffee-store/${store.fsq_id}`}
              />
            ))}
          </div>
        </>
        }
      </main>
    </>
  )
}
