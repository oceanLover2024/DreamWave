import {
  endOfYear,
  getDaysInYear,
  parseISO,
  startOfYear,
  isWithinInterval,
} from "date-fns";
import styles from "./statistics.module.css";
import { Statistics } from "@/app/type/todoItem";

const StYear = ({ selectedDate, isCompletedDate }: Statistics) => {
  const parsedSelectedDate = parseISO(selectedDate);
  const yearStart = startOfYear(parsedSelectedDate);
  const yearEnd = endOfYear(parsedSelectedDate);
  const filterIsCompeletedDate = Array.from(isCompletedDate).filter(
    (d) => d <= selectedDate
  );
  filterIsCompeletedDate.filter((d) =>
    isWithinInterval(parseISO(d), { start: yearStart, end: yearEnd })
  );
  console.log(filterIsCompeletedDate.length);
  const yearRate = Math.round(
    (filterIsCompeletedDate.length / getDaysInYear(parsedSelectedDate)) * 100
  );
  const getColor = (x: number) => {
    if (x >= 50) return styles.yellow;
    if (x >= 30) return styles.blue;
    return;
  };
  return (
    <div className={`${styles.circle} ${getColor(yearRate)}`}>
      <div className={styles.rate}>{yearRate}%</div>
      <div className={styles.text}>Year</div>
    </div>
  );
};
export default StYear;
