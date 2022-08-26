import React, {useEffect, useState} from 'react';
import Chip from "./core/Chip";
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import {withStyles} from "@material-ui/core";
import Moment from "react-moment";
import moment from "moment";

const styles = theme => ({
    boxCol: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        // backgroundColor: '#ebfffd',
        // padding: '2px',
        textAlign: 'center',
        // borderRadius: '6px',
        // borderBottom: '1px solid #5d5d5d'

    },
    chip: {
        padding: '2px',
        // borderRadius: '6px',
        // backgroundColor: '#ffb1b1',
    },
    date: {
        // borderBottom: '1px solid rgba(0,0,3 ,0.2 )',
        // borderTop: '1px solid rgba(0,0,3 ,0.2 )',
        marginButton: '1px!important',
        borderRadius: '6px',
        backgroundColor: '#fff',
        padding: '6px 0px'
    },
    slotList: {
        maxHeight: 460,
        overflow: 'auto',
        overflowX: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        // paddingRight:'12px',
        '&:hover': {
            '&::-webkit-scrollbar-thumb': {
                backgroundColor: 'rgba(78, 89, 131, 0.21)'
            },
            '&::-webkit-scrollbar-track': {
                backgroundColor: 'rgba(63, 68, 81, 0.05)'
            },
            '&::-webkit-scrollbar': {
                width: '3px!important',
                height: '3px',
            },
        },
        '&::-webkit-scrollbar-thumb': {
            backgroundColor: 'rgba(78, 89, 131, 0)'
        },
        '&::-webkit-scrollbar-track': {
            backgroundColor: 'rgba(63, 68, 81, 0)'
        },
        '&::-webkit-scrollbar': {
            width: '3px!important',
            height: '3px'
        }
    },
});


const CalendarColumn = props => {
    const {dataSet, noOfShift, classes, addSlots, removeSlots} = props;

    const [shiftIndex, setShiftIndex] = useState(props.index);

    useEffect(() => {

    })

    const handleChangeShift = index => {
        if (shiftIndex !== index) {
            setShiftIndex(index);
        }
    }


    const addSchedule = (value, service_id , shift_id ,price) => {
        addSlots(value, service_id , shift_id ,price);
    }
    const removeBookingSchedule = (value, service_id) => {
        removeSlots(value, service_id);
    }

    return (
        <div className={classes.boxCol}>
            <div className="item">
                <div
                    className={moment(dataSet.date, 'YYYY-MM-DD').isSame(moment().format('YYYY-MM-DD')) ? 'date_today' : 'dates'}>
                    <Moment format='DD'>{moment(dataSet.date, 'YYYY-MM-DD')}</Moment>
                    <div className="weeks">
                        <Moment format='MMM'>{moment(dataSet.date, 'YYYY-MM-DD')}</Moment>
                        |
                        <span><Moment format='ddd'>{moment(dataSet.date, 'YYYY-MM-DD')}</Moment></span></div>
                </div>
            </div>
            {/*<div className={classes.date}>*/}
            {/*    <Moment format='dddd'>{moment(dataSet.date , 'YYYY-MM-DD')}</Moment>*/}
            {/*    <br/>*/}
            {/*    <Moment format='MMM D'>{moment(dataSet.date , 'YYYY-MM-DD')}</Moment>*/}
            {/*</div>*/}
            <div
                style={shiftIndex === 1 || noOfShift === 1 ? {visibility: 'hidden'} : {cursor: 'pointer'}}
                onClick={() => handleChangeShift(shiftIndex - 1 !== undefined ? shiftIndex - 1 : 1)}>
                <ExpandLessIcon/>
            </div>
            <div className={classes.slotList}>
                {dataSet.shifts[shiftIndex - 1 !== undefined ? shiftIndex - 1 : 1].slots.map(slot => {
                    return (
                        <div className={classes.chip}>
                            <Chip
                                data={dataSet.shifts[shiftIndex - 1 !== undefined ? shiftIndex - 1 : 1]}
                                dateWithTime={slot.dateWithTime}
                                status={slot.status}
                                onClickChip={(value, service_id) => addSchedule(value, service_id ,
                                    dataSet.shifts[shiftIndex - 1 !== undefined ? shiftIndex - 1 : 1].id,
                                    dataSet.shifts[shiftIndex - 1 !== undefined ? shiftIndex - 1 : 1].actual_price,
                                )}
                                onCloseChips={(value, service_id) => removeBookingSchedule(value, service_id)}
                            />
                        </div>
                    )
                })}
            </div>
            <div
                style={shiftIndex === noOfShift || noOfShift === 1 ? {visibility: 'hidden'} : {cursor: 'pointer'}}
                onClick={() =>
                    handleChangeShift(shiftIndex + 1)
                }>
                <ExpandMoreIcon/>
            </div>
        </div>
    )
    // }

}

export default withStyles(styles)(CalendarColumn);
