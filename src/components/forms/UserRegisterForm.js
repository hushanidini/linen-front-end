import React, {useEffect} from 'react';
import {useFormik} from "formik";
import * as Yup from "yup";
import BootstrapInputText from "../core/InputText/BootstrapInputText";
import config from "../../utils/config";



const SITE_KEY = config.captcha_key;

const UserRegisterForm = (props) => {
    const {errors} = props;

    const formik = useFormik({
        initialValues: {
            firstname:'',
            lastname:'',
            email:'',
            phone:'',
            password:'',
            confirm_password:'',
        },
        validationSchema: Yup.object({
            firstname: Yup.string().required('Required'),
            lastname: Yup.string().required('Required'),
            email: Yup.string().email('Invalid email').required('Required'),
            phone: Yup.string().required('Required'),
            password: Yup.string().required('Required'),
            confirm_password: Yup.string().when('password' ,{
                is:val => (val && val.length > 0 ? true : false),
                then: Yup.string().oneOf(
                    [Yup.ref('password')],
                    "Both password need to be same"
                )
            })
        }),
        onSubmit: values => {
            const {getFormValue} = props;
            if (getFormValue) {
                // getFormValue(values);
                formSubmit(values);
            }
        },
    });

    const formSubmit = values => {
        const {getFormValue} = props;
        window.grecaptcha.ready(() => {
            window.grecaptcha.execute(SITE_KEY, { action: 'submit' }).then(token => {
                if (getFormValue) {
                    getFormValue(values);
                }
            });
        });
    }


    useEffect(() => {
        const loadScriptByURL = (id, url, callback) => {
            const isScriptExist = document.getElementById(id);

            if (!isScriptExist) {
                var script = document.createElement("script");
                script.type = "text/javascript";
                script.src = url;
                script.id = id;
                script.onload = function () {
                    if (callback) callback();
                };
                document.body.appendChild(script);
            }

            if (isScriptExist && callback) callback();
        }

        // load the script by passing the URL
        loadScriptByURL("recaptcha-key", `https://www.google.com/recaptcha/api.js?render=${SITE_KEY}`, function () {
            console.log("Script loaded!");
        });
    }, []);

    return (
        <div>
            <form className="stepform" onSubmit={formik.handleSubmit}>
                <fieldset className="">
                    <p>
                        <BootstrapInputText
                            placeholder="First Name"
                            id={'firstname'}
                            name={'firstname'}
                            value={formik.values.firstname}
                            error={Boolean(formik.errors.firstname) && formik.touched.firstname}
                            errorMessage={formik.errors.firstname}
                            getValue={value => formik.setFieldValue('firstname', value)}
                            onBlur={() => formik.setFieldTouched('firstname')}
                        />
                    </p>
                    <p>
                        <BootstrapInputText
                            placeholder="Last Name"
                            id={'lastname'}
                            name={'lastname'}
                            value={formik.values.lastname}
                            error={Boolean(formik.errors.lastname) && formik.touched.lastname}
                            errorMessage={formik.errors.lastname}
                            getValue={value => formik.setFieldValue('lastname', value)}
                            onBlur={() => formik.setFieldTouched('lastname')}/>
                    </p>
                    <p>
                        <BootstrapInputText
                            placeholder="Email Address"
                            name={'email'}
                            type={'email'}
                            value={formik.values.email}
                            error={Boolean(formik.errors.email) && formik.touched.email}
                            errorMessage={formik.errors.email}
                            getValue={value => formik.setFieldValue('email', value)}
                            onBlur={() => formik.setFieldTouched('email')}/>
                    </p>
                    <p>
                        <BootstrapInputText
                            placeholder="Phone Number"
                            name={'phone'}
                            value={formik.values.phone}
                            error={Boolean(formik.errors.phone) && formik.touched.phone}
                            errorMessage={formik.errors.phone}
                            getValue={value => formik.setFieldValue('phone', value)}
                            onBlur={() => formik.setFieldTouched('phone')}/>
                    </p>
                </fieldset>
                <fieldset className="">
                    <p>
                        <BootstrapInputText
                            className="form-control"
                            placeholder="Password"
                            name={'password'}
                            type={"password"}
                            value={formik.values.password}
                            error={Boolean(formik.errors.password) && formik.touched.password}
                            errorMessage={formik.errors.password}
                            getValue={value => formik.setFieldValue('password', value)}
                            onBlur={() => formik.setFieldTouched('password')}/>
                    </p>
                    <p>
                        <BootstrapInputText
                            className="form-control"
                            placeholder="Confirm password"
                            name={'confirm_password'}
                            type={"password"}
                            value={formik.values.confirm_password}
                            error={Boolean(formik.errors.confirm_password) && formik.touched.confirm_password}
                            errorMessage={formik.errors.confirm_password}
                            getValue={value => formik.setFieldValue('confirm_password', value)}
                            onBlur={() => formik.setFieldTouched('confirm_password')}/>
                    </p>

                    <div style={{display:'flex' , flexDirection: 'column' , alignItems: 'center' , justifyContent: 'center' , width:'100%', color:'red' ,padding:'16px'}}>
                        {Object.keys(errors).map(key=>{
                            return (<div>
                                {errors[key].map(error=>{
                                    return( <p>{error}</p>)
                                })}
                            </div>)
                        })}
                    </div>
                    <p className="text-center">
                        <input type="submit" value="Submit" name='submit' className="btn btn-success"/>
                    </p>
                </fieldset>
            </form>
        </div>
    );
}
export default UserRegisterForm;
