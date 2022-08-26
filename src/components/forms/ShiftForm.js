import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {makeStyles} from '@material-ui/core/styles'
import InputText from "../core/InputText/InputText";
import TimePicker from "../core/TimePicker/TimePicker";
import InputSelect from "../core/InputSelect/InputSelect";
import moment from "moment";


const useStyles = makeStyles(theme=>({
    footer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-end',
        '&>:first-child':{
            marginRight:'12px'
        }
    }
}));
const days=[
    {
        label:'Sunday',
        value:'sunday'
    },
    {
        label:'Monday',
        value:'monday'
    },
    {
        label:'Tuesday',
        value:'tuesday'
    },
    {
        label:'Wednesday',
        value:'wednesday'
    },
    {
        label:'Thursday',
        value:'thursday'
    },
    {
        label:'Friday',
        value:'friday'
    },
    {
        label:'Saturday',
        value:'saturday'
    },
];

const ShiftForm = props => {
    const classes = useStyles();
    const { initialValues ,services , errors} = props;
    const formik = useFormik({
        initialValues: {
            service_id:initialValues.service_id?initialValues.service_id:'',
            name:initialValues.name?initialValues.name:'',
            price:initialValues.price?initialValues.price:'',
            actual_price:initialValues.actual_price?initialValues.actual_price:'',
            day:initialValues.day?initialValues.day:'',
            start_time:initialValues.start_time?initialValues.start_time:moment().format('HH:mm:ss'),
            end_time:initialValues.end_time?initialValues.end_time:moment().format('HH:mm:ss'),
        },
        validationSchema: Yup.object({
            name: Yup.string().min(3,"Name must be at least 3 characters").required('Required'),
            price: Yup.number().required('Required'),
            actual_price: Yup.number().required('Required').when('price' ,{
                is:val => (val && val.length > 0 ? true : false),
                then: Yup.number().min(
                    [Yup.ref('price')],
                    "Both password need to be same"
                )
            }),
            start_time: Yup.string().required('Required'),
            end_time: Yup.string().required('Required'),
        }),
        onSubmit: values => {
            const { getFormValue } = props;
            if (getFormValue) {
                getFormValue(values);
            }
        },
    });

    return (
        <div style={{padding:'24px', paddingTop:'0'}}>
            <form onSubmit={formik.handleSubmit}>
                <div className="form-row">
                    <div className="form-group col-md-4">
                        <InputSelect
                            selected={formik.values.service_id}
                            options={services}
                            placeholder={'Please select'}
                            label={'Services'}
                            getValue={value => formik.setFieldValue('service_id',value)}
                        />
                    </div>
                    <div className="form-group col-md-4">
                        <InputText
                            id={'name'}
                            label={'Shift name'}
                            placeholder={"Shift name"}
                            value={formik.values.name}
                            error={Boolean(formik.errors.name) && formik.touched.name}
                            errorMessage={formik.errors.name}
                            getValue={value => formik.setFieldValue('name',value)}
                            onBlur={()=>formik.setFieldTouched('name')}
                        />
                    </div>

                    <div className="form-group col-md-4">
                        <InputSelect
                            options={days}
                            selected={formik.values.day}
                            placeholder={'Please select'}
                            label={'Days'}
                            getValue={value => formik.setFieldValue('day',value)}
                        />

                    </div>
                    <div className="form-group col-md-6">
                        <InputText
                            id={'price'}
                            label={'Price'}
                            placeholder={"Price"}
                            value={formik.values.price}
                            error={Boolean(formik.errors.price) && formik.touched.price}
                            errorMessage={formik.errors.price}
                            getValue={value => formik.setFieldValue('price',value)}
                            onBlur={()=>formik.setFieldTouched('price')}
                        />
                    </div>
                    <div className="form-group col-md-6">
                        <InputText
                            id={'actual_price'}
                            label={'Actual price'}
                            placeholder={"Actual price"}
                            value={formik.values.actual_price}
                            error={Boolean(formik.errors.actual_price) && formik.touched.actual_price}
                            errorMessage={formik.errors.actual_price}
                            getValue={value => formik.setFieldValue('actual_price',value)}
                            onBlur={()=>formik.setFieldTouched('actual_price')}
                        />
                    </div>
                    <div className="form-group col-md-6">
                        <TimePicker
                            id={'start_time'}
                            label={'Start time'}
                            placeholder={"Start time"}
                            value={formik.values.start_time}
                            error={Boolean(formik.errors.start_time) && formik.touched.start_time}
                            errorMessage={formik.errors.start_time}
                            getTime={value => formik.setFieldValue('start_time',value)}
                            onBlur={()=>formik.setFieldTouched('start_time')}
                        />

                    </div>
                    <div className="form-group col-md-6">
                        <TimePicker
                            id={'end_time'}
                            label={'End time'}
                            placeholder={"End time"}
                            value={formik.values.end_time}
                            error={Boolean(formik.errors.end_time) && formik.touched.end_time}
                            errorMessage={formik.errors.end_time}
                            getTime={value => formik.setFieldValue('end_time',value)}
                            onBlur={()=>formik.setFieldTouched('end_time')}
                        />
                    </div>
                </div>
                <div style={{
                            display:'flex' ,
                            flexDirection: 'column' ,
                            alignItems: 'center' ,
                            justifyContent: 'center' ,
                            width:'100%',
                            color:'red' ,
                            padding:'16px'
                    }}>
                    {Object.keys(errors).map(key=>{
                        return (<div>
                            {errors[key].map(error=>{
                                return(   <p>{error}</p> )
                            })}
                        </div>)
                    })}
                </div>
                <div className={classes.footer}>
                    <button  onClick={props.handleClose && props.handleClose} className="btn btn-danger">Cancel</button>
                    <button  type={'submit'} className="btn btn-success">Save</button>
                </div>
            </form>
        </div>

    );
}
export default ShiftForm;
