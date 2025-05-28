"use client";
import { useEffect, useState } from "react";
import { CardItem, Reply } from "./type/card";
import ReplySection from "./ReplySection";
import { useAuth } from "../../../context/AuthContext";
import styles from "./PostAction.module.css";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";

type PostActionProps = {
  post: CardItem;
  onLike: (id: string) => void;
};
const PostAction: React.FC<PostActionProps> = ({ post, onLike }) => {
  const { user } = useAuth();
  const [showReplies, setShowReplies] = useState<boolean>(false);
  const [repliesCount, setRepliesCount] = useState<number>(post.repliesCount);
  const hasLiked = user ? post.likedBy.includes(user.uid) : false;
  const toggleShowReply = () => setShowReplies((prev) => !prev);
  const handleCLickLike = () => {
    onLike(post.id);
  };
  useEffect(() => {
    const unsubscribe = onSnapshot(doc(db, "posts", post.id), (snapshot) => {
      setRepliesCount(snapshot.data()?.repliesCount);
    });
    return () => unsubscribe();
  }, [post.id]);
  return (
    <div>
      <div className={styles.wrapper}>
        <button onClick={() => handleCLickLike()} className={styles.like}>
          {hasLiked ? "❤️" : "🤍"}
        </button>
        {post.likes > 0 && <div>{post.likes}</div>}

        <button onClick={toggleShowReply} className={styles.reply_btn}>
          💬
        </button>
        <div>{repliesCount}</div>
      </div>

      {showReplies && <ReplySection postId={post.id} />}
    </div>
  );
};
export default PostAction;
