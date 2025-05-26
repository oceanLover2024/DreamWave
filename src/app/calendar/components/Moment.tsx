import styles from "./Moment.module.css";
import { TodoRecord } from "../../type/todoItem";
import { AnimatePresence, easeOut, motion } from "framer-motion";
import Circle from "./Circle";
type MomentProps = {
  filterRecords: TodoRecord[];
  selectedTitle: string;
  selectedDate: string;
  setSelectedTitle: (title: string) => void;
  setSelectedDate: (date: string) => void;
  showTodayBtn: boolean;
  setShowTodayBtn: React.Dispatch<React.SetStateAction<boolean>>;
  isCompletedDate: Set<string>;
};
const Moment = ({
  filterRecords,
  selectedTitle,
  selectedDate,
  setSelectedTitle,
  setSelectedDate,
  showTodayBtn,
  setShowTodayBtn,
  isCompletedDate,
}: MomentProps) => {
  return (
    <>
      {selectedTitle !== "" && (
        <div className={styles.Moment_wrapper}>
          {filterRecords && filterRecords.length > 0 && (
            <div className={styles.Moment_layout}>
              <h3 className={styles.Moment}>Moment</h3>
              <div className={styles.Moment_title}>
                {selectedTitle}/{selectedDate}:
              </div>
              {filterRecords.map((item) => (
                <div key={item.id}>
                  <div className={styles.details}>▫️Details:{item.detail}</div>
                  <div className={styles.comment}>▫️Notes:{item.comment}</div>
                </div>
              ))}
              <Circle
                selectedDate={selectedDate}
                isCompletedDate={isCompletedDate}
              />
            </div>
          )}
          <AnimatePresence>
            {showTodayBtn && (
              <motion.div
                className={styles.todayBtn}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.8, ease: easeOut }}
              >
                <img
                  src="/todayBtn.png"
                  className={styles.todayBtnImg}
                  onClick={() => {
                    setShowTodayBtn((prev) => !prev);
                    setTimeout(() => {
                      setSelectedDate("");
                      setSelectedTitle("");
                    }, 800);
                  }}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </>
  );
};
export default Moment;
