import React, {useState} from 'react';
import DateFnsUtils from '@date-io/date-fns'; // choose your lib
import {DateTimePicker, MuiPickersUtilsProvider,} from '@material-ui/pickers';
import moment from 'moment';
import * as PropTypes from "prop-types";
import ScheduleIcon from "@material-ui/icons/Schedule";
import {makeStyles} from "@material-ui/core/styles";
import {FormControl} from "@material-ui/core";

const CustomDateTimePicker=({getValue ,value, maxDate, minDate , label ,error , errorMessage ,disablePast ,...rest})=> {
    const classes = useStyles();
    const [selectedDate, handleDateChange] = useState(moment(value));

    const handleChange = (time) => {
        handleDateChange(moment(time));
        if(getValue){
            getValue(moment(time).format('YYYY-MM-DD HH:mm:ss'));
        }
    };

    return (
        <FormControl className={classes.formControl}>
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <DateTimePicker
                value={selectedDate}
                onChange={handleChange}
                label={label}
                maxDate={maxDate}
                minDate={minDate}
                ampm={false}
                disablePast={disablePast}
                format={'yyyy-MM-dd HH:mm:ss'}
                InputLabelProps={{
                    shrink: true,
                }}
                helperText={error?errorMessage:''}
                FormHelperTextProps={{
                    classes:{
                        root:classes.helperText
                    }
                }}
                {...rest}
                InputAdornmentProps={{position:'end'}}
                PopoverProps={<ScheduleIcon/>}
            />
        </MuiPickersUtilsProvider>
        </FormControl>
    );
}

CustomDateTimePicker.propTypes = {
    error:PropTypes.bool,
    disablePast:PropTypes.bool,
    errorMessage: PropTypes.string,
    value: PropTypes.any,
    label:PropTypes.string,
    maxDate:PropTypes.string,
    minDate:PropTypes.string
}
CustomDateTimePicker.defaultProps = {
    error:false,
    disablePast:true,
    value:moment().add(1,'day'),
    errorMessage:'The field is required',
    label:'Date',
    maxDate:'2030/01/01',
    minDate:'2021/01/01'

}
const useStyles = makeStyles(theme=>({
    formControl: {
        margin: theme.spacing(1),
        minWidth: "100%",
    },
    formRoot:{
        margin:'0px!important',
        backgroundColor:'red'
    },
    helperText:{
        color: 'red!important',
    },
}));

export default CustomDateTimePicker;
