import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {makeStyles} from '@material-ui/core/styles'
import InputText from "../core/InputText/InputText";


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

const MembershipForm = props => {
    const { initialValues ,errors} = props;
    const classes = useStyles();

    const formik = useFormik({
        initialValues: {
            name:initialValues.name?initialValues.name:'',
            fee:initialValues.fee?initialValues.fee:'',
            init_points:initialValues.init_points?initialValues.init_points:'',
            points_per_booking:initialValues.points_per_booking?initialValues.points_per_booking:'',
            cancellation:initialValues.cancellation?initialValues.cancellation:'',
            valid_duration:initialValues.valid_duration?initialValues.valid_duration:'',
            exchange:initialValues.exchange?initialValues.exchange:'',

        },
        validationSchema: Yup.object({
            name: Yup.string().required('Required'),
            fee: Yup.number().required('Required'),
            init_points: Yup.number().required('Required'),
            valid_duration: Yup.number().required('Required'),
            points_per_booking: Yup.number().required('Required'),
            cancellation: Yup.number().required('Required'),
            exchange: Yup.string().required('Required'),
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
            <form onSubmit={formik.handleSubmit} style={{marginTop:'0px'}}>
                <div className="form-row">
                    <div className="form-group col-md-6">
                        <InputText
                            id={'name'}
                            label={'Membership name'}
                            placeholder={"Membership name"}
                            value={formik.values.name}
                            error={Boolean(formik.errors.name) && formik.touched.name}
                            errorMessage={formik.errors.name}
                            getValue={value => formik.setFieldValue('name',value)}
                            onBlur={()=>formik.setFieldTouched('name')}
                        />

                    </div>

                    <div className="form-group col-md-6">
                        <InputText
                            id={'fee'}
                            label={'Initial fee'}
                            placeholder={"Fee"}
                            value={formik.values.fee}
                            error={Boolean(formik.errors.fee) && formik.touched.fee}
                            errorMessage={formik.errors.fee}
                            getValue={value => formik.setFieldValue('fee',value)}
                            onBlur={()=>formik.setFieldTouched('fee')}
                        />

                    </div>

                    <div className="form-group col-md-6">
                        <InputText
                            id={'init_points'}
                            label={'Initial points'}
                            placeholder={"Points per booking"}
                            value={formik.values.init_points}
                            error={Boolean(formik.errors.init_points) && formik.touched.init_points}
                            errorMessage={formik.errors.init_points}
                            getValue={value => formik.setFieldValue('init_points',value)}
                            onBlur={()=>formik.setFieldTouched('init_points')}
                        />

                    </div>

                    <div className="form-group col-md-6">
                        <InputText
                            id={'points_per_booking'}
                            label={'Points Per Booking'}
                            placeholder={"Points Per Booking"}
                            value={formik.values.points_per_booking}
                            error={Boolean(formik.errors.points_per_booking) && formik.touched.points_per_booking}
                            errorMessage={formik.errors.points_per_booking}
                            getValue={value => formik.setFieldValue('points_per_booking',value)}
                            onBlur={()=>formik.setFieldTouched('points_per_booking')}
                        />

                    </div>

                    <div className="form-group col-md-6">
                        <InputText
                            id={'cancellation'}
                            label={'Cancellation'}
                            placeholder={"Cancellation"}
                            value={formik.values.cancellation}
                            error={Boolean(formik.errors.cancellation) && formik.touched.cancellation}
                            errorMessage={formik.errors.cancellation}
                            getValue={value => formik.setFieldValue('cancellation',value)}
                            onBlur={()=>formik.setFieldTouched('cancellation')}
                        />
                    </div>

                    <div className="form-group col-md-6">
                        <InputText
                            id={'exchange'}
                            label={'Exchange'}
                            placeholder={"Exchange"}
                            value={formik.values.exchange}
                            error={Boolean(formik.errors.exchange) && formik.touched.exchange}
                            errorMessage={formik.errors.exchange}
                            getValue={value => formik.setFieldValue('exchange',value)}
                            onBlur={()=>formik.setFieldTouched('exchange')}
                        />
                    </div>

                    <div className="form-group col-md-6">
                        <InputText
                            id={'valid_duration'}
                            label={'Valid duration in months'}
                            placeholder={"Valid duration in months"}
                            value={formik.values.valid_duration}
                            error={Boolean(formik.errors.valid_duration) && formik.touched.valid_duration}
                            errorMessage={formik.errors.valid_duration}
                            getValue={value => formik.setFieldValue('valid_duration',value)}
                            onBlur={()=>formik.setFieldTouched('valid_duration')}
                        />
                    </div>

                </div>
                <div style={{display:'flex' ,flexDirection: 'column' , alignItems: 'center' , justifyContent: 'center' , width:'100%', color:'red' ,padding:'16px'}}>
                    {Object.keys(errors).map(key=>{
                        return (<div>
                            {errors[key].map(error=>{
                                return(<p>{error}</p>)
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

export default MembershipForm;
