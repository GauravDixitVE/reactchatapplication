import React, { useEffect, useMemo, useRef, useState } from "react";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import {
  Button,
  IconButton,
  Box,
  MenuItem,
  Popover,
  Tooltip,
  MenuList,
  Typography,
  Link,
  SwipeableDrawer,
  Grid,
  Modal
} from "@material-ui/core";
import OutlineIconButton from "../components/OutlineIconButton";
import { Constants, useMeeting, usePubSub } from "@videosdk.live/react-sdk";
import { sideBarModes, useMeetingAppContext } from "../MeetingAppContextDef";
import useIsTab from "../utils/useIsTab";
import useIsMobile from "../utils/useIsMobile";
import recordingBlink from "../animations/recording-blink.json";
import liveBlink from "../animations/live-blink.json";
import liveHLS from "../animations/live-hls.json";
import stoppingHLS from "../animations/hls_stop_blink.json";
import SettingsOutlinedIcon from "@material-ui/icons/SettingsOutlined";
import LiveIcon from "../icons/LiveIcon";
import RaiseHand from "../icons/RaiseHand";
import QAIcon from "../icons/QAIcon";
import 'font-awesome/css/font-awesome.min.css';
import {
  Activities,
  Chat,
  EndCall,
  Participants,
  ScreenRecording,
  ScreenShare,
  LeaveMeetingIcon,
  EndCallIcon
} from "../icons";

import {
  MicOff as MicOffIcon,
  Mic as MicIcon,
  VideocamOff as VideocamOffIcon,
  Videocam as VideocamIcon,
  MoreHoriz as MoreHorizIcon,
  ArrowDropDown as ArrowDropDownIcon,
  Gesture,
  PictureInPicture,
} from "@material-ui/icons";

import {
  isMobile as RDDIsMobile,
  isTablet as RDDIsTablet,
} from "react-device-detect";
import ConfirmBox from "../components/ConfirmBox";
import OutlineIconTextButton from "../components/OutlineIconTextButton";
import MobileIconButton from "../components/MobileIconButton";
import AddLiveStreamIcon from "../icons/AddLiveStreamIcon";
import useIsLivestreaming from "./useIsLivestreaming";
import useIsRecording from "./useIsRecording";
import useIsHls from "./useIsHls";
import { meetingModes } from "../CONSTS";
import CountDownTimer from "../components/CountDownTimer";

const useStyles = makeStyles({
  row: { display: "flex", alignItems: "center" },
  borderRight: { borderRight: "1ps solid #ffffff33" },
  popover: { backgroundColor: "transparent" },
  popoverBorder: {
    borderRadius: "12px",
    backgroundColor: "#212032",
    marginTop: 8,
    width: 300,
  },
});



const RaiseHandBTN = ({ onClick, isMobile, isTab }) => {
  const { publish } = usePubSub("RAISE_HAND");

  const onRaiseHand = () => {
    if (isMobile || isTab) {
      onClick();
      typeof onClick === "function" && onClick();
      publish("Raise Hand");
    } else {
      publish("Raise Hand");
    }
  };

  return isMobile || isTab ? (
    <Tooltip>
      <MobileIconButton
        id="RaiseHandBTN"
        tooltipTitle={"Raise hand"}
        Icon={RaiseHand}
        onClick={onRaiseHand}
        buttonText={"Raise Hand"}
      />
    </Tooltip>
  ) : (
    <Tooltip>
      <OutlineIconButton
        tooltipTitle={"Raise hand"}
        Icon={RaiseHand}
        onClick={onRaiseHand}
      />
    </Tooltip>
  );
};

/*const ParticipantsBTN = ({ onClick, isMobile, isTab }) => {
  const { sideBarMode, setSideBarMode, meetingMode } = useMeetingAppContext();

  const mMeeting = useMeeting();
  const participants = mMeeting?.participants;
  const participantsCount = participants ? new Map(participants).size : 0;

  return isMobile || isTab ? (
    <MobileIconButton
      tooltipTitle={"Participants"}
      isFocused={sideBarMode === sideBarModes.PARTICIPANTS}
      buttonText={"Participants"}
      Icon={Participants}
      disabled={meetingMode === meetingModes.VIEWER}
      onClick={() => {
        typeof onClick === "function" && onClick();
        setSideBarMode((s) =>
          s === sideBarModes.PARTICIPANTS ? null : sideBarModes.PARTICIPANTS
        );
      }}
      badge={participantsCount}
    />
  ) : (
    <OutlineIconButton
      tooltipTitle={"Participants"}
      isFocused={sideBarMode === sideBarModes.PARTICIPANTS}
      Icon={Participants}
      disabled={meetingMode === meetingModes.VIEWER}
      onClick={() => {
        typeof onClick === "function" && onClick();
        setSideBarMode((s) =>
          s === sideBarModes.PARTICIPANTS ? null : sideBarModes.PARTICIPANTS
        );
      }}
      badge={participantsCount}
    />
  );
};*/

const ConfigBTN = ({ isMobile, isTab }) => {
  const { sideBarMode, setSideBarMode } = useMeetingAppContext();

  return isMobile || isTab ? (
    <MobileIconButton
      tooltipTitle={"Configuration"}
      buttonText={"Configuration"}
      Icon={SettingsOutlinedIcon}
      isFocused={sideBarMode === sideBarModes.CONFIGURATION}
      onClick={() => {
        setSideBarMode((s) =>
          s === sideBarModes.CONFIGURATION ? null : sideBarModes.CONFIGURATION
        );
      }}
    />
  ) : (
    <OutlineIconButton
      tooltipTitle={"Configuration"}
      Icon={SettingsOutlinedIcon}
      isFocused={sideBarMode === sideBarModes.CONFIGURATION}
      onClick={() => {
        setSideBarMode((s) =>
          s === sideBarModes.CONFIGURATION ? null : sideBarModes.CONFIGURATION
        );
      }}
    />
  );
};

const ChatBTN = ({ isMobile, isTab }) => {
  const { sideBarMode, setSideBarMode } = useMeetingAppContext();

  return isMobile || isTab ? (
    <MobileIconButton
      tooltipTitle={"Chat"}
      buttonText={"Chat"}
      Icon={Chat}
      isFocused={sideBarMode === sideBarModes.CHAT}
      onClick={() => {
        setSideBarMode((s) =>
          s === sideBarModes.CHAT ? null : sideBarModes.CHAT
        );
      }}
    />
  ) : (
    <OutlineIconButton
      tooltipTitle={"Chat"}
      Icon={Chat}
      isFocused={sideBarMode === sideBarModes.CHAT}
      onClick={() => {
        setSideBarMode((s) =>
          s === sideBarModes.CHAT ? null : sideBarModes.CHAT
        );
      }}
    />
  );
};


function PipBTN({ isMobile, isTab }) {
  const { pipMode, setPipMode } = useMeetingAppContext();

  const getRowCount = (length) => {
    return length > 2 ? 2 : length > 0 ? 1 : 0;
  };
  const getColCount = (length) => {
    return length < 2 ? 1 : length < 5 ? 2 : 3;
  };

  const pipWindowRef = useRef(null);
  const togglePipMode = async () => {
    //Check if PIP Window is active or not
    //If active we will turn it off
    if (pipWindowRef.current) {
      await document.exitPictureInPicture();
      pipWindowRef.current = null;
      return;
    }

    //Check if browser supports PIP mode else show a message to user
    if ("pictureInPictureEnabled" in document) {
      //Creating a Canvas which will render our PIP Stream
      const source = document.createElement("canvas");
      const ctx = source.getContext("2d");

      //Create a Video tag which we will popout for PIP
      const pipVideo = document.createElement("video");
      pipWindowRef.current = pipVideo;
      pipVideo.autoplay = true;

      //Creating stream from canvas which we will play
      const stream = source.captureStream();
      pipVideo.srcObject = stream;
      drawCanvas();

      //When Video is ready we will start PIP mode
      pipVideo.onloadedmetadata = () => {
        pipVideo.requestPictureInPicture();
      };
      await pipVideo.play();

      //When the PIP mode starts, we will start drawing canvas with PIP view
      pipVideo.addEventListener("enterpictureinpicture", (event) => {
        drawCanvas();
        setPipMode(true);
      });

      //When PIP mode exits, we will dispose the track we created earlier
      pipVideo.addEventListener("leavepictureinpicture", (event) => {
        pipWindowRef.current = null;
        setPipMode(false);
        pipVideo.srcObject.getTracks().forEach((track) => track.stop());
      });

      
      //These will draw all the video elements in to the Canvas
      function drawCanvas() {
        //Getting all the video elements in the document
        const videos = document.querySelectorAll("video");
        try {
          //Perform initial black paint on the canvas
          ctx.fillStyle = "black";
          ctx.fillRect(0, 0, source.width, source.height);

          //Drawing the participant videos on the canvas in the grid format
          const rows = getRowCount(videos.length);
          const columns = getColCount(videos.length);
          for (let i = 0; i < rows; i++) {
            for (let j = 0; j < columns; j++) {
              if (j + i * columns <= videos.length || videos.length == 1) {
                ctx.drawImage(
                  videos[j + i * columns],
                  j < 1 ? 0 : source.width / (columns / j),
                  i < 1 ? 0 : source.height / (rows / i),
                  source.width / columns,
                  source.height / rows
                );
              }
            }
          }
        } catch (error) {
          console.log(error);
        }

        //If pip mode is on, keep drawing the canvas when ever new frame is requested
        if (document.pictureInPictureElement === pipVideo) {
          requestAnimationFrame(drawCanvas);
        }
      }
    } else {
      alert("PIP is not supported by your browser");
    }
  };

  return isMobile || isTab ? (
    <MobileIconButton
      id="pip-btn"
      tooltipTitle={pipMode ? "Stop PiP" : "Start PiP"}
      buttonText={pipMode ? "Stop PiP" : "Start PiP"}
      isFocused={pipMode}
      Icon={PictureInPicture}
      onClick={() => {
        togglePipMode();
      }}
      disabled={false}
    />
  ) : (
    <OutlineIconButton
      Icon={PictureInPicture}
      onClick={() => {
        togglePipMode();
      }}
      isFocused={pipMode}
      tooltipTitle={pipMode ? "STOP PRESENTATION MODE" : "START PRESENTATION MODE"}
      disabled={false}
    />
  );
}

/*const WhiteBoardBTN = ({ onClick, isMobile, isTab }) => {
  const { whiteboardStarted, whiteboardEnabled, canToggleWhiteboard } =
    useMeetingAppContext();

  const mMeeting = useMeeting({});

  const presenterId = mMeeting?.presenterId;

  return (
    <>
      {whiteboardEnabled &&
        (isMobile || isTab ? (
          <MobileIconButton
            disabled={presenterId || !canToggleWhiteboard}
            tooltipTitle={"Whiteboard"}
            buttonText={"Whiteboard"}
            Icon={Gesture}
            isFocused={whiteboardStarted}
            onClick={() => {
              typeof onClick === "function" && onClick();

              whiteboardStarted
                ? mMeeting.meeting.stopWhiteboard()
                : mMeeting.meeting.startWhiteboard();
            }}
          />
        ) : (
          <OutlineIconButton
            disabled={presenterId || !canToggleWhiteboard}
            tooltipTitle={"Whiteboard"}
            Icon={Gesture}
            isFocused={whiteboardStarted}
            onClick={() => {
              typeof onClick === "function" && onClick();

              whiteboardStarted
                ? mMeeting.meeting.stopWhiteboard()
                : mMeeting.meeting.startWhiteboard();
            }}
          />
        ))}
    </>
  );
};*/

const ScreenShareBTN = ({ onClick, isMobile, isTab }) => {
  const mMeeting = useMeeting({});
  const { whiteboardStarted } = useMeetingAppContext();

  const localScreenShareOn = mMeeting?.localScreenShareOn;
  const toggleScreenShare = mMeeting?.toggleScreenShare;
  const presenterId = mMeeting?.presenterId;

  return isMobile || isTab ? (
    <MobileIconButton
      tooltipTitle={
        presenterId
          ? localScreenShareOn
            ? "Stop Presenting"
            : null
          : "Present Screen"
      }
      buttonText={
        presenterId
          ? localScreenShareOn
            ? "Stop Presenting"
            : null
          : "Present Screen"
      }
      isFocused={localScreenShareOn}
      Icon={ScreenShare}
      onClick={() => {
        typeof onClick === "function" && onClick();
        toggleScreenShare();
      }}
      disabled={
        RDDIsMobile || RDDIsTablet
          ? true
          : whiteboardStarted
          ? true
          : presenterId
          ? localScreenShareOn
            ? false
            : true
          : false
      }
    />
  ) : (
    <OutlineIconButton
      tooltipTitle={
        presenterId
          ? localScreenShareOn
            ? "Stop Presenting"
            : null
          : "Present Screen"
      }
      isFocused={localScreenShareOn}
      Icon={ScreenShare}
      onClick={() => {
        typeof onClick === "function" && onClick();
        toggleScreenShare();
      }}
      disabled={
        RDDIsMobile || RDDIsTablet
          ? true
          : whiteboardStarted
          ? true
          : presenterId
          ? localScreenShareOn
            ? false
            : true
          : false
      }
    />
  );
};
const AddLiveStreamBTN = ({ isMobile, isTab }) => {
  const { sideBarMode, setSideBarMode } = useMeetingAppContext();

  return isMobile || isTab ? (
    <MobileIconButton
      tooltipTitle={"Add Live Streams"}
      Icon={AddLiveStreamIcon}
      buttonText={"Add Live Streams"}
      isFocused={sideBarMode === sideBarModes.ADD_LIVE_STREAM}
      onClick={() => {
        setSideBarMode((s) =>
          s === sideBarModes.ADD_LIVE_STREAM
            ? null
            : sideBarModes.ADD_LIVE_STREAM
        );
      }}
    />
  ) : (
    <OutlineIconTextButton
      tooltipTitle={"Add Live Streams"}
      buttonText="Add Live Streams"
      isFocused={sideBarMode === sideBarModes.ADD_LIVE_STREAM}
      onClick={() => {
        setSideBarMode((s) =>
          s === sideBarModes.ADD_LIVE_STREAM
            ? null
            : sideBarModes.ADD_LIVE_STREAM
        );
      }}
    />
  );
};
const RecordingBTN = ({ isMobile, isTab }) => {
  const mMeeting = useMeeting({});

  const startRecording = mMeeting?.startRecording;
  const stopRecording = mMeeting?.stopRecording;
  const recordingState = mMeeting?.recordingState;

  const isRecording = useIsRecording();
  const { isRequestProcessing } = useMemo(
    () => ({
      isRequestProcessing:
        recordingState === Constants.recordingEvents.RECORDING_STARTING ||
        recordingState === Constants.recordingEvents.RECORDING_STOPPING,
    }),
    [recordingState]
  );

  const {
    recordingWebhookUrl,
    recordingAWSDirPath,
    participantCanToggleRecording,
    appMeetingLayout,
  } = useMeetingAppContext();
  
  const { type, priority, gridSize } = useMemo(
    () => ({
      type: appMeetingLayout.type,
      priority: appMeetingLayout.priority,
      gridSize: appMeetingLayout.gridSize,
    }),
    [appMeetingLayout]
  );

  const typeRef = useRef(type);
  const priorityRef = useRef(priority);
  const gridSizeRef = useRef(gridSize);
  const isRecordingRef = useRef(isRecording);

  useEffect(() => {
    typeRef.current = type;
  }, [type]);

  useEffect(() => {
    priorityRef.current = priority;
  }, [priority]);

  useEffect(() => {
    gridSizeRef.current = gridSize;
  }, [gridSize]);

  useEffect(() => {
    isRecordingRef.current = isRecording;
  }, [isRecording]);

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: recordingBlink,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
    height: 64,
    width: 160,
  };

  const _handleStartRecording = () => {
    const type = typeRef.current;
    const priority = priorityRef.current;
    const gridSize = gridSizeRef.current;

    const layout = { type, priority, gridSize };
    // console.log(recordingWebhookUrl,recordingAWSDirPath);
    startRecording(recordingWebhookUrl, recordingAWSDirPath, { layout });
  };

  const _handleClick = () => {
    const isRecording = isRecordingRef.current;
    
    if (isRecording) {
      stopRecording();
    } else {
      _handleStartRecording();
    }
  };

  return isMobile || isTab ? (
    <MobileIconButton
      Icon={ScreenRecording}
      onClick={_handleClick}
      tooltipTitle={
        recordingState === Constants.recordingEvents.RECORDING_STARTED
          ? "Stop Recording"
          : recordingState === Constants.recordingEvents.RECORDING_STARTING
          ? "Starting Recording"
          : recordingState === Constants.recordingEvents.RECORDING_STOPPED
          ? "Start Recording"
          : recordingState === Constants.recordingEvents.RECORDING_STOPPING
          ? "Stopping Recording"
          : "Start Recording"
      }
      isFocused={isRecording}
      lottieOption={isRecording ? defaultOptions : null}
      buttonText={
        recordingState === Constants.recordingEvents.RECORDING_STARTED
          ? "Stop Recording"
          : recordingState === Constants.recordingEvents.RECORDING_STARTING
          ? "Starting Recording"
          : recordingState === Constants.recordingEvents.RECORDING_STOPPED
          ? "Start Recording"
          : recordingState === Constants.recordingEvents.RECORDING_STOPPING
          ? "Stopping Recording"
          : "Start Recording"
      }
      isRequestProcessing={isRequestProcessing}
    />
  ) : (
    <OutlineIconButton
      Icon={ScreenRecording}
      onClick={_handleClick}
      tooltipTitle={
        recordingState === Constants.recordingEvents.RECORDING_STARTED
          ? "Stop Recording"
          : recordingState === Constants.recordingEvents.RECORDING_STARTING
          ? "Starting Recording"
          : recordingState === Constants.recordingEvents.RECORDING_STOPPED
          ? "Start Recording"
          : recordingState === Constants.recordingEvents.RECORDING_STOPPING
          ? "Stopping Recording"
          : "Start Recording"
      }
      isFocused={isRecording}
      lottieOption={isRecording ? defaultOptions : null}
      isRequestProcessing={isRequestProcessing}
    />
  );
};

const RateBTN = ({ onClick, isMobile, isTab }) => {

  const location = window.location;
  const urlParams = new URLSearchParams(location.search);
  const [meetinTwoMinWorning, setMeetinTwoMinWorning] = useState(false);

  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
    textAlign: 'center'
  };

  const paramKeys = {
    a_token: 'a_token',
    user_id: 'user_id',
    ptype: 'ptype'
  };

  Object.keys(paramKeys).forEach((key) => {
    paramKeys[key] = urlParams.get(key)
      ? decodeURIComponent(urlParams.get(key))
      : null;
  });

  const rateCall = async (e) => {
    
    let path = `https://www.gosee.expert/api/notifytoparticipant/`+paramKeys.a_token+'/'+paramKeys.user_id;
  
    const rateCallStatus = await fetch(path, {
      method: "GET",
      headers: { "Content-type": "application/json" },
    });
    
    if (rateCallStatus) {
      alert("Video call invitation has been sent to your participant successfully");
      // setMeetinTwoMinWorning(true);
    }
  }

  return(
    <>  
  
      <Tooltip title={"Invite Participant"}>
      
        <Button 
          style={{
            corsur: 
            'pointer', 
            marginLeft: '10px',
            padding: '9px',
            background: 'rgb(33 32 50)',
            border: '1px solid #4d4d5b',
          }}
          onClick={(e) => rateCall(e) }
        >Invite &nbsp; <i className="fa fa-user-plus"/></Button>
      </Tooltip>
    </>
  );
}
const GoLiveBTN = ({ isMobile, isTab }) => {
  const mMeeting = useMeeting({});

  const [isPopupShown, setIsPopupShown] = useState(false);

  const startLivestream = mMeeting?.startLivestream;
  const stopLivestream = mMeeting?.stopLivestream;
  const livestreamState = mMeeting?.livestreamState;

  const isLiveStreaming = useIsLivestreaming();

  const { isRequestProcessing } = useMemo(
    () => ({
      isRequestProcessing:
        livestreamState === Constants.livestreamEvents.LIVESTREAM_STARTING ||
        livestreamState === Constants.livestreamEvents.LIVESTREAM_STOPPING,
    }),
    [livestreamState]
  );

  const {
    participantCanToggleLivestream,
    liveStreamConfig,
    setSideBarMode,
    appMeetingLayout,
  } = useMeetingAppContext();

  const { type, priority, gridSize } = useMemo(
    () => ({
      type: appMeetingLayout.type,
      priority: appMeetingLayout.priority,
      gridSize: appMeetingLayout.gridSize,
    }),
    [appMeetingLayout]
  );

  const typeRef = useRef(type);
  const priorityRef = useRef(priority);
  const gridSizeRef = useRef(gridSize);
  const isLiveStreamingRef = useRef(isLiveStreaming);
  const liveStreamConfigRef = useRef(liveStreamConfig);

  useEffect(() => {
    typeRef.current = type;
  }, [type]);

  useEffect(() => {
    priorityRef.current = priority;
  }, [priority]);

  useEffect(() => {
    gridSizeRef.current = gridSize;
  }, [gridSize]);

  useEffect(() => {
    isLiveStreamingRef.current = isLiveStreaming;
  }, [isLiveStreaming]);

  useEffect(() => {
    liveStreamConfigRef.current = liveStreamConfig;
  }, [liveStreamConfig]);

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: liveBlink,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
    height: 64,
    width: 170,
  };

  const _handleStartLivestream = () => {
    const type = typeRef.current;
    const priority = priorityRef.current;
    const gridSize = gridSizeRef.current;

    const layout = { type, priority, gridSize };

    startLivestream(liveStreamConfig, { layout });
  };

  const _handleClick = () => {
    const isLiveStreaming = isLiveStreamingRef.current;

    if (isLiveStreaming) {
      stopLivestream();
    } else {
      if (liveStreamConfigRef.current.length > 0) {
        _handleStartLivestream();
      } else {
        setIsPopupShown(true);
      }
    }
  };

  return (
    <>
      {isMobile || isTab ? (
        <MobileIconButton
          bgColor={"#D32F2F"}
          onClick={_handleClick}
          tooltipTitle={
            livestreamState === Constants.livestreamEvents.LIVESTREAM_STARTED
              ? "Stop Live"
              : livestreamState ===
                Constants.livestreamEvents.LIVESTREAM_STARTING
              ? "Starting Livestream"
              : livestreamState ===
                Constants.livestreamEvents.LIVESTREAM_STOPPED
              ? "Go Live"
              : livestreamState ===
                Constants.livestreamEvents.LIVESTREAM_STOPPING
              ? "Stopping Livestream"
              : "Go Live"
          }
          Icon={LiveIcon}
          buttonText={
            livestreamState === Constants.livestreamEvents.LIVESTREAM_STARTED
              ? "Stop Live"
              : livestreamState ===
                Constants.livestreamEvents.LIVESTREAM_STARTING
              ? "Starting Livestream"
              : livestreamState ===
                Constants.livestreamEvents.LIVESTREAM_STOPPED
              ? "Go Live"
              : livestreamState ===
                Constants.livestreamEvents.LIVESTREAM_STOPPING
              ? "Stopping Livestream"
              : "Go Live"
          }
          isFocused={isLiveStreaming}
          lottieOption={isLiveStreaming ? defaultOptions : null}
          disabled={!participantCanToggleLivestream}
          isRequestProcessing={isRequestProcessing}
        />
      ) : (
        <OutlineIconTextButton
          bgColor={"#D32F2F"}
          onClick={_handleClick}
          tooltipTitle={
            livestreamState === Constants.livestreamEvents.LIVESTREAM_STARTED
              ? "Stop Live"
              : livestreamState ===
                Constants.livestreamEvents.LIVESTREAM_STARTING
              ? "Starting Livestream"
              : livestreamState ===
                Constants.livestreamEvents.LIVESTREAM_STOPPED
              ? "Go Live"
              : livestreamState ===
                Constants.livestreamEvents.LIVESTREAM_STOPPING
              ? "Stopping Livestream"
              : "Go Live"
          }
          buttonText="Go Live"
          lottieOption={isLiveStreaming ? defaultOptions : null}
          disabled={!participantCanToggleLivestream}
          isRequestProcessing={isRequestProcessing}
        />
      )}
      <ConfirmBox
        open={isPopupShown}
        title={"Add live stream configuration"}
        subTitle={
          "Please add live stream configuration to start live streaming"
        }
        successText={"Proceed"}
        onSuccess={() => {
          setSideBarMode((s) => sideBarModes.ADD_LIVE_STREAM);
          setIsPopupShown(false);
        }}
        rejectText={"Cancel"}
        onReject={() => {
          setIsPopupShown(false);
        }}
      />
    </>
  );
};
const HlsBTN = ({ isMobile, isTab }) => {
  const mMeeting = useMeeting({});

  const startHls = mMeeting?.startHls;
  const stopHls = mMeeting?.stopHls;
  const [isHlsStop, setIsHlsStop] = useState(false);

  const isHls = useIsHls();

  const { appMeetingLayout, participantCanToggleHls } = useMeetingAppContext();

  const { type, priority, gridSize } = useMemo(
    () => ({
      type: appMeetingLayout.type,
      priority: appMeetingLayout.priority,
      gridSize: appMeetingLayout.gridSize,
    }),
    [appMeetingLayout]
  );

  const typeRef = useRef(type);
  const priorityRef = useRef(priority);
  const gridSizeRef = useRef(gridSize);
  const isHlsRef = useRef(isHls);

  useEffect(() => {
    typeRef.current = type;
  }, [type]);

  useEffect(() => {
    priorityRef.current = priority;
  }, [priority]);

  useEffect(() => {
    gridSizeRef.current = gridSize;
  }, [gridSize]);

  useEffect(() => {
    isHlsRef.current = isHls;
  }, [isHls]);

 
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: liveHLS,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
    height: 64,
    width: 170,
  };

  const defaultOptionsStoppingHls = {
    loop: true,
    autoplay: true,
    animationData: stoppingHLS,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
    height: 64,
    width: 170,
  };

  const _handleStartHLS = () => {
    const type = typeRef.current;
    const priority = priorityRef.current;
    const gridSize = gridSizeRef.current;

    const layout = { type, priority, gridSize };

    startHls(layout);
  };

  const _handleClick = () => {
    const isHls = isHlsRef.current;

    if (isHls) {
      stopHls();
      setIsHlsStop(true);
    } else {
      _handleStartHLS();
      setIsHlsStop(false);
    }
  };

  return isMobile || isTab ? (
    <MobileIconButton
      onClick={_handleClick}
      tooltipTitle={
        isHls ? (isHlsStop ? "Stopping HLS" : "Stop HLS") : "Start HLS"
      }
      Icon={LiveIcon}
      buttonText={
        isHls ? (isHlsStop ? "Stopping HLS" : "Stop HLS") : "Start HLS"
      }
      isFocused={isHls}
      lottieOption={isHls ? (isHlsStop ? null : defaultOptions) : null}
      disabled={!participantCanToggleHls}
    />
  ) : (
    <OutlineIconTextButton
      onClick={_handleClick}
      tooltipTitle={
        isHls ? (isHlsStop ? "Stopping HLS" : "Stop HLS") : "Start HLS"
      }
      buttonText={
        isHls ? (isHlsStop ? "Stopping HLS" : "Stop HLS") : "Start HLS"
      }
      lottieOption={isHls ? (isHlsStop ? null : defaultOptions) : null}
      disabled={!participantCanToggleHls}
    />
  );
};
const WebcamBTN = () => {
  const theme = useTheme();
  const mMeeting = useMeeting({});
  const { selectedWebcam } = useMeetingAppContext();
  const [selectedDeviceId, setSelectedDeviceId] = useState(selectedWebcam.id);
  const [downArrow, setDownArrow] = useState(null);
  const [webcams, setWebcams] = useState([]);

  const localWebcamOn = mMeeting?.localWebcamOn;
  const toggleWebcam = mMeeting?.toggleWebcam;
  const changeWebcam = mMeeting?.changeWebcam;

  const handleClick = (event) => {
    setDownArrow(event.currentTarget);
  };

  const handleClose = () => {
    setDownArrow(null);
  };

  const getWebcams = async (mGetWebcams) => {
    const webcams = await mGetWebcams();

    webcams && webcams?.length && setWebcams(webcams);
  };

  const tollTipEl = useRef();

  return (
    <Box
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
      ref={tollTipEl}
    >
      <OutlineIconButton
        btnID={"btnWebcam"}
        tooltipTitle={localWebcamOn ? "Turn off webcam" : "Turn on webcam"}
        isFocused={localWebcamOn}
        Icon={localWebcamOn ? VideocamIcon : VideocamOffIcon}
        onClick={toggleWebcam}
        focusBGColor={"#ffffff33"}
        focusIconColor={theme.palette.common.white}
        renderRightComponent={() => {
          return (
            <Tooltip placement="bottom" title={"Change webcam"}>
              <IconButton
                onClick={(e) => {
                  getWebcams(mMeeting?.getWebcams);
                  handleClick(e);
                }}
                size={"small"}
              >
                <ArrowDropDownIcon fontSize={"small"} />
              </IconButton>
            </Tooltip>
          );
        }}
      />
      <Popover
        container={tollTipEl.current}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        anchorEl={tollTipEl.current}
        open={Boolean(downArrow)}
        onClose={handleClose}
      >
        <MenuList>
          {webcams.map(({ deviceId, label }, index) => (
            <MenuItem
              key={`output_webcams_${deviceId}`}
              selected={deviceId === selectedDeviceId}
              onClick={() => {
                handleClose();
                setSelectedDeviceId(deviceId);
                changeWebcam(deviceId);
              }}
            >
              {label || `Webcam ${index + 1}`}
            </MenuItem>
          ))}
        </MenuList>
      </Popover>
    </Box>
  );
};
const MicBTN = () => {
  const { selectedMic } = useMeetingAppContext();
  const [selectedDeviceId, setSelectedDeviceId] = useState(selectedMic.id);
  const [downArrow, setDownArrow] = useState(null);
  const [mics, setMics] = useState([]);
  const mMeeting = useMeeting({});
  const theme = useTheme();

  const handleClick = (event) => {
    setDownArrow(event.currentTarget);
  };

  const handleClose = () => {
    setDownArrow(null);
  };

  const localMicOn = mMeeting?.localMicOn;
  const toggleMic = mMeeting?.toggleMic;
  const changeMic = mMeeting?.changeMic;

  const getMics = async (mGetMics) => {
    const mics = await mGetMics();

    mics && mics?.length && setMics(mics);
  };

  const tollTipEl = useRef();

  return (
    <Box
      ref={tollTipEl}
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <OutlineIconButton
        btnID={"btnMic"}
        tooltipTitle={localMicOn ? "Turn off mic" : "Turn on mic"}
        isFocused={localMicOn}
        Icon={localMicOn ? MicIcon : MicOffIcon}
        onClick={toggleMic}
        focusBGColor={"#ffffff33"}
        focusIconColor={theme.palette.common.white}
        renderRightComponent={() => {
          return (
            <Tooltip placement="bottom" title={"Change microphone"}>
              <IconButton
                onClick={(e) => {
                  getMics(mMeeting.getMics);
                  handleClick(e);
                }}
                size={"small"}
              >
                <ArrowDropDownIcon fontSize={"small"} />
              </IconButton>
            </Tooltip>
          );
        }}
      />

      <Popover
        container={tollTipEl.current}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        anchorEl={tollTipEl.current}
        open={Boolean(downArrow)}
        onClose={handleClose}
      >
        <MenuList>
          {mics.map(({ deviceId, label }, index) => (
            <MenuItem
              key={`output_mics_${deviceId}`}
              selected={deviceId === selectedDeviceId}
              onClick={() => {
                handleClose();
                setSelectedDeviceId(deviceId);
                changeMic(deviceId);
              }}
            >
              {label || `Mic ${index + 1}`}
            </MenuItem>
          ))}
        </MenuList>
      </Popover>
    </Box>
  );
};
const EndCallBTN = () => {
  
  // localStorage.removeItem('clockParticipants')

  const mMeeting = useMeeting({});
  const classes = useStyles();

  const [isEndMeeting, setIsEndMeeting] = useState(false);
  const {
    endCallContainerRef,
    participantCanEndMeeting,
    participantCanLeave,
    meetingMode,
  } = useMeetingAppContext();

  const sendChatMessage = mMeeting?.sendChatMessage;

  const leave = mMeeting?.leave;
  
  const location = window.location;
  
  const urlParams = new URLSearchParams(location.search);
  
  const paramKeys = {
    a_token: 'a_token',
    user_id: 'user_id',
    ptype: 'ptype',
  };

  const [pType,setPtype] = useState("")

  Object.keys(paramKeys).forEach((key) => {
    paramKeys[key] = urlParams.get(key)
      ? decodeURIComponent(urlParams.get(key))
      : null;
  });

  const leaveVideoCallRating = async () =>{
    const auth_token = paramKeys.a_token;
    const meetingTimingDetails = await fetch('https://www.gosee.expert/api/videocallrating/'+auth_token, {
      method: "GET",
      headers: { "Content-type": "application/json" },
    });
  }
  const end = mMeeting?.end;

  const tollTipEl = useRef();

  const theme = useTheme();

  const [downArrow, setDownArrow] = useState(null);

  const handleClick = (event) => {
    setDownArrow(event.currentTarget);
  };

  const handleClose = () => {
    setDownArrow(null)
  };

  //const pipWindowRef = useRef(null);
  const pipModeLeave = async () => {
      await document.exitPictureInPicture();
  }
  // useEffect(()=>{
  //   setPtype(ptype)
  // },[ptype])

  return (
    <Box
      ref={tollTipEl}
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <OutlineIconButton
        ref={endCallContainerRef}
        tooltipTitle={
          !participantCanLeave && meetingMode === meetingModes.CONFERENCE
            ? "End Call"
            : participantCanEndMeeting &&
              meetingMode === meetingModes.CONFERENCE
            ? "Open popup"
            : "Leave Call"
        }
        bgColor={theme.palette.error.main}
        Icon={EndCall}
        onClick={(e) => {
          !participantCanLeave && meetingMode === meetingModes.CONFERENCE
            ? setIsEndMeeting(true)
            : participantCanEndMeeting &&
              meetingMode === meetingModes.CONFERENCE
            ? handleClick(e)
            : leave()
            ? pipModeLeave() : pipModeLeave() ;
        }}
      />
      {participantCanEndMeeting && (
        <>
          <Popover
            container={tollTipEl.current}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "center",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "center",
            }}
            anchorEl={tollTipEl.current}
            open={Boolean(downArrow)}
            onClose={handleClose}
            classes={{
              paper: classes.popoverBorder,
            }}
          >
            <MenuList>
              <MenuItem
                key={`leave`}
                onClick={() => {
                  leave();
                }}
              >
                <Box style={{ display: "flex", flexDirection: "row" }}>
                  <Box
                    style={{
                      backgroundColor: theme.palette.common.sidePanel,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      height: 42,
                      width: 42,
                      borderRadius: 4,
                    }}
                  >
                    <LeaveMeetingIcon height={22} width={22} />
                  </Box>
                  <Box
                    style={{
                      display: "flex",
                      flex: 1,
                      flexDirection: "column",
                      marginLeft: 12,
                      justifyContent: "center",
                    }}
                  >
                    <Typography style={{ fontSize: 14 }}>Leave</Typography>
                    <Typography
                      color={"textSecondary"}
                      style={{ fontSize: "0.9rem" }}
                    >
                      Only you will leave the call.
                    </Typography>
                  </Box>
                </Box>
              </MenuItem>
              <MenuItem
                style={{ marginTop: 4 }}
                key={`end`}
                onClick={() => {
                  setIsEndMeeting(true);
                }}
              >
                <Box style={{ display: "flex", flexDirection: "row" }}>
                  <Box
                    style={{
                      backgroundColor: theme.palette.common.sidePanel,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      height: 42,
                      width: 42,
                      borderRadius: 4,
                    }}
                  >
                    <EndCallIcon />
                  </Box>
                  <Box
                    style={{
                      display: "flex",
                      marginLeft: 12,
                      flexDirection: "column",
                      justifyContent: "center",
                    }}
                  >
                    <Typography style={{ fontSize: 14, lineHeight: 1.5 }}>
                      End
                    </Typography>
                    <Typography
                      style={{
                        fontSize: "0.9rem",
                      }}
                      color={"textSecondary"}
                    >
                      End call for all participants.
                    </Typography>
                  </Box>
                </Box>
              </MenuItem>
            </MenuList>
          </Popover>

          <ConfirmBox
            open={isEndMeeting}
            title={"Are you sure to end this call for everyone?"}
            successText={"End Call"}
            onSuccess={() => {
              sendChatMessage(
                JSON.stringify({ buttonType: "END_CALL", data: {} })
              );
              setTimeout(() => {
                end();
              }, 1000);
            }}
            rejectText="Cancel"
            onReject={() => {
              setIsEndMeeting(false);
            }}
          />
        </>
      )}
    </Box>
  );
};

const TopBar = ({ topBarHeight,passPropsRefreshTime,props }) => {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [meetinEndModal, setMeetinEndModal] = useState(false);
  const [meetinEndModalHead, setMeetinEndModalHead] = useState('');
  const [meetinEndModalBody, setMeetinEndModalBody] = useState('');
  const [meetinTwoMinWorning, setMeetinTwoMinWorning] = useState(false);
  const [clockParticipantsValue,setClockParticipantsValue] = useState(false)
  const [hoursMinSec,setHoursMinSec]=useState({hours:0, minutes: passPropsRefreshTime.refreshTime, seconds:0});
 const [clockTime,setClockTime]=useState(passPropsRefreshTime.refreshTime);
  const paramKeys = {
    a_token: 'a_token',
    user_id: 'user_id',
    ptype: 'ptype',
    iscaller:'iscaller'
  };
  const location = window.location;
  const urlParams = new URLSearchParams(location.search);
  
  Object.keys(paramKeys).forEach((key) => {
    paramKeys[key] = urlParams.get(key)
      ? decodeURIComponent(urlParams.get(key))
      : null;
  });
  useEffect(()=>{
    setClockTime(passPropsRefreshTime.refreshTime)
    setHoursMinSec({hours:0, minutes: passPropsRefreshTime.refreshTime , seconds:0});
   // return() =>{  localStorage.removeItem('clockTime'); }
  },[passPropsRefreshTime.refreshTime])
  
  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
    textAlign: 'center'
  };

  const [defaultBrandLogoUrl, setDefaultBrandLogoUrl] = useState(null);

  const {
    chatEnabled,
    screenShareEnabled,
    canChangeLayout,
    participantCanToggleLivestream,
    liveStreamEnabled,
    hlsEnabled,
    pollEnabled,
    whiteboardEnabled,
    participantCanToggleSelfWebcam,
    participantCanToggleSelfMic,
    raiseHandEnabled,
    recordingEnabled,
    brandingEnabled,
    brandLogoURL,
    brandName,
    participantCanLeave,
    poweredBy,
    participantCanEndMeeting,
    animationsEnabled,
    meetingMode,
  } = useMeetingAppContext();

  const handleClickFAB = () => {
    setOpen(true);
  };

  const callParticipant=(data)=>{
    console.log("text",data)
    props.setParticipant(data)
}

  const handleCloseFAB = () => {
    setOpen(false);
  };

  const closeTMeeting = () => {
    setMeetinTwoMinWorning(false);
  }
 
  const rateCall = async (e) => {

    let path = ` https://www.gosee.expert/api/videocallrating/`+paramKeys.a_token+'/'+paramKeys.user_id;
  
    const rateCallStatus = await fetch(path, {
      method: "GET",
      headers: { "Content-type": "application/json" },
    });
  
    if (rateCallStatus) {
      alert("Video call invitation has been sent to your participant successfully!");
      // setMeetinTwoMinWorning(true);
    }
  }

  const isMobile = useIsMobile();
  const isTab = useIsTab();
  const theme = useTheme();

  const topBarButtonTypes = useMemo(
    () => ({
      END_CALL: "END_CALL",
      ACTIVITIES: "ACTIVITIES",
      CHAT: "CHAT",
      PARTICIPANTS: "PARTICIPANTS",
      SCREEN_SHARE: "SCREEN_SHARE",
      PIP:"PIP",
      WEBCAM: "WEBCAM",
      MIC: "MIC",
      RAISE_HAND: "RAISE_HAND",
      RECORDING: "RECORDING",
      HLS: "HLS",
      WHITEBOARD: "WHITEBOARD",
      ADD_LIVE_STREAM: "ADD_LIVE_STREAM",
      CONFIGURATION: "CONFIGURATION",
      GO_LIVE: "GO_LIVE",
      RATE: "RATE",
      COUNTDOWNTIMER : "COUNTDOWNTIMER"
    }),
    []
  );

  const { topBarIcons, firstFourElements, excludeFirstFourElements } =
    useMemo(() => {
      const arr = [];
      const mobileIconArr = [];

      if (participantCanLeave || participantCanEndMeeting) {
        arr.unshift([topBarButtonTypes.END_CALL]);
        mobileIconArr.unshift({
          buttonType: topBarButtonTypes.END_CALL,
          priority: 1,
        });
      }

      const arrSideBar = [];

      if (canChangeLayout && meetingMode === meetingModes.CONFERENCE) {
        arrSideBar.unshift(topBarButtonTypes.CONFIGURATION);
        mobileIconArr.unshift({
          buttonType: topBarButtonTypes.CONFIGURATION,
          priority: 7,
        });
      }
      if (chatEnabled) {
        arrSideBar.unshift(topBarButtonTypes.CHAT);
        mobileIconArr.unshift({
          buttonType: topBarButtonTypes.CHAT,
          priority: 5,
        });
      }
      arrSideBar.unshift(topBarButtonTypes.PARTICIPANTS);
      mobileIconArr.unshift({
        buttonType: topBarButtonTypes.PARTICIPANTS,
        priority: 10,
      });

      arrSideBar.unshift(topBarButtonTypes.ACTIVITIES);
      mobileIconArr.unshift({
        buttonType: topBarButtonTypes.ACTIVITIES,
        // priority: 10,
      });

      arr.unshift(arrSideBar);

      const arrMedia = [];

      if (screenShareEnabled && meetingMode === meetingModes.CONFERENCE) {
        arrMedia.unshift(topBarButtonTypes.SCREEN_SHARE);
        mobileIconArr.unshift({
          buttonType: topBarButtonTypes.SCREEN_SHARE,
          priority: 6,
        });
      }
      if (
        participantCanToggleSelfWebcam &&
        meetingMode === meetingModes.CONFERENCE
      ) {
        arrMedia.unshift(topBarButtonTypes.WEBCAM);
        mobileIconArr.unshift({
          buttonType: topBarButtonTypes.WEBCAM,
          priority: 2,
        });
      }
      if (
        participantCanToggleSelfMic &&
        meetingMode === meetingModes.CONFERENCE
      ) {
        arrMedia.unshift(topBarButtonTypes.MIC);
        mobileIconArr.unshift({
          buttonType: topBarButtonTypes.MIC,
          priority: 3,
        });

        arrMedia.unshift(topBarButtonTypes.PIP);
        mobileIconArr.unshift({
          buttonType: topBarButtonTypes.PIP,
          priority: 4,
        });

      }

      if (arrMedia.length) {
        arr.unshift(arrMedia);
      }

      const utilsArr = [];

      if (raiseHandEnabled) {
        utilsArr.unshift(topBarButtonTypes.RAISE_HAND);
        mobileIconArr.unshift({
          buttonType: topBarButtonTypes.RAISE_HAND,
          priority: 13,
        });
      }
      if (recordingEnabled && meetingMode === meetingModes.CONFERENCE) {
        utilsArr.unshift(topBarButtonTypes.RECORDING);
        mobileIconArr.unshift({
          buttonType: topBarButtonTypes.RECORDING,
          priority: 4,
        });
      }

      utilsArr.unshift(topBarButtonTypes.RATE);
      mobileIconArr.unshift({
        buttonType: topBarButtonTypes.RATE,
        priority: 5,
      });

      if (whiteboardEnabled && meetingMode === meetingModes.CONFERENCE) {
        utilsArr.unshift(topBarButtonTypes.WHITEBOARD);
        mobileIconArr.unshift({
          buttonType: topBarButtonTypes.WHITEBOARD,
          priority: 11,
        });
      }

      if (
        liveStreamEnabled &&
        !participantCanToggleLivestream &&
        meetingMode === meetingModes.CONFERENCE
      ) {
        utilsArr.unshift(topBarButtonTypes.GO_LIVE);
        mobileIconArr.unshift({
          buttonType: topBarButtonTypes.GO_LIVE,
          priority: 9,
        });
      }

      if (hlsEnabled && meetingMode === meetingModes.CONFERENCE) {
        utilsArr.unshift(topBarButtonTypes.HLS);
        mobileIconArr.unshift({
          buttonType: topBarButtonTypes.HLS,
          priority: 14,
        });
      }

      if (
        participantCanToggleLivestream &&
        liveStreamEnabled &&
        meetingMode === meetingModes.CONFERENCE
      ) {
        //liveStreamIcon
        utilsArr.unshift(topBarButtonTypes.GO_LIVE);
        mobileIconArr.unshift({
          buttonType: topBarButtonTypes.GO_LIVE,
          priority: 9,
        });
        //AddLiveStreamIcon
        utilsArr.unshift(topBarButtonTypes.ADD_LIVE_STREAM);
        mobileIconArr.unshift({
          buttonType: topBarButtonTypes.ADD_LIVE_STREAM,
          priority: 8,
        });
      }

      if (participantCanToggleLivestream && !liveStreamEnabled) {
      }

      if (utilsArr.length) {
        arr.unshift(utilsArr);
      }

      //sorting mobile icon
      mobileIconArr
        .sort((iconA, iconB) => iconA.priority - iconB.priority)
        .map((icon) => icon.buttonType);
      
        
      const firstFourElements = mobileIconArr.slice(0, 4);
      

      const excludeFirstFourElements = mobileIconArr.slice(4);

      return {
        topBarIcons: arr,
        mobileIcons: mobileIconArr,
        firstFourElements,
        excludeFirstFourElements,
      };
    }, [
      participantCanToggleSelfMic,
      participantCanToggleSelfWebcam,
      screenShareEnabled,
      pollEnabled,
      whiteboardEnabled,
      chatEnabled,
      raiseHandEnabled,
      topBarButtonTypes,
      recordingEnabled,
      meetingMode,
  ]);

  const [topBarVisible, setTopBarVisible] = useState(false);

  // let clockParticipants = localStorage.getItem('clockParticipants');

  useEffect(() => {
    setTimeout(() => {
      setTopBarVisible(true);
    }, 100);
  }, []);


  const mMeeting = useMeeting();

  const participants = mMeeting?.participants;
  let participantsLength = participants.size
  return isTab || isMobile ? (
    <>
      <Box
        style={{
          height: topBarHeight,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: theme.palette.background.default,
        }}
      >
        {firstFourElements.map((icon, i) => {
          return (
            <Box key={`topbar_controls_j_${i}`} ml={i === 0 ? 0 : 1.5}>
              {icon.buttonType === topBarButtonTypes.RAISE_HAND ? (
                <RaiseHandBTN />
              ) : icon.buttonType === topBarButtonTypes.MIC ? (
                <MicBTN />
              ) : icon.buttonType === topBarButtonTypes.WEBCAM ? (
                <WebcamBTN />
              ) : icon.buttonType === topBarButtonTypes.SCREEN_SHARE ? (
                <ScreenShareBTN />)
              // ) : icon.buttonType === topBarButtonTypes.PARTICIPANTS ? (
              //   <ParticipantsBTN />
              : icon.buttonType === topBarButtonTypes.PIP && paramKeys['iscaller']==='true' ? (
                <PipBTN />
              ) : icon.buttonType === topBarButtonTypes.CHAT ? (
                <ChatBTN />
               ) : icon.buttonType === topBarButtonTypes.END_CALL ? (
                <EndCallBTN />
              ) : icon.buttonType === topBarButtonTypes.RECORDING ? (
                <RecordingBTN />
              ) : icon.buttonType === topBarButtonTypes.RATE ? (
                <RateBTN />
              ) : icon.buttonType === topBarButtonTypes.HLS ? (
                <HlsBTN />
              ) : icon.buttonType === topBarButtonTypes.GO_LIVE ? (
                <GoLiveBTN />
              // ) : icon.buttonType === topBarButtonTypes.WHITEBOARD ? (
              //   <WhiteBoardBTN />
              ) : icon.buttonType === topBarButtonTypes.ADD_LIVE_STREAM ? (
                <AddLiveStreamBTN />
              ) : icon.buttonType === topBarButtonTypes.CONFIGURATION ? (
                <ConfigBTN />
              ) : null}
            </Box>
          );
        })}

        {excludeFirstFourElements.length >= 1 && (
          <Box ml={2}>
            <OutlineIconButton
              Icon={MoreHorizIcon}
              // Icon={Boolean(anchorEl) ? CloseIcon : MoreHorizIcon}
              // isFocused={anchorEl}
              onClick={handleClickFAB}
            />
          </Box>
        )}

        <SwipeableDrawer
          anchor={"bottom"}
          open={Boolean(open)}
          onClose={handleCloseFAB}
          onOpen={handleClickFAB}
          style={{ paddingBottom: "100px" }}
        >
          <Grid container>
            {excludeFirstFourElements.map((icon, i) => {
              return (
                <Grid
                  item
                  xs={4}
                  sm={3}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {icon.buttonType === topBarButtonTypes.RAISE_HAND ? (
                    <RaiseHandBTN
                      onClick={handleCloseFAB}
                      isMobile={isMobile}
                      isTab={isTab}
                    />
                  ) : icon.buttonType === topBarButtonTypes.MIC ? (
                    <MicBTN
                      onClick={handleCloseFAB}
                      isMobile={isMobile}
                      isTab={isTab}
                    />
                  ) : icon.buttonType === topBarButtonTypes.WEBCAM ? (
                    <WebcamBTN
                      onClick={handleCloseFAB}
                      isMobile={isMobile}
                      isTab={isTab}
                    />
                  ) : icon.buttonType === topBarButtonTypes.SCREEN_SHARE ? (
                    <ScreenShareBTN
                      onClick={handleCloseFAB}
                      isMobile={isMobile}
                      isTab={isTab}
                    />
                  // ) : icon.buttonType === topBarButtonTypes.PARTICIPANTS ? (
                  //   <ParticipantsBTN
                  //     onClick={handleCloseFAB}
                  //     isMobile={isMobile}
                  //     isTab={isTab}
                  //   />
                  ) : icon.buttonType === topBarButtonTypes.CHAT ? (
                    <ChatBTN
                      onClick={handleCloseFAB}
                      isMobile={isMobile}
                      isTab={isTab}
                    />
                    )
                    : icon.buttonType === topBarButtonTypes.PIP && paramKeys['iscaller']==='true' ? (
                        <PipBTN
                          isMobile={isMobile}
                          isTab={isTab}
                         />
                  ) : icon.buttonType === topBarButtonTypes.END_CALL ? (
                    <EndCallBTN
                      onClick={handleCloseFAB}
                      isMobile={isMobile}
                      isTab={isTab}
                    />
                  ) : icon.buttonType === topBarButtonTypes.RECORDING ? (
                    <RecordingBTN
                      onClick={handleCloseFAB}
                      isMobile={isMobile}
                      isTab={isTab}
                    />
                  ) : icon.buttonType === topBarButtonTypes.RATE ? (
                    <RateBTN
                      onClick={rateCall}
                      isMobile={isMobile}
                      isTab={isTab}
                    />
                  ) : icon.buttonType === topBarButtonTypes.HLS ? (
                    <HlsBTN
                      onClick={handleCloseFAB}
                      isMobile={isMobile}
                      isTab={isTab}
                    />
                  ) : icon.buttonType === topBarButtonTypes.GO_LIVE ? (
                    <GoLiveBTN
                      onClick={handleCloseFAB}
                      isMobile={isMobile}
                      isTab={isTab}
                    />
                  // ) : icon.buttonType === topBarButtonTypes.WHITEBOARD ? (
                  //   <WhiteBoardBTN
                  //     onClick={handleCloseFAB}
                  //     isMobile={isMobile}
                  //     isTab={isTab}
                  //   />
                  ) : icon.buttonType === topBarButtonTypes.ADD_LIVE_STREAM ? (
                    <AddLiveStreamBTN
                      onClick={handleCloseFAB}
                      isMobile={isMobile}
                      isTab={isTab}
                    />
                  ) : icon.buttonType === topBarButtonTypes.CONFIGURATION ? (
                    <ConfigBTN
                      onClick={handleCloseFAB}
                      isMobile={isMobile}
                      isTab={isTab}
                    />
                  ) : null}
                </Grid>
              );
            })}
          </Grid>
        </SwipeableDrawer>
      </Box>
      {/* <Modal
        open={meetinTwoMinWorning}
        onClose={closeTMeeting}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Rating
          </Typography>
          <hr />
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            Your Rating Saved Successfully
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            Clck OK to close
          </Typography>
          <Button 
            style={{
              corsur: 
              'pointer', 
              marginTop: '15px', 
              backgroundColor: '#101019'
            }}
            onClick={(e) => closeTMeeting(e) }
          >OK</Button>
        </Box>
      </Modal> */}
    </>
  ) : (
    <>
    <Box
      style={{
        height: topBarHeight,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: theme.palette.background.default,
        borderBottom: "1px solid #ffffff33",
        position: "relative",
        top: topBarVisible ? 0 : -topBarHeight,
        transition: `all ${400 * (animationsEnabled ? 1 : 0.5)}ms`,
        transitionTimingFunction: "ease-in-out",
      }}
    >
      <Box
        style={{
          display: "flex",
          height: topBarHeight,
          paddingLeft: theme.spacing(2),
          position: "relative",
          alignItems: "center",
        }}
      >

        {(participantsLength>1 && clockTime) ?<CountDownTimer hoursMinSecs={hoursMinSec} participantsLength={()=>callParticipant(participantsLength)} />:''}
        {brandingEnabled && (
          <>
            <img
              alt={"App Logo"}
              style={{
                display: "inline-block",
                height: topBarHeight - theme.spacing(2),
              }}
              src={
                defaultBrandLogoUrl ||
                brandLogoURL ||
                `https://static.videosdk.live/prebuilt/videosdk_logo_circle.png`
              }
              onError={() => {
                setDefaultBrandLogoUrl(
                  `https://static.videosdk.live/prebuilt/videosdk_logo_circle.png`
                );
              }}
            />
            <Box
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}
              ml={1}
            >
              
              <Typography
                style={{
                  fontSize: "1.2rem",
                  fontWeight: "600",
                }}
              >
                {brandName}
              </Typography>
              {poweredBy ? (
                <Typography
                  style={{
                    fontSize: "0.9rem",
                    wordBreak: "break-all",
                    display: "flex",
                    alignItems: "center",
                  }}
                  color={"textSecondary"}
                >
                  Powered by&nbsp;
                  <Link
                    style={{ textDecorationColor: "#fa3a57" }}
                    target={"_blank"}
                    href={"https://videosdk.live"}
                  >
                    <Typography
                      style={{
                        color: "#fa3a57",
                        textTransform: "lowercase",
                        fontSize: "0.9rem",
                      }}
                    >
                      videosdk.live
                    </Typography>
                  </Link>
                </Typography>
              ) : null}
            </Box>
          </>
        )}
      </Box>

      <Box className={classes.row} p={2}>
        {topBarIcons.map((row, i) => {
          return (
            <React.Fragment key={`topbar_controls_i_${i}`}>
              {i !== 0 && (
                <Box
                  style={{
                    backgroundColor: "#ffffff33",
                    width: 1,
                    height: topBarHeight - theme.spacing(1.5),
                    flex: 1,
                  }}
                />
              )}
              <Box
                ml={i === 0 ? 0 : 3}
                mr={i === topBarIcons.length - 1 ? 0 : 3}
                className={classes.row}
              >
                {row.map((buttonType, j) => {
                  return (
                    <Box key={`topbar_controls_j_${j}`} ml={j === 0 ? 0 : 1.5}>
                      {buttonType === topBarButtonTypes.RAISE_HAND ? (
                        <RaiseHandBTN />
                      ) : buttonType === topBarButtonTypes.MIC ? (
                        <MicBTN />
                      ) : buttonType === topBarButtonTypes.WEBCAM ? (
                        <WebcamBTN />
                      ) : buttonType === topBarButtonTypes.SCREEN_SHARE ? (
                        <ScreenShareBTN />
                      // ) : buttonType === topBarButtonTypes.PARTICIPANTS ? (
                      //   <ParticipantsBTN />
                      )
                      : buttonType === topBarButtonTypes.CHAT ? ( 
                          <ChatBTN />
                      // ) : buttonType === topBarButtonTypes.ACTIVITIES ? (
                      //   <ActivitiesBTN />
                      ) : buttonType === topBarButtonTypes.END_CALL ? (
                        <EndCallBTN />
                      ) : buttonType === topBarButtonTypes.PIP && paramKeys['iscaller']==='true' ? (
                        <PipBTN />
                      ) : buttonType === topBarButtonTypes.RECORDING ? (
                        <RecordingBTN />
                      ) : buttonType === topBarButtonTypes.RATE ? (
                        <RateBTN />
                      ) : buttonType === topBarButtonTypes.HLS ? (
                        <HlsBTN />
                      ) : buttonType === topBarButtonTypes.GO_LIVE ? (
                        <GoLiveBTN />
                      // ) : buttonType === topBarButtonTypes.WHITEBOARD ? (
                      //   <WhiteBoardBTN />
                      ) : buttonType === topBarButtonTypes.ADD_LIVE_STREAM ? (
                        <AddLiveStreamBTN />
                      ) : buttonType === topBarButtonTypes.CONFIGURATION ? (
                        <ConfigBTN />
                      ) : null}
                    </Box>
                  );
                })}
              </Box>
            </React.Fragment>
          );
        })}
      </Box>
    </Box>
    {/* <Modal
      open={meetinTwoMinWorning}
      onClose={closeTMeeting}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <Typography id="modal-modal-title" variant="h6" component="h2">
          Rating
        </Typography>
        <hr />
        <Typography id="modal-modal-description" sx={{ mt: 2 }}>
          Your Rating Saved Successfully
        </Typography>
        <Typography id="modal-modal-description" sx={{ mt: 2 }}>
          Clck OK to close
        </Typography>
        <Button 
          style={{
            corsur: 
            'pointer', 
            marginTop: '15px', 
            backgroundColor: '#101019'
          }}
          onClick={(e) => closeTMeeting(e) }
        >OK</Button>
      </Box>
    </Modal> */}
</>
  );
};

export default TopBar;