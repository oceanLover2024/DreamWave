import {
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import { db } from "./firebase";
//doc(db, "collectionName", "documentId")
export const saveUserDataToDB = async (uid: string, username: string) => {
  await setDoc(doc(db, "users", uid), {
    username: username,
    displayName: username,
    createAt: new Date(),
    pic: "",
  });
  await setDoc(doc(db, "searchIndex", uid), {
    username: username,
    displayName: username,
  });
};

export const checkUsernameExist = async (
  username: string
): Promise<boolean> => {
  const q = query(
    collection(db, "searchIndex"),
    where("username", "==", username)
  );
  const snapshot = await getDocs(q);
  return !snapshot.empty;
};
