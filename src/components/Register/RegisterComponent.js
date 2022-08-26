import React from 'react';
import UserRegisterForm from "../forms/UserRegisterForm";

const RegisterComponent = ({getFormValue, errors}) => {

    return (
        <div className="mt-5 card_wrapper">
            <h3 className="pb-3 d-flex justify-content-center">Register</h3>

            <UserRegisterForm getFormValue={getFormValue} errors={errors}/>
        </div>

    )
}
export default RegisterComponent;
