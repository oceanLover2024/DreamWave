"use client";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import styles from "./member.module.css";
import { ImUser } from "react-icons/im";
import ProtectRoute from "../components/ProtectRoute";
import { usePhotographer } from "@/context/PhotographerContext";
export default function Member() {
  const { user } = useAuth();
  const [username, setUsername] = useState<string>("");
  const [pic, setPic] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const { setPhotographerName } = usePhotographer();
  useEffect(() => setPhotographerName("Gui Basto"), [setPhotographerName]);
  useEffect(() => {
    if (!user) return;
    const fetchUserData = async () => {
      const docRef = doc(db, "users", user.uid);
      const snapshot = await getDoc(docRef);
      if (snapshot.exists()) {
        const data = snapshot.data();
        setUsername(data.username || "");
        setPic(data.pic || "");
      }
      setIsLoading(false);
    };
    fetchUserData();
  }, [user]);
  const handleSave = async () => {
    if (!user) return;
    const docRef = doc(db, "users", user.uid);
    await updateDoc(docRef, {
      username: username,
      pic: pic,
    });
    alert("Saved successfully");
    setIsEditing(!isEditing);
  };
  const toggleToEdit = () => {
    setIsEditing(!isEditing);
  };
  if (user && isLoading) return <div>載入中.....</div>;
  return (
    <ProtectRoute>
      <div className={styles.background} />
      <section className={styles.section}>
        <div className={styles.wrapper}>
          {pic ? (
            <img src={pic} className={styles.img} alt="default picture" />
          ) : (
            <ImUser className={styles.defaultPic} />
          )}

          {isEditing ? (
            <div className={styles.row}>
              <div className={styles.field}>
                <label className={styles.input_label}>Name:</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className={styles.name_input}
                  placeholder="Change Name"
                />
              </div>
              <div className={styles.field}>
                <label className={styles.input_label}>Image URL:</label>
                <input
                  type="text"
                  value={pic}
                  placeholder="Please provide a valid image URL"
                  onChange={(e) => setPic(e.target.value)}
                  className={styles.url_input}
                />
              </div>
              <div className={styles.btn_layout}>
                <button onClick={handleSave} className={styles.btn}>
                  Save
                </button>
              </div>
            </div>
          ) : (
            <div className={styles.row}>
              <div className={styles.hello}>Hello, {user?.displayName}~</div>
              <div className={styles.btn_layout}>
                <button onClick={toggleToEdit} className={styles.btn}>
                  Edit
                </button>
              </div>
            </div>
          )}
        </div>
      </section>
    </ProtectRoute>
  );
}
