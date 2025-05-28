"use client";
import styles from "./signup.module.css";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "../../../lib/firebase";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { FirebaseError } from "firebase/app";
import { saveUserDataToDB } from "@/lib/userService";
export default function Signup() {
  const router = useRouter();
  const [username, setUsername] = useState<string>("");
  const [usernameError, setUsernameError] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState("");
  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    setError("");
    setUsernameError("");
    if (!username) setUsernameError("Please enter a display name");
    try {
      const userData = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      setUsername(username);
      await updateProfile(userData.user, { displayName: username });
      await saveUserDataToDB(userData.user.uid, username, email);
      alert("Sign-up successful!");
      router.push("../auth/sign_in");
    } catch (e) {
      if (e instanceof FirebaseError) {
        switch (e.code) {
          case "auth/invalid-email":
            setError("Invalid or missing email. Please try again.");
            break;
          case "auth/missing-password":
            setError("Please enter a password.");
            break;
          case "auth/weak-password":
            setError("Password must be at least 6 characters.");
            break;
          case "auth/email-already-in-use":
            setError("This email is already registered.");
            break;
          default:
            setError("Login failed:" + e.message);
        }
      } else if (e instanceof Error) {
        console.log("程式錯誤:", e.message);
        setError("Login failed, Please try again.");
      } else {
        console.log("未知錯誤:");
        setError("An error occurred. Please try again.");
      }
    }
  };
  return (
    <main className={styles.main_layout}>
      <div className={styles.sign_up_box_layout}>
        <div className={styles.welcome_text}>Welcome</div>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div>username</div>
          <input
            className={styles.input}
            onChange={(e) => setUsername(e.target.value.trim())}
          />
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
          <button className={styles.btn_signup} type="submit">
            SIGN Up
          </button>
          {usernameError && (
            <div className={styles.errorText}>{usernameError}</div>
          )}
          {error && <div className={styles.errorText}>{error}</div>}
          <button
            className={styles.btn_to_signin}
            type="button"
            onClick={() => router.push("/auth/sign_in")}
          >
            CLick here to sign in!
          </button>
        </form>
      </div>
    </main>
  );
}
