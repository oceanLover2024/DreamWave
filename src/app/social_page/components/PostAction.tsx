"use client";
import { useState } from "react";
import { CardItem } from "./type/card";
import ReplySection from "./ReplySection";
import { useAuth } from "../../../context/AuthContext";
type PostActionProps = {
  post: CardItem;
  onLike: (id: string) => void;
  onReply: (id: string, message: string) => void;
};
const PostAction: React.FC<PostActionProps> = ({ post, onLike, onReply }) => {
  const { user } = useAuth();
  const [showReplies, setShowReplies] = useState<boolean>(false);
  const hasLiked = user ? post.likedBy.includes(user.uid) : false;
  const toggleShowReply = () => setShowReplies((prev) => !prev);
  const handleCLickLike = () => {
    if (hasLiked) return;
    onLike(post.id);
  };
  return (
    <div>
      <button onClick={() => handleCLickLike()}>
        {hasLiked
          ? `❤️${post.likes}`
          : post.likes > 0
          ? `🤍${post.likes}`
          : "🤍"}
      </button>
      <button onClick={toggleShowReply}>{`💬${post.replies.length}`}</button>
      {showReplies && (
        <ReplySection
          replies={post.replies}
          onReply={(message) => onReply(post.id, message)}
        />
      )}
    </div>
  );
};
export default PostAction;
