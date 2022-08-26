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

const numPattern = /^[0-9]*$/;
const DiscountForm = props => {
    const classes = useStyles();
    const { initialValues ,errors } = props;
    const formik = useFormik({
        initialValues: {
            discount:initialValues.discount?initialValues.discount:'',
            start:initialValues.start?initialValues.start:'',
            end:initialValues.end?initialValues.end:'',
        },
        validationSchema: Yup.object({
            start: Yup.string().matches(
                numPattern,
                'The value should be number'
            ).max(3,"too long").required('Required'),
            end: Yup.string().matches(
                numPattern,
                'The value should be number'
            ).max(3,"too long").required('Required'),
            discount: Yup.string().matches(
                numPattern,
                'The value should be number'
            ).max(3,"too long").required('Required'),
        }),
        onSubmit: values => {
            const { getFormValue } = props;
            if (getFormValue) {
                getFormValue(values);
            }
        },
    });
    // const getInputValue=event=>{
    //     formik.setFieldValue(event.target.name, event.target.value);
    // }
    return (
        <div  style={{padding:'24px', paddingTop:'0'}}>
            <form onSubmit={formik.handleSubmit}>
            <div className="form-row">
                <div className=" col-md-4">
                    <InputText
                        id={'start'}
                        label={'Start'}
                        placeholder={"Enter here"}
                        value={formik.values.start}
                        error={Boolean(formik.errors.start) && formik.touched.start}
                        errorMessage={formik.errors.start}
                        getValue={value => formik.setFieldValue('start',value)}
                        onBlur={()=>formik.setFieldTouched('start')}
                    />
                </div>

                <div className=" col-md-4">
                    <InputText
                        id={'end'}
                        label={'End'}
                        placeholder={"Enter here"}
                        value={formik.values.end}
                        error={Boolean(formik.errors.end) && formik.touched.end}
                        errorMessage={formik.errors.end}
                        getValue={value => formik.setFieldValue('end',value)}
                        onBlur={()=>formik.setFieldTouched('end')}
                    />
                </div>

                <div className=" col-md-4">
                    <InputText
                        id={'discount'}
                        label={'Discount (%)'}
                        placeholder={"Enter here"}
                        value={formik.values.discount}
                        error={Boolean(formik.errors.discount) && formik.touched.discount}
                        errorMessage={formik.errors.discount}
                        getValue={value => formik.setFieldValue('discount',value)}
                        onBlur={()=>formik.setFieldTouched('discount')}
                    />
                </div>

            </div>
                <div style={{display:'flex' , flexDirection: 'column' , alignItems: 'center' , justifyContent: 'center' , width:'100%', color:'red' ,padding:'16px'}}>
                    {Object.keys(errors).map(key=>{
                        return (<div>
                            {errors[key].map(error=>{
                                return( <p>{error}</p>)
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

export default DiscountForm;
