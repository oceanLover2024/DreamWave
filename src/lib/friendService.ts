import { doc, setDoc } from "firebase/firestore";
import { db } from "./firebase";

type addFriendParams = {
  userId: string;
  username: string;
  friendId: string;
  friendName: string;
};
export const addFriend = async ({
  userId,
  username,
  friendId,
  friendName,
}: addFriendParams) => {
  const timeStamp = new Date().toISOString();
  try {
    await Promise.all([
      setDoc(doc(db, "users", userId, "friends", friendId), {
        uid: friendId,
        displayName: friendName,
        createAt: timeStamp,
      }),
      setDoc(doc(db, "users", friendId, "friends", userId), {
        uid: userId,
        displayName: username,
        createAt: timeStamp,
      }),
    ]);
  } catch (e: unknown) {
    console.log("建立好友失敗:", e);
  }
};
