import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {makeStyles} from '@material-ui/core/styles'
import InputText from "../core/InputText/InputText";
import InputSelect from "../core/InputSelect/InputSelect";
import MultipleSelect from "../core/MultipleSelect/MultipleSelect";


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
const UserForm = props => {
    const { initialValues ,branches,errors} = props;
    const classes = useStyles();

    const formik = useFormik({
        initialValues: {
            name:initialValues.name?initialValues.name:'',
            email:initialValues.email?initialValues.email:'',
            role:initialValues.role?initialValues.role:'',
            branch_ids:initialValues.branch_ids?initialValues.branch_ids:[],

        },
        validationSchema: Yup.object({
            name: Yup.string().required('Required'),
            email: Yup.string().required('Required'),
            // role: Yup.string().required('Required'),
            // branch_ids: Yup.string().required('Required'),
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
                            label={'Name'}
                            placeholder={"Name"}
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
                        <InputSelect
                            options={roleOption}
                            placeholder={'Select the role'}
                            label={'User role'}
                            selected={formik.values.role}
                            isLabel={true}
                            getValue={value => formik.setFieldValue('role',value)}
                        />
                    </div>
                    {formik.values.role === 'manager' && (
                        <div className="form-group col-md-6">
                            <MultipleSelect setValue={value => formik.setFieldValue('branch_ids',value)}
                                            selected={[]}
                                            label={'Please select the branches'}
                                            options={branches}/>
                        </div>
                    )}

                </div>
                <p style={{color:'#225e0e',}}>We will send you the password</p>
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
export default UserForm;
const roleOption =[{label:'Manager',value:'manager'} ,{label:'User',value:'user'}];
