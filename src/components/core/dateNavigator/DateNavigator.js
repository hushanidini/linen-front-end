import React ,{useState} from "react";
import DatePickerBtn from "../DatePickerOnlyWithIcon/DatePicker";
import moment from "moment";
import Moment from "react-moment";
import * as PropTypes from "prop-types";

const DateNavigator = ({   date,
                           onChangeDate ,
                           type ,
                           isShowDate ,
                           isDisable ,
                           maxDate,
                           minDate,
                           disablePast ,
                           disableFuture}) => {
    const [currentDate, setCurrentDate] = useState(moment(date).format('YYYY-MM-DD'));

    const handleChange =value=>{
        switch(type){
            case 'DAY':
                if(value === 'NEXT'){
                    onChangeDate(moment(currentDate).add(1 , 'days').format('YYYY-MM-DD'));
                    setCurrentDate(moment(currentDate).add(1 , 'days').format('YYYY-MM-DD'));
                }else if(value === 'PREVIOUS'){
                    onChangeDate(moment(currentDate).subtract(1 , 'days').format('YYYY-MM-DD'));
                    setCurrentDate(moment(currentDate).subtract(1 , 'days').format('YYYY-MM-DD'));
                }else{
                    onChangeDate(moment(value).format('YYYY-MM-DD'));
                    setCurrentDate(moment(value).format('YYYY-MM-DD'));
                }
                break ;

            case 'WEEK' :
                if(value === 'NEXT'){
                    onChangeDate(moment(currentDate).add(1 , 'weeks').format('YYYY-MM-DD'));
                    setCurrentDate(moment(currentDate).add(1 , 'weeks').format('YYYY-MM-DD'));
                }else if(value === 'PREVIOUS'){
                    onChangeDate(moment(currentDate).subtract(1 , 'weeks').format('YYYY-MM-DD'));
                    setCurrentDate(moment(currentDate).subtract(1 , 'weeks').format('YYYY-MM-DD'));
                }else{
                    onChangeDate(moment(value).format('YYYY-MM-DD'));
                    setCurrentDate(moment(value).format('YYYY-MM-DD'));
                }
                break ;

            case 'MONTH':
                if(value === 'NEXT'){
                    onChangeDate(moment(currentDate).add(1 , 'months').format('YYYY-MM-DD'));
                    setCurrentDate(moment(currentDate).add(1 , 'months').format('YYYY-MM-DD'));
                }else if(value === 'PREVIOUS'){
                    onChangeDate(moment(currentDate).subtract(1 , 'months').format('YYYY-MM-DD'));
                    setCurrentDate(moment(currentDate).subtract(1 , 'months').format('YYYY-MM-DD'));
                }else{
                    onChangeDate(moment(value).format('YYYY-MM-DD'));
                    setCurrentDate(moment(value).format('YYYY-MM-DD'));
                }
                break ;

            case 'YEAR' :
                if(value === 'NEXT'){
                    onChangeDate(moment(currentDate).add(1 , 'years').format('YYYY-MM-DD'));
                    setCurrentDate(moment(currentDate).add(1 , 'years').format('YYYY-MM-DD'));
                }else if(value === 'PREVIOUS'){
                    onChangeDate(moment(currentDate).subtract(1 , 'years').format('YYYY-MM-DD'));
                    setCurrentDate(moment(currentDate).subtract(1 , 'years').format('YYYY-MM-DD'));
                }else {
                    onChangeDate(moment(value).format('YYYY-MM-DD'));
                    setCurrentDate(moment(value).format('YYYY-MM-DD'));
                }
                break ;

            default :
                break ;
        }

    }
    return (
        <div style={isDisable?{pointerEvents: 'none', opacity: 0.5}:{}}>
            <div
                onClick={()=>handleChange('PREVIOUS')}
                 style={moment(currentDate).isSameOrBefore(moment().format('YYYY-MM-DD'), 'day') && disableFuture
                     ? {pointerEvents: 'none', opacity: 0.5} : {}}
                 className="btn vm_bg_light_gray2 m-1"><i
                className="fa fa-arrow-left vm_text_gray"></i>
            </div>
            <div className="btn vm_bg_light_gray2 m-1" style={{cursor: 'pointer'}}>
                <DatePickerBtn
                    maxDate={disablePast?moment().format('YYYY/MM/DD'):maxDate}
                    minDate={disableFuture?moment().format('YYYY/MM/DD'):minDate}
                    getValue={date => handleChange(date)}
                    date={moment(currentDate)}>
                    {isShowDate? (
                        <>
                            {type=== 'DAY' && (
                                <Moment format={'YYYY-MMM-DD'} date={currentDate}/>
                            )}
                            {type=== 'WEEK' && (
                                <>
                                    <Moment format={'DD MMM'} date={currentDate}/>
                                    -
                                    <Moment format={'DD MMM'} date={moment(currentDate).add(1 , 'weeks').format('YYYY-MM-DD')}/>

                                </>
                            )}
                            {type=== 'MONTH' && (
                                <>
                                    <Moment format={'MMM DD'} date={currentDate}/>
                                    -
                                    <Moment format={'MMM DD'} date={moment(currentDate).add(1 , 'months').format('YYYY-MM-DD')}/>

                                </>
                            )}
                            {type=== 'YEAR' && (
                                <>
                                    <Moment format={'YYYY MMM'} date={currentDate}/>
                                    -
                                    <Moment format={'YYYY MMM'} date={moment(currentDate).add(1 , 'years').format('YYYY-MM-DD')}/>

                                </>
                            )}
                        </>
                    ):(
                        <i style={{cursor: 'pointer'}}
                           className="fa fa-calendar-alt vm_text_gray"></i>
                    )}

                </DatePickerBtn>
            </div>
            <div style={moment(currentDate).isSameOrAfter(moment().format('YYYY-MM-DD'), 'day') && disablePast
                ? {pointerEvents: 'none', opacity: 0.5} : {}}
                onClick={()=>handleChange('NEXT')}
                 className="btn vm_bg_light_gray2 m-1"><i
                className="fa fa-arrow-right vm_text_gray"></i></div>
        </div>
    )
}
DatePickerBtn.propTypes = {
    date:PropTypes.string,
    maxDate:PropTypes.string,
    minDate:PropTypes.string,
    type:PropTypes.string,
    isShowDate:PropTypes.bool,
    isDisable:PropTypes.bool,
    disablePast:PropTypes.bool,
    disableFuture:PropTypes.bool
}
DatePickerBtn.defaultProps = {
    date:moment().format('YYYY-MM-DD'),
    maxDate:'2030/01/01',
    minDate:'2020/01/01',
    type:'DAY',
    isShowDate:false,
    isDisable:false,
    disablePast:false,
    disableFuture:false
}

export default DateNavigator;
