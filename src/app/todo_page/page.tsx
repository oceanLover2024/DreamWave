"use client";
import Edit from "./components/Edit";
import List from "./components/List";
import styles from "./page.module.css";
import { TodoItem } from "../type/todoItem";
import { useEffect, useState } from "react";
import SaveBtn from "./components/SaveBtn";
import ProtectRoute from "../components/ProtectRoute";
import { db } from "../../lib/firebase";
import { useAuth } from "../../context/AuthContext";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { format } from "date-fns";
import { usePhotographer } from "@/context/PhotographerContext";
const DayHabit = () => {
  const [todos, setTodo] = useState<TodoItem[]>([]);
  const today: string = format(new Date(), "yyyy-MM-dd");
  const { user } = useAuth();
  const { setPhotographerName } = usePhotographer();
  useEffect(() => {
    const loadTodos = async () => {
      if (!user) return;

      const draftRef = doc(db, "users", user.uid, "drafts", today);
      const draftSnap = await getDoc(draftRef);
      if (draftSnap.exists()) {
        const data = draftSnap.data();
        const todos = data?.todos || [];
        setTodo(todos || []);
      }
      localStorage.setItem(`local_todos_${user.uid}`, JSON.stringify(todos));
    }; /* const localData = localStorage.getItem(`local_todos_${user.uid}`);
      if (localData) {
        const parsedData = JSON.parse(localData);
        if (parsedData.length > 0) {
          setTodo(parsedData);
          return;
        }
      }*/
    loadTodos();
  }, [user, today]);
  useEffect(() => {
    if (!user || todos.length === 0) return;
    localStorage.setItem(`local_todos_${user.uid}`, JSON.stringify(todos));
    const saveDraft = async () => {
      const draftRef = doc(db, "users", user.uid, "drafts", today);
      await setDoc(draftRef, { todos: todos, date: today });
    };
    saveDraft();
  }, [todos, user, today]);
  useEffect(() => {
    if (!user) {
      setTodo([]);
    }
  }, [user]);
  useEffect(() => setPhotographerName("Siao"), [setPhotographerName]);

  function handleDelete(id: string) {
    if (!user) return;
    const updatedTodo = todos.filter((item) => item.id !== id);
    setTodo(updatedTodo);
    localStorage.setItem(
      `local_todos_${user.uid}`,
      JSON.stringify(updatedTodo)
    );
    setDoc(doc(db, "users", user.uid, "drafts", today), {
      todos: updatedTodo,
      date: today,
    });
    return updatedTodo;
  }

  function handleIsCompleted(id: string) {
    setTodo((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, isCompleted: !item.isCompleted } : item
      )
    );
  }
  function handleIsShared(id: string) {
    setTodo((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, isShared: !item.isShared } : item
      )
    );
  }
  function handleCommentContext(id: string, comment: string) {
    setTodo((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, comment: comment } : item
      )
    );
  }
  function toggleEditComment(id: string) {
    setTodo((prev) =>
      prev.map((item) =>
        item.id === id
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
            <div className={styles.todo_layout}>
              <List
                todos={todos}
                handleDelete={handleDelete}
                handleIsCompleted={handleIsCompleted}
                handleIsShared={handleIsShared}
                handleCommentContext={handleCommentContext}
                toggleEditComment={toggleEditComment}
                setTodo={setTodo}
              />
              <Edit setTodo={setTodo} />
              <SaveBtn todos={todos} onClear={() => setTodo([])} />
            </div>
          </div>
        </section>
      </ProtectRoute>
    </main>
  );
};
export default DayHabit;
