import React, { useEffect, useMemo, useRef, useState } from "react";
import {
    MeetingProvider,
    useMeeting,
    useParticipant,
    useConnection,
    usePubSub,
  } from "@videosdk.live/react-sdk";

import { ParticipantView } from './ParticipantView';

export function ParticipantsView()
{
    const borderRadius = 8;
    const { participants } = useMeeting();
  
    const chunk = (arr) => {
        const newArr = [];
        while (arr.length) newArr.push(arr.splice(0, 3));
        return newArr;
      };

    return (
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          flexDirection: "column",
          padding: borderRadius,
        }}
      >
        {/* <Title dark title={"Participants"} /> */}
        {chunk([...participants.keys()]).map((k) => (
          <div style={{ display: "flex" }}>
            {k.map((l) => (
              <ParticipantView key={l} participantId={l} />
            ))}
          </div>
        ))}
      </div>
    );
  }