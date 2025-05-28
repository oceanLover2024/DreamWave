"use client";
import { format } from "date-fns";
import styles from "./page.module.css";
import { useEffect, useMemo, useState } from "react";
import { db } from "../../lib/firebase";
import { useAuth } from "../../context/AuthContext";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { TodoItem } from "../type/todoItem";
import ProtectRoute from "../components/ProtectRoute";
import ControlCalendar from "./components/ControlCalendar";
import { TodoRecord } from "../type/todoItem";
import TodayList from "./components/TodayList";
import Moment from "./components/Moment";
import { usePhotographer } from "@/context/PhotographerContext";
export default function habitCalendar() {
  const { user } = useAuth();
  const [selectedTitle, setSelectedTitle] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [records, setRecords] = useState<TodoRecord[]>([]);
  const [todayTodo, setTodayTodo] = useState<TodoRecord[]>([]);
  const [showTodayBtn, setShowTodayBtn] = useState<boolean>(true);
  const todayStr = format(new Date(), "yyyy-MM-dd");
  const { setPhotographerName } = usePhotographer();
  useEffect(() => {
    const fetchRecords = async () => {
      if (!user) return;
      const snapshot = await getDocs(
        collection(db, "users", user.uid, "habits")
      );
      const category_result: TodoRecord[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        const { todos, date } = data;
        todos.forEach((todo: TodoItem) => {
          category_result.push({ ...todo, date });
        });
      });
      setRecords(category_result);
    };
    fetchRecords();
  }, [user]);
  useEffect(() => {
    const fetchTodayRecord = async () => {
      if (!user) return;
      const docRef = doc(db, "users", user.uid, "habits", todayStr);
      const todaysnap = await getDoc(docRef);
      if (!todaysnap.exists()) {
        setTodayTodo([]);
        return;
      }
      const todayData = todaysnap.data();
      const { todos } = todayData;
      const today_result: TodoRecord[] = todos.map((todo: TodoItem) => ({
        ...todo,
        date: todayStr,
      }));
      setTodayTodo(today_result);
    };
    fetchTodayRecord();
  }, [user, todayStr]);
  useEffect(() => setPhotographerName("Mo-Eid"), []);
  const isCompletedDate = useMemo(
    () =>
      new Set(
        records
          .filter(
            (item) => item.title === selectedTitle && item.isCompleted === true
          )
          .map((item) => item.date)
      ),
    [records, selectedTitle]
  );

  const titleCategories = useMemo(
    () => Array.from(new Set(records.map((item) => item.title))),
    [records]
  );

  const filterRecords: TodoRecord[] = useMemo(() => {
    if (!selectedDate) return [];
    return records.filter(
      (item) =>
        item.date === selectedDate &&
        item.isCompleted === true &&
        item.title === selectedTitle
    );
  }, [records, selectedDate, selectedTitle]);
  const handleClickDay = (date: Date) => {
    const dateStr = format(date, "yyyy-MM-dd");
    setSelectedDate(dateStr);
  };
  return (
    <main>
      <ProtectRoute>
        <div className={styles.background} />
        <section className={styles.section}>
          <div className={styles.all_wrapper}>
            <ControlCalendar
              selectedTitle={selectedTitle}
              setSelectedTitle={setSelectedTitle}
              setSelectedDate={setSelectedDate}
              titleCategories={titleCategories}
              isCompletedDate={isCompletedDate}
              handleClickDay={handleClickDay}
              showTodayBtn={showTodayBtn}
              setShowTodayBtn={setShowTodayBtn}
            />
            <TodayList
              selectedTitle={selectedTitle}
              todayTodo={todayTodo}
              todayStr={todayStr}
              setTodayTodo={setTodayTodo}
            />
            <Moment
              filterRecords={filterRecords}
              selectedTitle={selectedTitle}
              selectedDate={selectedDate}
              setSelectedTitle={setSelectedTitle}
              showTodayBtn={showTodayBtn}
              setShowTodayBtn={setShowTodayBtn}
              setSelectedDate={setSelectedDate}
              isCompletedDate={isCompletedDate}
            />
          </div>
        </section>
      </ProtectRoute>
    </main>
  );
}
