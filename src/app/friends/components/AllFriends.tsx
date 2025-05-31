import { useEffect, useState } from "react";
import { UserResult } from "../type/friendType";
import styles from "./Friend.module.css";
import { IoPersonRemove } from "react-icons/io5";
import { useAuth } from "@/context/AuthContext";
import { collection, deleteDoc, doc, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import Pic from "@/app/components/common/Pic";

const AllFriends = () => {
  const { user } = useAuth();
  const [friends, setFriends] = useState<UserResult[]>([]);
  useEffect(() => {
    const fetchFriends = async () => {
      if (!user) return;
      const snapshot = await getDocs(
        collection(db, "users", user.uid, "friends")
      );
      if (!snapshot.empty) {
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          username: doc.data().username,
          displayName: doc.data().displayName,
          createAt: doc.data().createAt,
          pic: doc.data().pic,
        }));
        setFriends(data);
      }
    };
    fetchFriends();
  }, [user]);
  const removeFriend = async (userId: string, friendId: string) => {
    try {
      await Promise.all([
        deleteDoc(doc(db, "users", userId, "friends", friendId)),
        deleteDoc(doc(db, "users", friendId, "friends", userId)),
      ]);
    } catch (e: unknown) {
      console.log("刪除好友失敗:", e);
    }
    setFriends((prev) => prev.filter((f) => f.id !== friendId));
  };
  if (friends.length === 0)
    return <div className={styles.no_friend_text}>No friends yet.</div>;
  return (
    <>
      {user &&
        friends.map((f) => (
          <div className={styles.layout} key={f.id}>
            <div className={styles.info}>
              <Pic userId={f.id} size={30} />
              <div className={styles.name}>{f.displayName || f.username}</div>
            </div>
            <div className={styles.action}>
              <button
                className={styles.delete}
                onClick={() => {
                  removeFriend(user.uid, f.id);
                }}
              >
                <IoPersonRemove />
                Remove
              </button>
            </div>
          </div>
        ))}
    </>
  );
};
export default AllFriends;
