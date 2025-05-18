"use client";
import { format } from "date-fns";
import styles from "./page.module.css";
import Calendar from "react-calendar";
import "react-calendar/dist/calendar.css";
import { useEffect, useState } from "react";
import { db } from "../../lib/firebase";
import { useAuth } from "../../context/AuthContext";
import { collection, getDocs } from "firebase/firestore";
import { TodoItem } from "../type/todoItem";
import ProtectRoute from "../components/ProtectRoute";
type FirebaseTodo = Omit<TodoItem, "isEditingComment">;
type TodoRecord = FirebaseTodo & { date: string };
export default function habitCalendar() {
  const { user } = useAuth();
  const [selectedTitle, setSelectedTitle] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [records, setRecords] = useState<TodoRecord[]>([]);
  useEffect(() => {
    const fetchRecords = async () => {
      if (!user) return;
      const snapshot = await getDocs(
        collection(db, "users", user.uid, "habits")
      );
      console.log(snapshot);
      const result: TodoRecord[] = [];

      snapshot.forEach((doc) => {
        const data = doc.data();
        const { todos, date } = data;
        console.log(data);
        todos.forEach((todo: FirebaseTodo) => result.push({ ...todo, date }));
      });
      setRecords(result);
    };
    fetchRecords();
  }, [user]);
  const isCompletedDate = new Set(
    records
      .filter(
        (item) => item.title === selectedTitle && item.isCompleted === true
      )
      .map((item) => item.date)
  );
  const titleCategories = Array.from(
    new Set(records.map((item) => item.title))
  );
  const handleClickDay = (date: Date) => {
    const dateStr = format(date, "yyyy-MM-dd");
    setSelectedDate(dateStr);
  };
  const filterRecords =
    selectedDate &&
    records.filter(
      (item) =>
        item.date === selectedDate &&
        item.isCompleted === true &&
        item.title === selectedTitle
    );
  return (
    <main>
      <ProtectRoute>
        <div className={styles.background} />
        <section className={styles.section}>
          <div className={styles.wrapper}>
            <select
              value={selectedTitle}
              onChange={(e) => {
                return setSelectedTitle(e.target.value);
              }}
            >
              <option value="">請選擇類別</option>
              {titleCategories.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>

            <Calendar
              locale="en-US"
              tileClassName={({ date }) => {
                const datestr = format(date, "yyyy-MM-dd");

                return isCompletedDate.has(datestr)
                  ? "calendar_marked"
                  : undefined;
              }}
              onClickDay={handleClickDay}
            />
            {filterRecords && filterRecords.length > 0 && (
              <div>
                <h3>今日戰績:</h3>
                {filterRecords.map((item, index) => (
                  <div key={index}>
                    <div>{item.detail}</div>
                    <div>{item.comment}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </ProtectRoute>
    </main>
  );
}
