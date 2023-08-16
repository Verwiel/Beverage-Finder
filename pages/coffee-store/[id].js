import Head from 'next/head'
import Image from 'next/image'
import Link from "next/link"
import { useRouter } from "next/router"
import { fetchCoffeeStores, fetchCoffeeStore } from '@/lib/coffee-stores'
import styles from '../../styles/coffee-store.module.css'

export async function getStaticProps({ params }) {
  const coffeeStore = await fetchCoffeeStore(params?.id)
  return {
    props: {
      coffeeStore
    }
  }
}

export async function getStaticPaths() {
  const data = await fetchCoffeeStores()
  const paths = data.map(store => {
    return {
      params: {
        id: store.fsq_id.toString()
      }
    }
  })

  return {
    paths,
    fallback: true
  }
}


const CoffeeStore = ({ coffeeStore }) => {
  const router = useRouter()
  if(router.isFallback) {
    return <div>Loading...</div>
  }
  
  const { name, location, related_places, imgUrl } = coffeeStore

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
              alt={name}
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
              <p className={styles.text}>{location?.formatted_address}</p>
            </div>

            {related_places.parent &&
              <div className={styles.iconWrapper}>
                <Image
                  src='/static/icons/nearMe.svg'
                  alt='Neighbourhood Icon'
                  width={24}
                  height={24}
                />
                <p className={styles.text}>{related_places.parent.name}</p>
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
