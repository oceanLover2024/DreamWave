"use client";
import SocialWall from "./components/SocialWall";
import { CardItem } from "./components/type/card";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "../../lib/firebase";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import ProtectRoute from "../components/ProtectRoute";
import styles from "./page.module.css";
export default function SocialPage() {
  const { user } = useAuth();
  const [fetchedPosts, setFetchedPosts] = useState<CardItem[]>([]);
  useEffect(() => {
    const toFetchPostsFromDB = async () => {
      const q = query(collection(db, "posts"), orderBy("createAt", "desc"));
      const snapshot = await getDocs(q);
      const fetchedPostsFromDB: CardItem[] = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          name: data.name,
          authorId: data.authorId,
          title: data.title ?? "",
          detail: data.detail ?? "",
          comment: data.comment ?? "",
          createAt: data.createAt ?? new Date().toISOString(),
          likes: data.likes ?? 0,
          likedBy: Array.isArray(data.likedBy) ? data.likedBy : [],
          repliesCount: data.repliesCount ?? 0,
        };
      });

      setFetchedPosts(fetchedPostsFromDB);
    };

    toFetchPostsFromDB();
  }, []);

  return (
    <ProtectRoute>
      <div className={styles.background} />
      <section className={styles.section}>
        <div className={styles.wrapper}>
          <SocialWall postFromDB={fetchedPosts} />
        </div>
      </section>
    </ProtectRoute>
  );
}
