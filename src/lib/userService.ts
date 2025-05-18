import { doc, setDoc } from "firebase/firestore";
import { db } from "./firebase";
//doc(db, "collectionName", "documentId")
export const saveUserDataToDB = async (
  uid: string,
  username: string,
  email: string
) => {
  await setDoc(doc(db, "users", uid), {
    username: username,
    email: email,
    createAt: new Date(),
  });
};
