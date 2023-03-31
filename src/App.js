import React, { useEffect, useMemo, useState } from "react";
import MeetingContainer from "./meetingContainer/MeetingContainer";
import { MeetingProvider,useMeeting } from "@videosdk.live/react-sdk";
import {
  MeetingAppProvider,
  meetingLayoutPriorities,
  meetingLayouts,
  meetingLayoutTopics,
  useMeetingAppContext,
} from "./MeetingAppContextDef";
import JoinMeeting from "./components/JoinScreen";
import ClickAnywhereToContinue from "./components/ClickAnywhereToContinue";
import { Box, CircularProgress, Button, Typography, Modal } from "@material-ui/core";
import { useTheme } from "@material-ui/core/styles";
import MeetingLeftScreen from "./components/MeetingLeftScreen";
import ConfirmBox from "./components/ConfirmBox";
import {
  maxParticipantGridCount_large_desktop,
  maxParticipantGridCount_desktop,
  maxParticipantGridCount_tab,
  maxParticipantGridCount_mobile,
} from "./utils/common";
import useIsSMDesktop from "./utils/useIsSMDesktop";
import useIsLGDesktop from "./utils/useIsLGDesktop";
import useIsTab from "./utils/useIsTab";
import { version as prebuiltSDKVersion } from "../package.json";
import { meetingModes } from "./CONSTS";

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
const App = () => {  
  
   //const {mainViewParticipants} = useMeetingAppContext();

   //let mainParticipants = [...mainViewParticipants];

   //console.log('mainParticipants',mainViewParticipants)
   
  const[backgroundBlur,setBackgroundBlur] = useState(false);
  const[participantsTotal,setParticipantsTotal] = useState(1);
  
  // const pname = paramKeys.pname;

  if(backgroundBlur){
    document.getElementById('root').style.filter = 'blur(10px)';
  }
  
  const [meetingIdValidation, setMeetingIdValidation] = useState({
    isLoading: true,
    meetingId: null,
    reqError: null,
    reqStatusCode: null,
  });

  const [meetingError, setMeetingError] = useState({
    message: null,
    code: null,
    isVisible: false,
  });

  const [meetingLeft, setMeetingLeft] = useState(false);

  useEffect(()=>{
     if(participantsTotal && participantsTotal>1){
          getMeetingData();
          const endMeet = closeMeetingAfterTimerEnd();
     }
  },[participantsTotal])
  

  const playNotificationErr = async () => {
    const errAudio = new Audio(
      `https://static.videosdk.live/prebuilt/notification_err.mp3`
    );

    await errAudio.play();
  };

  const getParams = ({ maxGridSize }) => {
    const location = window.location;

    const urlParams = new URLSearchParams(location.search);

    const paramKeys = {
      token: "token",
      a_token: 'a_token',
      user_id: 'user_id',
      ptype: 'ptype',
      pname: 'pname',
      start_time : "start_time",
      end_time : "end_time",
      date : "date",
      micEnabled: "micEnabled",
      webcamEnabled: "webcamEnabled",
      name: "name",
      meetingId: "meetingId",
      redirectOnLeave: "redirectOnLeave",
      chatEnabled: "chatEnabled",
      screenShareEnabled: "screenShareEnabled",
      pollEnabled: "pollEnabled",
      whiteboardEnabled: "whiteboardEnabled",
      raiseHandEnabled: "raiseHandEnabled",
      //
      participantCanToggleSelfWebcam: "participantCanToggleSelfWebcam",
      participantCanToggleSelfMic: "participantCanToggleSelfMic",
      participantCanToggleRecording: "participantCanToggleRecording",
      participantCanLeave: "participantCanLeave",
      participantCanToggleOtherWebcam: "participantCanToggleOtherWebcam",
      participantCanToggleOtherMic: "participantCanToggleOtherMic",
      partcipantCanToogleOtherScreenShare:"partcipantCanToogleOtherScreenShare",
      participantCanToggleOtherMode: "participantCanToggleOtherMode",
      participantCanToggleLivestream: "participantCanToggleLivestream",
      participantCanEndMeeting: "participantCanEndMeeting",
      participantCanToggleHls: "participantCanToggleHls",
      //
      recordingEnabled: "recordingEnabled",
      recordingWebhookUrl: "recordingWebhookUrl",
      recordingAWSDirPath: "recordingAWSDirPath",
      autoStartRecording: "autoStartRecording",
      //
      brandingEnabled: "brandingEnabled",
      brandLogoURL: "brandLogoURL",
      brandName: "brandName",
      poweredBy: "poweredBy",
      //
      liveStreamEnabled: "liveStreamEnabled",
      autoStartLiveStream: "autoStartLiveStream",
      liveStreamOutputs: "liveStreamOutputs",
      //
      askJoin: "askJoin",
      //
      joinScreenEnabled: "joinScreenEnabled",
      joinScreenMeetingUrl: "joinScreenMeetingUrl",
      joinScreenTitle: "joinScreenTitle",
      //
      notificationSoundEnabled: "notificationSoundEnabled",
      canPin: "canPin",
      canRemoveOtherParticipant: "canRemoveOtherParticipant",
      canDrawOnWhiteboard: "canDrawOnWhiteboard",
      canToggleWhiteboard: "canToggleWhiteboard",
      canCreatePoll: "canCreatePoll",
      //
      leftScreenActionButtonLabel: "leftScreenActionButtonLabel",
      leftScreenActionButtonHref: "leftScreenActionButtonHref",
      leftScreenRejoinButtonEnabled: "leftScreenRejoinButtonEnabled",
      //
      maxResolution: "maxResolution",
      animationsEnabled: "animationsEnabled",
      topbarEnabled: "topbarEnabled",
      notificationAlertsEnabled: "notificationAlertsEnabled",
      debug: "debug",
      participantId: "participantId",
      //
      layoutType: "layoutType",
      layoutGridSize: "layoutGridSize",
      layoutPriority: "layoutPriority",
      meetingLayoutTopic: "meetingLayoutTopic",
      //
      isRecorder: "isRecorder",
      hideLocalParticipant: "hideLocalParticipant",
      alwaysShowOverlay: "alwaysShowOverlay",
      sideStackSize: "sideStackSize",
      reduceEdgeSpacing: "reduceEdgeSpacing",
      joinWithoutUserInteraction: "joinWithoutUserInteraction",
      rawUserAgent: "rawUserAgent",
      canChangeLayout: "canChangeLayout",
      region: "region",
      preferredProtocol: "preferredProtocol",
      //
      mode: "mode",
      //
      hlsEnabled: "hlsEnabled",
      autoStartHls: "autoStartHls",
      hlsPlayerControlsVisible: "hlsPlayerControlsVisible",
      //
      // liveStreamLayoutType: "liveStreamLayoutType",
      // liveStreamLayoutPriority: "liveStreamLayoutPriority",
      // liveStreamLayoutGridSize: "liveStreamLayoutGridSize",
      // recordingLayoutType: "recordingLayoutType",
      // recordingLayoutPriority: "recordingLayoutPriority",
      // recordingLayoutGridSize: "recordingLayoutGridSize",

      maintainVideoAspectRatio: "maintainVideoAspectRatio",
      networkBarEnabled: "networkBarEnabled",
    };

    Object.keys(paramKeys).forEach((key) => {
      paramKeys[key] = urlParams.get(key)
        ? decodeURIComponent(urlParams.get(key))
        : null;
    });

    // required options
    let configErr;

  
    /*if (typeof paramKeys.token !== "string") {
      configErr = `"token" not provided`;
      playNotificationErr();
      setMeetingError({ message: configErr, code: 4001, isVisible: true });
      //
      // throw new Error(configErr);
    }
    if (typeof paramKeys.meetingId !== "string") {
      configErr = `"meetingId" not provided`;
      playNotificationErr();
      setMeetingError({ message: configErr, code: 4001, isVisible: true });
      //
      // throw new Error(configErr);
    }*/
    /* if (typeof paramKeys.name !== "string") {
      if (paramKeys.joinScreenEnabled !== "true") {
        configErr = `"name" not provided when joinScreen is disabled`;
        playNotificationErr();
        setMeetingError({ message: configErr, code: 4001, isVisible: true });
        //
        // throw new Error(configErr);
      }
    } */

    // default options

    if (typeof paramKeys.micEnabled !== "string") {
      paramKeys.micEnabled = "true";
    }
    if (typeof paramKeys.webcamEnabled !== "string") {
      paramKeys.webcamEnabled = "true";
    }
    if (typeof paramKeys.chatEnabled !== "string") {
      paramKeys.chatEnabled = "true";
    }
    if (typeof paramKeys.screenShareEnabled !== "string") {
      paramKeys.screenShareEnabled = "true";
    }
    if (typeof paramKeys.pollEnabled !== "string") {
      paramKeys.pollEnabled = "true";
    }
    if (typeof paramKeys.whiteboardEnabled !== "string") {
      paramKeys.whiteboardEnabled = "true";
    }
    if (typeof paramKeys.participantCanToggleSelfWebcam !== "string") {
      paramKeys.participantCanToggleSelfWebcam = "true";
    }
    if (typeof paramKeys.participantCanToggleSelfMic !== "string") {
      paramKeys.participantCanToggleSelfMic = "true";
    }
    if (typeof paramKeys.raiseHandEnabled !== "string") {
      paramKeys.raiseHandEnabled = "true";
    }
    if (typeof paramKeys.recordingEnabled !== "string") {
      paramKeys.recordingEnabled = "true";
    }
    if (typeof paramKeys.hlsEnabled !== "string") {
      paramKeys.hlsEnabled = "false";
    }
    if (typeof paramKeys.poweredBy !== "string") {
      paramKeys.poweredBy = "true";
    }
    if (typeof paramKeys.liveStreamEnabled !== "string") {
      paramKeys.liveStreamEnabled = "false";
    }
    if (typeof paramKeys.autoStartLiveStream !== "string") {
      paramKeys.autoStartLiveStream = "false";
    }
    if (typeof paramKeys.participantCanToggleLivestream !== "string") {
      paramKeys.participantCanToggleLivestream = "false";
    }

    if (typeof paramKeys.canCreatePoll !== "string") {
      paramKeys.canCreatePoll = "false";
    }

    if (paramKeys.autoStartLiveStream === "true") {
      try {
        paramKeys.liveStreamOutputs = JSON.parse(paramKeys.liveStreamOutputs);
        if (
          paramKeys.liveStreamOutputs === null ||
          !paramKeys.liveStreamOutputs.length
        ) {
          paramKeys.liveStreamOutputs = [];
        }
      } catch (err) {
        paramKeys.liveStreamOutputs = [];
      }
    }

    if (typeof paramKeys.joinScreenEnabled !== "string") {
      paramKeys.joinScreenEnabled = "true";
    }

    if (
      paramKeys.joinScreenMeetingUrl === null ||
      !paramKeys.joinScreenMeetingUrl.length
    ) {
      paramKeys.joinScreenMeetingUrl = "";
    }

    if (
      paramKeys.joinScreenTitle === null ||
      !paramKeys.joinScreenTitle.length
    ) {
      paramKeys.joinScreenTitle = "";
    }

    if (typeof paramKeys.notificationSoundEnabled !== "string") {
      paramKeys.notificationSoundEnabled = "true";
    }

    if (typeof paramKeys.maintainVideoAspectRatio !== "string") {
      paramKeys.maintainVideoAspectRatio = "false";
    }

    if (typeof paramKeys.networkBarEnabled !== "string") {
      paramKeys.networkBarEnabled = "true";
    }

    if (typeof paramKeys.canPin !== "string") {
      paramKeys.canPin = "false";
    }

    switch (paramKeys?.layoutType?.toUpperCase()) {
      case meetingLayouts.GRID:
      case meetingLayouts.SPOTLIGHT:
      case meetingLayouts.SIDEBAR:
        paramKeys.layoutType = paramKeys.layoutType.toUpperCase();
        break;
      default:
        paramKeys.layoutType = meetingLayouts.GRID;
        break;
    }

    switch (paramKeys.layoutPriority?.toUpperCase()) {
      case meetingLayoutPriorities.PIN:
      case meetingLayoutPriorities.SPEAKER:
        paramKeys.layoutPriority = paramKeys.layoutPriority.toUpperCase();
        break;
      default:
        paramKeys.layoutPriority = meetingLayoutPriorities.SPEAKER;
        break;
    }

    paramKeys.layoutGridSize = parseInt(paramKeys.layoutGridSize);

    if (paramKeys.layoutGridSize <= 0 || isNaN(paramKeys.layoutGridSize)) {
      paramKeys.layoutGridSize = maxGridSize;
    }

    if (paramKeys.isRecorder === "true") {
      paramKeys.micEnabled = "false";
      paramKeys.webcamEnabled = "false";
      paramKeys.hideLocalParticipant = "true";
      paramKeys.alwaysShowOverlay = "true";
      paramKeys.sideStackSize = "5";
      paramKeys.reduceEdgeSpacing = "true";
      paramKeys.topbarEnabled = "false";
      paramKeys.notificationSoundEnabled = "false";
      paramKeys.notificationAlertsEnabled = "false";
      paramKeys.animationsEnabled = "false";
      paramKeys.redirectOnLeave = undefined;
    }

    paramKeys.sideStackSize = parseInt(paramKeys.sideStackSize);

    if (
      typeof paramKeys.sideStackSize === "number" &&
      paramKeys.sideStackSize <= 0
    ) {
      configErr = `"sideStackSize" is not a valid number`;
      playNotificationErr();
      setMeetingError({ message: configErr, code: 4001, isVisible: true });
    }

    // validate meetingLayoutTopic here
    switch (paramKeys.meetingLayoutTopic?.toUpperCase()) {
      case meetingLayoutTopics.MEETING_LAYOUT:
      case meetingLayoutTopics.RECORDING_LAYOUT:
      case meetingLayoutTopics.LIVE_STREAM_LAYOUT:
      case meetingLayoutTopics.HLS_LAYOUT:
        paramKeys.meetingLayoutTopic =
          paramKeys.meetingLayoutTopic.toUpperCase();
        break;
      default:
        paramKeys.meetingLayoutTopic = meetingLayoutTopics.MEETING_LAYOUT;
        break;
    }

    if (!paramKeys.region || typeof paramKeys.region !== "string") {
      paramKeys.region = "sg001";
    }

    if (typeof paramKeys.preferredProtocol !== "string") {
      paramKeys.preferredProtocol = "UDP_ONLY";
    }

    switch (paramKeys.preferredProtocol.toUpperCase()) {
      case "UDP_ONLY":
      case "UDP_OVER_TCP":
        paramKeys.preferredProtocol = paramKeys.preferredProtocol.toUpperCase();
        break;
      default:
        paramKeys.preferredProtocol = "UDP_ONLY";
        break;
    }

    if (typeof paramKeys.mode !== "string") {
      paramKeys.mode = meetingModes.CONFERENCE;
    }

    switch (paramKeys.mode.toUpperCase()) {
      case meetingModes.CONFERENCE:
      case meetingModes.VIEWER:
        paramKeys.mode = paramKeys.mode.toUpperCase();
        break;
      default:
        paramKeys.mode = meetingModes.CONFERENCE;
        break;
    }

    return paramKeys;
  };

  const isLGDesktop = useIsLGDesktop();
  const isSMDesktop = useIsSMDesktop();
  const isTab = useIsTab();

  const maxGridSize = useMemo(() => {
    return isLGDesktop
      ? maxParticipantGridCount_large_desktop
      : isSMDesktop
      ? maxParticipantGridCount_desktop
      : isTab
      ? maxParticipantGridCount_tab
      : maxParticipantGridCount_mobile;
  }, [isLGDesktop, isSMDesktop, isTab]);

  const paramKeys = useMemo(() => getParams({ maxGridSize }), [maxGridSize]);

  const [userHasInteracted, setUserHasInteracted] = useState(
    paramKeys.joinWithoutUserInteraction === "true"
  );

  const [joinDisable, setJoinDisable] = useState(true);
  
  // timing 
  const [meetingData, setMeetingData] = useState({});
  const [meetinEndModal, setMeetinEndModal] = useState(false);
  const [meetinEndModalHead, setMeetinEndModalHead] = useState('');
  const [meetinEndModalBody, setMeetinEndModalBody] = useState('');
  const [meetinTwoMinWorning, setMeetinTwoMinWorning] = useState(false);
  const [clockTime,setClockTime]=useState(30);
  const mMeeting = useMeeting({});
  const end = mMeeting?.end;

  // const participants = mMeeting.participants;
  // console.log('participants',mMeeting)


   var xmlHttp;
  const srvTime=()=>{
      try {
          //FF, Opera, Safari, Chrome
          xmlHttp = new XMLHttpRequest();
      }
      catch (err1) {
          //IE
          try {
              xmlHttp = new window.ActiveXObject('Msxml2.XMLHTTP');
          }
          catch (err2) {
              try {
                  xmlHttp = new window.ActiveXObject('Microsoft.XMLHTTP');
              }
              catch (eerr3) {
                  //AJAX not supported, use CPU time.
                  alert("AJAX not supported");
              }
          }
      }
      xmlHttp.open('HEAD',window.location.href.toString(),false);
      xmlHttp.setRequestHeader("Content-Type", "text/html");
      xmlHttp.send('');
      return xmlHttp.getResponseHeader("Date");
  }
   var servertime = srvTime();

  const getMeetingData = async () => {

    const auth_token = paramKeys.a_token;
    const user_id = paramKeys.user_id;
    const pname = paramKeys.pname;
    const ptype = paramKeys.ptype;
    
    // const meetingTimingDetails = await fetch('http://localhost:8080/get-token?u_token=123', { 
    const meetingTimingDetails = await fetch('https://www.gosee.expert/api/validdatetime/'+auth_token, {
      method: "GET",
      headers: { "Content-type": "application/json" },
    });
    
    const mdata = await meetingTimingDetails.json();
    // console.log('mdata',mdata)
    if(mdata.status){

      setMeetingData(mdata.values);
      const records=mdata.values;
      
      var startTime = records.start_at;
      var endTime = records.end_at;
      var urlDate = records.call_date;
      if(records.call_start_time){
              var oldTime=new Date(records.call_start_time*1000); 
              var newTime=new Date(servertime); 
              var newTimeToSet=newTime.getHours() * 60 + newTime.getMinutes();
              var startTimeSave = oldTime.getHours() * 60 + oldTime.getMinutes(); 
              var lastTimeSave = oldTime.getHours() * 60 + ((oldTime.getMinutes())+30);
             console.log("oldTime="+oldTime+",lastTimeSave time","="+lastTimeSave+" ,old start time ="+startTimeSave + ",newtimeslot=" + newTimeToSet)
           
              if(newTimeToSet <= lastTimeSave){
                var clockTimeData=lastTimeSave-newTimeToSet;
                setClockTime(clockTimeData);
                localStorage.setItem('startTimeSave',startTimeSave)
                localStorage.setItem('lastTimeSave',lastTimeSave)
              }
      }else{
        localStorage.removeItem('startTimeSave');
        localStorage.removeItem('lastTimeSave');
      }
      const ud = urlDate.split('/'); 
      const udDate = ud[0];
      const udMonth = ud[1];
      const udYear = ud[2];
  
      var currentTime = new Date();  //current Date that gives us current Time also  var startTime = '03:30:20';
  
      const curr_date = currentTime.toLocaleDateString('es-CL');
      const curr_date_split = curr_date.split('-'); 
      const currDate = curr_date_split[0];
      const currMonth = curr_date_split[1];
      const currYear = curr_date_split[2];
  
      var s =  startTime.split(':');
      
      var mStartTime = new Date(currentTime.getFullYear(), currentTime.getMonth(), currentTime.getDate(),
      parseInt(s[0]), parseInt(s[1]));
      var e =  endTime.split(':');
      var mEndTime = new Date(currentTime.getFullYear(), currentTime.getMonth(),
      currentTime.getDate(),parseInt(e[0]), parseInt(e[1]));

      

      if (udYear === currYear) {        
        if (udMonth === currMonth) {
          if (udDate === currDate) {
            // if (currentTime >= mStartTime) {  //checking start time with current time
              // if (currentTime <= mEndTime) { //checking end time with current time
                const convUrlDate = `${udMonth}/${udDate}/${udYear}`;

              
                
                  // const getItemKey = localStorage.getItem('itemKey')
                  // if(getItemKey){
                  //   localStorage.setItem('itemKey',2)
                  // }else{
                  //   localStorage.setItem('itemKey',1)
                  //   getItemKey=1
                  // }
                  // if(getItemKey===2){
                    
                  // }
                
                
              // } 
              // else {
              //   setMeetinEndModalHead('Join on wrong meeting time');
              //   setMeetinEndModalBody('Please Join at the Schedule Time');
              //   setUserHasInteracted(false);
              //   setJoinDisable(false);
              //   setMeetinEndModal(true);
              //   setBackgroundBlur(true);
              // }
            // } else {
            //   setMeetinEndModalHead('Join on wrong meeting time');
            //   setMeetinEndModalBody('Please Join at the Schedule Time');
            //   setUserHasInteracted(false);
            //   setJoinDisable(false);
            //   setMeetinEndModal(true);
            //   setBackgroundBlur(true);
            // }
          } else {
            setMeetinEndModalHead('Join on wrong meeting time');
            setMeetinEndModalBody('Please Join at the Schedule Time');
            setUserHasInteracted(false);
            setJoinDisable(false);
            setMeetinEndModal(true);
            setBackgroundBlur(true);
          }
        } else {
          setMeetinEndModalHead('Join on wrong meeting time');
          setMeetinEndModalBody('Please Join at the Schedule Time');
          setUserHasInteracted(false);
          setJoinDisable(false);
          setMeetinEndModal(true);
          setBackgroundBlur(true);
        }
      } else {
        setMeetinEndModalHead('Join on wrong meeting time');
        setMeetinEndModalBody('Please Join at the Schedule Time');
        setUserHasInteracted(false);
        setJoinDisable(false);
        setMeetinEndModal(true);
        setBackgroundBlur(true);
      }      
    }
    return mdata;
  }

  useEffect( () => {
    const endM = getMeetingData();
    return () =>{ setUserHasInteracted(''); setJoinDisable(''); }   
  },[paramKeys]);

  useEffect( () => {
    return () =>{ localStorage.removeItem('itemKey') }   
  },[]);

  /*useEffect(() => {  
    return async () => {  
      const auth_token = paramKeys.a_token;
      const meetingTimingDetails = await fetch('https://www.gosee.expert/api/videocallrating/'+auth_token, {
        method: "GET",
        headers: { "Content-type": "application/json" },
      });  
    };
  }, []);*/

  // const endMeeting = (date, sTime, eTime, currentTime) => {
    const endMeeting = (date, sTime, eTime, currentTime) => {

    // const currentTimeDiff = new Date(date+" " + eTime) - new Date(date+" " + currentTime);
    // var meetingDuration = Math.floor((currentTimeDiff/60)/1000);
    // var endMin = (meetingDuration * 60) * 1000;
    // var twoMinEarly = (meetingDuration - 2) * (60 * 1000);

    // console.log('meetingDuration',meetingDuration)
    // console.log('endMin',endMin)
    // console.log('twoMinEarly',twoMinEarly)

    var thirtyMinute = 30
    var endMin = (thirtyMinute * 60) * 1000;
    var twoMinEarly = (thirtyMinute - 2) * (60 * 1000);

    setTimeout(() => {
      setMeetinTwoMinWorning(true);
    }, twoMinEarly);
    
    setTimeout( async () => {
      setMeetinEndModalHead('Meeting is over');
      setMeetinEndModalBody('Thanks for joining');
      setMeetinEndModal(true);
      setBackgroundBlur(true);
      localStorage.removeItem('clockParticipants')
      
      return end;
    }, endMin);

  }
  
  const closeMeetingAfterTimerEnd = async (e) => {
    var thirtyMinute = clockTime;
    console.log("thirtyMinute",thirtyMinute)
    if(thirtyMinute){
    console.log("notification time",thirtyMinute)
    var endMin = (thirtyMinute * 60) * 1000;
    var twoMinEarly = (thirtyMinute - 2) * (60 * 1000);

    setTimeout(() => {
      setMeetinTwoMinWorning(true);
    }, twoMinEarly);
    console.log("endmin",endMin);
    setTimeout( async () => {
      let path = `https://www.gosee.expert/`;
      window.location.href = path;
      localStorage.removeItem('clockParticipants')
    }, endMin);
   }
  }

  const closeMeeting = async (e) => {
    
    let path = `https://www.gosee.expert/`;
    window.location.href = path;
  }
  
  /*const rateCall = async (e) => {

    // alert(paramKeys.user_id);
    // alert(paramKeys.a_token);
    let path = ` https://www.gosee.expert/api/videocallrating/`+paramKeys.a_token+'/'+paramKeys.user_id;

    const rateCallStatus = await fetch(path, {
      method: "GET",
      headers: { "Content-type": "application/json" },
    });

    if (rateCallStatus) {
      setMeetinEndModalHead('Rating');
      setMeetinEndModalBody('Rating Submitted Successfully');
      setUserHasInteracted(false);
      setJoinDisable(false);
      setMeetinEndModal(true);
      setBackgroundBlur(true);
    }
    
    // window.location.href = path;
  }*/

  const closeTMeeting = () => {
    setMeetinTwoMinWorning(false);
  }
  // end timing

  const [name, setName] = useState(paramKeys.name || "");
  const [joinScreenWebCam, setJoinScreenWebCam] = useState(
    paramKeys.joinScreenEnabled === "true"
      ? paramKeys.participantCanToggleSelfWebcam === "true" &&
          paramKeys.webcamEnabled === "true"
      : paramKeys.webcamEnabled === "true"
  );

  const [joinScreenMic, setJoinScreenMic] = useState(
    paramKeys.joinScreenEnabled === "true"
      ? paramKeys.participantCanToggleSelfMic === "true" &&
          paramKeys.micEnabled === "true"
      : paramKeys.micEnabled === "true"
  );
  const [selectedMic, setSelectedMic] = useState({ id: null });
  const [selectedWebcam, setSelectedWebcam] = useState({ id: null });

  const validateMeetingId = async ({ meetingId, token, debug, region }) => {
    const BASE_URL = "https://api.videosdk.live";

    const urlMeetingId = `${BASE_URL}/v1/prebuilt/meetings/${meetingId}`;

    const resMeetingId = await fetch(urlMeetingId, {
      method: "POST",
      headers: { "Content-type": "application/json", Authorization: token },
      body: JSON.stringify({ region }),
    });

    const meetingIdJson = await resMeetingId.json();

    const validatedMeetingId = meetingIdJson.meetingId;

    if (validatedMeetingId) {
      setMeetingIdValidation({
        isLoading: false,
        meetingId: validatedMeetingId,
        reqError: null,
        reqStatusCode: null,
      });
    } else {
      setMeetingIdValidation({
        isLoading: false,
        meetingId: null,
        reqError: meetingIdJson.error,
        reqStatusCode: meetingIdJson.statusCode,
      });

      playNotificationErr();

      setMeetingError({
        message: debug ? meetingIdJson.error : "Unable to join meeting!",
        code: meetingIdJson.statusCode,
        isVisible: true,
      });
    }
  };
  
  useEffect(() => {
    if (meetingData.meeting_id && meetingData.authorization_token) {
      validateMeetingId({
        meetingId: meetingData.meeting_id,
        token: meetingData.authorization_token,
        debug: paramKeys.debug === "true",
        region: paramKeys.region,
      });
    }
  }, [meetingData]);

  const theme = useTheme();

  return (
    <>
      <Modal
        open={meetinEndModal}
        onClose={closeMeeting}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            {meetinEndModalHead}            
          </Typography>
          <hr />
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            {meetinEndModalBody}            
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            Click OK to exit!
          </Typography>
          <Button 
            style={{
              corsur: 
              'pointer', 
              marginTop: '15px', 
              backgroundColor: '#101019'
            }}
            onClick={(e) => closeMeeting(e) }
          >OK</Button>
          {/* <Button 
            style={{
              corsur: 
              'pointer', 
              marginLeft: '10px',
              marginTop: '15px', 
              backgroundColor: '#101019'
            }}
            onClick={(e) => rateCall(e) }
          >Hit</Button> */}
        </Box>
      </Modal>

      {/* Two minutes warning modal start */}
      <Modal
        open={meetinTwoMinWorning}
        onClose={closeTMeeting}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            !!! Alert !!!
          </Typography>
          <hr />
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            Only 2 minutes
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
      </Modal>
      {/* Two minutes warning modal end */}
      {meetingLeft ? (
        paramKeys.isRecorder === "true" ? null : (
          <MeetingLeftScreen
            brandLogoURL={paramKeys.brandLogoURL}
            leftScreenActionButtonLabel={paramKeys.leftScreenActionButtonLabel}
            leftScreenActionButtonHref={paramKeys.leftScreenActionButtonHref}
            leftScreenRejoinButtonEnabled={
              paramKeys.leftScreenRejoinButtonEnabled !== "false"
            }
            setMeetingLeft={setMeetingLeft}
          />
        )
      ) : meetingIdValidation.isLoading ? (
        <Box
          style={{
            display: "flex",
            flex: 1,
            flexDirection: "column",
            height: "100vh",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: theme.palette.background.default,
          }}
        >
          <CircularProgress size={"4rem"} />
        </Box>
      ) : meetingIdValidation.reqError ? (
        <>
          {/* <ErrorPage
            errMsg={meetingIdValidation.reqError}
            statusCode={meetingIdValidation.reqStatusCode}
          /> */}
        </>
      ) : userHasInteracted && meetingIdValidation.meetingId ? (
        <MeetingAppProvider
          {...{
            redirectOnLeave: paramKeys.redirectOnLeave,
            chatEnabled: paramKeys.chatEnabled === "true",
            screenShareEnabled: paramKeys.screenShareEnabled === "true",
            pollEnabled: paramKeys.pollEnabled === "true",
            whiteboardEnabled: paramKeys.whiteboardEnabled === "true",
            participantCanToggleSelfWebcam:
              paramKeys.participantCanToggleSelfWebcam === "true",
            participantCanToggleSelfMic:
              paramKeys.participantCanToggleSelfMic === "true",
            raiseHandEnabled: paramKeys.raiseHandEnabled === "true",
            canChangeLayout: paramKeys.canChangeLayout === "true",
            meetingLayoutTopic: paramKeys.meetingLayoutTopic,
            recordingEnabled: paramKeys.recordingEnabled === "true",
            hlsEnabled: paramKeys.hlsEnabled === "true",
            recordingWebhookUrl: paramKeys.recordingWebhookUrl,
            recordingAWSDirPath: paramKeys.recordingAWSDirPath,
            autoStartRecording: paramKeys.autoStartRecording === "true",
            autoStartHls: paramKeys.autoStartHls === "true",
            hlsPlayerControlsVisible:
              paramKeys.hlsPlayerControlsVisible === "true",
            participantCanToggleRecording:
              paramKeys.participantCanToggleRecording === "true",
            participantCanToggleHls:
              paramKeys.participantCanToggleHls === "true",
            brandingEnabled: paramKeys.brandingEnabled === "true",
            poweredBy: paramKeys.poweredBy === "true",
            liveStreamEnabled: paramKeys.liveStreamEnabled === "true",
            autoStartLiveStream: paramKeys.autoStartLiveStream === "true",
            liveStreamOutputs: paramKeys.liveStreamOutputs,
            brandLogoURL:
              paramKeys.brandLogoURL?.length > 0
                ? paramKeys.brandLogoURL
                : null,
            brandName:
              paramKeys.brandName?.length > 0 ? paramKeys.brandName : null,
            participantCanLeave: paramKeys.participantCanLeave !== "false",
            askJoin: paramKeys.askJoin === "true",
            participantCanToggleOtherMic:
              paramKeys.participantCanToggleOtherMic === "true",
            participantCanToggleOtherWebcam:
              paramKeys.participantCanToggleOtherWebcam === "true",
            partcipantCanToogleOtherScreenShare:
              paramKeys.partcipantCanToogleOtherScreenShare === "true",
            participantCanToggleLivestream:
              paramKeys.participantCanToggleLivestream === "true",
            participantCanToggleOtherMode:
              paramKeys.participantCanToggleOtherMode === "true",
            notificationSoundEnabled:
              paramKeys.notificationSoundEnabled === "true",
            layoutType: paramKeys.layoutType,
            mode: paramKeys.mode,
            layoutPriority: paramKeys.layoutPriority,
            canPin: paramKeys.canPin === "true",
            selectedMic,
            selectedWebcam,
            joinScreenWebCam,
            joinScreenMic,
            canRemoveOtherParticipant:
              paramKeys.canRemoveOtherParticipant === "true",
            participantCanEndMeeting:
              paramKeys.participantCanEndMeeting === "true",
            canDrawOnWhiteboard: paramKeys.canDrawOnWhiteboard === "true",
            canToggleWhiteboard: paramKeys.canToggleWhiteboard === "true",
            canCreatePoll: paramKeys.canCreatePoll === "true",
            meetingLeft,
            setMeetingLeft,
            animationsEnabled: paramKeys.animationsEnabled !== "false",
            topbarEnabled: paramKeys.topbarEnabled !== "false",
            notificationAlertsEnabled:
              paramKeys.notificationAlertsEnabled !== "false",
            debug: paramKeys.debug === "true",
            layoutGridSize: paramKeys.layoutGridSize,
            hideLocalParticipant: paramKeys.hideLocalParticipant === "true",
            alwaysShowOverlay: paramKeys.alwaysShowOverlay === "true",
            sideStackSize: paramKeys.sideStackSize,
            reduceEdgeSpacing: paramKeys.reduceEdgeSpacing === "true",
            isRecorder: paramKeys.isRecorder === "true",
            //
            // recordingLayoutType: paramKeys.recordingLayoutType,
            // recordingLayoutPriority: paramKeys.recordingLayoutPriority,
            // recordingLayoutGridSize: paramKeys.recordingLayoutGridSize,
            // liveStreamLayoutType: paramKeys.liveStreamLayoutType,
            // liveStreamLayoutPriority: paramKeys.liveStreamLayoutPriority,
            // liveStreamLayoutGridSize: paramKeys.liveStreamLayoutGridSize,
            //
            maintainVideoAspectRatio:
              paramKeys.maintainVideoAspectRatio === "true",
            networkBarEnabled: paramKeys.networkBarEnabled === "true",
          }}
        >
          <MeetingProvider
            config={{
              meetingId: meetingIdValidation.meetingId,
              micEnabled: joinScreenMic,
              webcamEnabled: joinScreenWebCam,
              name: name,
              maxResolution:
                paramKeys.isRecorder === "true"
                  ? "hd"
                  : paramKeys.maxResolution === "sd" ||
                    paramKeys.maxResolution === "hd"
                  ? paramKeys.maxResolution
                  : "sd",
              participantId: paramKeys.participantId,
              preferredProtocol: paramKeys.preferredProtocol,
              autoConsume: false,
            }}
            token={meetingData.authorization_token}
            joinWithoutUserInteraction
            deviceInfo={{
              sdkType: "prebuilt",
              sdkVersion: prebuiltSDKVersion,
              rawUserAgent:
                paramKeys.rawUserAgent || typeof window !== "undefined"
                  ? window?.navigator?.userAgent
                  : null,
            }}
          >
            <MeetingContainer clockTime={ clockTime } />
          </MeetingProvider>
        </MeetingAppProvider>
      ) : 
      // paramKeys.joinScreenEnabled === "true" ? (
      //   <JoinMeeting
      //     onClick={({ name, webcamOn, micOn }) => {
      //       setName(name);
      //       setJoinScreenMic(micOn);
      //       setJoinScreenWebCam(webcamOn);
      //       setUserHasInteracted(true);
      //     }}
      //     {...{
      //       micEnabled:
      //         paramKeys.mode === meetingModes.VIEWER
      //           ? false
      //           : paramKeys.micEnabled === "true",
      //       webcamEnabled:
      //         paramKeys.mode === meetingModes.VIEWER
      //           ? false
      //           : paramKeys.webcamEnabled === "true",
      //     }}
      //     name={name}
      //     joinDisable = {joinDisable}
      //     setName={setName}
      //     setSelectedMic={setSelectedMic}
      //     setSelectedWebcam={setSelectedWebcam}
      //     meetingUrl={paramKeys.joinScreenMeetingUrl}
      //     meetingTitle={paramKeys.joinScreenTitle}
      //     participantCanToggleSelfWebcam={
      //       paramKeys.mode === meetingModes.VIEWER
      //         ? "false"
      //         : paramKeys.participantCanToggleSelfWebcam
      //     }
      //     participantCanToggleSelfMic={
      //       paramKeys.mode === meetingModes.VIEWER
      //         ? "false"
      //         : paramKeys.participantCanToggleSelfMic
      //     }
      //     mode={paramKeys.mode}
      //   />
      // ) :
       (
        <MeetingAppProvider
          {...{
            redirectOnLeave: paramKeys.redirectOnLeave,
            chatEnabled: paramKeys.chatEnabled === "true",
            screenShareEnabled: paramKeys.screenShareEnabled === "true",
            pollEnabled: paramKeys.pollEnabled === "true",
            whiteboardEnabled: paramKeys.whiteboardEnabled === "true",
            participantCanToggleSelfWebcam:
              paramKeys.participantCanToggleSelfWebcam === "true",
            participantCanToggleSelfMic:
              paramKeys.participantCanToggleSelfMic === "true",
            raiseHandEnabled: paramKeys.raiseHandEnabled === "true",
            canChangeLayout: paramKeys.canChangeLayout === "true",
            meetingLayoutTopic: paramKeys.meetingLayoutTopic,
            recordingEnabled: paramKeys.recordingEnabled === "true",
            hlsEnabled: paramKeys.hlsEnabled === "true",
            recordingWebhookUrl: paramKeys.recordingWebhookUrl,
            recordingAWSDirPath: paramKeys.recordingAWSDirPath,
            autoStartRecording: paramKeys.autoStartRecording === "true",
            autoStartHls: paramKeys.autoStartHls === "true",
            hlsPlayerControlsVisible:
              paramKeys.hlsPlayerControlsVisible === "true",
            participantCanToggleRecording:
              paramKeys.participantCanToggleRecording === "true",
            participantCanToggleHls:
              paramKeys.participantCanToggleHls === "true",
            brandingEnabled: paramKeys.brandingEnabled === "true",
            poweredBy: paramKeys.poweredBy === "true",
            liveStreamEnabled: paramKeys.liveStreamEnabled === "true",
            autoStartLiveStream: paramKeys.autoStartLiveStream === "true",
            liveStreamOutputs: paramKeys.liveStreamOutputs,
            brandLogoURL:
              paramKeys.brandLogoURL?.length > 0
                ? paramKeys.brandLogoURL
                : null,
            brandName:
              paramKeys.brandName?.length > 0 ? paramKeys.brandName : null,
            participantCanLeave: paramKeys.participantCanLeave !== "false",
            askJoin: paramKeys.askJoin === "true",
            participantCanToggleOtherMic:
              paramKeys.participantCanToggleOtherMic === "true",
            participantCanToggleOtherWebcam:
              paramKeys.participantCanToggleOtherWebcam === "true",
            partcipantCanToogleOtherScreenShare:
              paramKeys.partcipantCanToogleOtherScreenShare === "true",
            participantCanToggleLivestream:
              paramKeys.participantCanToggleLivestream === "true",
            participantCanToggleOtherMode:
              paramKeys.participantCanToggleOtherMode === "true",
            notificationSoundEnabled:
              paramKeys.notificationSoundEnabled === "true",
            layoutType: paramKeys.layoutType,
            mode: paramKeys.mode,
            layoutPriority: paramKeys.layoutPriority,
            canPin: paramKeys.canPin === "true",
            selectedMic,
            selectedWebcam,
            joinScreenWebCam,
            joinScreenMic,
            canRemoveOtherParticipant:
              paramKeys.canRemoveOtherParticipant === "true",
            participantCanEndMeeting:
              paramKeys.participantCanEndMeeting === "true",
            canDrawOnWhiteboard: paramKeys.canDrawOnWhiteboard === "true",
            canToggleWhiteboard: paramKeys.canToggleWhiteboard === "true",
            canCreatePoll: paramKeys.canCreatePoll === "true",
            meetingLeft,
            setMeetingLeft,
            animationsEnabled: paramKeys.animationsEnabled !== "false",
            topbarEnabled: paramKeys.topbarEnabled !== "false",
            notificationAlertsEnabled:
              paramKeys.notificationAlertsEnabled !== "false",
            debug: paramKeys.debug === "true",
            layoutGridSize: paramKeys.layoutGridSize,
            hideLocalParticipant: paramKeys.hideLocalParticipant === "true",
            alwaysShowOverlay: paramKeys.alwaysShowOverlay === "true",
            sideStackSize: paramKeys.sideStackSize,
            reduceEdgeSpacing: paramKeys.reduceEdgeSpacing === "true",
            isRecorder: paramKeys.isRecorder === "true",
            //
            // recordingLayoutType: paramKeys.recordingLayoutType,
            // recordingLayoutPriority: paramKeys.recordingLayoutPriority,
            // recordingLayoutGridSize: paramKeys.recordingLayoutGridSize,
            // liveStreamLayoutType: paramKeys.liveStreamLayoutType,
            // liveStreamLayoutPriority: paramKeys.liveStreamLayoutPriority,
            // liveStreamLayoutGridSize: paramKeys.liveStreamLayoutGridSize,
            //
            maintainVideoAspectRatio:
              paramKeys.maintainVideoAspectRatio === "true",
            networkBarEnabled: paramKeys.networkBarEnabled === "true",
          }}
        >
          <MeetingProvider
            config={{
              meetingId: meetingIdValidation.meetingId,
              micEnabled: joinScreenMic,
              webcamEnabled: joinScreenWebCam,
              name: paramKeys.pname,
              maxResolution:
                paramKeys.isRecorder === "true"
                  ? "hd"
                  : paramKeys.maxResolution === "sd" ||
                    paramKeys.maxResolution === "hd"
                  ? paramKeys.maxResolution
                  : "sd",
              participantId: paramKeys.participantId,
              preferredProtocol: paramKeys.preferredProtocol,
              autoConsume: false,
            }}
            token={meetingData.authorization_token}
            joinWithoutUserInteraction
            deviceInfo={{
              sdkType: "prebuilt",
              sdkVersion: prebuiltSDKVersion,
              rawUserAgent:
                paramKeys.rawUserAgent || typeof window !== "undefined"
                  ? window?.navigator?.userAgent
                  : null,
            }}
          >
            <MeetingContainer setParticipant={(data) => setParticipantsTotal(data)} clockTime={ clockTime }  />
          </MeetingProvider>
        </MeetingAppProvider>
        // <ClickAnywhereToContinue
        //   onClick={() => {
        //     setUserHasInteracted(true); 
        //   }}
        //   title="Click anywhere to continue"
        //   brandLogoURL={paramKeys.brandLogoURL}
        // />
      )}
      <ConfirmBox
        open={meetingError.isVisible}
        successText="OKAY"
        onSuccess={() => {
          setMeetingError(({ message }) => {
            throw new Error(message);

            // return {
            //   message: null,
            //   code: null,
            //   isVisible: false,
            // };
          });
        }}
        title={`Error Code: ${meetingError.code}`}
        subTitle={meetingError.message}
      />
    </>
  );
};

export default App;
