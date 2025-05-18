import { differenceInDays, formatDistanceToNow, format } from "date-fns";
import { CardItem } from "./type/card";
import { zhTW } from "date-fns/locale";
type PostContentProps = { post: CardItem };
const PostContent: React.FC<PostContentProps> = ({ post }) => {
  const today = new Date();
  const createTime = new Date(post.createAt);
  const distanceTime = formatDistanceToNow(new Date(post.createAt), {
    addSuffix: true,
    locale: zhTW,
  });
  const diffDays = differenceInDays(today, createTime);
  const finalTime =
    diffDays > 7 ? format(createTime, "yyyy-MM-dd") : distanceTime;
  return (
    <div>
      <div>👤姓名:{post.name}</div>
      <div>🕓發布於:{finalTime}</div>
      <div>📌類型:{post.title}</div>
      <div>📋內容:{post.detail}</div>
      <div>😊心得:{post.comment}</div>
    </div>
  );
};
export default PostContent;
