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
      <div className="main" >
        <h2 className="textWhite">Chat</h2>
        <hr />
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