"use client";
import { useEffect, useState } from "react";
import styles from "./page.module.css";
import { usePhotographer } from "@/context/PhotographerContext";
import ProtectRoute from "../components/ProtectRoute";
import FriendRequests from "./components/FriendRequests";
import FindFriend from "./components/FindFriend";
import AllFriends from "./components/AllFriends";
import { CiMail } from "react-icons/ci";
import { SlMagnifier } from "react-icons/sl";
import { FaUserFriends } from "react-icons/fa";
const Friends = () => {
  const { setPhotographerName } = usePhotographer();
  useEffect(() => setPhotographerName("Jess Loiterton"), [setPhotographerName]);
  const [activeTag, setActiveTag] = useState<"find" | "requests" | "all">(
    "requests"
  );
  const [searchText, setSearchText] = useState<string>("");
  return (
    <ProtectRoute>
      <div className={styles.background} />
      <div className={styles.section}>
        <div className={styles.wrapper}>
          <div className={styles.classification}>
            <div
              className={styles.title_wrapper}
              onClick={() => setActiveTag("find")}
            >
              <SlMagnifier className={styles.search_btn} />
              <input
                className={styles.find_input}
                placeholder="	Search"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
              />
            </div>
            <div
              onClick={() => setActiveTag("requests")}
              className={styles.title_wrapper}
            >
              <CiMail />
              <div className={styles.title_text}> Friend Requests</div>
            </div>
            <div
              onClick={() => setActiveTag("all")}
              className={styles.title_wrapper}
            >
              <FaUserFriends />
              <div className={styles.title_text}> All Friends</div>
            </div>
          </div>
          <hr className={styles.hr} />
          {activeTag === "find" && <FindFriend searchText={searchText} />}
          {activeTag === "requests" && <FriendRequests />}
          {activeTag === "all" && <AllFriends />}
        </div>
      </div>
    </ProtectRoute>
  );
};
export default Friends;
