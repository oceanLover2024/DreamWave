import styles from "./Friend.module.css";
import { IoPersonAdd } from "react-icons/io5";
import { IoPersonRemove } from "react-icons/io5";
import { addFriend } from "../../../lib/friendService";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { collection, deleteDoc, doc, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { FriendRequest } from "../type/friendType";
import Pic from "@/app/components/common/Pic";
const FriendRequests = () => {
  const { user } = useAuth();
  const [requests, setRequests] = useState<FriendRequest[]>([]);
  useEffect(() => {
    const fetchRequests = async () => {
      if (!user) return;
      const snapshot = await getDocs(
        collection(db, "users", user.uid, "friendRequests")
      );

      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        fromId: doc.data().fromId,
        fromName: doc.data().fromName,
        sentAt: doc.data().sentAt,
      }));
      setRequests(data);
    };
    fetchRequests();
  }, [user]);
  const handleConfirm = async (fromId: string, fromName: string) => {
    if (!user) return;
    await addFriend({
      userId: user.uid,
      username: user.displayName ?? "匿名",
      friendId: fromId,
      friendName: fromName,
    });
    await deleteDoc(doc(db, "users", user.uid, "friendRequests", fromId));
    setRequests((prev) => prev.filter((r) => r.fromId !== fromId));
  };
  const handleDelete = async (fromId: string) => {
    if (!user) return;
    await deleteDoc(doc(db, "users", user.uid, "friendRequests", fromId));
    setRequests((prev) => prev.filter((r) => r.fromId != fromId));
  };
  if (requests.length === 0)
    return (
      <div className={styles.no_friend_text}>No friend requests right now.</div>
    );
  return (
    <>
      {requests.map((r) => (
        <div className={styles.layout} key={r.id}>
          <div className={styles.info}>
            <Pic userId={r.id} size={30} />
            <div className={styles.name}>{r.fromName}</div>
          </div>
          <div className={styles.action}>
            <button
              className={styles.confirm}
              onClick={() => handleConfirm(r.fromId, r.fromName)}
            >
              <IoPersonAdd />
              Confirm
            </button>
            <button
              className={styles.delete}
              onClick={() => handleDelete(r.fromId)}
            >
              <IoPersonRemove />
              Delete
            </button>
          </div>
        </div>
      ))}
    </>
  );
};
export default FriendRequests;
