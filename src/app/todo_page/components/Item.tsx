"use client";
import styles from "./Item.module.css";
import { useAuth } from "../../../context/AuthContext";
import { BsTrash } from "react-icons/bs";
import { PiPencilCircleLight } from "react-icons/pi";
import { FaUserFriends } from "react-icons/fa";
import { TfiSaveAlt } from "react-icons/tfi";
import { TodoItem } from "../../type/todoItem";
import { collection, doc, setDoc } from "firebase/firestore";
import { db } from "../../../lib/firebase";
type ItemProps = TodoItem & {
  handleDelete: () => void;
  handleIsCompleted: () => void;
  handleIsShared: () => void;
  handleCommentContext: (commment: string) => void;
  toggleEditComment: () => void;
  handleMarkedShared: () => void;
};
const Item: React.FC<ItemProps> = ({
  title,
  detail,
  isCompleted,
  isShared,
  comment,
  isEditingComment,
  isShareNow,
  handleDelete,
  handleIsCompleted,
  handleIsShared,
  handleCommentContext,
  toggleEditComment,
  handleMarkedShared,
}) => {
  const { user } = useAuth();
  const handleShareNow = async () => {
    if (!user) return;
    if (isShared && !isShareNow) {
      try {
        const postRef = doc(collection(db, "posts"));
        const postData = {
          id: postRef.id,
          name: user.displayName || "匿名",
          authorId: user.uid,
          title,
          detail,
          comment,
          createAt: new Date().toISOString(),
          likes: 0,
          replies: [],
        };
        await setDoc(postRef, postData);
        handleMarkedShared();
      } catch (e) {
        if (e instanceof Error) console.log("立即分享失敗", e.message);
      }
    }
  };
  return (
    <div className={styles.card}>
      <div className={styles.first_line}>
        <input
          className={styles.do_checkbox}
          type="checkbox"
          checked={isCompleted}
          onChange={handleIsCompleted}
        />
        <div className={styles.title}>{title}：</div>

        <div className={styles.detail}>{detail}</div>
        {!isShareNow && (
          <div className={styles.icon_wrapper}>
            {isCompleted && (
              <label className={styles.share_label}>
                <input
                  type="checkbox"
                  checked={isShared}
                  onChange={handleIsShared}
                  className={styles.share_checkbox}
                />
                <FaUserFriends className={styles.share_icon} />
              </label>
            )}

            {isCompleted && (
              <div onClick={toggleEditComment}>
                {isEditingComment ? (
                  <TfiSaveAlt className={styles.save_icon} />
                ) : (
                  <PiPencilCircleLight className={styles.edit_icon} />
                )}
              </div>
            )}
            <div onClick={handleDelete}>
              <BsTrash className={styles.delete_icon} />
            </div>
          </div>
        )}
      </div>
      {isCompleted && isEditingComment && (
        <div className={styles.second_line}>
          <textarea
            className={styles.comment_text}
            value={comment || ""}
            onChange={(e) => handleCommentContext(e.target.value)}
            placeholder="Take a moment to reflect on what you did well. Let's write it down!"
          ></textarea>
        </div>
      )}
      {isCompleted && !isEditingComment && comment && (
        <div>
          <div className={styles.comment}>{comment}</div>
        </div>
      )}
      {isCompleted && isShared && !isShareNow && (
        <div className={styles.share_now} onClick={handleShareNow}>
          Share now
        </div>
      )}
      {isCompleted && isShared && isShareNow && (
        <div className={styles.already_shared}>Already Shared</div>
      )}
    </div>
  );
};
export default Item;
