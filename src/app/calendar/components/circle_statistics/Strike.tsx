import { Statistics } from "@/app/type/todoItem";
import { format, subDays } from "date-fns";
import styles from "./statistics.module.css";
const Strike = ({ selectedDate, isCompletedDate }: Statistics) => {
  let strike = 0;
  let date = new Date(selectedDate);

  while (isCompletedDate.has(format(date, "yyyy-MM-dd"))) {
    strike++;
    date = subDays(date, 1);
  }
  const getColor = (x: number) => {
    if (x >= 7) return styles.yellow;
    if (x >= 3) return styles.blue;
    return;
  };

  return (
    <div className={`${styles.circle} ${getColor(strike)}`}>
      <div className={styles.rate}>{strike}</div>
      <div className={styles.text}>Strike</div>
    </div>
  );
};
export default Strike;
