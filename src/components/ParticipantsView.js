import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  MeetingProvider,
  useMeeting,
  useParticipant,
  useConnection,
  usePubSub,
} from "@videosdk.live/react-sdk";

import ParticipantView from './ParticipantView';
import { getToken } from "../API";

const primary = "#333244";

const width = 400;
const height = (width * 2) / 3;
const borderRadius = 8;

const chunk = (arr) => {
    const newArr = [];
    while (arr.length) newArr.push(arr.splice(0, 3));
    return newArr;
  };

  const Title = ({ title, dark }) => {
    return <h2 style={{ color: dark ? primary : "#fff" }}>{title}</h2>;
  };

const ParticipantsView = () => {
    const { participants } = useMeeting();
  
    return (
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          flexDirection: "column",
          padding: borderRadius,
        }}
      >
        {/* <Title title={"Participants"} /> */}
        {chunk([...participants.keys()]).map((k) => (
          <div style={{ display: "flex" }}>
            {k.map((l) => (
              <ParticipantView key={l} participantId={l} />
            ))}
          </div>
        ))}
      </div>
    );
  };

  export default ParticipantsView;