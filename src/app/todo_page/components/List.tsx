import styles from "./List.module.css";
import Item from "./Item";
import { TodoItem } from "../../type/todoItem";
import { motion, AnimatePresence } from "framer-motion";
type ListProps = {
  todos: TodoItem[];
  setTodo: React.Dispatch<React.SetStateAction<TodoItem[]>>;
  handleDelete: (id: string) => void;
  handleIsCompleted: (id: string) => void;
  handleIsShared: (id: string) => void;
  handleCommentContext: (id: string, comment: string) => void;
  toggleEditComment: (id: string) => void;
};
const List: React.FC<ListProps> = ({
  todos,
  setTodo,
  handleDelete,
  handleIsCompleted,
  handleIsShared,
  handleCommentContext,
  toggleEditComment,
}) => {
  const handleMarkedShared = (id: string) => {
    setTodo((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, isShareNow: true } : item
      )
    );
  };
  return (
    <>
      <div className={styles.outer}>
        <h2 className={styles.h2}>Habit Tracker</h2>
        <AnimatePresence>
          {todos.map((item: TodoItem) => {
            const {
              id,
              title = "",
              detail = "",
              isCompleted = false,
              isShared = false,
              comment = "",
              isEditingComment = false,
              isShareNow = false,
            } = item;
            return (
              <motion.div
                key={id}
                /*layout*/
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -50, scale: 0 }}
                transition={{ duration: 1 }}
              >
                <Item
                  id={id}
                  key={id}
                  title={title}
                  detail={detail}
                  isCompleted={isCompleted}
                  isShared={isShared}
                  comment={comment}
                  isEditingComment={isEditingComment}
                  isShareNow={isShareNow}
                  handleDelete={() => handleDelete(id)}
                  handleIsCompleted={() => handleIsCompleted(id)}
                  handleIsShared={() => {
                    handleIsShared(id);
                  }}
                  handleCommentContext={(comment) =>
                    handleCommentContext(id, comment)
                  }
                  toggleEditComment={() => toggleEditComment(id)}
                  handleMarkedShared={() => handleMarkedShared(id)}
                />
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </>
  );
};
export default List;
