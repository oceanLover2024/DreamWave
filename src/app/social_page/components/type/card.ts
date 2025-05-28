export interface CardItem {
  id: string;
  name: string;
  authorId: string;
  title: string;
  detail: string;
  comment: string;
  createAt: string;
  updateAt: string;
  likes: number;
  replies?: Reply[];
  likedBy: string[];
  repliesCount: number;
}
export interface Reply {
  id: string;
  authorName: string;
  message: string;
  createAt: string;
  authorId: string;
  updateAt?: string;
}
