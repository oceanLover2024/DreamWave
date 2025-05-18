"use client";
import React, { useEffect, useState } from "react";
import SocialCard from "./SocialCard";
import { CardItem, Reply } from "./type/card";
import { arrayUnion, doc, increment, updateDoc } from "firebase/firestore";
import { db } from "../../../lib/firebase";
import { useAuth } from "../../../context/AuthContext";

type Props = { postFromDB: CardItem[] };
const SocialWall = ({ postFromDB }: Props) => {
  const { user } = useAuth();
  const [posts, setPosts] = useState<CardItem[]>(postFromDB);
  const [clickLike, setClickLike] = useState<boolean>(false);
  useEffect(() => {
    setPosts(postFromDB);
  }, [postFromDB]);

  async function onLike(id: string) {
    if (!user) return;
    try {
      const postRef = doc(db, "posts", id);
      await updateDoc(postRef, {
        likes: increment(1),
        likedBy: arrayUnion(user.uid),
      });
      setPosts((prev) =>
        prev.map((post) =>
          post.id === id
            ? {
                ...post,
                likes: post.likes + 1,
                likedBy: [...post.likedBy, user.uid],
              }
            : post
        )
      );
    } catch (e) {
      console.log("更新❤️失敗:", e);
    }
  }
  async function onReply(id: string, message: string) {
    try {
      const postRef = doc(db, "posts", id);
      const newReply: Reply = {
        id: String(Date.now()),
        authorName: user?.displayName ?? "匿名",
        message: message,
      };

      await updateDoc(postRef, { replies: arrayUnion(newReply) });
      setPosts((prev) =>
        prev.map((post) =>
          post.id === id
            ? { ...post, replies: [...post.replies, newReply] }
            : post
        )
      );
    } catch (e) {
      console.log("更新留言失敗:", e);
    }
  }

  return (
    <>
      {posts.map((post) => (
        <SocialCard
          key={post.id}
          post={post}
          onLike={onLike}
          onReply={onReply}
        />
      ))}
    </>
  );
};
export default SocialWall;
