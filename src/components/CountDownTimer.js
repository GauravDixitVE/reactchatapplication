import { Button } from '@material-ui/core';
import React,{useEffect} from 'react'
import { clearInterval, clearTimeout, setInterval, setTimeout } from 'worker-timers';

const CountDownTimer = (props) => {
    var hoursMinSecs=props.hoursMinSecs;
    // if(hoursMinSecs.minutes<=0){
    //     let path = `https://www.gosee.expert/`;
    //     window.location.href = path;
    // }
    console.log("testig",hoursMinSecs);
    const { hours = 0, minutes = 0, seconds = 0 } = hoursMinSecs;
    const [[hrs, mins, secs], setTime] = React.useState([hours, minutes, seconds]);
    
    useEffect(() => {
        setTime([parseInt(0), parseInt(hoursMinSecs.minutes), parseInt(0)])
        return () => {
            setTime([parseInt(0), parseInt(0), parseInt(0)])
        };
    }, [hoursMinSecs]);

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

    
    React.useEffect(() => {
        const timerId = setInterval(() => tick(), 1000);
        return () => clearInterval(timerId);
    });

    
    return (
        <div className="col-md-4">
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