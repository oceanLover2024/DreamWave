import { getFinalTime } from "./tools/postTime";
import { CardItem } from "./type/card";
import { useAuth } from "@/context/AuthContext";
import styles from "./PostContent.module.css";
import { useEffect, useState } from "react";
import { BsTrash } from "react-icons/bs";
import { PiPencilCircleLight } from "react-icons/pi";
import { TfiSaveAlt } from "react-icons/tfi";
import { deleteDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import Pic from "../../components/common/Pic";
type PostContentProps = {
  post: CardItem;
  updateDetailFromLocal: (postId: string, updatedDetail: string) => void;
  updateCommentFromLocal: (postId: string, updateComment: string) => void;
  updateTimeFromLocal: (postId: string, updateAt: string) => void;
  deletePostFromLocal: (postId: string) => void;
};
const PostContent: React.FC<PostContentProps> = ({
  post,
  updateDetailFromLocal,
  updateCommentFromLocal,
  updateTimeFromLocal,
  deletePostFromLocal,
}) => {
  const { user } = useAuth();
  const [needExpend, setNeedExpend] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editedDetail, setEditedDetail] = useState<string>(post.detail);
  const [editedComment, setEditedComment] = useState<string>(post.comment);
  const handleSaveEdit = async () => {
    if (!user) return;
    const postRef = doc(db, "posts", post.id);
    await updateDoc(postRef, {
      detail: editedDetail,
      comment: editedComment,
      updateAt: new Date().toISOString(),
    });
    setIsEditing(!isEditing);
    updateDetailFromLocal(post.id, editedDetail);
    updateCommentFromLocal(post.id, editedComment);
    updateTimeFromLocal(post.id, new Date().toISOString());
  };
  const handleStartEdit = () => {
    setIsEditing(!isEditing);
    setEditedDetail(editedDetail);
    setEditedComment(editedComment);
  };
  const handleDeletePost = async () => {
    if (!user) return;
    const confirmDelete = window.confirm(
      "🗑️ Are you sure you want to delete this?"
    );
    if (!confirmDelete) return;
    const postRef = doc(db, "posts", post.id);
    if (confirmDelete) await deleteDoc(postRef);
    deletePostFromLocal(post.id);
  };
  const toggleMore = () => {
    setNeedExpend(!needExpend);
  };
  const truncatedComment = post.comment.substring(0, 28) + "...";
  useEffect(() => {
    if (post.comment.length > 28) setNeedExpend(true);
  }, [post.comment]);
  return (
    <div className={styles.content_wrapper}>
      <div className={styles.name_time_wrapper}>
        <Pic userId={post.authorId} size={30} />
        <div>{post.name}</div>
        <span className={styles.dot}>·</span>
        <div className={styles.time}>
          {post.updateAt && post.updateAt !== post.createAt
            ? `edited ${getFinalTime(post.updateAt)}`
            : getFinalTime(post.createAt)}
        </div>
        {user?.uid === post.authorId && (
          <div className={styles.icon_btns}>
            {isEditing ? (
              <TfiSaveAlt
                className={styles.save_btn}
                onClick={() => handleSaveEdit()}
              />
            ) : (
              <>
                <PiPencilCircleLight
                  className={styles.edit_btn}
                  onClick={() => handleStartEdit()}
                />
                <BsTrash
                  className={styles.delete_btn}
                  onClick={() => handleDeletePost()}
                />
              </>
            )}
          </div>
        )}
      </div>

      <div>{post.title}</div>
      <div>
        📋
        {isEditing ? (
          <input
            type="text"
            value={editedDetail}
            onChange={(e) => setEditedDetail(e.target.value)}
            className={styles.editInput}
          />
        ) : (
          post.detail
        )}
      </div>
      <div>
        🌱
        {isEditing ? (
          <textarea
            value={editedComment}
            onChange={(e) => setEditedComment(e.target.value)}
            className={styles.editComment}
          ></textarea>
        ) : post.comment.length > 28 ? (
          needExpend ? (
            <>
              {truncatedComment}
              <button onClick={toggleMore} className={styles.more}>
                {needExpend ? "More" : "Less"}
              </button>
            </>
          ) : (
            <>
              {post.comment}{" "}
              <button onClick={toggleMore} className={styles.more}>
                {needExpend ? "More" : "Less"}
              </button>
            </>
          )
        ) : (
          post.comment
        )}
      </div>
    </div>
  );
};
export default PostContent;
