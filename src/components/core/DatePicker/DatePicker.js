import "date-fns";
import React from "react";
import DateFnsUtils from "@date-io/date-fns";
import {KeyboardDatePicker, MuiPickersUtilsProvider} from "@material-ui/pickers";
import * as PropTypes from "prop-types";
import moment from "moment";

const DatePicker = ({getDate , maxDate, minDate , label ,error , errorMessage}) => {
    // The first commit of Material-UI
    const [selectedDate, setSelectedDate] = React.useState(
        moment().format('YYYY-MM-DD')
    );

    const handleDateChange = (date) => {
        setSelectedDate(date);
    };

    return (
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <KeyboardDatePicker
                margin="normal"
                id="date-picker-dialog"
                label={label}
                format="yyyy/MM/dd"
                value={selectedDate}
                onChange={handleDateChange}
                maxDate={maxDate}
                minDate={minDate}
                KeyboardButtonProps={{
                    "aria-label": "change date"
                }}
                InputLabelProps={{
                    shrink: true,
                }}
            />
        </MuiPickersUtilsProvider>
    );
}
DatePicker.propTypes = {
    error:PropTypes.bool,
    errorMessage: PropTypes.string,
    name:PropTypes.string,
    label:PropTypes.string,
    maxDate:PropTypes.string,
    minDate:PropTypes.string
}
DatePicker.defaultProps = {
    error:false,
    errorMessage:'The field is required',
    name:'datePicker',
    label:'Date',
    maxDate:'2030/01/01',
    minDate:'2021/01/01'

}
export default DatePicker;
