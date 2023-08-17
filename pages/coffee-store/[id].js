import { useState, useEffect } from "react"
import { useRouter } from "next/router"
import Link from "next/link"
import Head from "next/head"
import Image from "next/image"
import styles from "../../styles/coffee-store.module.css"
import { fetchCoffeeStores } from "../../lib/coffee-stores"
import { useStore } from "../../context/store-context"
import { isEmpty } from "../../utils"

export async function getStaticProps({ params }) {
  const coffeeStores = await fetchCoffeeStores()
  const storeFromContext = coffeeStores.find((coffeeStore) => {
    return coffeeStore.id === params.id
  })

  return {
    props: {
      coffeeStore: storeFromContext ? storeFromContext : {},
    },
  }
}

export async function getStaticPaths() {
  const coffeeStores = await fetchCoffeeStores()
  const paths = coffeeStores.map((coffeeStore) => {
    return {
      params: {
        id: coffeeStore.id,
      },
    }
  })
  return {
    paths,
    fallback: true,
  }
}

const CoffeeStore = (initialProps) => {
  const router = useRouter()
  if (router.isFallback) {
    return <div>Loading...</div>
  }

  const id = router.query.id
  const [coffeeStore, setCoffeeStore] = useState(initialProps.coffeeStore)

  const {
    state: { coffeeStores },
  } = useStore()

  const handleCreateCoffeeStore = async (store) => {
    try {
      const res = await fetch('/api/createCoffeeStore', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(store)
      })

      const dbStore = await res.json()
      console.log(dbStore)
    } catch (err) {
      console.error('Error creating coffee store', err)
    }
  }

  useEffect(() => {
    if (isEmpty(initialProps.coffeeStore)) {
      if (coffeeStores.length > 0) {
        const storeFromContext = coffeeStores.find((coffeeStore) => {
          return coffeeStore.id === id
        })

        if(storeFromContext){
          setCoffeeStore(storeFromContext)
          handleCreateCoffeeStore(storeFromContext)
        }
      }
    } else {
      handleCreateCoffeeStore(initialProps.coffeeStore) // SSG
    }
  }, [id, initialProps])

  const { name, address, parent, imgUrl } = coffeeStore

  const handleUpvoteButton = () => {
    console.log('upvote')
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
              <p className={styles.text}>{1}</p>
            </div>

            <button className={styles.upvoteButton} onClick={handleUpvoteButton}>Upvote</button>
          </aside>
        </div>
      </main>
    </>
  )
}

export default CoffeeStore
