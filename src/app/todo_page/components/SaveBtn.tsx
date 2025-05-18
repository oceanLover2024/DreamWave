"use client";
import { TodoItem } from "../../type/todoItem";
import { useAuth } from "../../../context/AuthContext";
import { db } from "../../../lib/firebase";
import { collection, doc, setDoc } from "firebase/firestore";
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

      //shared social wall
      const shareToWallTodos = todos.filter((item) => item.isShared);
      for (const item of shareToWallTodos) {
        const postRef = doc(collection(db, "posts"));
        const postData = {
          id: postRef.id,
          name: user.displayName || "匿名",
          title: item.title,
          detail: item.detail,
          comment: item.comment || "",
          createAt: new Date().toISOString(),
          likes: 0,
          replies: [],
        };

        await setDoc(postRef, postData);
      }
      alert("已存檔!");
      onClear();
    } catch (e) {
      if (e instanceof Error) console.log("儲存失敗", e.message);
    }
  };
  return (
    <div>
      <button onClick={handleSave}>SAVE TODOS</button>
    </div>
  );
};
export default SaveBtn;
