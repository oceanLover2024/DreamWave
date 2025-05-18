"use client";
import styles from "./signin.module.css";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../../lib/firebase";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { FirebaseError } from "firebase/app";

export default function SignIn() {
  const router = useRouter();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState("");
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
            setError("未填電子郵件，或電子郵件格式錯誤，請重新輸入。");
            break;
          case "auth/missing-password":
            setError("請輸入密碼");
            break;

          default:
            setError("登入失敗，請重新輸入。");
            console.log("firebase錯誤:", e.message);
        }
      } else if (e instanceof Error) {
        console.log("程式錯誤:", e.message);
        setError("登入失敗，請重試");
      } else {
        console.log("未知錯誤:");
        setError("發生錯誤，請重試");
      }
    }
  };
  return (
    <main className={styles.main_layout}>
      <div className={styles.sign_in_box_layout}>
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
          <button className={styles.btn_signin} type="submit">
            SIGN IN
          </button>

          {error && <div className={styles.errorText}>{error}</div>}
          <button
            className={styles.btn_to_signup}
            onClick={() => router.push("/auth/sign_up")}
          >
            Create a new account
          </button>
        </form>
      </div>
    </main>
  );
}
