import { Statistics } from "@/app/type/todoItem";
import styles from "./statistics.module.css";
const StDays = ({ selectedDate, isCompletedDate }: Statistics) => {
  const filterCompletedDate = Array.from(isCompletedDate).filter(
    (date) => date <= selectedDate
  );
  const days = filterCompletedDate.length;

  const getColor = (x: number) => {
    if (x >= 100) return styles.yellow;
    if (x >= 50) return styles.blue;
    return;
  };

  return (
    <div className={`${styles.circle} ${getColor(days)}`}>
      <div className={styles.rate}>{days}</div>
      <div className={styles.text}>Days</div>
    </div>
  );
};
export default StDays;
