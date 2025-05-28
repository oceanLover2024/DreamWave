import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { TodoRecord } from "../../type/todoItem";
import styles from "./TodayList.module.css";
import { BsTrash } from "react-icons/bs";
import { PiPencilCircleLight } from "react-icons/pi";
import { TfiSaveAlt } from "react-icons/tfi";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";
type TodayListProps = {
  selectedTitle: string;
  todayTodo: TodoRecord[];
  todayStr: string;
  setTodayTodo: Dispatch<SetStateAction<TodoRecord[]>>;
};
const TodayList = ({
  selectedTitle,
  todayTodo,
  todayStr,
  setTodayTodo,
}: TodayListProps) => {
  const { user } = useAuth();
  const [isEditingId, setIsEditingId] = useState<string | null>(null);
  const [editedDetail, setEditedDetail] = useState<string>("");
  const [editedComment, setEditedComment] = useState<string>("");

  const handleEdit = (id: string, detail: string, comment: string) => {
    setIsEditingId(id);
    setEditedDetail(detail);
    setEditedComment(comment);
  };
  const handleSave = async (id: string) => {
    if (!user) return;
    const updateTodos = todayTodo.map((t) =>
      t.id === id ? { ...t, detail: editedDetail, comment: editedComment } : t
    );
    const docRef = doc(db, "users", user.uid, "habits", todayStr);
    await updateDoc(docRef, { todos: updateTodos });
    setIsEditingId(null);
    setEditedDetail("");
    setEditedComment("");
    setTodayTodo(updateTodos);
  };
  const handleDelete = async (id: string) => {
    if (!user) return;
    const confirmed = window.confirm(
      " 🗑️ Are you sure you want to delete this?"
    );
    if (!confirmed) return;

    const updatedTodos = todayTodo.filter((t) => t.id !== id);
    const docRef = doc(db, "users", user.uid, "habits", todayStr);
    await updateDoc(docRef, { todos: updatedTodos });
    setTodayTodo(updatedTodos);
  };
  return (
    <>
      {selectedTitle === "" && (
        <div className={styles.todayTodo_wrapper}>
          <div className={styles.todayTodo_layout}>
            <div className={styles.today_achievements}>
              Today&apos;s Achievements
            </div>

            {todayTodo.length > 0 &&
              todayTodo.map((item) => (
                <div key={item.id} className={styles.today_todo}>
                  <div>
                    {item.title}
                    {item.detail && (
                      <span>
                        :
                        {isEditingId === item.id ? (
                          <input
                            className={styles.input}
                            value={editedDetail}
                            onChange={(e) => setEditedDetail(e.target.value)}
                          />
                        ) : (
                          <span className={styles.today_detail}>
                            {item.detail}
                          </span>
                        )}
                      </span>
                    )}
                  </div>
                  <div className={styles.comment}>
                    ➙
                    {isEditingId === item.id ? (
                      <textarea
                        className={styles.textarea}
                        value={editedComment}
                        onChange={(e) => {
                          setEditedComment(e.target.value);
                        }}
                      />
                    ) : (
                      item.comment
                    )}
                  </div>

                  {isEditingId === item.id ? (
                    <TfiSaveAlt
                      onClick={() => handleSave(item.id)}
                      className={`${styles.save_icon} ${styles.icon}`}
                    />
                  ) : (
                    <div className={styles.icon_wrapper}>
                      <PiPencilCircleLight
                        onClick={() =>
                          handleEdit(
                            item.id,
                            item.detail ?? "",
                            item.comment ?? ""
                          )
                        }
                        className={`${styles.edit_icon} ${styles.icon}`}
                      />
                      <BsTrash
                        className={`${styles.delete_icon} ${styles.icon}`}
                        onClick={() => handleDelete(item.id)}
                      />
                    </div>
                  )}
                </div>
              ))}
            {todayTodo.length === 0 && (
              <div className={styles.incomplete_text}>
                Nothing completed yet, but you're on your way!
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};
export default TodayList;
