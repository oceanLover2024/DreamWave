import { endOfMonth, getDaysInMonth, parseISO, startOfMonth } from "date-fns";
import { Statistics } from "@/app/type/todoItem";
import { isWithinInterval } from "date-fns";
import styles from "./statistics.module.css";
const StMonth = ({ selectedDate, isCompletedDate }: Statistics) => {
  const filterCompletedDate = Array.from(isCompletedDate).filter(
    (d) => d <= selectedDate
  );
  const monthStart = startOfMonth(parseISO(selectedDate));
  const monthEnd = endOfMonth(parseISO(selectedDate));
  const monthCompletedDate = filterCompletedDate.filter((d) =>
    isWithinInterval(parseISO(d), {
      start: monthStart,
      end: monthEnd,
    })
  );
  const monthRate = Math.round(
    (monthCompletedDate.length / getDaysInMonth(parseISO(selectedDate))) * 100
  );
  const getColor = (x: number) => {
    if (x >= 80) return styles.yellow;
    if (x >= 50) return styles.blue;
    return;
  };
  return (
    <div className={`${styles.circle} ${getColor(monthRate)}`}>
      <div className={styles.rate}>{monthRate}%</div>
      <div className={styles.text}>Month</div>
    </div>
  );
};
export default StMonth;
