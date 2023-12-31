import React from "react"
import { useRouter } from "next/router"
import Link from "next/link"
import Head from "next/head"
import Image from "next/image"
import useSWR from 'swr'
import styles from "../../styles/coffee-store.module.css"
import { fetchStores } from "../../lib/coffee-stores"
import { useStore } from "../../context/store-context"
import { isEmpty, fetcher } from "../../utils"

export async function getStaticProps({ params }) {
  const stores = await fetchStores()
  const storeFromContext = stores.find(store => {
    return store.id === params.id
  })

  return {
    props: {
      store: storeFromContext ? storeFromContext : {},
      // fallback: {}
    },
  }
}

export async function getStaticPaths() {
  const stores = await fetchStores()
  const paths = stores.map((store) => {
    return {
      params: {
        id: store.id,
      },
    }
  })
  return {
    paths,
    fallback: true,
  }
}

const Store = (initialProps) => {
  const router = useRouter()
  const id = router.query.id

  const { useEffect, useState } = React
  const [store, setStore] = useState(initialProps.store || {})

  const {
    state: { stores },
  } = useStore()

  const handleCreateStore = async (store) => {
    try {
      const res = await fetch('/api/createStore', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(store)
      })
      
      const dbStore = await res.json()
    } catch (err) {
      console.error('Error creating store', err)
    }
  }

  useEffect(() => {
    if (isEmpty(initialProps.store)) {
      if (stores.length > 0) {
        const storeFromContext = stores.find(store => {
          return store.id === id
        })
        
        if(storeFromContext){
          setStore(storeFromContext)
          handleCreateStore(storeFromContext)
        }
      }
    } else {
      handleCreateStore(initialProps.store) // SSG
    }
  }, [id, initialProps, stores])

  const { name, address, parent, imgUrl, votes } = store
  const [votingCount, setVotingCount] = useState(0)

  const { data, error } = useSWR(`/api/getStoreById?id=${id}`, fetcher)

  useEffect(() => {
    if(data && data.id){
      setStore(data)
      setVotingCount(data.votes)
    }
  }, [data])

  if (router.isFallback) {
    return <div>Loading...</div>;
  }
  
  const handleUpvoteButton = async () => {
    try {
      const res = await fetch('/api/upvoteStore', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({id})
      })
      
      const dbStore = await res.json()
      if(dbStore){
        let count = votingCount + 1
        setVotingCount(count)
      }
    } catch (err) {
      console.error('Error upvoting store', err)
    }
  }

  if(error){
    return <div>Something broke getting store page</div>
  }
  
  return (
    <>
      <Head>
        <title>{name} | Coffee Connoisseur</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.layout}>
        <div className={styles.container}>
          <div className={styles.col1}>
            <div className={styles.backToHomeLink}>
              <Link href='/'>← Back to home</Link>
            </div>

            <div className={styles.nameWrapper}>
              <h1 className={styles.name}>{name}</h1>
            </div>

            <Image
              src={imgUrl || 'https://fastly.4sqi.net/img/general/35522112_aQQekWBaM6JApcMZaNEhNZCyXAVbnxiNVopBSrSmSXU.jpg'}
              alt={name || "Coffee Shop"}
              width={600}
              height={360}
              className={styles.storeImg}
              priority={true}
            />
          </div>
          
          <aside className={`${styles.col2} glass`}>
            <div className={styles.iconWrapper}>
              <Image
                src='/static/icons/places.svg'
                alt='Address Icon'
                width={24}
                height={24}
              />
              <p className={styles.text}>{address}</p>
            </div>

            {parent &&
              <div className={styles.iconWrapper}>
                <Image
                  src='/static/icons/nearMe.svg'
                  alt='Neighbourhood Icon'
                  width={24}
                  height={24}
                />
                <p className={styles.text}>{parent}</p>
              </div>
            }

            <div className={styles.iconWrapper}>
              <Image
                src='/static/icons/star.svg'
                alt='Upvote Icon'
                width={24}
                height={24}
              />
              <p className={styles.text}>{votingCount}</p>
            </div>

            <button className={styles.upvoteButton} onClick={handleUpvoteButton}>Upvote</button>
          </aside>
        </div>
      </main>
    </>
  )
}

export default Store
