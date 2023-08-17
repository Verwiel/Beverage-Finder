import { useEffect, useState } from 'react'
import Head from 'next/head'
import Image from 'next/image'
import { ACTION_TYPES, useStore } from "../context/store-context"
import { fetchStores } from '../lib/coffee-stores'
import useTrackLocation from '@/hooks/use-track-location'
import Banner from '../components/banner'
import Card from '../components/card'
import styles from '../styles/Home.module.css'

export async function getStaticProps(context) {
  // dont use API routes within getStaticProps since the servers wont have started at build time.
  const data = await fetchStores()
  return {
    props: {
      defaultStores: data,
    },
  }
}


export default function Home({ defaultStores }) {
  const [storesError, setStoresError] = useState(null)
  const { handleTrackLocation, locationErrorMsg, isFindingLocation } = useTrackLocation()
  const { dispatch, state } = useStore()
  const { latLong, stores } = state

  const handleOnButtonClick = () => {
    handleTrackLocation()
  }

  useEffect(() => {
    async function displayStoresByLocation() {
      if (latLong) {
        try {
          const response = await fetch(`/api/getStoresByLocation?latLong=${latLong}&limit=30`)
          const fetchedStores = await response.json()

          dispatch({
            type: ACTION_TYPES.SET_STORES,
            payload: { ...state, stores: fetchedStores }
          })
          setStoresError(null)
        } catch (error) {
          console.log({ error })
          setStoresError(error.message)
        }
      }
    }
    displayStoresByLocation()
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

        {storesError &&
          <p>Something went wrong: {storesError}</p>
        }

        <Image 
          src='/static/hero-image.png' 
          width={700} 
          height={400} 
          className={styles.heroImage}
          alt='coffee hero'
          priority={true}
        />

        {stores.length > 0 &&
        <>
          <h2 className={styles.heading2}>Coffee Stores near me</h2>
          <div className={styles.cardLayout}>
            {stores.map(store => (
              <Card 
                key={store.id}
                className={styles.card}
                name={store.name}
                imgUrl={store.imgUrl || 'https://images.unsplash.com/photo-1504753793650-d4a2b783c15e?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80'}
                href={`coffee-store/${store.id}`}
              />
            ))}
          </div>
        </>
        }

        {defaultStores.length > 0 &&
        <>
          <h2 className={styles.heading2}>Salt Lake City Coffee Stores</h2>
          <div className={styles.cardLayout}>
            {defaultStores.map(store => (
              <Card 
                key={store.id}
                className={styles.card}
                name={store.name}
                imgUrl={store.imgUrl || 'https://images.unsplash.com/photo-1504753793650-d4a2b783c15e?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80'}
                href={`coffee-store/${store.id}`}
              />
            ))}
          </div>
        </>
        }
      </main>
    </>
  )
}
