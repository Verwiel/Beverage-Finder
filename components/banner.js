import styles from './banner.module.css'

const Banner = ({ buttonText, handleOnClick }) => {
  return (
    <header className={styles.container}>
      <h1 className={styles.title}>
        <span className={styles.title1}>Coffee</span>
        <span className={styles.title2}>Connoisseur</span>
      </h1>
      <p className={styles.subTitle}>Discover your local coffee shops</p>

      <div className={styles.buttonWrapper}>
        <button className={styles.button} onClick={handleOnClick}>{buttonText}</button>
      </div>
    </header>
  )
}

export default Banner
