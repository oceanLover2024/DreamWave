"use client";
import styles from "./SocialCard.module.css";
import PostContent from "./PostContent";
import PostAction from "./PostAction";
import { CardItem, Reply } from "./type/card";

type SocialCardProps = {
  post: CardItem;
  onLike: (id: string) => void;
  /* onReply: (id: string, message: string) => void;
  updateRepliesfromLocal: (postId: string, updatedReplies: Reply[]) => void;*/
  updateDetailFromLocal: (postId: string, updatedDetail: string) => void;
  updateCommentFromLocal: (postId: string, updatedComment: string) => void;
};
const SocialCard: React.FC<SocialCardProps> = ({
  post,
  onLike,
  /* onReply,
  updateRepliesfromLocal,*/
  updateDetailFromLocal,
  updateCommentFromLocal,
}) => {
  return (
    <>
      <div className={styles.outer}>
        <PostContent
          post={post}
          updateDetailFromLocal={updateDetailFromLocal}
          updateCommentFromLocal={updateCommentFromLocal}
        />
        <PostAction
          post={post}
          onLike={onLike}
          /* onReply={onReply}
          updateRepliesfromLocal={updateRepliesfromLocal}*/
        />
      </div>
    </>
  );
};
export default SocialCard;
