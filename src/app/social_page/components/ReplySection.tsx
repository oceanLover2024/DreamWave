"use client";
import styles from "./ReplySection.module.css";
import { useState } from "react";
import { Reply } from "./type/card";

type ReplySectionProps = {
  replies: Reply[];
  onReply: (message: string) => void;
};
const ReplySection = ({ replies, onReply }: ReplySectionProps) => {
  const [message, setMessage] = useState<string>("");
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimtext = message.trim();
    trimtext && onReply(trimtext);
    setMessage("");
  };

  return (
    <div className={styles.replies_outer}>
      <div className={styles.replies_content}>
        {replies.length > 0 ? (
          replies.map((reply, index) => (
            <div key={index}>
              {reply.authorName}:{reply.message}
            </div>
          ))
        ) : (
          <div>目前尚無留言</div>
        )}
      </div>
      <div>
        <form onSubmit={handleSubmit}>
          <textarea
            value={message}
            maxLength={100}
            placeholder="請輸入留言"
            onChange={(e) => setMessage(e.target.value)}
          />
          <button type="submit">送出</button>
        </form>
      </div>
    </div>
  );
};
export default ReplySection;
