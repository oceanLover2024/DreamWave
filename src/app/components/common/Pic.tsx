"use client";
import { useEffect, useState } from "react";
import styles from "./Pic.module.css";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { ImUser } from "react-icons/im";
type PicProps = { userId: string; size: number };
const Pic: React.FC<PicProps> = ({ userId, size }) => {
  const [pic, setPic] = useState<string>("");
  useEffect(() => {
    const fetchPic = async () => {
      const docRef = doc(db, "users", userId);
      const snapshot = await getDoc(docRef);
      if (snapshot.exists()) {
        const data = snapshot.data();
        if (data.pic) setPic(data.pic);
      }
    };
    fetchPic();
  }, [userId]);

  return pic ? (
    <img
      src={pic}
      style={{ width: size, height: size }}
      className={styles.img}
    />
  ) : (
    <ImUser
      className={styles.default_img}
      style={{ width: size, height: size }}
    />
  );
};
export default Pic;
