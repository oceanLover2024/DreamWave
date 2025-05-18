"use client";
import Edit from "./components/Edit";
import List from "./components/List";
import styles from "./page.module.css";
import { TodoItem } from "../type/todoItem";
import { useState } from "react";
import SaveBtn from "./components/SaveBtn";
import ProtectRoute from "../components/ProtectRoute";

const DayHabit = () => {
  const [todo, setTodo] = useState<TodoItem[]>([]);
  function handleDelete(index: number) {
    setTodo((prev) => prev.filter((_, i) => i !== index));
  }
  function handleIsCompleted(index: number) {
    setTodo((prev) =>
      prev.map((item, i) =>
        i === index ? { ...item, isCompleted: !item.isCompleted } : item
      )
    );
  }
  function handleIsShared(index: number) {
    setTodo((prev) =>
      prev.map((item, i) =>
        i === index ? { ...item, isShared: !item.isShared } : item
      )
    );
  }
  function handleCommentContext(index: number, comment: string) {
    setTodo((prev) =>
      prev.map((item, i) =>
        i === index ? { ...item, comment: comment } : item
      )
    );
  }
  function toggleEditComment(index: number) {
    setTodo((prev) =>
      prev.map((item, i) =>
        i === index
          ? { ...item, isEditingComment: !item.isEditingComment }
          : item
      )
    );
  }
  return (
    <main>
      <ProtectRoute>
        <div className={styles.background} />
        <section className={styles.section}>
          <div className={styles.wrapper}>
            <div className={styles.layout}>
              <div className={styles.todo_layout}>
                <List
                  todo={todo}
                  handleDelete={handleDelete}
                  handleIsCompleted={handleIsCompleted}
                  handleIsShared={handleIsShared}
                  handleCommentContext={handleCommentContext}
                  toggleEditComment={toggleEditComment}
                />
                <Edit setTodo={setTodo} />
                <SaveBtn todos={todo} onClear={() => setTodo([])} />
              </div>
            </div>
          </div>
        </section>
      </ProtectRoute>
    </main>
  );
};
export default DayHabit;
