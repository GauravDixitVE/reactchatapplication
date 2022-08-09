import React, { useEffect, useMemo, useRef, useState } from "react";

const MessageList = ({ messages }) => {

    function formatAMPM(date) {
        var hours = date.getHours();
        var minutes = date.getMinutes();
        var ampm = hours >= 12 ? "pm" : "am";
        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'
        minutes = minutes < 10 ? "0" + minutes : minutes;
        var strTime = hours + ":" + minutes + " " + ampm;
        return strTime;
    }
    
    return (
      <div style={{height: '310px', overflowY: 'scroll'}}>
        {messages?.map((message, i) => {
          const { senderName, message: text, timestamp } = message;
  
          return (
            <div
              style={{
                margin: 8,
                backgroundColor: "rgb(61, 60, 78)",
                borderRadius: 8,
                overflow: "hidden",
                padding: 8,
                color: "#fff",
              }}
              key={i}
            >
              <div style={{display: 'flex', justifyContent: 'space-between', alignItem: 'center'}}>
              <p style={{ margin: 0, padding: 0, fontStyle: "italic" }}>
                {senderName}
              </p>
              <p
                style={{
                  margin: 0,
                  padding: 0,
                  opacity: 0.6,
                  marginTop: 4,
                }}
              >
                {formatAMPM(new Date(timestamp))}
              </p>
              </div>
              <h3 style={{ margin: 0, padding: 0, marginTop: 4 }}>{text}</h3>
            </div>
          );
        })}
      </div>
    );
};

export default MessageList;