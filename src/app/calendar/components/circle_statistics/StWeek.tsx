import { Statistics } from "@/app/type/todoItem";
import { startOfWeek, endOfWeek, parseISO, isWithinInterval } from "date-fns";
import styles from "./statistics.module.css";
const StWeek = ({ selectedDate, isCompletedDate }: Statistics) => {
  const weekStart = startOfWeek(parseISO(selectedDate), { weekStartsOn: 1 });
  const weekEnd = endOfWeek(parseISO(selectedDate), { weekStartsOn: 1 });
  const filterCompletedDate = Array.from(isCompletedDate).filter(
    (date) => date <= selectedDate
  );
  const weekCompletedDays = filterCompletedDate.filter((item) =>
    isWithinInterval(parseISO(item), { start: weekStart, end: weekEnd })
  );
  const uniqueDays = Array.from(new Set(weekCompletedDays)).length;
  const weekRate = Math.round((uniqueDays / 7) * 100);
  const getColor = (x: number) => {
    if (x >= 80) return styles.yellow;
    if (x >= 50) return styles.blue;
    return;
  };
  return (
    <div className={`${styles.circle} ${getColor(weekRate)}`}>
      <div className={styles.rate}>{weekRate}%</div>
      <div className={styles.text}>Week</div>
    </div>
  );
};
export default StWeek;
