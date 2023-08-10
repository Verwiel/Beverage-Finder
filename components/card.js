import Image from "next/image"
import Link from "next/link"
import styles from "./card.module.css"

const Card = ({ name, imgUrl, href }) => {
  return (
    <Link href={href} className={styles.cardLink}>
      <div className={`${styles.container} glass`}>
        <div className={styles.cardHeaderWrapper}>
          <h2 className={styles.cardHeader}>{name}</h2>
        </div>
        <div className={styles.cardImageWrapper}>
          <Image 
            src={imgUrl}
            alt={name}
            width={260}
            height={160}
            className={styles.cardImage}
          />
        </div>
      </div>
    </Link>
  )
}

export default Card
