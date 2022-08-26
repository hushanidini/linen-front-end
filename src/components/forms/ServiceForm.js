import React from 'react';
import {useFormik} from 'formik';
import * as Yup from 'yup';
import {makeStyles} from '@material-ui/core/styles'
import InputText from "../core/InputText/InputText";
import InputSelect from "../core/InputSelect/InputSelect";


const useStyles = makeStyles(theme => ({
    footer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-end',
        '&>:first-child': {
            marginRight: '12px'
        }
    }
}));
const ServiceForm = props => {
    const {initialValues, branches, errors} = props;
    const classes = useStyles();

    const formik = useFormik({
        initialValues: {
            branch_id: initialValues.branch_id ? initialValues.branch_id : '',
            name: initialValues.name ? initialValues.name : '',
            color: initialValues.color ? initialValues.color : '',
            tax: initialValues.tax ? initialValues.tax : '',
            type: initialValues.type ? initialValues.type : '',
            max_reservation: initialValues.max_reservation ? initialValues.max_reservation : '',

        },
        validationSchema: Yup.object({
            name: Yup.string().required('Required'),
            type: Yup.string().required('Required'),
            color: Yup.string().required('Required'),
            max_reservation: Yup.string().required('Required'),
            tax: Yup.string().required('Required'),
        }),
        onSubmit: values => {
            const {getFormValue} = props;
            if (getFormValue) {
                getFormValue(values);
            }
        },
    });
    // const getInputValue = event => {
    //     formik.setFieldValue(event.target.name, event.target.value);
    // }
    // const onChangeBranch = event => {
    //     formik.setFieldValue(event.target.name, event.target.value);
    // }
    const serviceTypes = [
        {label: 'Studio', value: 'studio'},
        {label: 'Makeup room', value: 'makeup_room'},
        {label: 'Lights', value: 'lights'},
    ];
    const serviceColor = [
        {label: 'blue', value: '#0d6efd'},
        {label: 'indigo room', value: '#6610f2'},
        {label: 'purple', value: '#6f42c1'},
        {label: 'pink', value: '#d63384'},
        {label: 'red room', value: '#dc3545'},
        {label: 'orange', value: '#fd7e14'},
        {label: 'yellow', value: '#ffc107'},
        {label: 'green room', value: '#198754'},
        {label: 'teal', value: '#20c997'},
        {label: 'cyan', value: '#0dcaf0'},
    ];

    return (
        <div style={{padding: '24px', paddingTop: '0'}}>
            <form onSubmit={formik.handleSubmit} style={{marginTop: '0px'}}>
                <div className="form-row">
                    <div className="form-group col-md-6">
                        <InputSelect
                            selected={formik.values.branch_id}
                            options={branches}
                            placeholder={'Please select location'}
                            label={'Locations'}
                            getValue={value => formik.setFieldValue('branch_id', value)}
                        />
                    </div>
                    <div className="form-group col-md-6">
                        <InputText
                            id={'name'}
                            label={'Service name'}
                            placeholder={"Please enter (Ex: Willo)"}
                            value={formik.values.name}
                            error={Boolean(formik.errors.name) && formik.touched.name}
                            errorMessage={formik.errors.name}
                            getValue={value => formik.setFieldValue('name', value)}
                            onBlur={() => formik.setFieldTouched('name')}
                        />

                    </div>
                    <div className="form-group col-md-6">
                        <InputSelect
                            selected={formik.values.type}
                            options={serviceTypes}
                            label={'Services'}
                            placeholder={'Please select service'}
                            getValue={value => formik.setFieldValue('type', value)}
                        />
                        {/*<InputText*/}
                        {/*    id={'type'}*/}
                        {/*    label={'Type'}*/}
                        {/*    placeholder={"Type"}*/}
                        {/*    value={formik.values.type}*/}
                        {/*    error={Boolean(formik.errors.type) && formik.touched.type}*/}
                        {/*    errorMessage={formik.errors.type}*/}
                        {/*    getValue={value => formik.setFieldValue('type',value)}*/}
                        {/*    onBlur={()=>formik.setFieldTouched('type')}*/}
                        {/*/>*/}

                    </div>
                    <div className="form-group col-md-6">
                        <InputText
                            id={'max_reservation'}
                            label={'Maximum reservation per slot'}
                            placeholder={"Please enter (Ex: 1)"}
                            value={formik.values.max_reservation}
                            error={Boolean(formik.errors.max_reservation) && formik.touched.max_reservation}
                            errorMessage={formik.errors.max_reservation}
                            getValue={value => formik.setFieldValue('max_reservation', value)}
                            onBlur={() => formik.setFieldTouched('max_reservation')}
                        />

                    </div>

                    <div className="form-group col-md-6">
                        <InputText
                            id={'tax'}
                            label={'Tax (%)'}
                            placeholder={"Please enter (Ex: 1)"}
                            value={formik.values.tax}
                            error={Boolean(formik.errors.tax) && formik.touched.tax}
                            errorMessage={formik.errors.tax}
                            getValue={value => formik.setFieldValue('tax', value)}
                            onBlur={() => formik.setFieldTouched('tax')}
                        />
                    </div>

                    <div className="form-group col-md-6">
                        <InputSelect
                            selected={formik.values.color}
                            options={serviceColor}
                            label={'Color'}
                            placeholder={'Please select color'}
                            error={Boolean(formik.errors.color) && formik.touched.color}
                            errorMessage={formik.errors.color}
                            getValue={value => formik.setFieldValue('color', value)}
                        />
                        {/*<InputText*/}
                        {/*    id={'color'}*/}
                        {/*    label={'Color code'}*/}
                        {/*    placeholder={"Please enter"}*/}
                        {/*    value={formik.values.color}*/}
                        {/*    error={Boolean(formik.errors.color) && formik.touched.color}*/}
                        {/*    errorMessage={formik.errors.color}*/}
                        {/*    getValue={value => formik.setFieldValue('color', value)}*/}
                        {/*    onBlur={() => formik.setFieldTouched('color')}*/}
                        {/*/>*/}
                    </div>
                </div>
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
                <div className={classes.footer}>
                    <button onClick={props.handleClose && props.handleClose} className="btn btn-danger">Cancel</button>
                    <button type={'submit'} className="btn btn-success">Save</button>
                </div>
            </form>
        </div>
    );
}
export default ServiceForm;
