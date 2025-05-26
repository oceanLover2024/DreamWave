import styles from "./Circle.module.css";
import { Statistics } from "../../../app/type/todoItem";
import StYear from "./circle_statistics/StYear";
import StMonth from "./circle_statistics/StMonth";
import StWeek from "./circle_statistics/StWeek";
import StDays from "./circle_statistics/StDays";
import Strike from "./circle_statistics/Strike";
const Circle = ({ selectedDate, isCompletedDate }: Statistics) => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.row1}>
        <StWeek selectedDate={selectedDate} isCompletedDate={isCompletedDate} />
        <StMonth
          selectedDate={selectedDate}
          isCompletedDate={isCompletedDate}
        />
        <StYear selectedDate={selectedDate} isCompletedDate={isCompletedDate} />
      </div>
      <div className={styles.row2}>
        <Strike selectedDate={selectedDate} isCompletedDate={isCompletedDate} />
        <StDays selectedDate={selectedDate} isCompletedDate={isCompletedDate} />
      </div>
    </div>
  );
};
export default Circle;
