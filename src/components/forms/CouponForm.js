import React from 'react';
import {useFormik} from 'formik';
import * as Yup from 'yup';
import {makeStyles} from '@material-ui/core/styles'
import InputText from "../core/InputText/InputText";
import {get} from 'lodash';
import CustomDateTimePicker from "../core/DateTimePicker/DateTimePicker";
import moment from "moment";
import InputRadio from "../core/inputRadio/InputRadio";
import MultipleSelect from "../core/MultipleSelect/MultipleSelect";
import MultipleSelectWithSearch from "../core/MultipleSelect/MultipleSelectWithSearch";

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

const CouponForm = props => {
    const {errors, initialValues ,
        branches,
        searchValue,
        users,
        services,
        memberships} = props;
    const classes = useStyles();

    const formik = useFormik({
        initialValues: {
            title: get(initialValues, 'title', ''),
            is_override: get(initialValues, 'is_override', false),
            is_display: get(initialValues, 'is_display', false),
            off_percentage: get(initialValues, 'off_percentage', ''),
            over_value: get(initialValues, 'over_value', ''),
            coupon_start: get(initialValues, 'coupon_start', moment().add(1, 'day').format('YYYY-MM-DD HH:mm:ss'),),
            coupon_expire: get(initialValues, 'coupon_expire', moment().add(2, 'day').format('YYYY-MM-DD HH:mm:ss'),),
            max_no_of_use: get(initialValues, 'max_no_of_use', ''),
            member_ship_ids: get(initialValues, 'member_ship_ids', []),
            user_ids: get(initialValues, 'user_ids', []),
            branch_ids: get(initialValues, 'branch_ids', []),
            service_ids: get(initialValues, 'service_ids', []),
        },
        validationSchema: Yup.object({
            title: Yup.string().min(3, "title must be at least 3 characters").required('Required'),
            off_percentage: Yup.number().required('Required'),
            coupon_start: Yup.string().required('Required'),
            coupon_expire: Yup.string().required('Required'),
            max_no_of_use: Yup.number().required('Required'),
            over_value: Yup.number().required('Required'),


            is_override: Yup.bool(),
            is_display: Yup.bool(),
            // is_all_users: Yup.bool(),
            // user_ids: Yup.array().when('is_all_users', {
            //     is: val => (!val),
            //     then: Yup.array().required("Required")
            // }),
            // branch_ids: Yup.array().required('Required'),
            // service_ids: Yup.array().required('Required'),


        }),
        onSubmit: values => {
            console.log(values);
            const {getFormValue} = props;
            if (getFormValue) {
                getFormValue(values);
            }
        },
    });
    // const mapSelectedUsers=selectedValue=>{
    //     let selectedOptions=[];
    //     selectedValue.forEach(selectBranch=>{
    //         const data = branches.filter(data=>data.id === selectBranch.id)[0];
    //         if(!isEmpty(data)){
    //             selectedOptions.push(data);
    //         }
    //     });
    //     return selectedOptions;
    // }
    return (
        <div style={{padding: '30px', paddingTop: '0', paddingLeft: '15px'}}>
            <form onSubmit={formik.handleSubmit}>
                <div className="form-row">
                    <div className="form-group col-md-6">
                        <InputText
                            id={'title'}
                            label={'Title'}
                            placeholder={"Please enter"}
                            value={formik.values.title}
                            error={Boolean(formik.errors.title) && formik.touched.title}
                            errorMessage={formik.errors.title}
                            getValue={value => formik.setFieldValue('title', value)}
                            onBlur={() => formik.setFieldTouched('title')}
                        />
                    </div>
                    <div className="form-group col-md-6">
                        <InputText
                            id={'off_percentage'}
                            label={'Off percentage (%)'}
                            placeholder={"Please enter"}
                            value={formik.values.off_percentage}
                            error={Boolean(formik.errors.off_percentage) && formik.touched.off_percentage}
                            errorMessage={formik.errors.off_percentage}
                            getValue={value => formik.setFieldValue('off_percentage', value)}
                            onBlur={() => formik.setFieldTouched('off_percentage')}
                        />

                    </div>
                    <div className="form-group col-md-6">
                        <CustomDateTimePicker
                            id={'coupon_start'}
                            label={'Coupon activation'}
                            placeholder={"Please enter"}
                            value={formik.values.coupon_start}
                            error={Boolean(formik.errors.coupon_start) && formik.touched.coupon_start}
                            errorMessage={formik.errors.coupon_start}
                            getValue={value => formik.setFieldValue('coupon_start', value)}
                        />
                    </div>
                    <div className="form-group col-md-6">
                        <CustomDateTimePicker
                            id={'coupon_expire'}
                            label={'Coupon Expire'}
                            placeholder={"Please enter"}
                            value={formik.values.coupon_expire}
                            error={Boolean(formik.errors.coupon_expire) && formik.touched.coupon_expire}
                            errorMessage={formik.errors.coupon_expire}
                            getValue={value => formik.setFieldValue('coupon_expire', value)}
                        />
                    </div>
                    <div className="form-group col-md-4">
                        <InputText
                            id={'max_no_of_use'}
                            label={'Max number of use'}
                            placeholder={"Please enter a number"}
                            value={formik.values.max_no_of_use}
                            error={Boolean(formik.errors.max_no_of_use) && formik.touched.max_no_of_use}
                            errorMessage={formik.errors.max_no_of_use}
                            getValue={value => formik.setFieldValue('max_no_of_use', value)}
                            onBlur={() => formik.setFieldTouched('max_no_of_use')}
                        />
                    </div>
                    <div className="form-group col-md-4" style={{display: 'flex', alignItems: 'center'}}>
                        <InputRadio
                            id={'is_override'}
                            label={'Is override'}
                            value={formik.values.is_override}
                            error={Boolean(formik.errors.is_override) && formik.touched.is_override}
                            errorMessage={formik.errors.is_override}
                            getValue={value => formik.setFieldValue('is_override', value)}
                            onBlur={() => formik.setFieldTouched('is_override')}
                        />
                    </div>

                    <div className="form-group col-md-4">
                        <InputText
                            id={'over_value'}
                            label={'Over value'}
                            placeholder={"Please enter a over value"}
                            value={formik.values.over_value}
                            error={Boolean(formik.errors.over_value) && formik.touched.over_value}
                            errorMessage={formik.errors.over_value}
                            getValue={value => formik.setFieldValue('over_value', value)}
                            onBlur={() => formik.setFieldTouched('over_value')}
                        />
                    </div>

                    <div className="form-group col-md-4" style={{display: 'flex', alignItems: 'center'}}>
                        <InputRadio
                            id={'is_display'}
                            label={'Is display'}
                            value={formik.values.is_display}
                            error={Boolean(formik.errors.is_display) && formik.touched.is_display}
                            errorMessage={formik.errors.is_display}
                            getValue={value => formik.setFieldValue('is_display', value)}
                            onBlur={() => formik.setFieldTouched('is_display')}
                        />
                    </div>

                    <div className="form-group col-md-4" style={{display: 'flex', alignItems: 'center'}}>
                        <MultipleSelect
                            id={'member_ship_ids'}
                            label={'Memberships list'}
                            placeholder={"Please select the memberships"}
                            setValue={value => formik.setFieldValue('member_ship_ids', value)}
                            selected={[]}
                            options={memberships}
                            error={Boolean(formik.errors.member_ship_ids) && formik.touched.member_ship_ids}
                            errorMessage={formik.errors.member_ship_ids}
                            onBlur={() => formik.setFieldTouched('member_ship_ids')}
                        />
                    </div>

                    <div className="form-group col-md-4">
                        <MultipleSelectWithSearch
                            id={'user_ids'}
                            label={'Users'}
                            placeholder={"Please enter a number"}
                            setValue={value => formik.setFieldValue('user_ids', value)}
                            selected={[]}
                            options={users}
                            searchValue={val=>searchValue(val)}
                            error={Boolean(formik.errors.user_ids) && formik.touched.user_ids}
                            errorMessage={formik.errors.user_ids}
                            onBlur={() => formik.setFieldTouched('user_ids')}
                        />
                    </div>


                    <div className="form-group col-md-6">
                        <MultipleSelect
                            id={'branch_ids'}
                            label={'Locations'}
                            placeholder={"Please enter a number"}
                            value={formik.values.branch_ids}
                            error={Boolean(formik.errors.branch_ids) && formik.touched.branch_ids}
                            errorMessage={formik.errors.branch_ids}
                            setValue={value => formik.setFieldValue('branch_ids', value)}
                            selected={[]}
                            options={branches}
                            onBlur={() => formik.setFieldTouched('branch_ids')}
                        />
                    </div>
                    <div className="form-group col-md-6">
                        <MultipleSelect
                            id={'service_ids'}
                            label={'Services'}
                            placeholder={"Please enter a number"}
                            setValue={value => formik.setFieldValue('service_ids', value)}
                            selected={[]}
                            options={services}
                            error={Boolean(formik.errors.service_ids) && formik.touched.service_ids}
                            errorMessage={formik.errors.service_ids}
                            onBlur={() => formik.setFieldTouched('service_ids')}
                        />
                    </div>

                {/*for test*/}


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

export default CouponForm;
