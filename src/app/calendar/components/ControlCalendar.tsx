import styles from "./ControlCalendar.module.css";
import Calendar from "react-calendar";
import { format } from "date-fns";
type ControlCalendarProps = {
  selectedTitle: string;
  setSelectedTitle: (title: string) => void;
  setSelectedDate: (date: string) => void;
  titleCategories: string[];
  isCompletedDate: Set<string>;
  handleClickDay: (date: Date) => void;
  showTodayBtn: boolean;
  setShowTodayBtn: React.Dispatch<React.SetStateAction<boolean>>;
};
const ControlCalendar = ({
  selectedTitle,
  setSelectedTitle,
  setSelectedDate,
  titleCategories,
  isCompletedDate,
  handleClickDay,
  setShowTodayBtn,
}: ControlCalendarProps) => {
  return (
    <>
      <div className={styles.calendar_wrapper}>
        <select
          className={styles.select}
          value={selectedTitle}
          onChange={(e) => {
            setSelectedTitle(e.target.value);
            setShowTodayBtn(true);
            setSelectedDate(""); // 切換 title 時清空日期
          }}
        >
          <option value="">Select Category</option>
          {titleCategories.map((item) => (
            <option key={item} value={item} className={styles.option}>
              {item}
            </option>
          ))}
        </select>

        <Calendar
          className={styles.calendar}
          locale="en-US"
          tileClassName={({ date }) => {
            const datestr = format(date, "yyyy-MM-dd");

            return isCompletedDate.has(datestr) ? "calendar_marked" : undefined;
          }}
          onClickDay={handleClickDay}
        />
      </div>
    </>
  );
};
export default ControlCalendar;
