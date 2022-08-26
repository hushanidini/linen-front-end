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
const BranchForm = props => {
    const { errors } = props;
    const classes = useStyles();

    const formik = useFormik({
        initialValues: {
            name:props.initialValues.name?props.initialValues.name:'',
            email:props.initialValues.email?props.initialValues.email:'',
            address:props.initialValues.address?props.initialValues.address:'',
            phone:props.initialValues.phone?props.initialValues.phone:''
        },
        validationSchema: Yup.object({
            name: Yup.string().min(3,"Name must be at least 3 characters").required('Required'),
            email: Yup.string().required('Required'),
            address: Yup.string().required('Required'),
            phone: Yup.string().required('Required'),
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
        <div style={{padding:'30px', paddingTop:'0' , paddingLeft:'15px'}}>
            <form onSubmit={formik.handleSubmit}>
                <div className="form-row">
                    <div className="form-group col-md-6">
                        <InputText
                            id={'name'}
                            label={'Location name'}
                            placeholder={"Location name"}
                            value={formik.values.name}
                            error={Boolean(formik.errors.name) && formik.touched.name}
                            errorMessage={formik.errors.name}
                            getValue={value => formik.setFieldValue('name',value)}
                            onBlur={()=>formik.setFieldTouched('name')}
                        />
                    </div>
                    <div className="form-group col-md-6">
                        <InputText
                            id={'email'}
                            label={'Email'}
                            placeholder={"Email"}
                            value={formik.values.email}
                            error={Boolean(formik.errors.email) && formik.touched.email}
                            errorMessage={formik.errors.email}
                            getValue={value => formik.setFieldValue('email',value)}
                            onBlur={()=>formik.setFieldTouched('email')}
                        />

                    </div>
                    <div className="form-group col-md-6">
                        <InputText
                            id={'address'}
                            label={'Address'}
                            placeholder={"Address"}
                            value={formik.values.address}
                            error={Boolean(formik.errors.address) && formik.touched.address}
                            errorMessage={formik.errors.address}
                            getValue={value => formik.setFieldValue('address',value)}
                            onBlur={()=>formik.setFieldTouched('address')}
                        />
                    </div>
                    <div className="form-group col-md-6">
                        <InputText
                            id={'phone'}
                            label={'Phone number'}
                            placeholder={"Phone number"}
                            value={formik.values.phone}
                            error={Boolean(formik.errors.phone) && formik.touched.phone}
                            errorMessage={formik.errors.phone}
                            getValue={value => formik.setFieldValue('phone',value)}
                            onBlur={()=>formik.setFieldTouched('phone')}
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
export default BranchForm;
