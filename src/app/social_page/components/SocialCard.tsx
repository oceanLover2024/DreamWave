"use client";
import styles from "./SocialCard.module.css";
import PostContent from "./PostContent";
import PostAction from "./PostAction";
import { CardItem } from "./type/card";
type SocialCardProps = {
  post: CardItem;
  onLike: (id: string) => void;
  onReply: (id: string, message: string) => void;
};
const SocialCard: React.FC<SocialCardProps> = ({ post, onLike, onReply }) => {
  return (
    <>
      <div className={styles.outer}>
        <div>
          <PostContent post={post} />
          <PostAction post={post} onLike={onLike} onReply={onReply} />
        </div>
      </div>
    </>
  );
};
export default SocialCard;
