"use client";
import React, { useEffect, useState } from "react";
import SocialCard from "./SocialCard";
import { CardItem } from "./type/card";
import {
  arrayRemove,
  arrayUnion,
  doc,
  increment,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../../lib/firebase";
import { useAuth } from "../../../context/AuthContext";
import styles from "./SocialCard.module.css";
type Props = { postFromDB: CardItem[] };
const SocialWall = ({ postFromDB }: Props) => {
  const { user } = useAuth();
  const [posts, setPosts] = useState<CardItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  useEffect(() => {
    setIsLoading(true);
    if (postFromDB.length > 0) {
      setPosts(postFromDB);
      setIsLoading(false);
    } else {
      setIsLoading(false);
    }
  }, [postFromDB]);

  async function onLike(id: string) {
    if (!user) return;
    try {
      const thisPost = posts.find((p) => p.id === id);
      if (!thisPost) return;
      const postRef = doc(db, "posts", id);
      const hasLiked = thisPost.likedBy.includes(user.uid);

      if (hasLiked) {
        await updateDoc(postRef, {
          likes: increment(-1),
          likedBy: arrayRemove(user.uid),
        });
        setPosts((prev) =>
          prev.map((p) =>
            p.id === id
              ? {
                  ...p,
                  likes: p.likes - 1,
                  likedBy: p.likedBy.filter((u) => u !== user.uid),
                }
              : p
          )
        );
      } else {
        await updateDoc(postRef, {
          likes: increment(1),
          likedBy: arrayUnion(user.uid),
        });
        setPosts((prev) =>
          prev.map((p) =>
            p.id === id
              ? {
                  ...p,
                  likes: p.likes + 1,
                  likedBy: [...p.likedBy, user.uid],
                }
              : p
          )
        );
      }
    } catch (e) {
      console.log("更新❤️失敗:", e);
    }
  }
  const updateDetailFromLocal = (postId: string, updatedDetail: string) => {
    setPosts((prev) =>
      prev.map((p) => (p.id === postId ? { ...p, detail: updatedDetail } : p))
    );
  };
  const updateCommentFromLocal = (postId: string, updatedComment: string) => {
    setPosts((prev) =>
      prev.map((p) => (p.id === postId ? { ...p, comment: updatedComment } : p))
    );
  };
  const updateTimeFromLocal = (postId: string, updateAt: string) => {
    setPosts((prev) =>
      prev.map((p) => (p.id === postId ? { ...p, updateAt: updateAt } : p))
    );
  };
  const deletePostFromLocal = (postId: string) => {
    setPosts((prev) => prev.filter((p) => p.id !== postId));
  };
  if (isLoading)
    return <div className={styles.socialWallNoPostText}>Loading...</div>;
  return (
    <>
      {posts.length !== 0 ? (
        posts.map((post) => (
          <SocialCard
            key={post.id}
            post={post}
            onLike={onLike}
            updateDetailFromLocal={updateDetailFromLocal}
            updateCommentFromLocal={updateCommentFromLocal}
            updateTimeFromLocal={updateTimeFromLocal}
            deletePostFromLocal={deletePostFromLocal}
          />
        ))
      ) : (
        <div className={styles.socialWallNoPostText}>
          No posts yet.
          <br />
          Share your first post or connect with a friend!
        </div>
      )}
    </>
  );
};
export default SocialWall;
