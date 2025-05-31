"use client";
import styles from "../sign.module.css";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../../lib/firebase";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FirebaseError } from "firebase/app";
import { usePhotographer } from "@/context/PhotographerContext";
export default function SignIn() {
  const { setPhotographerName } = usePhotographer();
  const router = useRouter();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState("");
  useEffect(
    () => setPhotographerName("Kammeran Gonzalez-Keola"),
    [setPhotographerName]
  );
  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/");
    } catch (e) {
      if (e instanceof FirebaseError) {
        console.log("Firebase 錯誤代碼：", e.code);
        switch (e.code) {
          case "auth/invalid-email":
            setError("Invalid or missing email. Please try again.");
            break;
          case "auth/missing-password":
            setError("Please enter a password.");
            break;

          default:
            setError("Login failed, Please try again.");
            console.log("firebase錯誤:", e.message);
        }
      } else if (e instanceof Error) {
        console.log("程式錯誤:", e.message);
        setError("Login failed, Please try again.");
      } else {
        console.log("未知錯誤:");
        setError("An error occurred, Please try again.");
      }
    }
  };
  return (
    <main className={styles.main_layout}>
      <div className={styles.box_layout}>
        <div className={styles.welcome_text}>Welcome</div>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div>Email</div>
          <input
            type="email"
            className={styles.input}
            onChange={(e) => setEmail(e.target.value)}
          />
          <div>Password</div>
          <input
            type="password"
            className={styles.input}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button className={styles.btn_sign} type="submit">
            SIGN IN
          </button>

          {error && <div className={styles.errorText}>{error}</div>}
          <button
            type="button"
            className={styles.btn_change}
            onClick={() => router.push("/auth/sign_up")}
          >
            Create a new account
          </button>
        </form>
      </div>
    </main>
  );
}
