"use client";
import { Dispatch, SetStateAction, useState } from "react";
import styles from "./Edit.module.css";
import { TodoItem } from "../../type/todoItem";
type EditProps = { setTodo: Dispatch<SetStateAction<TodoItem[]>> };
const Edit: React.FC<EditProps> = ({ setTodo }) => {
  const [title, setTitle] = useState<string>("");
  const [userTitle, setUserTitle] = useState<string>("");
  const [detail, setDetail] = useState<string>("");
  function handleCreate() {
    const finalTitle = title === "🔸其他" ? `🔸${userTitle}` : title;
    if (finalTitle) {
      setTodo((pre: TodoItem[]) => [
        ...pre,
        {
          title: finalTitle,
          detail,
          isCompleted: false,
          isShared: false,
          comment: "",
          isEditingComment: false,
        },
      ]);
      setTitle("");
      setUserTitle("");
      setDetail("");
    } else {
      alert("請輸入類別");
    }
  }

  return (
    <>
      <div className={styles.outer}>
        <h2>Create Here</h2>
        <div>
          <select
            onChange={(e) => {
              setTitle(e.target.value);
            }}
            value={title}
          >
            <option value="">請選擇類別</option>
            <option value="📓閱讀">📓閱讀</option>
            <option value="👩‍💻寫程式">👩‍💻寫程式</option>
            <option value="🏃‍♂️‍➡️跑步">🏃‍♂️‍➡️跑步</option>
            <option value="🏄🏻‍♀️衝浪">🏄🏻‍♀️衝浪</option>
            <option value="🏊🏼游泳">🏊🏼游泳</option>
            <option value="🏋🏻‍♂️重訓">🏋🏻‍♂️重訓</option>
            <option value="🚴🏻‍♂️單車">🚴🏻‍♂️單車</option>
            <option value="🧘🏻‍♀️冥想">🧘🏻‍♀️冥想</option>
            <option value="🔸其他">🔸其他</option>
          </select>
        </div>
        {title === "🔸其他" && (
          <input
            type="text"
            placeholder="請輸入類別"
            value={userTitle}
            onChange={(e) => setUserTitle(e.target.value)}
          />
        )}
        <div>
          <input
            type="text"
            placeholder="可輸入細節"
            value={detail}
            onChange={(e) => {
              setDetail(e.target.value);
            }}
          />
        </div>

        <button onClick={handleCreate}>CREATE</button>
      </div>
    </>
  );
};
export default Edit;
