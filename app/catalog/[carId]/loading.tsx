import Link from "next/link";
import styles from "./details.module.css";

export default function CarLoading() {
  return (
    <article className={styles.page} aria-busy="true" aria-live="polite">
      <p className="srOnly">Loading car details</p>
      <p className={styles.back}>
        <Link href="/catalog">Back to catalog</Link>
      </p>
      <div className={styles.layout}>
        <div className={styles.left}>
          <div className={`${styles.imageWrap} ${styles.shimmer}`} />
          <div className={styles.formSkeleton} aria-hidden="true">
            <div className={`${styles.skeletonLine} ${styles.shimmer}`} />
            <div className={`${styles.skeletonLineShort} ${styles.shimmer}`} />
            <div className={`${styles.skeletonField} ${styles.shimmer}`} />
            <div className={`${styles.skeletonField} ${styles.shimmer}`} />
            <div className={`${styles.skeletonArea} ${styles.shimmer}`} />
            <div className={`${styles.skeletonSubmit} ${styles.shimmer}`} />
          </div>
        </div>
        <section className={styles.info} aria-hidden="true">
          <div className={`${styles.skeletonTitle} ${styles.shimmer}`} />
          <div className={`${styles.skeletonLine} ${styles.shimmer}`} />
          <div className={`${styles.skeletonPrice} ${styles.shimmer}`} />
          <div className={`${styles.skeletonText} ${styles.shimmer}`} />
          <div className={`${styles.skeletonText} ${styles.shimmer}`} />
          <div className={`${styles.skeletonBlock} ${styles.shimmer}`} />
        </section>
      </div>
    </article>
  );
}
