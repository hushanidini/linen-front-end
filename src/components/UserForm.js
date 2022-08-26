import React from 'react';
import '../pages/style/calendar.css'
import { useFormik } from 'formik';
import * as Yup from 'yup';

const UserForm = props => {
    const formik = useFormik({
        initialValues: {},
        validationSchema: Yup.object({
            name: Yup.string().required('Required'),
        }),
        onSubmit: values => {
            const { getFormValue } = props;
            if (getFormValue) {
                getFormValue(values);
            }
        },
    });
    const getInputValue=event=>{
        formik.setFieldValue(event.target.name, event.target.value);
    }
    return (
        <div>
            <form onSubmit={formik.handleSubmit}>
                <div className="form-row">
                    <div className="form-group col-md-4">
                        <label htmlFor="inputPassword4">Name</label>
                        <input className="form-control"
                               placeholder="Name"
                               id={'name'}
                               name={'name'}
                               value={formik.values.name}
                               onChange={event=>getInputValue(event )}
                        />
                    </div>
                    <div className="form-group col-md-4">
                        <label htmlFor="inputEmail4">Email</label>
                        <input type="email"
                               className="form-control"
                               placeholder="Email"
                               id={'email'}
                               name={'email'}
                               value={formik.values.email}
                               onChange={event=>getInputValue(event)}/>

                    </div>
                    <div className="form-group col-md-4">
                        <label htmlFor="inputAddress">Phone number</label>
                        <input type="text"
                               className="form-control"
                               placeholder="Phone number"
                               id={'phone'}
                               name={'phone'}
                               value={formik.values.phone}
                               onChange={event=>getInputValue(event)}/>
                    </div>
                </div>
                <div className="form-row">
                    <div className="form-group col-md-6">
                        <label htmlFor="inputAddress2">Photographer's First and Last Name *</label>
                        <input type="text" className="form-control"
                               placeholder="Photographer's First and Last Name *"
                               id={'photographer_name'}
                               name={'photographer_name'}
                               value={formik.values.photographer_name}
                               onChange={event=>getInputValue(event)}/>
                    </div>
                    <div className="form-group col-md-6">
                        <label htmlFor="inputState">Type of shoot</label>
                        <select className="form-control"
                                id={'shoot_type'}
                                name={'shoot_type'}
                                value={formik.values.shoot_type}
                                onChange={event=>getInputValue(event)}>
                            <option selected>Choose...</option>
                            <option>night</option>
                        </select>
                    </div>
                </div>

                <div className="form-row">
                    <div className="form-group col-md-12">
                        <label htmlFor="inputCity">Note</label>
                        <textarea type="text" rows="4" cols="50" className="form-control form-control-lg"
                                  id={'note'}
                                  name={'note'}
                                  value={formik.values.note}
                                  onChange={event=>getInputValue(event)}/>
                    </div>


                </div>
                <div className="form-group">
                    <div className="form-check">
                        <input className="form-check-input" type="checkbox" id="gridCheck"/>
                            <label className="form-check-label" htmlFor="gridCheck">
                                I agree to Terms and Conditions

                            </label>
                    </div>
                </div>
                <button  type={'submit'} className="btn btn-success"
                        >Proceed To Payment</button>
            </form>
        </div>
    );
}
export default UserForm;
