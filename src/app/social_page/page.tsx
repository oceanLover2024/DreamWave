"use client";
import SocialWall from "./components/SocialWall";
import { CardItem } from "./components/type/card";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "../../lib/firebase";
import { useEffect, useState } from "react";
import ProtectRoute from "../components/ProtectRoute";

export default function SocialPage() {
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
          title: data.title ?? "",
          detail: data.detail ?? "",
          comment: data.comment ?? "",
          createAt: data.createAt ?? new Date().toISOString(),
          likes: data.likes ?? 0,
          replies: Array.isArray(data.replies) ? data.replies : [],
          likedBy: Array.isArray(data.likedBy) ? data.likedBy : [],
        };
      });

      setFetchedPosts(fetchedPostsFromDB);
    };

    toFetchPostsFromDB();
  }, []);

  return (
    <ProtectRoute>
      <SocialWall postFromDB={fetchedPosts} />
    </ProtectRoute>
  );
}
