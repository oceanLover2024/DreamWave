"use client";
import React, { useEffect, useState } from "react";
import SocialCard from "./SocialCard";
import { CardItem, Reply } from "./type/card";
import {
  arrayRemove,
  arrayUnion,
  doc,
  increment,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../../lib/firebase";
import { useAuth } from "../../../context/AuthContext";
type Props = { postFromDB: CardItem[] };
const SocialWall = ({ postFromDB }: Props) => {
  const { user } = useAuth();
  const [posts, setPosts] = useState<CardItem[]>([]);
  useEffect(() => {
    if (postFromDB.length > 0) {
      setPosts(postFromDB);
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
  /* async function onReply(id: string, message: string) {
    try {
      const newReply: Reply = {
        id: String(Date.now()),
        authorName: user?.displayName ?? "匿名",
        authorId: user?.uid ?? "",
        message: message,
        createAt: new Date().toISOString(),
      };
      const thisPost = posts.find((p) => p.id === id);
      if (!thisPost) return;
      const updatedReplies = [...thisPost.replies, newReply];
      const postRef = doc(db, "posts", id);
      await updateDoc(postRef, { replies: updatedReplies });
      setPosts((prev) =>
        prev.map((p) => (p.id === id ? { ...p, replies: updatedReplies } : p))
      );
    } catch (e) {
      console.log("更新留言失敗:", e);
    }
  }
  const updateRepliesfromLocal = (postId: string, updatedReplies: Reply[]) => {
    setPosts((prev) =>
      prev.map((p) => (p.id === postId ? { ...p, replies: updatedReplies } : p))
    );
  };*/
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
  return (
    <>
      {posts.map((post) => (
        <SocialCard
          key={post.id}
          post={post}
          onLike={onLike}
          /*onReply={onReply}
          updateRepliesfromLocal={updateRepliesfromLocal}*/
          updateDetailFromLocal={updateDetailFromLocal}
          updateCommentFromLocal={updateCommentFromLocal}
        />
      ))}
    </>
  );
};
export default SocialWall;
