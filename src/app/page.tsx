import styles from "./page.module.css";

export default function Home() {
  return (
    <main>
      <section className={styles.hero}>
        <div className={styles.layout}>
          <div className={styles.title}>Dream Wave</div>
        </div>
      </section>
      <section className={styles.content}>
        <div>網站介紹</div>
      </section>
    </main>
  );
}
