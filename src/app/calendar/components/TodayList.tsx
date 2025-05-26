import { TodoRecord } from "../../type/todoItem";
import styles from "./TodayList.module.css";

type TodayListProps = {
  selectedTitle: string;
  todayTodo: TodoRecord[];
  selectedDate: string;
};
const TodayList = ({
  selectedTitle,
  todayTodo,
  selectedDate,
}: TodayListProps) => {
  return (
    <>
      {selectedTitle === "" && (
        <div className={styles.todayTodo_wrapper}>
          <div className={styles.todayTodo_layout}>
            {todayTodo.length > 0 &&
              todayTodo.map((item) => (
                <div key={item.id} className={styles.today_todo}>
                  <div>
                    {item.title}
                    {item.detail && (
                      <span>
                        :
                        <span className={styles.today_detail}>
                          {item.detail}
                        </span>
                      </span>
                    )}
                  </div>
                  <div className={styles.comment}>{item.comment}</div>
                </div>
              ))}
          </div>
        </div>
      )}
    </>
  );
};
export default TodayList;
