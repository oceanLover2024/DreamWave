import { IoPersonAdd } from "react-icons/io5";
import styles from "./Friend.module.css";
import { UserResult } from "../type/friendType";
import { useEffect, useState } from "react";
import { TbMailUp } from "react-icons/tb";
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";
import { checkUsernameExist } from "@/lib/userService";
import Pic from "@/app/components/common/Pic";
type searchTextProps = { searchText: string };
type State = {
  resultUser: UserResult | null;
  isLoading: boolean;
  isYourself: boolean;
  isNoText: boolean;
};
const FindFriend = ({ searchText }: searchTextProps) => {
  const [state, setState] = useState<State>({
    resultUser: null,
    isLoading: false,
    isYourself: false,
    isNoText: true,
  });
  const [isAlreadySent, setIsAlreadySent] = useState<boolean>(false);
  const { user } = useAuth();
  useEffect(() => {
    const fetchUserData = async () => {
      if (!searchText.trim()) {
        setState({
          resultUser: null,
          isLoading: false,
          isYourself: false,
          isNoText: true,
        });
        return;
      }
      setState((prev) => ({ ...prev, isLoading: true }));
      const exist = await checkUsernameExist(searchText);
      if (!exist) {
        setState({
          resultUser: null,
          isLoading: false,
          isYourself: false,
          isNoText: true,
        });
        return;
      }
      const snapshot = await getDocs(
        query(collection(db, "users"), where("username", "==", searchText))
      );
      if (snapshot.empty) {
        setState({
          resultUser: null,
          isLoading: false,
          isYourself: false,
          isNoText: false,
        });
        return;
      } else {
        const document = snapshot.docs[0];
        if (document.id === user?.uid) {
          setState({
            resultUser: null,
            isLoading: false,
            isYourself: true,
            isNoText: false,
          });
          return;
        } else {
          const data = document.data();
          setState({
            resultUser: {
              id: document.id,
              username: data.username,
              displayName: data.displayName,
              createAt: data.createAt,
              pic: data.pic,
            },
            isYourself: false,
            isLoading: false,
            isNoText: false,
          });
          if (user && document.id !== user.uid) {
            const requestDoc = await getDoc(
              doc(db, "users", document.id, "friendRequests", user.uid)
            );
            setIsAlreadySent(requestDoc.exists()); //是否有收到邀請
          }
        }
      }
    };
    fetchUserData();
  }, [searchText, user]);
  const sentRequest = async () => {
    if (!user || !state.resultUser) return;
    await setDoc(
      doc(db, "users", state.resultUser.id, "friendRequests", user.uid),
      {
        fromId: user.uid,
        fromName: user.displayName,
        sentAt: new Date().toISOString(),
      }
    );
    setIsAlreadySent(true);
    console.log("+++");
  };
  const cancelRequest = async () => {
    if (!user || !state.resultUser) return;
    await deleteDoc(
      doc(db, "users", state.resultUser.id, "friendRequests", user.uid)
    );
    console.log("取消");
    setIsAlreadySent(false);
  };
  if (state.isNoText)
    return (
      <div className={styles.no_friend_text}>Find Friends by Username</div>
    );
  if (state.isYourself)
    return <div className={styles.no_friend_text}>This is your username~</div>;
  if (state.isLoading)
    return <div className={styles.no_friend_text}>Loading...</div>;
  return (
    <>
      {state.resultUser ? (
        <div className={styles.layout}>
          <div className={styles.info}>
            <Pic userId={state.resultUser.id} size={30} />
            <div className={styles.name}>
              {state.resultUser.displayName || state.resultUser.username}
            </div>
          </div>
          <div className={styles.action}>
            {isAlreadySent ? (
              <button className={styles.delete} onClick={cancelRequest}>
                <TbMailUp />
                Sent
              </button>
            ) : (
              <button className={styles.confirm} onClick={sentRequest}>
                <IoPersonAdd />
                Add
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className={styles.no_friend_text}>User not found.</div>
      )}
    </>
  );
};
export default FindFriend;
