import React from 'react';
import moment from 'moment';
import Moment from "react-moment";
import 'react-day-picker/lib/style.css';
import DatePicker from "./core/CalendarCompo";
import rightArrow from "../assets/icons/angle-right-solid.svg";
import leftArrow from "../assets/icons/angle-left-solid.svg"
import CustomChips from "./core/Chip";
import '../theme/table.css';

const CalendarSlot = props => {
    const {header, timeSchedule, addSchedule, removeBookingSchedule, currentDate } = props;

    const onChangeDate = (day) => {
        props.changeDate(moment(day));
    }
    const goToNextWeek = () => {
        console.log(moment(currentDate).format('YYYY-MM-DD'));
        props.changeDate(moment(currentDate).add(7, 'day'));
    }
    const goToPreviousWeek = () => {
        console.log(moment(currentDate).format('YYYY-MM-DD'));
        props.changeDate(moment(currentDate).subtract(7, 'day'));
    }

    return (
        <div>
            {/*{!isEmpty(currentDate) && (*/}
            {/*    <div>{currentDate}</div>*/}
            {/*)}*/}
            <br/>
            <div className="row">
                <div className="col col-sm-4 col-md-4 col-lg-4">
                </div>
                <div className="col col-sm-8 col-md-8 col-lg-8" >
                    <div className="row" style={{float: 'right'}}>

                        {/*<button type="button" style={{*/}
                        {/*    margin: '4px',*/}
                        {/*    display: (moment(currentDate).isSameOrBefore(moment().format('YYYY-MM-DD'), 'day')) ? 'none' : ''*/}
                        {/*}} onClick={goToPreviousWeek} className="btn btn-secondary">*/}

                        {/*</button>*/}
                        <img   type="button" style={{ height:'32px' , width:'32px' ,marginTop:'7px',
                            margin: '4px',
                            color:"green",
                            display: (moment(currentDate).isSameOrBefore(moment().format('YYYY-MM-DD'), 'day')) ? 'none' : ''
                        }} onClick={goToPreviousWeek}  src={leftArrow} alt={leftArrow}/>

                        <DatePicker
                            date={currentDate}
                            onChangeDate={onChangeDate}/>

                        <img onClick={goToNextWeek} style={{height:'32px' , width:'32px' ,marginTop:'7px',
                                        color:"green",
                                        margin: '4px',}} src={rightArrow} alt={rightArrow}/>

                    </div>
                </div>
            </div>

            <br/>
            <div className="table-responsive-xl">
                <table className="table table-sm table-borderless">
                    <thead>
                    <tr>
                        {header.map((item, index) => {
                            return (<th scope="col">
                                <Moment format="ddd MMM  DD" withTitle>
                                    {moment(item)}
                                </Moment>
                            </th>)
                        })

                        }
                    </tr>
                    </thead>
                    <tbody>

                    {timeSchedule.map((item, index) => {
                        return (<tr key={index}>
                            {item.map((data, i) =>{
                               return (<td key={i} style={{textAlign:'-moz-center'}}>
                                   <CustomChips
                                       item={data}
                                       status={data.status}
                                       dateWithTime={data.dateWithTime}
                                       onClickChip={value=>addSchedule(value)}
                                       onCloseChips={value=>removeBookingSchedule(value.dateWithTime , value.studio_id)}
                                   />
                               </td>)
                            })}


                        </tr>);
                    })}

                    </tbody>
                </table>
            </div>
        </div>
    );
}
export default CalendarSlot;
