import React, { useState ,useEffect } from "react";
import {DatePicker, MuiPickersUtilsProvider} from "@material-ui/pickers";
import {  makeStyles } from "@material-ui/core";
import moment from "moment";
import * as PropTypes from "prop-types";
import DateFnsUtils from "@date-io/date-fns";


const useStyles = makeStyles({
    container: {
        display: "flex",
        flexDirection: "column",
    },
    input: {
        // display: "flex"
        position:'absolute',
    }
});

const DatePickerBtn=({children , date ,getValue ,open,maxDate,
                         disablePast,
                         disableFuture,
                         minDate, ...props }) =>{
    const classes = useStyles();
    // const [isOpen, setIsOpen] = useState(false);
    // const [selectedDate, handleDateChange] = useState(moment(date));
    const [isOpen, setIsOpen] = useState(false);
    const [selectedDate, handleDateChange] = useState(date);

    useEffect(()=>{
        handleDateChange(date);
    })

    const handleChange=val=>{
        handleDateChange(val);
        if(getValue){
            getValue(val);
        }
    }
    return (
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <a href={true} onClick={() => setIsOpen(true)}> {children} </a>
                <DatePicker
                    maxDate={moment(maxDate)}
                    minDate={moment(minDate)}
                    variant="inline"
                    open={isOpen}
                    disablePast={disablePast}
                    disableFuture={disableFuture}
                    onOpen={() => setIsOpen(true)}
                    onClose={() => setIsOpen(false)}
                    value={selectedDate}
                    inputProps={{
                        className:classes.input,
                        disableUnderline:true
                    }}
                    onChange={handleChange}
                    // TextFieldComponent={()=><input type="text"/>}
                />
            </MuiPickersUtilsProvider>

    );
}

DatePickerBtn.propTypes = {
    open:PropTypes.bool.isRequired,
    disablePast:PropTypes.bool,
    disableFuture:PropTypes.bool,
    date:PropTypes.any,
    maxDate:PropTypes.string,
    minDate:PropTypes.string
}
DatePickerBtn.defaultProps = {
    open:false,
    disablePast:false,
    disableFuture:false,
    date:moment(),
    label:'Date',
    maxDate:'2030/01/01',
    minDate:'2020/01/01'

}
export default DatePickerBtn;
