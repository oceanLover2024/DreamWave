"use client";
import { useEffect, useState } from "react";
import styles from "./ToggleMenu.module.css";
import Link from "next/link";
import { useAuth } from "../../context/AuthContext";
import { usePathname } from "next/navigation";

export default function ToggleMenu() {
  const { user, isLoading, logOut } = useAuth();
  if (isLoading) return <div>載入中...</div>;
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const pathName = usePathname();
  const toggle = () => {
    setIsOpen(!isOpen);
  };
  useEffect(() => setIsOpen(false), [pathName]);
  return (
    <>
      <div className={styles.wrapper}>
        <div
          className={`${styles.menuBtn} ${isOpen ? styles.close : ""}`}
          onClick={toggle}
        >
          {isOpen ? "ClOSE" : "MENU"}
        </div>
        <div className={`${styles.box} ${isOpen ? styles.boxOpen : ""}`}>
          <div>
            {user ? (
              <div onClick={logOut}>SIGN OUT</div>
            ) : (
              <Link href="/auth/sign_in" className={styles.menu_text}>
                SIGN IN
              </Link>
            )}
          </div>
          <Link href="/todo_page" className={styles.menu_text}>
            Todo List
          </Link>
          <Link href="/calendar" className={styles.menu_text}>
            Habit Tracker
          </Link>
          <Link href="/social_page" className={styles.menu_text}>
            Wall
          </Link>
          <Link href="/member" className={styles.menu_text}>
            Member
          </Link>
        </div>
      </div>
    </>
  );
}
