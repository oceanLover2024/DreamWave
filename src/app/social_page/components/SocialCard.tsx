"use client";
import styles from "./SocialCard.module.css";
import PostContent from "./PostContent";
import PostAction from "./PostAction";
import { CardItem } from "./type/card";

type SocialCardProps = {
  post: CardItem;
  onLike: (id: string) => void;
  updateDetailFromLocal: (postId: string, updatedDetail: string) => void;
  updateCommentFromLocal: (postId: string, updatedComment: string) => void;
  updateTimeFromLocal: (postId: string, updateAt: string) => void;
  deletePostFromLocal: (postId: string) => void;
};
const SocialCard: React.FC<SocialCardProps> = ({
  post,
  onLike,
  updateDetailFromLocal,
  updateCommentFromLocal,
  updateTimeFromLocal,
  deletePostFromLocal,
}) => {
  return (
    <>
      <div className={styles.outer}>
        <PostContent
          post={post}
          updateDetailFromLocal={updateDetailFromLocal}
          updateCommentFromLocal={updateCommentFromLocal}
          updateTimeFromLocal={updateTimeFromLocal}
          deletePostFromLocal={deletePostFromLocal}
        />
        <PostAction post={post} onLike={onLike} />
      </div>
    </>
  );
};
export default SocialCard;
