"use client";
import SocialWall from "./components/SocialWall";
import { CardItem } from "./components/type/card";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "../../lib/firebase";
import { useEffect, useState } from "react";
import ProtectRoute from "../components/ProtectRoute";
import styles from "./page.module.css";
import { usePhotographer } from "@/context/PhotographerContext";
import { useAuth } from "@/context/AuthContext";
import { FaHome } from "react-icons/fa";
import Pic from "../components/common/Pic";
export default function SocialPage() {
  const { user } = useAuth();
  const [fetchedPosts, setFetchedPosts] = useState<CardItem[]>([]);
  const [viewMode, setViewMode] = useState<"home" | "mine">("home");
  const [friendsIds, setFriendsId] = useState<string[]>([]);
  const [picSize, setPicSize] = useState<number>(50);
  const { setPhotographerName } = usePhotographer();
  const handleMode = (mode: "home" | "mine") => setViewMode(mode);
  useEffect(() => {
    const toFetchPostsFromDB = async () => {
      if (!user) return;
      const getFriendsId = async () => {
        const snapshot = await getDocs(
          collection(db, "users", user.uid, "friends")
        );
        const friendsIds = snapshot.docs.map((doc) => doc.id);
        setFriendsId(friendsIds);
      };
      getFriendsId();
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
          updateAt: data.updateAt ?? data.createAt ?? new Date().toISOString(),
          likes: data.likes ?? 0,
          likedBy: Array.isArray(data.likedBy) ? data.likedBy : [],
          repliesCount: data.repliesCount ?? 0,
        };
      });
      const filteredPostsFromDB =
        viewMode === "home"
          ? fetchedPostsFromDB.filter(
              (p) => friendsIds.includes(p.authorId) || p.authorId === user.uid
            )
          : fetchedPostsFromDB.filter((p) => p.authorId === user.uid);
      setFetchedPosts(filteredPostsFromDB);
    };

    toFetchPostsFromDB();
  }, [user, viewMode, friendsIds]);
  useEffect(
    () => setPhotographerName("Asad Photo Maldives"),
    [setPhotographerName]
  );
  useEffect(() => {
    const handleResize = () => {
      setPicSize(window.innerWidth <= 600 ? 28 : 50);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return (
    <ProtectRoute>
      <div className={styles.background} />
      <section className={styles.section}>
        <div className={styles.mode_wrapper}>
          <button
            className={`${styles.mode} ${styles.home}  ${
              viewMode === "home" ? styles.mode_active : ""
            }`}
            onClick={() => handleMode("home")}
          >
            <FaHome />
          </button>
          <button
            className={`${styles.mode} ${styles.mine} ${
              viewMode === "mine" ? styles.mode_active : ""
            }`}
            onClick={() => handleMode("mine")}
          >
            {user && <Pic userId={user.uid} size={picSize} />}
          </button>
        </div>
        <div className={styles.wrapper}>
          <SocialWall postFromDB={fetchedPosts} />
        </div>
      </section>
    </ProtectRoute>
  );
}
