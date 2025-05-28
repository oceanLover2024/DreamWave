"use client";
import { Dispatch, SetStateAction, useState } from "react";
import styles from "./Edit.module.css";
import { TodoItem } from "../../type/todoItem";
import { v4 as uuidv4 } from "uuid";
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
          id: uuidv4(),
          title: finalTitle,
          detail,
          isCompleted: false,
          isShared: false,
          comment: "",
          isEditingComment: false,
          isShareNow: false,
        },
      ]);
      setTitle("");
      setUserTitle("");
      setDetail("");
    } else {
      alert("Please enter a category");
    }
  }

  return (
    <>
      <div className={styles.outer}>
        <div className={styles.create_here}>Create Here</div>
        <div className={styles.form_layout}>
          <div className={styles.select_wrapper}>
            <select
              onChange={(e) => {
                setTitle(e.target.value);
              }}
              value={title}
              required
            >
              <option value=""> Category</option>
              <option value="📓Reading">📓Reading</option>
              <option value="👩‍💻Programming">👩‍💻Programming</option>
              <option value="🏃‍♂️‍➡️Running">🏃‍♂️‍➡️Running</option>
              <option value="🏄🏻‍♀️Surfing">🏄🏻‍♀️Surfing</option>
              <option value="🏊🏼Swimming">🏊🏼Swimming</option>
              <option value="🏋🏻‍♂️Work out">🏋🏻‍♂️Work out</option>
              <option value="🚴🏻‍♂️Cycling">🚴🏻‍♂️Cycling</option>
              <option value="🧘🏻‍♀️Yoga">🧘🏻‍♀️yoga</option>
              <option value="🔸Others">🔸Others</option>
            </select>
          </div>

          {title === "🔸Others" && (
            <input
              type="text"
              placeholder="Category"
              className={styles.other_category}
              value={userTitle}
              required
              onChange={(e) => setUserTitle(e.target.value)}
            />
          )}

          <input
            type="text"
            placeholder="Task details"
            className={styles.input_detail}
            value={detail}
            onChange={(e) => {
              setDetail(e.target.value);
            }}
          />

          <button onClick={handleCreate} className={styles.create_btn}>
            +
          </button>
        </div>
      </div>
    </>
  );
};
export default Edit;
