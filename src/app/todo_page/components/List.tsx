import styles from "./List.module.css";
import Item from "./Item";
import { TodoItem } from "../type/todoItem";
type ListProps = {
  todo: TodoItem[];
  handleDelete: (index: number) => void;
  handleIsCompleted: (index: number) => void;
  handleIsShared: (index: number) => void;
  handleCommentContext: (index: number, comment: string) => void;
  toggleEditComment: (index: number) => void;
};
const List: React.FC<ListProps> = ({
  todo,
  handleDelete,
  handleIsCompleted,
  handleIsShared,
  handleCommentContext,
  toggleEditComment,
}) => {
  return (
    <>
      <div className={styles.outer}>
        <h2>Habit Tracker</h2>
        {todo.map((item: TodoItem, index: number) => {
          const {
            title = "",
            detail = "",
            isCompleted = false,
            isShared = false,
            comment = "",
            isEditingComment = false,
          } = item;
          return (
            <Item
              key={index}
              title={title}
              detail={detail}
              isCompleted={isCompleted}
              isShared={isShared}
              comment={comment}
              isEditingComment={isEditingComment}
              handleDelete={() => handleDelete(index)}
              handleIsCompleted={() => handleIsCompleted(index)}
              handleIsShared={() => {
                handleIsShared(index);
              }}
              handleCommentContext={(comment) =>
                handleCommentContext(index, comment)
              }
              toggleEditComment={() => toggleEditComment(index)}
            />
          );
        })}
      </div>
    </>
  );
};
export default List;
