import React, {Component} from "react";
import {Divider, withStyles} from "@material-ui/core";
import RootElement from "./component/RootElement";
import ShiftDynamicForm from "../../components/forms/ShiftDynamicForm";
import {addNewShift, deleteShift, fetchShiftByServiceId, updateShift} from "../../services/private/ShiftService";
import Swal from "sweetalert2";
import {chain, cloneDeep, findIndex, isEmpty} from "lodash";
import {getServiceById, updateHtmlTags} from "../../services/private/ServicesService";
import CustomLoader from "../../components/CustomLoader";
import AlertBar from "../../components/core/Alert/AlertBar";
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import DiscountForm from "../../components/forms/DiscountForm";
import CustomDialog from "../../components/core/CustomDialog";
import {addDiscount, deleteDiscount, fetchDiscountByService, updateDiscount} from "../../services/DiscountService";
import DiscountDetails from "../../components/molecule/DiscountDetails";
import ServiceHtmlTagForm from "../../components/forms/ServiceHtmlTagForm";
import moment from 'moment';


const styles = theme => ({
    shifts: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    discounts: {
        display: 'flex',
        minWidth: '600px'
    },
    singleCart: {
        display: 'flex',
        flexWrap: 'wrap',
        flex: '50%',
        height: '100%',
        padding: 12,
        justifyContent: 'space-around',
        [theme.breakpoints.down('md')]: {
            flex: '100%',
        }
    },
    serviceDetails: {
        padding: '24px',
    },
    detail: {
        display: 'flex',
        flexDirection: 'row',
        fontSize: '17px',
        alignItems: 'center',
        '& > :first-child': {
            width: '180px',
        }
    },
    badge:{
        color:'#fff',
        backgroundColor:'#009688',
        padding:'6px  0px',
        width: 180,
        paddingLeft:8,
        textAlign:'left',
        borderRadius:4
    }
});

const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']



class ServiceDetails extends Component {

    constructor(props) {
        super(props);
        this.state = {
            initData: [],
            serviceId: null,
            isLoading: false,
            alertOpen: false,
            alertMessage: '',
            alertType: '',
            serviceDetails: {},
            isShowDiscountDetails: true,
            isShowServiceDetails: true,
            discountFields: [{start: '', end: '', discount: ''}],
            isAddDiscount: false,
            isEditDiscount: false,
            discounts: [],
            discount: {},
            isShowShiftDetails: true,
            errors: {},
            isShowHtmlTag: false,
        }
    }

    componentWillMount() {
        // const field =[{name:'',start_time:'',end_time:''}];
        this.setState({
            initData: days.map(day => ({
                day: day,
                fields: [{
                    name: 'day',
                    start_time: '10:00:00',
                    end_time: '18:00:00',
                    price: 16,
                    actual_price: 10,
                    errors: {},
                    isNew: true
                }],
            }))
        });
    }

    componentDidMount = async () => {
        const {match: {params},} = this.props;
        this.setState({serviceId: params.serviceId, isLoading: true});
        let shiftData = [];
        let shiftFields = [];
        // let mergedData = [];
        try {
            const serviceResponse = await getServiceById(params.serviceId);
            let shiftResponse = await fetchShiftByServiceId(params.serviceId);
            const discountsResponse = await fetchDiscountByService(params.serviceId);
            //have to change here as '!'
            if (!isEmpty(shiftResponse.data)) {
                const groupByDay = chain(shiftResponse.data).groupBy('day').map((value, key) => ({
                    data: value,
                    day: key
                })).value();
                this.setState({
                    initData: []
                });
                groupByDay.forEach(item => {
                    item.data.forEach(shift => {
                        const data = {
                            id: shift.id,
                            name: shift.name,
                            start_time: shift.start_time,
                            end_time: shift.end_time,
                            price: shift.price,
                            actual_price: shift.actual_price,
                            errors: {},
                            isNew: false
                        }
                        shiftFields.push(data);
                    })
                    let data = {
                        day: item.day,
                        fields: shiftFields
                    }
                    shiftData.push(data);
                    data = [];
                    shiftFields = [];
                });

                // mergedData = this.state.initData.map(day => ({
                //     ...day,
                //     fields: shiftData.filter(item => day.day === item.day).map(item => {
                //         return item.fields
                //     })[0] !== undefined ?
                //         shiftData.filter(item => day.day === item.day).map(item => {
                //             return item.fields
                //         })[0] : day.fields
                // }))
            }
            this.setState({
                initData: isEmpty(shiftData) ? this.state.initData : shiftData,
                isLoading: false,
                serviceDetails: serviceResponse.data,
                discounts: discountsResponse.data
            });
        } catch (e) {

        }

    }

    addNewShiftForm = day => {
        const {initData} = this.state;
        const index = initData.findIndex(item => item.day === day);
        initData[index].fields.push({
            name: 'day',
            start_time: '10:00:00',
            end_time: '20:00:00',
            price: 16,
            actual_price: 10,
            errors: {},
            isNew: true
        });

        this.setState(state => {
            return {
                initData: initData
            }
        })
    }

    reLoadData = async () => {
        const {match: {params},} = this.props;
        this.setState({serviceId: params.serviceId})
        try {
            let shiftResponse = await fetchShiftByServiceId(params.serviceId);
            if (!isEmpty(shiftResponse.data)) {
                const groupByDay = chain(shiftResponse.data).groupBy('day').map((value, key) => ({
                    data: value,
                    day: key
                })).value();
                let shiftData = [];
                let shiftFields = [];
                this.setState({
                    initData: []
                });
                groupByDay.forEach(item => {
                    item.data.forEach(shift => {
                        const data = {
                            id: shift.id,
                            name: shift.name,
                            start_time: shift.start_time,
                            end_time: shift.end_time,
                            price: shift.price,
                            actual_price: shift.actual_price,
                            errors: {},
                            isNew: false
                        }
                        shiftFields.push(data);
                    })
                    let data = {
                        day: item.day,
                        fields: shiftFields
                    }
                    shiftData.push(data);
                    data = [];
                    shiftFields = [];
                });
                this.setState({
                    initData: shiftData,
                    isLoading: false
                });
            }
        } catch (e) {
        }
    }

    addNewShiftFormData = (data, day, formIndex) => {
        const {initData} = this.state;
        const index = initData.findIndex(item => item.day === day);
        let merged = {...initData[index].fields[formIndex], ...data};
        initData[index].fields.splice(formIndex, 1, merged);
        this.setState(state => {
            return {
                initData: initData
            }
        })
    }

    timeOverLapsValidations = (weekday, index) => {
        let copyWeekday = cloneDeep(weekday.fields);
        let isError = false;
        weekday.fields.forEach((fieldA, indexA) => {
            const i = findIndex(weekday.fields, fieldA);
            copyWeekday.splice(i, 1);
            copyWeekday.forEach(fieldB => {
                const stat_a = moment(fieldA.start_time, 'HH:mm:ss');
                const stat_b = moment(fieldB.start_time, 'HH:mm:ss');
                const end_a = moment(fieldA.end_time, 'HH:mm:ss');
                const end_b = moment(fieldB.end_time, 'HH:mm:ss');

                if ((moment(stat_a).isBefore(moment(stat_b)) && moment(end_a).isBefore(moment(stat_b))) ||
                    (moment(stat_a).isAfter(moment(end_b)) && moment(end_a).isAfter(moment(end_b)))) {
                    return;
                } else {
                    isError = true;
                }
            });
            copyWeekday = cloneDeep(weekday.fields);
        });
        return isError;
    }

    addOrUpdateAllShifts = async () => {
        const {initData, serviceId} = this.state;
        console.log(initData);
        this.setState({errors:{}});
        let isError = false;
        //validate here
        initData.forEach((weekday, index) => {
            if (this.timeOverLapsValidations(weekday, index)) {
                isError = true;
                this.setState({errors:{[weekday.day]:"Shift schedule are overlapping"},
                    alertOpen: true,
                    alertMessage: `Shift schedule are overlapping on ${weekday.day}`,
                    alertType: 'error'});
                return;
            }else{
            }
        });
        if (isError) return;
        this.setState({isLoading: true});
        if (!this.validateData(initData)) {
            this.setState({isLoading: false});
            return;
        }
        try {
            let promises = [];
            initData.forEach(item => {
                const createPromises = item.fields.map(async field => {
                    //checking isNew or not
                    if (field.isNew) {
                        const data = {
                            service_id: serviceId,
                            day: item.day,
                            name: field.name,
                            start_time: field.start_time,
                            end_time: field.end_time,
                            price: field.price,
                            actual_price: field.actual_price
                        }
                        return await addNewShift(data);
                    } else {
                        const data = {
                            service_id: serviceId,
                            day: item.day,
                            name: field.name,
                            start_time: field.start_time,
                            end_time: field.end_time,
                            price: field.price,
                            actual_price: field.actual_price
                        }
                        return await updateShift(field.id, data);

                    }
                });
                promises = [...promises, ...createPromises];
            });
            await Promise.all(promises);
            await this.reLoadData();
            this.setState({
                alertOpen: true,
                alertMessage: "Process successful.",
                alertType: 'success'
            });
        } catch (e) {
            // await this.reLoadData();
            this.setState({
                isLoading: false,
                alertOpen: true,
                alertMessage: "Please check your latest shift form data!",
                alertType: 'error'
            });
        }
    }

    removeShift = async (day, formIndex) => {
        const {initData} = this.state;
        const index = initData.findIndex(item => item.day === day);
        //have to check delete or remove
        if (initData[index].fields[formIndex].isNew) {
            initData[index].fields.splice(formIndex, 1);
            this.setState(state => {
                return {
                    initData: initData
                }
            })
        } else {
            const swal = await Swal.fire({
                title: 'Are you sure?',
                text: 'You want to delete it.',
                icon: 'error',
                showCloseButton: true,
                showCancelButton: true,
                reverseButtons: true,
                cancelButtonText: `Cancel`,
                confirmButtonText: `Delete`,
                confirmButtonColor: '#ff5252'
            });
            if (swal.value) {
                try {
                    const response = await deleteShift(initData[index].fields[formIndex].id);
                    initData[index].fields.splice(formIndex, 1);
                    this.setState({
                        initData: initData,
                        alertOpen: true,
                        alertMessage: response.message,
                        alertType: 'success'
                    });
                } catch (e) {
                    this.setState({
                        isLoading: false,
                        alertOpen: true,
                        alertMessage: 'Something went wrong!',
                        alertType: 'error'
                    })
                }


            }


        }

    }

    validateData = (dataSet) => {
        let error = []
        dataSet.forEach((day, i1) => {
            const err = day.fields.filter(item => !isEmpty(item.errors))[0];
            error.push(err);
        });
        const isError = error.filter(i => i !== undefined);
        if (isEmpty(isError)) {
            return true
        } else {
            return false
        }

    }

    updateDiscount = async val => {
        this.setState({isLoading: true, errors: {}});
        const {discounts, discount, serviceId} = this.state;
        try {
            const data = {
                ...val,
                service_id: serviceId
            }
            const response = await updateDiscount(discount.id, data);
            const index = findIndex(discounts, {id: val.id});
            discounts.splice(index, 1, response.data);
            this.setState({
                discounts: discounts, isLoading: false,
                isEditDiscount: false,
                isOpen: false,
                alertOpen: true,
                alertMessage: "Discount added successfully.",
                alertType: 'success'
            });
        } catch (e) {
            if (e.response && e.response.data && e.response.data.errors) {
                this.setState({
                    isLoading: false,
                    errors: e.response.data.errors
                });
            } else {
                this.setState({
                    isLoading: false,
                    isEditDiscount: false,
                    isOpen: false,
                    alertOpen: true,
                    alertMessage: "Something went wrong.",
                    alertType: 'error'
                });
            }
        }
    }

    saveDiscount = async val => {
        this.setState({isLoading: true, errors: {}});
        const {discounts, serviceId} = this.state;
        try {
            const data = {
                ...val,
                service_id: serviceId
            }
            const response = await addDiscount(data);
            this.setState({
                discounts: [...discounts, response.data], isLoading: false,
                isAddDiscount: false,
                isOpen: false,
                alertOpen: true,
                alertMessage: "Discount added successfully.",
                alertType: 'success'
            });
        } catch (e) {
            if (e.response && e.response.data && e.response.data.errors) {
                this.setState({
                    isLoading: false,
                    errors: e.response.data.errors
                });
            } else {
                this.setState({
                    isLoading: false,
                    isAddDiscount: false,
                    isOpen: false,
                    alertOpen: true,
                    alertMessage: "Something went wrong.",
                    alertType: 'error'
                });
            }

        }
    }

    deleteDiscount = async val => {
        const swal = await Swal.fire({
            title: 'Are you sure?',
            text: 'You want to save the changes.',
            icon: 'success',
            showCloseButton: true,
            showCancelButton: true,
            reverseButtons: true,
            cancelButtonText: `Cancel`,
            confirmButtonText: `Delete`,
            confirmButtonColor: '#ff5252'
        });
        if (swal.value) {
            try {
                const response = await deleteDiscount(val.id);
                this.setState({
                    discounts: this.state.discounts.filter(item => item.id !== val.id),
                    alertOpen: true,
                    alertMessage: response.message,
                    alertType: 'success'
                });
            } catch (e) {
                this.setState({
                    isLoading: false,
                    alertOpen: true,
                    alertMessage: 'Something went wrong!',
                    alertType: 'error'
                });
            }


        }
    }

    updateHtmlTags = async text => {
        this.setState({isLoading: true})
        const {serviceDetails} = this.state;
        let top = text.top_tag;
        let bottom = text.bottom_tag;

        const data = {
            top_tag: top,
            bottom_tag: bottom
        }
        console.log(data);
        try {
            const response = await updateHtmlTags(serviceDetails.id, data);
            const ser = {
                ...serviceDetails,
                top_tag: response.data.top_tag,
                bottom_tag: response.data.bottom_tag
            }
            this.setState({
                serviceDetails: ser,
                isLoading: false,
                alertOpen: true,
                alertMessage: response.message,
                alertType: 'success'
            });

        } catch (e) {
            this.setState({
                isLoading: false,
                alertOpen: true,
                alertMessage: 'Something went wrong!',
                alertType: 'error'
            });
        }
    }

    convertHtmlTags = html => {
        return <div dangerouslySetInnerHTML={{__html: html}}/>;
    }

    render() {
        const {classes} = this.props;
        const {
            initData,
            isLoading,
            alertOpen,
            alertMessage,
            serviceDetails,
            alertType,
            isShowServiceDetails,
            isShowDiscountDetails,
            isEditDiscount,
            isOpen,
            isAddDiscount,
            discounts,
            discount,
            isShowShiftDetails,
            errors, isShowHtmlTag
        } = this.state;
        return (
            <RootElement>
                {!isEmpty(serviceDetails) && (
                    <div className={classes.serviceDetails}>
                        <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center', cursor: 'pointer'}}
                             onClick={() => this.setState({isShowServiceDetails: !this.state.isShowServiceDetails})}>
                            <h3>Service details</h3>
                            {isShowServiceDetails ? <ExpandMoreIcon/> :
                                <ExpandLessIcon/>}
                        </div>
                        <Divider style={{margin: '4px 0px'}}/>
                        {isShowServiceDetails && (
                            <div className="row" style={{padding: '12px 0 0 12px'}}>
                                <div className="col-6">
                                    <div className={classes.detail}>
                                        <p>Service name</p>
                                        <p className={classes.badge}>{serviceDetails.name}</p>
                                    </div>
                                    <div className={classes.detail}>
                                        <p>Service type</p>
                                        <p className={classes.badge}>{serviceDetails.type}</p>
                                    </div>
                                    <div className={classes.detail}>
                                        <p>Max reservation</p>
                                        <p className={classes.badge}>{serviceDetails.max_reservation}</p>
                                    </div>
                                    <div className={classes.detail}>
                                        <p>Tax</p>
                                        <p className={classes.badge}>{serviceDetails.tax}%</p>
                                    </div>
                                </div>
                                <div className="col-6">
                                    <div className={classes.detail}>
                                        <p>Branch name</p>
                                        <p className={classes.badge}>{serviceDetails.branch.name}</p>
                                    </div>
                                    <div className={classes.detail}>
                                        <p>Branch email</p>
                                        <p className={classes.badge}>{serviceDetails.branch.email}</p>
                                    </div>
                                    <div className={classes.detail}>
                                        <p>Branch phone</p>
                                        <p className={classes.badge}>{serviceDetails.branch.phone}</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                <div className={classes.serviceDetails}>
                    <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center', cursor: 'pointer'}}
                         onClick={() => this.setState({isShowDiscountDetails: !this.state.isShowDiscountDetails})}>
                        <h3>Discount details</h3>
                        {isShowDiscountDetails ? <ExpandMoreIcon/> :
                            <ExpandLessIcon/>}
                    </div>
                    <Divider style={{margin: '4px 0px'}}/>
                    {isShowDiscountDetails && (
                        <DiscountDetails
                            addNewDiscount={() => this.setState({isOpen: true, isAddDiscount: true})}
                            deleteDiscount={(val) => this.deleteDiscount(val)}
                            openUpdate={(discount) => this.setState({discount, isOpen: true, isEditDiscount: true})}
                            discounts={discounts}
                        />
                    )}

                </div>

                <div className={classes.serviceDetails}>
                    <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
                        <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center', cursor: 'pointer'}}
                             onClick={() => this.setState({isShowShiftDetails: !this.state.isShowShiftDetails})}>
                            <h3>Shift schedule details</h3>
                            {isShowShiftDetails ? <ExpandMoreIcon/> :
                                <ExpandLessIcon/>}
                        </div>
                        {isShowShiftDetails && (
                            <button style={{margin: '0px'}}
                                    onClick={() => this.addOrUpdateAllShifts()}
                                    className="btn btn-success"
                            >Save
                            </button>
                        )}
                    </div>
                    <Divider style={{margin: '4px 0px'}}/>
                    {isShowShiftDetails && (
                        <div className={classes.shifts}>
                            {initData.map(day => {
                                return (
                                    <div className={classes.singleCart}>
                                        <div className="card bg-light mb-3">
                                            <div className="card-header" style={{
                                                display: 'flex',
                                                flexDirection: 'row',
                                                justifyContent: 'space-between',
                                                alignItems: 'center',

                                            }}>
                                                <div>{day.day.charAt(0).toUpperCase() + day.day.slice(1)}</div>
                                                <div>
                                                    <button style={{margin: '0px'}}
                                                            onClick={() => this.addNewShiftForm(day.day)}
                                                            className="btn btn-light"
                                                    >Add shift
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="card-body">
                                                <h5 className="card-title">Shift details</h5>
                                                {day.fields.map((field, index) => {
                                                    return (
                                                        <ShiftDynamicForm initialValues={field}
                                                                          removeShift={() => this.removeShift(day.day, index)}
                                                                          getFormValue={(shiftData => this.addNewShiftFormData(shiftData, day.day, index))}/>
                                                    )
                                                })}

                                            </div>
                                            <div style={{
                                                display: 'flex',
                                                flexDirection: 'row',
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                                padding: '10px',
                                                color: 'red'
                                            }}>
                                                {!isEmpty(errors) && (
                                                    <div>
                                                        {errors[day.day]}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}

                </div>

                <div className={classes.serviceDetails}>
                    <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center', cursor: 'pointer'}}
                         onClick={() => this.setState({isShowHtmlTag: !this.state.isShowHtmlTag})}>
                        <h3>Service top and bottom html tags</h3>
                        {isShowHtmlTag ? <ExpandMoreIcon/> :
                            <ExpandLessIcon/>}
                    </div>
                    <Divider style={{margin: '4px 0px'}}/>
                    {isShowHtmlTag && (
                        <div className="row" style={{padding: '12px 0 0 12px'}}>
                            <div className="col-12">
                                <ServiceHtmlTagForm initialValues={serviceDetails} errors={{}}
                                                    getFormValue={value => this.updateHtmlTags(value)}/>
                            </div>
                            <div> It's for testing.... <br/>{this.convertHtmlTags(serviceDetails.bottom_tag)}</div>
                        </div>
                    )}
                </div>

                {isOpen && (
                    <CustomDialog
                        closeDialog={() => this.setState({isOpen: false, isAddDiscount: false, isEditDiscount: false})}
                        isNoteOpen={isOpen}>
                        {isAddDiscount && (
                            <DiscountForm initialValues={''}
                                          errors={errors}
                                          handleClose={() => this.setState({isOpen: false, isAddDiscount: false})}
                                          getFormValue={(value) => this.saveDiscount(value)}/>
                        )}
                        {isEditDiscount && (
                            <DiscountForm initialValues={discount}
                                          errors={errors}
                                          handleClose={() => this.setState({isOpen: false, isEditDiscount: false})}
                                          getFormValue={(value) => this.updateDiscount(value)}/>
                        )}
                    </CustomDialog>
                )}
                {isLoading && (
                    <CustomLoader isNoteOpen={true}/>
                )}

                {alertOpen && (
                    <AlertBar alertMessage={alertMessage}
                              alertType={alertType}
                              onClose={() => this.setState({alertOpen: false})}/>
                )}
            </RootElement>
        )
    }
}

export default withStyles(styles)(ServiceDetails);
