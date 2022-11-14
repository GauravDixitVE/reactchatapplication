import {
  Box,
  Button,
  Card,
  IconButton,
  InputAdornment,
  TextField,
  Tooltip,
  Typography,
  useTheme,
} from "@material-ui/core";
import { useEffect, useRef, useState, useMemo } from "react";
import LinesEllipsis from "react-lines-ellipsis";
import useCopyClipboard from "react-use-clipboard";
import { Keyboard } from "@material-ui/icons";
import { CopyIcon } from "../../icons";
import useWindowSize from "../../utils/useWindowSize";
import useIsSMDesktop from "../../utils/useIsSMDesktop";
import useIsLGDesktop from "../../utils/useIsLGDesktop";

import fetch from 'node-fetch';



export default function MeetingDetailModal({
  internalPadding,
  name,
  setName,
  nameErr,
  setNameErr,
  startMeeting,
  meetingTitle,
  meetingUrl,
  joinDisable
}) {
  const theme = useTheme();
  const [descriptionBoxHeight, setDescriptionBoxHeight] = useState(0);
  const [copyBoxHeight, setCopyBoxHeight] = useState(0);

  const [copied, setCopied] = useCopyClipboard(meetingUrl, {
    successDuration: 4000,
  });

  const descriptionBoxRef = useRef();
  const copyBoxRef = useRef();

  const getParams = ({ maxGridSize }) => {
    const location = window.location;

    const urlParams = new URLSearchParams(location.search);

    const paramKeys = {
      a_token: 'a_token',
    };

    Object.keys(paramKeys).forEach((key) => {
      paramKeys[key] = urlParams.get(key)
        ? decodeURIComponent(urlParams.get(key))
        : null;
    });

    return paramKeys;
  };

  const isLGDesktop = useIsLGDesktop();
  const isSMDesktop = useIsSMDesktop();

  const maxGridSize = useMemo(() => {
    return isLGDesktop
      
  }, [isLGDesktop, isSMDesktop]);

  const paramKeys = useMemo(() => getParams({ maxGridSize }), [maxGridSize]);

  const handleValidation = () => {
    let isValid = true;
    fetchPartis();
    if (name.length < 3) {
      isValid = false;
      setNameErr(true);
      return false;
    } else {
      setNameErr(false);
    }
    return isValid;
  };

  const fetchPartis = async () => {
    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcGlrZXkiOiJmOTA1MzI3YS0yOTRiLTRkNTItYWMzMS04ZjhmZDY4ZjVhYTUiLCJwZXJtaXNzaW9ucyI6WyJhbGxvd19qb2luIl0sImlhdCI6MTY2MDI4OTY2NCwiZXhwIjoxNjYwODk0NDY0fQ.d76mEzp1-QBmKUod5JPPNbX-XBSCbXqYIm9DDq7St3E';

    const options = {
      method: "GET",
      headers: {
        "Authorization": token,
        "Content-Type": "application/json",
      },
    };
    

    const url= `https://api.videosdk.live/v2/sessions/?roomId=99zs-d4o5-koml`;
    const response = await fetch(url, options);
    const data = response.json;
    // console.log("cdnkdjcbdskjvbjubvd::: ", response);
  }

  const btnVideoCallRatingApi = async () => {
    const auth_token = paramKeys.a_token;
      const meetingTimingDetails = await fetch('https://www.gosee.expert/api/videocallrating/'+auth_token, {
        method: "GET",
        headers: { "Content-type": "application/json" },
    });
  }
  const { width: windowWidth } = useWindowSize();

  useEffect(() => {
    if (
      descriptionBoxRef.current &&
      descriptionBoxRef.current.offsetHeight !== descriptionBoxHeight
    ) {
      setDescriptionBoxHeight(descriptionBoxRef.current.offsetHeight);
    }
    if (
      copyBoxRef.current &&
      copyBoxRef.current.offsetHeight !== copyBoxHeight
    ) {
      setCopyBoxHeight(copyBoxRef.current.offsetHeight);
    }
  }, [windowWidth]);

  return (
    <Box
      style={{
        width: "100%",
        display: "flex",
        flex: 1,
        flexDirection: "column",
      }}
    >
      {(meetingUrl && meetingTitle) || meetingUrl ? (
        <Card
          style={{
            borderRadius: 10,
            color: theme.palette.primary.contrastText,
          }}
        >
          <Box p={internalPadding}>
            {meetingTitle ? (
              <div
                style={{
                  fontFamily: "Roboto, sans-serif",
                  color: theme.palette.primary.contrastText,
                }}
              >
                <LinesEllipsis
                  text={meetingTitle}
                  maxLine="3"
                  ellipsis="..."
                  style={{
                    width: "100%",
                    fontSize: "20px",
                    fontWeight: "bold",

                    fontFamily: "inherit",
                  }}
                />
              </div>
            ) : null}

            {meetingUrl ? (
              <Box
                ref={copyBoxRef}
                mt={meetingTitle ? 2 : 0}
                p={2.5}
                pt={1}
                pb={1}
                style={{
                  display: "flex",
                  flexDirection: "row",
                  flex: 1,
                  backgroundColor: "#1C1F2E80",
                  borderRadius: 4,
                  overflow: "hidden",
                  alignItems: "center",
                }}
              >
                <Box
                  style={{
                    overflow: "hidden",
                    display: "flex",
                    flex: 1,
                  }}
                >
                  <Typography
                    style={{
                      width: "100%",
                      textOverflow: "ellipsis",
                      overflow: "hidden",
                      whiteSpace: "nowrap",
                    }}
                    variant="subtitle1"
                  >
                    {meetingUrl}
                  </Typography>
                </Box>
                <Box
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                  }}
                >
                  <Tooltip title={copied ? "Copied" : "Copy"} aria-label="add">
                    <IconButton
                      style={{
                        padding: 0,
                        margin: 0,
                      }}
                      onClick={(e) => {
                        setCopied(e);
                      }}
                    >
                      <CopyIcon
                        fill={"#fff"}
                        style={{
                          cursor: "pointer",
                        }}
                      />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Box>
            ) : null}
          </Box>
        </Card>
      ) : meetingTitle ? (
        <div
          style={{
            fontFamily: "Roboto, sans-serif",
            color: theme.palette.primary.contrastText,
          }}
        >
          <LinesEllipsis
            text={meetingTitle}
            maxLine="3"
            ellipsis="..."
            style={{
              width: "100%",
              fontSize: "20px",
              fontWeight: "bold",
            }}
          />
        </div>
      ) : null}

      <Box mt={meetingTitle || meetingUrl ? 2 : 0} style={{ width: "100%" }}>
        <TextField
          id={"inputJoin"}
          placeholder="Enter your name"
          variant="outlined"
          fullWidth
          value={name}
          error={nameErr}
          helperText={
            nameErr
              ? "Enter Minimum 3 Characters"
              : "Your name will help everyone identify you in the meeting"
          }
          onChange={(ev) => {
            setName(ev.target.value);
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <IconButton>
                  <Keyboard
                    style={{
                      color: theme.palette.primary.contrastText,
                    }}
                  />
                </IconButton>
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                <Button
                  color="primary"
                  variant="contained"
                  disabled={!joinDisable}
                  onClick={(e) => {
                    const isValid = handleValidation();
                    if (isValid) {
                      startMeeting(e);
                      btnVideoCallRatingApi();
                    }
                  }}
                  id={"btnJoin"}
                >
                  Join
                </Button>
              </InputAdornment>
            ),
          }}
        />
      </Box>
    </Box>
  );
}
