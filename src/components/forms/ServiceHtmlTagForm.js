import React from 'react';
import {useFormik} from 'formik';
import * as Yup from 'yup';
import {makeStyles} from '@material-ui/core/styles'
import {TextareaAutosize} from "@material-ui/core";


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
const ServiceHtmlTagForm = props => {
    const {initialValues, errors} = props;
    const classes = useStyles();

    const formik = useFormik({
        initialValues: {
            top_tag: initialValues.top_tag ? initialValues.top_tag : '',
            bottom_tag: initialValues.bottom_tag ? initialValues.bottom_tag : '',

        },
        validationSchema: Yup.object({
            top_tag: Yup.string().required('Required'),
            bottom_tag: Yup.string().required('Required'),
        }),
        onSubmit: values => {
            const {getFormValue} = props;
            if (getFormValue) {
                getFormValue(values);
            }
        },
    });

    return (
        <div style={{padding: '24px', paddingTop: '0'}}>
            <form onSubmit={formik.handleSubmit} style={{marginTop: '0px'}} >
                <div className="form-row">

                    <div className="form-group col-md-6">
                        <label style={Boolean(formik.errors.top_tag)?{color: 'red'}:{}}>Top tag</label>
                        <TextareaAutosize
                            id={'top_tag'}
                            style={{width: '100%'}}
                            aria-label="Top tag"
                            rowsMin={8}
                            rowsMax={18}
                            placeholder="Top tag"
                            value={formik.values.top_tag}
                            error={Boolean(formik.errors.top_tag) && formik.touched.top_tag}
                            errorMessage={formik.errors.top_tag}
                            onChange={event=>formik.setFieldValue('top_tag', event.target.value)}
                            onBlur={() => formik.setFieldTouched('top_tag')}
                        />
                        <p style={{color: 'red'}}>{formik.errors.top_tag}</p>
                    </div>
                    <div className="form-group col-md-6">
                        <label style={Boolean(formik.errors.bottom_tag)?{color: 'red'}:{}}>Bottom tag</label>
                        <TextareaAutosize
                            id={'bottom_tag'}
                            style={{width: '100%'}}
                            aria-label="Bottom tag"
                            rowsMin={8}
                            rowsMax={18}
                            placeholder="Bottom tag"
                            value={formik.values.bottom_tag}
                            error={Boolean(formik.errors.bottom_tag) && formik.touched.bottom_tag}
                            errorMessage={formik.errors.bottom_tag}
                            onChange={event => formik.setFieldValue('bottom_tag', event.target.value)}
                            onBlur={() => formik.setFieldTouched('bottom_tag')}
                        />
                        <p style={{color: 'red'}}>{formik.errors.bottom_tag}</p>

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
                    <button type={'submit'} className="btn btn-success">Save</button>
                </div>
            </form>
        </div>
    );
}
export default ServiceHtmlTagForm;
