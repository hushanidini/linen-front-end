import React from 'react';
import img from '../../assets/img/logo2.png';
import LoginForm from "../forms/LoginForm";
import {useHistory} from "react-router";

const LoginComponent = ({getFormValue, errors, ...props}) => {
    const history=useHistory();
    return (
        <div className="container pt-5">
            <div className="row">
                <div className="col-md-3"></div>

                <div className="col-md-6">
                    <div className="col-md-12 d-flex justify-content-center">
                        <img src={img} alt="" className="col-md-6"/>
                    </div>

                    <div className="mt-5 card_wrapper">
                        <h3 className="pb-3 d-flex justify-content-center">Login</h3>

                        <LoginForm getFormValue={getFormValue} errors={errors}/>
                    </div>

                    <div className="d-flex justify-content-center">
                        <p className="p-4">
                            <a href={true} style={{
                                cursor: 'pointer',
                                color: '#007bff'
                            }}
                               onClick={() => history.push('register')}>Create New Account</a>
                        </p>
                    </div>

                </div>
            </div>
        </div>
    )
}
export default LoginComponent;
