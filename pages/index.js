import React from 'react'
import Head from 'next/head'
import Image from 'next/image'
import { ACTION_TYPES, useStore } from "../context/store-context"
import { fetchStores } from '../lib/coffee-stores'
import useTrackLocation from '@/hooks/use-track-location'
import Banner from '../components/banner'
import Card from '../components/card'
import styles from '../styles/Home.module.css'

export async function getStaticProps(context) {
  const data = await fetchStores()
  return {
    props: {
      defaultStores: data,
    },
  }
}

export default function Home({ defaultStores }) {
  const { useEffect, useState } = React
  const [storesError, setStoresError] = useState(null)
  const { handleTrackLocation, locationErrorMsg, isFindingLocation } = useTrackLocation()
  const { dispatch, state } = useStore()
  const { latLong, stores, isOpen, hideChains } = state

  const handleOnButtonClick = () => {
    handleTrackLocation()
  }

  const handleCheck = (e) => {
    const { checked, name } = e.target
    if(name === 'hideChains'){
      dispatch({
        type: ACTION_TYPES.SET_HIDE_CHAINS,
        payload: { hideChains: checked }
      })
    }

    if(name === 'openNow'){
      dispatch({
        type: ACTION_TYPES.SET_OPEN_NOW,
        payload: { isOpen: checked }
      })
    }
  }

  useEffect(() => {
    async function displayStoresByLocation() {
      if (latLong) {
        try {
          const response = await fetch(`/api/getStoresByLocation?latLong=${latLong}&limit=30&isOpen=${isOpen}&hideChains=${hideChains}`)
          const fetchedStores = await response.json()

          dispatch({
            type: ACTION_TYPES.SET_STORES,
            payload: { ...state, stores: fetchedStores }
          })
          setStoresError(null)
        } catch (error) {
          console.error({ error })
          setStoresError(error.message)
        }
      }
    }
    displayStoresByLocation()
  }, [latLong, isOpen, hideChains])

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
          <ul className={styles.list}>
            <li>
              <label htmlFor="hideChains">
                Hide Chains
                <input type="checkbox" name="hideChains" checked={hideChains} onChange={handleCheck} />
              </label>
            </li>
            <li>
              <label htmlFor="openNow">
                Open Now
                <input type="checkbox" name="openNow" checked={isOpen} onChange={handleCheck} />
              </label>
            </li>
          </ul>
        }

        {stores.length > 0 ?
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
        : defaultStores.length > 0 &&
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
