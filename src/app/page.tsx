"use client";
import { useEffect } from "react";
import styles from "./page.module.css";
import { usePhotographer } from "@/context/PhotographerContext";
export default function Home() {
  const { setPhotographerName } = usePhotographer();
  useEffect(() => setPhotographerName("Tim Mossholder"), []);
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
