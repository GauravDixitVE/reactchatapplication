import { Button, Box, CircularProgress, Typography, Modal } from '@material-ui/core';
import React,{useEffect,useState} from 'react'
import { clearInterval, clearTimeout, setInterval, setTimeout } from 'worker-timers';

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

const CountDownTimer = (props) => {
    var hoursMinSecs=props.hoursMinSecs;
    const { hours, minutes, seconds } = hoursMinSecs;
    const [meetinTwoMinWorning, setMeetinTwoMinWorning] = useState(false);
    const [[hrs, mins, secs], setTime] = useState([hours, minutes, seconds]);
    
    useEffect(() => {
        setTime([parseInt(0), parseInt(hoursMinSecs.minutes), parseInt(hoursMinSecs.seconds)])
        return () => {
            setTime([parseInt(0), parseInt(0), parseInt(0)])
        };
    }, [hoursMinSecs]);

    useEffect(()=>{
       if(mins === 2 && secs === 0){ 
        console.log("before 2 min");
           setMeetinTwoMinWorning(true);
        }
        if(mins === 0 && secs === 34){
          setTimeout(() => {
              endCall();
          }, 33000);
        }
        return () =>{
          localStorage.removeItem('setStartTime');
          localStorage.removeItem('clockParticipants');
      
        }
      
    },[hrs, mins, secs])

    const endCall=()=>{
       localStorage.removeItem('clockParticipants');
       localStorage.removeItem('set_start_meeting');
       let path = `https://www.gosee.expert/home/end-of-call`;
       window.location.href = path;
       
    }
    const tick = () => {
        if (hrs === 0 && mins === 0 && secs === 0) 
            reset()
        else if (mins === 0 && secs === 0) {
            setTime([hrs - 1, 59, 59]);
        } else if (secs === 0) {
            setTime([hrs, mins - 1, 59]);
        } else {
            setTime([hrs, mins, secs - 1]);
        }
    };


    const reset = () => setTime([parseInt(hours), parseInt(minutes), parseInt(seconds)]);

    
    useEffect(() => {
        const timerId = setInterval(() => tick(), 1000);
        return () => clearInterval(timerId);
    });

    const closeTMeeting = (e) => {
        setMeetinTwoMinWorning(false);
      }

    return (
        <div className="col-md-4">
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
            Only 2 minutes are remaining!
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
        <Button 
          style={{
            corsur: 
            'pointer', 
            marginLeft: '10px',
            padding: '9px',
            background: 'rgb(33 32 50)',
            border: '1px solid #4d4d5b',
          }} >
            {`${hrs.toString().padStart(2, '0')}:${mins
            .toString()
            .padStart(2, '0')}:${secs.toString().padStart(2, '0')}`} 
        </Button>

            {/* <p>{`${hrs.toString().padStart(2, '0')}:${mins
            .toString()
            .padStart(2, '0')}:${secs.toString().padStart(2, '0')}`}</p>  */}
        </div>
    );
}

export default CountDownTimer;