import React, {useEffect} from 'react';
import '../../pages/style/login.css';
import {useFormik} from "formik";
import * as Yup from "yup";
import {isEmpty} from "lodash";
import config from "../../utils/config";

const SITE_KEY = config.captcha_key;

const LoginForm = (props) => {
    const {errors} = props;
    console.log(SITE_KEY);

    const formik = useFormik({
        initialValues: {},
        validationSchema: Yup.object({
            email: Yup.string().required('Required'),
            password: Yup.string().required('Required'),
        }),
        onSubmit: values => {
            const {getFormValue} = props;
            if (getFormValue) {
                // formSubmit(values);
                getFormValue(values);
            }
        },
    });
    // const formSubmit = values => {
    //     const {getFormValue} = props;
    //     window.grecaptcha.ready(() => {
    //         window.grecaptcha.execute(SITE_KEY, {action: 'submit'}).then(token => {
    //             if (getFormValue) {
    //                 getFormValue(values);
    //             }
    //         });
    //     });
    // }

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


    const getInputValue = event => {
        formik.setFieldValue(event.target.name, event.target.value);
    }

    return (
        <form onSubmit={formik.handleSubmit}>
            <input type="text"
                   className="form-control user_field"
                   aria-describedby="emailHelp"
                   id={'email'}
                   name={'email'}
                   placeholder={'Email'}
                   value={formik.values.name}
                   onChange={event => getInputValue(event)}
            />
            <p style={Boolean(formik.errors.email) ? {color: 'red', marginTop: '-20px'} : {}}>{formik.errors.email}</p>
            <input type="password"
                   className="form-control"
                   id={'password'}
                   name={'password'}
                   placeholder={'Password'}
                   value={formik.values.name}
                   onChange={event => getInputValue(event)}
            />
            <p style={Boolean(formik.errors.password) ? {
                color: 'red',
                marginTop: '-20px'
            } : {}}>{formik.errors.password}</p>
            {!isEmpty(errors) && (
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '100%',
                    color: 'red',
                    padding: '16px'
                }}>
                    {Object.keys(errors).map(key => {
                        return (<div>
                            {errors[key].map(error => {
                                return (<p>{error}</p>)
                            })}
                        </div>)
                    })}
                </div>
            )}

            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                <input style={{marginTop: 0}} type="submit" name="submit" value="Submit" className="btn"/>
                <a href={true}>Forgot Password?</a>
            </div>

        </form>
    );
}
export default LoginForm;
