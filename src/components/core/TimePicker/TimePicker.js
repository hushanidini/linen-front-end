import "date-fns";
import React, {useEffect} from "react";
import DateFnsUtils from "@date-io/date-fns";
import {KeyboardTimePicker, MuiPickersUtilsProvider} from "@material-ui/pickers";
import * as PropTypes from "prop-types";
import moment from "moment";
import {FormControl} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import ScheduleIcon from '@material-ui/icons/Schedule';

const useStyles = makeStyles(theme=>({
    formControl: {
        margin: theme.spacing(1),
        minWidth: "100%",
        marginTop:'-8px'
    },
    formRoot:{
        margin:'0px!important',
        backgroundColor:'red'
    },
    helperText:{
        color: 'red!important',
    },
}));

const TimePicker = ({getTime , label ,value, error , errorMessage}) => {
    const classes = useStyles();
    // The first commit of Material-UI
    const [selectedTime, setSelectedTime] = React.useState(moment(value,'hh:mm:ss'));
    useEffect(()=>{
        // setSelectedTime(moment(value));
    })

    const handleTimeChange = (time) => {
        setSelectedTime(time);
        if(getTime){
            getTime(moment(time).format('HH:mm:ss'));
            setSelectedTime(moment(time));
        }
    };

    return (
        <FormControl className={classes.formControl}>
         <MuiPickersUtilsProvider utils={DateFnsUtils}  >
            <KeyboardTimePicker
                margin="normal"
                id="time-picker"
                ampm={false}
                label={label}
                value={selectedTime}
                onChange={handleTimeChange}
                helperText={error?errorMessage:''}
                KeyboardButtonProps={{
                    "aria-label": "change time"
                }}
                InputLabelProps={{
                    shrink: true,
                }}
                FormHelperTextProps={{
                    classes:{
                        root:classes.helperText
                    }
                }}
                keyboardIcon={<ScheduleIcon/>}
            />
        </MuiPickersUtilsProvider>
        </FormControl>
    );
}
TimePicker.propTypes = {
    error:PropTypes.bool,
    errorMessage: PropTypes.string,
    name:PropTypes.string,
    label:PropTypes.string,
    value:PropTypes.any,
}
TimePicker.defaultProps = {
    error:false,
    errorMessage:'The field is required',
    name:'Time Picker',
    label:'Time',
    value:'20:02:00'

}
export default TimePicker;
