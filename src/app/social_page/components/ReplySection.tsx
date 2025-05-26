"use client";
import styles from "./ReplySection.module.css";
import { useState, useEffect } from "react";
import { Reply } from "./type/card";
import { useAuth } from "@/context/AuthContext";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  increment,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { BsTrash } from "react-icons/bs";
import { PiPencilCircleLight } from "react-icons/pi";
import { TfiSaveAlt } from "react-icons/tfi";
import { getFinalTime } from "./tools/postTime";
type ReplySectionProps = {
  /*replies: Reply[];
  onReply: (message: string) => void; 
  updateRepliesfromLocal: (postId: string, updatedReplies: Reply[]) => void;*/
  postId: string;
};
const ReplySection = ({
  /*replies,
  onReply, 
  updateRepliesfromLocal,*/
  postId,
}: ReplySectionProps) => {
  const { user } = useAuth();
  const [message, setMessage] = useState<string>(""); //新留言
  /* const [localReplies, setLocalReplies] = useState<Reply[]>(replies); //畫面上的留言*/
  const [editingId, setEditingId] = useState<string | null>(null); //正在編輯的id
  const [editMessage, setEditMessage] = useState<string>(""); //編輯的留言內容
  const [replies, setReplies] = useState<Reply[]>([]); //snapShop新增的
  /* useEffect(() => setLocalReplies(replies), [replies]);*/
  useEffect(() => {
    const q = query(
      collection(db, "posts", postId, "replies"),
      orderBy("createAt")
    );
    const unsubscribe = onSnapshot(q, (snapShop) => {
      const fetchedReplies: Reply[] = snapShop.docs.map((doc) => ({
        id: doc.id,
        authorId: doc.data().authorId,
        authorName: doc.data().authorName,
        createAt: doc.data().createAt,
        message: doc.data().message,
      }));
      setReplies(fetchedReplies);
    });
    return () => unsubscribe();
  }, [postId]);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    /* const trimtext = message.trim();
    trimtext && onReply(trimtext);
    setMessage("");*/
    if (!user || message.trim() === "") return;
    try {
      await addDoc(collection(db, "posts", postId, "replies"), {
        authorId: user.uid,
        authorName: user.displayName ?? "匿名",
        message: message.trim(),
        createAt: new Date().toISOString(),
        updateAt: new Date().toISOString(),
      });
      await updateDoc(doc(db, "posts", postId), { repliesCount: increment(1) });
      setMessage("");
    } catch (e) {
      console.log("e:", e);
    }
  };
  const handleStartEdit = (reply: Reply) => {
    setEditingId(reply.id);
    setEditMessage(reply.message);
  };
  const handleSaveEdit = async (replyId: string) => {
    if (!user) return;
    const replyRef = doc(db, "posts", postId, "replies", replyId);
    await updateDoc(replyRef, {
      message: editMessage,
      updateAt: new Date().toISOString(),
    });
    setEditMessage("");
    setEditingId(null);
    //新增

    /*const postRef = doc(db, "posts", postId);
    const updatedReplies: Reply[] = localReplies.map((r) =>
      r.id === id
        ? { ...r, message: editMessage, createAt: new Date().toISOString() }
        : r
    );
    await updateDoc(postRef, { replies: updatedReplies });
    setLocalReplies(updatedReplies);
    setEditingId(null);
    setEditMessage("");
    updateRepliesfromLocal(postId, updatedReplies);*/
  };
  const handleDeleteReply = async (replyId: string) => {
    if (!user) return;

    await deleteDoc(doc(db, "posts", postId, "replies", replyId));
    await updateDoc(doc(db, "posts", postId), { repliesCount: increment(-1) });
    /* const postRef = doc(db, "posts", postId);
    const updatedReplies = localReplies.filter((r) => r.id != id);
    await updateDoc(postRef, { replies: updatedReplies });
    setLocalReplies(updatedReplies);
    updateRepliesfromLocal(postId, updatedReplies);*/
  };
  return (
    <div className={styles.replies_outer}>
      <div className={styles.replies_content}>
        {/*{localReplies.length > 0 ? (
          localReplies.map((reply) => (*/}
        {replies.length > 0 ? (
          replies.map((reply) => (
            <div key={reply.id} className={styles.individual_reply}>
              <div className={styles.name_time_wrapper}>
                <div>👤{reply.authorName}</div>
                <span className={styles.dot}>·</span>
                <div className={styles.time}>
                  {getFinalTime(reply.createAt)}
                </div>
                {user?.uid === reply.authorId && (
                  <div className={styles.icon_btns}>
                    {editingId === reply.id ? (
                      <TfiSaveAlt
                        onClick={() => handleSaveEdit(reply.id)}
                        className={styles.save_btn}
                      />
                    ) : (
                      <>
                        <PiPencilCircleLight
                          onClick={() => handleStartEdit(reply)}
                          className={styles.edit_btn}
                        />

                        <BsTrash
                          onClick={() => handleDeleteReply(reply.id)}
                          className={styles.delete_btn}
                        />
                      </>
                    )}
                  </div>
                )}
              </div>
              {editingId === reply.id ? (
                <textarea
                  className={styles.textarea}
                  value={editMessage}
                  onChange={(e) => setEditMessage(e.target.value)}
                />
              ) : (
                <div>{reply.message}</div>
              )}
            </div>
          ))
        ) : (
          <div>Be the first to comment!</div>
        )}
      </div>
      <div>
        <form onSubmit={handleSubmit} className={styles.form}>
          <textarea
            className={styles.textarea}
            value={message}
            maxLength={300}
            placeholder="Enter a comment..."
            onChange={(e) => setMessage(e.target.value)}
          />
          <button type="submit" className={styles.submit}>
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};
export default ReplySection;
