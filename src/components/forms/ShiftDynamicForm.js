import React, {useEffect, useState} from 'react';
import {makeStyles} from '@material-ui/core/styles'
import {isEmpty} from "lodash";
import InputText from "../core/InputText/InputText";
import TimePicker from "../core/TimePicker/TimePicker";
import moment from "moment";
import HighlightOffIcon from '@material-ui/icons/HighlightOff';

const useStyles = makeStyles(theme=>({
    footer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-end',
        '&>:first-child':{
            marginRight:'12px'
        }
    },
    form:{
        padding:4,
        borderRadius: '8px',
        backgroundColor:'white',
        marginTop:6,
    }
}));

const ShiftDynamicForm = props => {
    const classes = useStyles();
    const { initialValues} = props;
    const [dataSet , setDataSet] = useState(initialValues);
    useEffect(()=>{
        setDataSet(initialValues);
    })
    const getInputValue=(name , value)=>{
        const { getFormValue } = props;
        let data = { name: dataSet.name,
            start_time: dataSet.start_time,
            end_time: dataSet.end_time ,
            price:dataSet.price,
            actual_price:dataSet.actual_price,
            errors:dataSet.errors,
            isNew:dataSet.isNew
        };
        data[name] = value;
        if(moment(data.start_time ,'HH:mm:ss').isAfter(moment(data.end_time ,'HH:mm:ss'))){
            data.errors.start_time = "The start time should be less than the end time";
            data.errors.end_time = "The end time should be greater than the start time";

        }else{
            delete data.errors["start_time"];
            delete data.errors["end_time"];
        }
        if (isNaN(data.price)){
            data.errors.price = "The price should be number.";
        }
        if (isNaN(data.actual_price)){
            data.errors.actual_price = "The actual price should be number.";
        }
        if(parseInt(data.price) < parseInt(data.actual_price)){
            data.errors.price = "The price should be more than actual price";
            data.errors.actual_price = "The actual price should be less than price";
        }else{
            delete data.errors["price"];
            delete data.errors["actual_price"];
        }
        if(isEmpty(data[name])){
            data.errors[name] = "The field should be correct format";
        }else{
            // delete data.errors[name];
        }
        if(!isEmpty(data[name])
            && !isNaN(data.price)
            && (parseInt(data.price) > parseInt(data.actual_price))
            && !(moment(data.start_time ,'HH:mm:ss').isAfter(moment(data.end_time ,'HH:mm:ss')))){
            delete data.errors[name];
        }
        setDataSet(data);
        if (getFormValue) {
            getFormValue(data);
        }
    }
    return (
        <div className={classes.form} style={{paddingTop:'0' , display:'flex' , flexDirection: 'row'}}>
            {/*<form onSubmit={formik.handleSubmit}>*/}
                <div className="form-row">
                    <div className=" col-md-4">
                        <InputText
                            id={'name'}
                            label={'Shift name'}
                            placeholder={"Shift name"}
                            value={dataSet.name}
                            getValue={value => getInputValue('name',value)}
                            error={Boolean(dataSet.errors.name)}
                            errorMessage={dataSet.errors.name}
                        />
                    </div>

                    <div className=" col-md-4">
                        <TimePicker
                            id={'start_time'}
                            label={'Start time'}
                            placeholder={"Start time"}
                            value={dataSet.start_time}
                            getTime={value => getInputValue('start_time',value)}
                            error={Boolean(dataSet.errors.start_time)}
                            errorMessage={dataSet.errors.start_time}
                        />
                    </div>

                    <div className=" col-md-4">
                        <TimePicker
                            id={'end_time'}
                            label={'End time'}
                            placeholder={"End time"}
                            value={dataSet.end_time}
                            getTime={value => getInputValue('end_time',value)}
                            error={Boolean(dataSet.errors.end_time)}
                            errorMessage={dataSet.errors.end_time}
                        />
                    </div>

                    <div className=" col-md-6">
                        <InputText
                            type={'number'}
                            id={'price'}
                            label={'Price'}
                            placeholder={"Price"}
                            value={dataSet.price}
                            getValue={value => getInputValue('price',value)}
                            error={Boolean(dataSet.errors.price)}
                            errorMessage={dataSet.errors.price}
                        />
                    </div>

                    <div className=" col-md-6">
                        <InputText
                            type={'number'}
                            id={'actual_price'}
                            label={'Actual price'}
                            placeholder={"Actual price"}
                            value={dataSet.actual_price}
                            getValue={value => getInputValue('actual_price',value)}
                            error={Boolean(dataSet.errors.actual_price)}
                            errorMessage={dataSet.errors.actual_price}
                        />
                    </div>
                </div>
            <div onClick={props.removeShift} className=" col-md-1"
                 style={{margin:'0px 0px 0px 1rem' , display:'flex',alignItems:'center' , justifyContent:'center' ,cursor: 'pointer'}}>
                <HighlightOffIcon style={dataSet.isNew? {color: "green"}:{color: "red"}}/>
            </div>
            {/*</form>*/}
        </div>

    );
}

export default ShiftDynamicForm;
