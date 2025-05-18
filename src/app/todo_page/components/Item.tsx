"use client";
import { TodoItem } from "../type/todoItem";
type ItemProps = TodoItem & {
  handleDelete: () => void;
  handleIsCompleted: () => void;
  handleIsShared: () => void;
  handleCommentContext: (commment: string) => void;
  toggleEditComment: () => void;
};
const Item: React.FC<ItemProps> = ({
  title,
  detail,
  isCompleted,
  isShared,
  comment,
  isEditingComment,
  handleDelete,
  handleIsCompleted,
  handleIsShared,
  handleCommentContext,
  toggleEditComment,
}) => {
  return (
    <div>
      <input
        type="checkbox"
        checked={isCompleted}
        onChange={handleIsCompleted}
      />
      <div>{title}</div>
      <div>{detail}</div>
      {isCompleted && (
        <label>
          <input type="checkbox" checked={isShared} onChange={handleIsShared} />
          SHARE
        </label>
      )}

      {isCompleted && isEditingComment ? (
        <div>
          <button onClick={toggleEditComment}>SAVE</button>
          <div>
            {" "}
            <textarea
              value={comment || ""}
              onChange={(e) => handleCommentContext(e.target.value)}
              placeholder="請紀錄心情"
            ></textarea>
          </div>
        </div>
      ) : comment ? (
        <div>
          <button onClick={toggleEditComment}>EDIT</button>
          <div>
            <p>{comment}</p>
          </div>{" "}
        </div>
      ) : (
        <div>
          <button onClick={toggleEditComment}>COMMENT</button>
        </div>
      )}

      <button onClick={handleDelete}>DELETE</button>
    </div>
  );
};
export default Item;
