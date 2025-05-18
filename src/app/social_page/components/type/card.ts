export interface CardItem {
  id: string;
  name: string;
  title: string;
  detail: string;
  comment: string;
  createAt: string;
  likes: number;
  replies: Reply[];
  likedBy: string[];
}
export interface Reply {
  id: string;
  authorName: string;
  message: string;
}
