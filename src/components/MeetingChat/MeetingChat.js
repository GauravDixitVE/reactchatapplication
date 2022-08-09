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
        
        <MessageList messages={messages} />
        <div style={{ display: "flex", height: '75px', borderTop: '1px solid rgba(112, 112, 112, 0.2)', alignItems: 'center', paddingRight: '8px', paddingLeft: '8px', justifyContent: 'space-between' }}>
            <input
              value={message}
              className="message-input"
              placeholder="Write Your Message"
              onChange={(e) => {
                const v = e.target.value;
                setMessage(v);
              }}
            />
            <button
              className={"button default myBtn"}
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
  
        
      </div>
    );
};

export default MeetingChat;