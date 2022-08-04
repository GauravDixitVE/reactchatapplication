import React, { useEffect, useMemo, useRef, useState } from "react";
import MessageList from "../MessageList";

import {
  // MeetingProvider,
  // useMeeting,
  // useParticipant,
  // useConnection,
  usePubSub,
} from "@videosdk.live/react-sdk";

import './style.css'

const primary = "#3E84F6";
// const width = 400;
// const height = (width * 2) / 3;
const borderRadius = 8;


const MeetingChat = ({ tollbarHeight }) => {

    const [message, setMessage] = useState("");
    const { publish, messages } = usePubSub("CHAT", {});
    
    return (
      <div
        style={{
          marginLeft: borderRadius,
          width: 400,
          backgroundColor: primary,
          overflowY: "scroll",
          borderRadius,
          height: `calc(100vh - ${tollbarHeight + 2 * borderRadius}px)`,
          padding: borderRadius,
        }}
      >
        <h2 style={{ color: "#fff" }}>Chat</h2>
  
        <div style={{ display: "flex" }}>
          <input
            value={message}
            onChange={(e) => {
              const v = e.target.value;
              setMessage(v);
            }}
          />
          <button
            className={"button default"}
            onClick={() => {
              const m = message;
  
              if (m.length) {
                publish(m, { persist: true });
                setMessage("");
              }
            }}
          >
            Send
          </button>
        </div>
        <MessageList messages={messages} />
      </div>
    );
};

export default MeetingChat;