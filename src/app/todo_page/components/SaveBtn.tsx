"use client";
import styles from "./SaveBtn.module.css";
import { TodoItem } from "../../type/todoItem";
import { useAuth } from "../../../context/AuthContext";
import { db } from "../../../lib/firebase";
import { collection, deleteDoc, doc, getDoc, setDoc } from "firebase/firestore";
import { format } from "date-fns";
type SaveBtnProps = {
  onClear: () => void;
  todos: TodoItem[];
};
const SaveBtn = ({ onClear, todos }: SaveBtnProps) => {
  const { user } = useAuth();
  const handleSave = async () => {
    if (!user) return;
    const today = format(new Date(), "yyyy-MM-dd");
    const docRef = doc(db, "users", user.uid, "habits", today);
    try {
      await setDoc(docRef, {
        todos: todos,
        date: today,
      });
      const userDoc = await getDoc(doc(db, "users", user.uid));
      const userData = userDoc.exists() ? userDoc.data() : null;
      //shared social wall
      const shareToWallTodos = todos.filter(
        (item) => item.isShared && !item.isShareNow
      );
      for (const item of shareToWallTodos) {
        const postRef = doc(collection(db, "posts"));
        const postData = {
          id: postRef.id,
          name: userData?.displayName || userData?.username || "匿名",
          authorId: user.uid,
          title: item.title,
          detail: item.detail,
          comment: item.comment || "",
          createAt: new Date().toISOString(),
          likes: 0,
          replies: [],
        };

        await setDoc(postRef, postData);
        console.log(postData.name, userDoc.data());
      }
      alert("Successfully submitted!");

      await deleteDoc(doc(db, "users", user.uid, "drafts", today));
      localStorage.removeItem(`local_todos_${user.uid}`);
      onClear();
    } catch (e) {
      if (e instanceof Error) console.log("儲存失敗", e.message);
    }
  };
  return (
    <>
      <div onClick={handleSave} className={styles.save_all_btn}>
        Submit
      </div>
    </>
  );
};
export default SaveBtn;
