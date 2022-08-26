import React from 'react';
import DayPickerInput from 'react-day-picker/DayPickerInput';
import 'react-day-picker/lib/style.css';
import {formatDate, parseDate,} from 'react-day-picker/moment';

const DatePicker = (props) => {
    const {selectedDay} = props

    const handleDayChange = (day) => {
        props.onChangeDate(day);
    }
    const FORMAT = 'MM/DD/yyyy';
    return (
        <div style={{margin: '4px', marginTop: '7px'}}>
            {/*{selectedDay && <p>Day: {selectedDay.toLocaleDateString()}</p>}*/}
            {/*{!selectedDay && <p>Choose a day</p>}*/}
            <DayPickerInput
                format={FORMAT}
                formatDate={formatDate}
                parseDate={parseDate}
                placeholder={`${formatDate(selectedDay)} Calendar`}
                onDayChange={handleDayChange}/>
        </div>
    )

}
export default DatePicker;
