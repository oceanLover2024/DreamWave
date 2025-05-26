"use client";
import styles from "./Nav.module.css";
import Link from "next/link";
import { useAuth } from "../../context/AuthContext";
import ToggleMenu from "./ToggleMenu";
import Image from "next/image";
export const Nav = () => {
  const { user, isLoading, logOut } = useAuth();
  /* if (isLoading) return <div>載入中...</div>;*/
  return (
    <nav className={styles.nav}>
      <div className={styles.layout}>
        <div className={styles.dream_wave}>
          <Link href="/">
            <Image src="/title.png" alt="Dream Wave" width={100} height={50} />
          </Link>
        </div>
        <div className={styles.space} />
        <ToggleMenu />
      </div>
    </nav>
  );
};
