import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {makeStyles} from '@material-ui/core/styles'
import BootstrapInputText from "../core/InputText/BootstrapInputText";


const useStyles = makeStyles(theme=>({
    footer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        '&>:first-child':{
            marginRight:'12px'
        }
    }
}));
const ActivationForm = props => {
    const { errors } = props;
    const classes = useStyles();

    const formik = useFormik({
        initialValues: {
            activation_code:'',
        },
        validationSchema: Yup.object({
            activation_code: Yup.string().required('Required'),
        }),
        onSubmit: values => {
            const { getFormValue } = props;
            if (getFormValue) {
                getFormValue(values);
            }
        },
    });

    return (
        <div style={{padding:'30px', paddingTop:'0' , paddingLeft:'15px' , marginTop:30}}>
            <form onSubmit={formik.handleSubmit}>
                <div className="form-row">
                    <BootstrapInputText
                        id={'activation_code'}
                        label={'Activate code'}
                        placeholder={"Activate code"}
                        value={formik.values.activation_code}
                        error={Boolean(formik.errors.activation_code) && formik.touched.activation_code}
                        errorMessage={formik.errors.activation_code}
                        getValue={value => formik.setFieldValue('activation_code',value)}
                        onBlur={()=>formik.setFieldTouched('activation_code')}
                    />
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
                    <button  type={'submit'} className="btn btn-success">Active</button>
                </div>
            </form>
        </div>
    );
}
export default ActivationForm;
