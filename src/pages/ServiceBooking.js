import React, {Component} from 'react';
import {withStyles} from "@material-ui/core";
import moment from "moment";
import {chain, cloneDeep, find, findIndex, get, isEmpty} from "lodash";
import {fetchShiftByServiceId, getAllShifts} from "../services/private/ShiftService";
import CalendarColumn from "../components/CalendarColumn";
import DatePickerBtn from "../components/core/DatePickerOnlyWithIcon/DatePicker";
import {checkAvailability, fetchBookedData, saveBookingData} from "../services/private/BookingService";
import {connect} from "react-redux";
import {addSlots, clearSlots, removeSlots} from "../store/actions/bookingAction";
import store from "../store";
import CalenderFooter from "../components/layout/CalendarFooter";
import {getAllServices} from "../services/private/ServicesService";
import CustomLoader from "../components/CustomLoader";
import CustomDialog from "../components/core/CustomDialog";
import ServiceListView from "../components/core/ServiceListView";
import AlertBar from "../components/core/Alert/AlertBar";
import {fetchDiscounts} from "../services/DiscountService";
import {checkPromoCode} from "../services/CouponService";
import PublicRootElement from "./admin/component/PublicRootElement";
import {removeBookingDetails} from "../store/actions/bookingDetailsAction";


const styles = theme => ({
    slotColumn: {
        display: 'flex',
        flexDirection: 'row',
        overflow: 'auto',
        scrollBehavior: 'smooth',
        // maxWidth:'900px',
        // padding:theme.spacing(3)
    },
    singleColumn: {
        [theme.breakpoints.up('lg')]: {
            width: 'calc(100% / 7)',
        },
        // width: '-webkit-calc(100% / 7)',
        // padding: '0 2px'
    },
    drawer: {
        [theme.breakpoints.up('sm')]: {
            // width: drawerWidth,
            flexShrink: 0,
        },
        [theme.breakpoints.down('sm')]: {
            width: '0',
            flexShrink: 0,
        },
    },
    drawerPaper: {
        width: '800px',
        backgroundColor: '#FAFAFA',
        borderRight: 'none',
        padding: '8px',
        // paddingRight: '0px',
        overflow: 'hidden',
        marginTop: '0px',
        [theme.breakpoints.down('sm')]: {
            width: '100%',
        },
    },
});


class ServiceBooking extends Component {

    constructor(props) {
        super(props);
        this.mayCalendarRef = React.createRef();
        const {match: {params}} = this.props;
        this.state = {
            date: moment(),
            shiftData: [],
            formatDate: [],
            bookedSlots: [],
            bookingSlots: [],
            isDrawer: false,
            cartHeader: ['#', 'Date', 'Room', 'Time Slot', 'Price', 'Action'],
            service_id: params.serviceId,
            branch_id: params.branchId,
            services: [],
            slotsDetails: [],
            shifts: [],
            discounts: [],
            isLoading: false,
            isOpen: false,
            iaSelect: false,
            coupons: [],
            service: {},
            otherServices: [],
            allServices: [],

        }
    }

    componentDidMount = async () => {
        const {match: {params},} = this.props;
        this.setState({isLoading: true});
        const data = {
            start_date: moment().subtract(1, 'days').format('YYYY-MM-DD HH:mm:ss'),
            end_date: moment().add(7, 'days').format('YYYY-MM-DD HH:mm:ss')
        }
        const allServices = await getAllServices();
        // const services = await getAllServicesByBranch(params.branchId);
        const services = allServices.data.filter(service => parseInt(service.branch_id) === parseInt(params.branchId));
        // const service_id = find(services, {type: 'studio'}).id;
        const service_id = parseInt(params.serviceId);
        const response = await fetchShiftByServiceId(service_id);
        const discountsResponse = await fetchDiscounts(); //all discount
        const responseBookedData = await fetchBookedData(service_id, data);
        const responseShifts = await getAllShifts();
        this.setState({
            shiftData: response.data,
            bookedSlots: responseBookedData.data,
            isLoading: false,
            services: services,
            service: find(services, {id: service_id}),
            otherServices: services.filter(item => item.type !== 'studio'),
            shifts: responseShifts.data,
            discounts: discountsResponse.data,
            allServices: allServices.data,
            service_id
        }, () => this.weekFormat(moment()));
    }

    async componentWillReceiveProps(nextProps, prevProps) {
        if (nextProps.match.params.branchId !== this.props.match.params.branchId ||
            nextProps.match.params.serviceId !== this.props.match.params.serviceId  ) {
            const {date} = this.state;
            const {match: {params},} = nextProps;
            this.setState({isLoading: true});
            const allServices = await getAllServices();

            // const services = await getAllServicesByBranch(params.branchId);
            const services = allServices.data.filter(service => parseInt(service.branch_id) === parseInt(params.branchId));

            const service_id = parseInt(params.serviceId);

            const reqDate = {
                start_date: moment(date, 'YYYY-MM-DD HH:mm:ss').subtract(1, 'days').format('YYYY-MM-DD HH:mm:ss'),
                end_date: moment(date, 'YYYY-MM-DD HH:mm:ss').add(7, 'days').format('YYYY-MM-DD HH:mm:ss')
            }
            const responseBookedData = await fetchBookedData(service_id, reqDate);
            const response = await fetchShiftByServiceId(service_id);
            this.setState({
                services: services,
                service: find(services, {id: service_id}),
                otherServices: services.filter(item => item.type !== 'studio'),
                shiftData: response.data,
                bookedSlots: responseBookedData.data,
                isLoading: true,
                isOpen: false,
                iaSelect: false,
                service_id: service_id,
                allServices: allServices.data
            }, () => this.weekFormat(moment(date)));
        }
        if(nextProps.slots.length !== this.props.slots.length){
            setTimeout(() =>this.weekFormat(this.state.date),
                100);
        }else{
            nextProps.slots.forEach((service , index )=>{
                if(nextProps.slots[index].slots.length !== this.props.slots[index].slots.length ){
                    setTimeout(() =>this.weekFormat(this.state.date),
                        100);
                }
            })
        }
    }

    weekFormat = async date => {
        const { shiftData, bookedSlots} = this.state;
        let weekData = [];
        let initObj = [];
        for (let i = 0; i < 7; i++) {
            weekData.push(moment(date).add(i, 'day').format('YYYY-MM-DD'));
            const obj = {
                day: moment(date).add(i, 'day').format('dddd').toLowerCase(),
                date: moment(date).add(i, 'day').format('YYYY-MM-DD'),
            }
            initObj.push(obj);
        }
        //fetch init shift data here
        const mappedWithShifts = initObj.map(item => ({
            ...item,
            shifts: shiftData.filter(data => item.day === data.day)
        }));
        //if shift are empty
        const forEmpty = mappedWithShifts.map(item => ({
            ...item,
            shifts: !isEmpty(item.shifts) ? item.shifts : [{
                slots: [{
                    dateWithTime: "2021-02-08 10:00:00",
                    status: "There is empty shift"
                }]
            }]
        }));
        this.generateSlots(forEmpty, bookedSlots);
    }

    generateSlots = (data, bookedData) => {
        data.forEach(item => {
            const updateShifts = item.shifts.map(shift => ({
                ...shift,
                slots: this.addSlots(shift.start_time, shift.end_time, item.date, shift, bookedData),
            }));
            item.shifts = updateShifts;
        });
        this.setState({formatDate: data, isLoading: false});
    }

    mappingStatus = (slot, service_id, bookedData) => {
        const {slots} = this.props;
        let isBooking = -1;
        const isBooked = findIndex(bookedData, (e) => {
            return moment(slot, 'YYYY-MM-DD HH:mm:ss').isSame(moment(e, 'YYYY-MM-DD HH:mm'));
        }, 0);
        if (!isEmpty(slots)) {
            slots.filter(data => data.service_id === service_id)
                .forEach(service => {
                    isBooking = findIndex(service.slots, (e) => {
                        return moment(slot, 'YYYY-MM-DD HH:mm:ss').isSame(moment(e.slot, 'YYYY-MM-DD HH:mm'));
                    }, 0)
                });
        }

        // const isBooking =;
        if (isBooked !== -1) {
            return 'booked';
        }
        if (isBooking !== -1) {
            return 'booking';
        }
        return 'available';
    }


    addSlots = (start, end, date, details, bookedData) => {
        const duration = moment.duration(moment(end, 'HH:mm:ss').diff(moment(start, "HH:mm:ss")));
        const hours = duration.asHours();
        let slots = [];
        let data = {}
        for (let i = 0; i < (hours + 1); i++) {
            data = {
                dateWithTime: moment(date + ' ' + start, 'YYYY-MM-DD HH:mm:ss').add(i, 'hour').format('YYYY-MM-DD HH:mm:ss'),
                status: this.mappingStatus(moment(date + ' ' + start, 'YYYY-MM-DD HH:mm:ss').add(i, 'hour').format('YYYY-MM-DD HH:mm:ss'), details.service_id, bookedData)
            }
            slots.push(data);
        }
        return slots;
    }

    goToPreviousWeek = async () => {
        const {date, service_id} = this.state;
        const duration = moment.duration(moment(date).diff(moment()));
        const days = duration.asDays();
        if (days < 7) {
            const reqDate = {
                start_date: moment().subtract(1, 'days').format('YYYY-MM-DD HH:mm:ss'),
                end_date: moment().add(7, 'days').format('YYYY-MM-DD HH:mm:ss')
            }
            const responseBookedData = await fetchBookedData(service_id, reqDate);
            this.setState({
                    date: moment(),
                    bookedSlots: responseBookedData.data,
                    isLoading: true
                },
                () => this.weekFormat(moment()));

        } else {
            const reqDate = {
                start_date: moment(date, 'YYYY-MM-DD HH:mm:ss').subtract(8, 'days').format('YYYY-MM-DD HH:mm:ss'),
                end_date: moment(date, 'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DD HH:mm:ss')
            }
            const responseBookedData = await fetchBookedData(service_id, reqDate);
            this.setState({
                date: moment(date).subtract(7, 'day'),
                bookedSlots: responseBookedData.data,
                isLoading: true
            }, () => this.weekFormat(moment(date).subtract(7, 'day')));

        }
    }

    onChangeDate = async (date) => {
        const {service_id} = this.state;

        const reqDate = {
            start_date: moment(date, 'YYYY-MM-DD HH:mm:ss').subtract(1, 'days').format('YYYY-MM-DD HH:mm:ss'),
            end_date: moment(date, 'YYYY-MM-DD HH:mm:ss').add(7, 'days').format('YYYY-MM-DD HH:mm:ss')
        }
        const responseBookedData = await fetchBookedData(service_id, reqDate);
        this.setState({
                date: date,
                bookedSlots: responseBookedData.data,
                isLoading: true
            },
            () => this.weekFormat(moment(date).format('YYYY-MM-DD')));

    }

    goToNextWeek = async () => {
        const {date, service_id} = this.state;
        const prevDate = moment(date).add(7, 'day');
        const reqDate = {
            start_date: moment(date, 'YYYY-MM-DD HH:mm:ss').add(6, 'days').format('YYYY-MM-DD HH:mm:ss'),
            end_date: moment(date, 'YYYY-MM-DD HH:mm:ss').add(14, 'days').format('YYYY-MM-DD HH:mm:ss')
        }
        const responseBookedData = await fetchBookedData(service_id, reqDate);
        this.setState({
                date: prevDate,
                bookedSlots: responseBookedData.data,
                isLoading: true
            },
            () => this.weekFormat(prevDate));
    }

    addSlot = async (slot, service_id, shift_id ,price) => {
        if (moment(slot, 'YYYY-MM-DD HH:mm:ss').isBefore(moment().format('YYYY-MM-DD HH:mm:ss'))) {
            this.setState({
                alertOpen: true,
                alertMessage: "You can not book past date",
                alertType: 'error',
            });
            return;
        }
        await store.dispatch(addSlots({slot, service_id, shift_id ,price}));
        this.weekFormat(this.state.date).then(r => {
            this.setState({
                alertOpen: true,
                alertMessage: "Slot added to cart",
                alertType: 'success',
            });
        });
    }

    removeSlot = async (slot, service_id) => {
        await store.dispatch(removeSlots({slot, service_id}));
        console.log(this.props.slots[0].slots);
        if(this.props.slots[0].slots <= 0){
            await store.dispatch(removeBookingDetails(null));
        }
        this.weekFormat(this.state.date).then(r => {
            this.setState({
                alertOpen: true,
                alertMessage: "Slot removed from cart",
                alertType: 'success',
                slotsDetails: this.tableFormat()
            });
        });
    }

    countBookedSlots = () => {
        const {slots} = this.props;
        let count = 0;
        slots.forEach(itme => {
            count = count + itme.slots.length;
        });
        return count;
    }

    clearSlots = async () => {
        await store.dispatch(clearSlots([]));
        await store.dispatch(removeBookingDetails(null));
        this.weekFormat(this.state.date).then(r => {
            this.setState({
                alertOpen: true,
                alertMessage: "Removed all from cart",
                alertType: 'success',
            });
        });
    }

    mapShift = (slots) => {
        const {shifts} = this.state;
        return slots.map(sl => ({
            slot: sl.slot,
            shift: shifts.filter(shift => shift.id === sl.shift_id)[0]
        }));
    };

    tableFormat = () => {
        const {allServices} = this.state;
        const {slots} = this.props;
        return slots.map(ser => ({
            service: allServices.filter(service => service.id === ser.service_id)[0],
            slots: this.mapShift(ser.slots),
            groupByDate: this.groupByDate(this.mapShift(ser.slots))
        }));
    }

    groupByDate = slots => {
        const splitDate = slots.map(item => ({
            ...item,
            date: moment(item.slot, 'YYYY-MM-DD').format('YYYY-MM-DD')
        }));
        return chain(splitDate).groupBy('date').map((value, key) => ({
            data: value,
            date: key
        })).value();
    }

    openDrawer = () => {
        this.setState({isDrawer: !this.state.isDrawer, slotsDetails: this.tableFormat()});
    }

    handleSelectServices = data => {

    }

    onChangeService = async data => {
        const {date} = this.state;
        const reqDate = {
            start_date: moment(date, 'YYYY-MM-DD HH:mm:ss').subtract(1, 'days').format('YYYY-MM-DD HH:mm:ss'),
            end_date: moment(date, 'YYYY-MM-DD HH:mm:ss').add(7, 'days').format('YYYY-MM-DD HH:mm:ss')
        }
        const responseBookedData = await fetchBookedData(data.id, reqDate);
        const response = await fetchShiftByServiceId(data.id);
        this.setState({
            service: data,
            shiftData: response.data,
            bookedSlots: responseBookedData.data,
            // otherServices:allServices.filter(item => item.id !== data.id),
            isLoading: true, isOpen: false, iaSelect: false, service_id: data.id
        }, () => this.weekFormat(moment(date)));
    }

    handleScroll = async (e) => {
        const {date, service_id} = this.state;

        let element = e.target;
        // this.mayCalendarRef.current.scrollLeft = 10;
        if (element.scrollLeft === 0) {
            const duration = moment.duration(moment(date).diff(moment()));
            const days = duration.asDays();
            if (moment().isSame(moment(date).format('YYYY-MM-DD'), 'days')) {
                this.mayCalendarRef.current.scrollLeft = 0;
                return;
            }
            if (days < 7) {
                const reqDate = {
                    start_date: moment().subtract(1, 'days').format('YYYY-MM-DD HH:mm:ss'),
                    end_date: moment().add(7, 'days').format('YYYY-MM-DD HH:mm:ss')
                }
                const responseBookedData = await fetchBookedData(service_id, reqDate);
                this.setState({
                        date: moment(),
                        bookedSlots: responseBookedData.data,
                        isLoading: false
                    }, () =>
                        this.weekFormat(moment()).then(r => {
                            this.mayCalendarRef.current.scrollLeft = 10;
                        })
                );

            } else {
                const reqDate = {
                    start_date: moment(date, 'YYYY-MM-DD HH:mm:ss').subtract(5).format('YYYY-MM-DD HH:mm:ss'),
                    end_date: moment(date, 'YYYY-MM-DD HH:mm:ss').add(4, 'days').format('YYYY-MM-DD HH:mm:ss')
                }
                const responseBookedData = await fetchBookedData(service_id, reqDate);
                this.setState({
                        date: moment(date).subtract(4, 'day'),
                        bookedSlots: responseBookedData.data,
                        isLoading: false
                    }, () =>
                        this.weekFormat(moment(date).subtract(4, 'day')).then(r => {
                            this.mayCalendarRef.current.scrollLeft = 10;
                        })
                );
                this.weekFormat(moment(date).subtract(4, 'day')).then(r => {
                    this.mayCalendarRef.current.scrollLeft = 10;
                });
            }
        }
        if (element.scrollWidth - element.scrollLeft === element.clientWidth) {
            const reqDate = {
                start_date: moment(date, 'YYYY-MM-DD HH:mm:ss').add(4, 'days').format('YYYY-MM-DD HH:mm:ss'),
                end_date: moment(date, 'YYYY-MM-DD HH:mm:ss').add(11, 'days').format('YYYY-MM-DD HH:mm:ss')
            }
            const responseBookedData = await fetchBookedData(service_id, reqDate);
            const prevDate = moment(date).add(4, 'day');
            this.setState({
                    date: prevDate,
                    bookedSlots: responseBookedData.data,
                    isLoading: false
                }, () =>
                    this.weekFormat(prevDate).then(r => {
                        this.mayCalendarRef.current.scrollLeft = element.clientWidth - 10;
                    })
            );

        }
    }

    addPromoCode = async code => {
        if(!this.props.auth) {
          this.props.history.push('/login');
        }
        this.setState({isLoading: true});
        const {coupons} = this.state;
        let updateCoupons=cloneDeep(coupons);
        try {
            const promoCodeDetails = await checkPromoCode(code);
            const isNew = findIndex(coupons , {id:promoCodeDetails.data.id});
            if(isNew === -1){
                updateCoupons.push(promoCodeDetails.data)
            }
            this.setState({
                coupons: updateCoupons,
                isLoading: false,
                alertOpen: true,
                alertMessage: "Valid coupon",
                alertType: 'success',
            });
        } catch (e) {
            this.setState({
                isLoading: false,
                alertOpen: true,
                alertMessage: "Invalid coupon code",
                alertType: 'error',
            });

        }
    }

    proceedNext = async (isError, data) => {
        if (isError) {
            this.setState({
                isLoading: false,
                alertOpen: true,
                alertMessage: "Something wrong please check your entries",
                alertType: 'error',
            });
        }
        const {auth, user, slots ,bookingDetails} = this.props;
        if (!auth) {
            this.setState({
                isLoading: false,
                alertOpen: true,
                alertMessage: "If you want to book please login",
                alertType: 'error',
            });
            setTimeout(() =>
                this.props.history.push('/login'), 3000
            )

        } else {
            //    goto payment
            const dataFormat = {
                photographer_name: 'vipiFromReact',
                shoot_type: 'wedding',
                booking_detail_id:isEmpty(bookingDetails)?null:bookingDetails.id,
                payment: {
                    sub_total: data.totalPriceWithoutDiscount,
                    discount: data.total_discount ? data.total_discount : 0,
                    coupon_discount: data.coupon_discount ? data.coupon_discount : 0,
                    grant_total: data.grant_total,
                    promo_code_ids: data.promo_code_id ? data.promo_code_id : -1,
                    used_points: data.used_points ? data.used_points : 0,
                    tax_amount: data.tax,
                    booked_by: user.name,
                    payment_status: 'DECLINE',
                    payment_type: 'ONLINE',
                    gateway_response: '{}',
                },
                booking_data: slots
            }
            try {
                await checkAvailability(this.formatForCheckAvailability());
                const response = await saveBookingData(user.id, dataFormat);
                await store.dispatch(clearSlots([]));
                await store.dispatch(removeBookingDetails(null));
                // const responseBookedData = await fetchBookedData(this.state.service.id, reqDate);
                this.setState({
                    isDrawer: false,
                    isLoading: false,
                    alertOpen: true,
                    alertMessage: "Successfully booked your slots",
                    alertType: 'success',
                }, () => this.props.history.push('/invoices/' + response.data.booked_details.id));
                //
                // this.setState({
                //     bookedSlots: responseBookedData.data,
                //     isDrawer: false,
                //     isLoading: false,
                //     alertOpen: true,
                //     alertMessage: "Successfully booked your slots",
                //     alertType: 'success',
                // }, () => this.weekFormat(this.state.date));
            } catch (err) {
                this.setState({
                    isLoading: false,
                    alertOpen: true,
                    alertMessage: "Something went wrong",
                    alertType: 'error',
                });
            }

        }
    }


    formatForCheckAvailability = () => {
        const {slots} = this.props;
        return slots.map((slot) => ({
            service_id: slot.service_id,
            slots: slot.slots.map((item) => {
                return item.slot
            })
        }));
    }


    render() {
        const {classes} = this.props;
        const {
            formatDate,
            date,
            isLoading,
            isOpen,
            iaSelect,
            alertOpen,
            alertMessage,
            alertType,
            service,
            otherServices,
        } = this.state;
        return (
            <PublicRootElement>
                <div className="booking mt-5">
                    <div className="container">
                        {!isEmpty(formatDate) && (
                            <div className="card_wrapper"
                                 style={{boxShadow: 'rgba(170, 170, 170 ,0.5) 10px 10px 25px'}}>
                                <div className="row">
                                    <div className="col-md-9">
                                        <div className="btn vm_bg_gray2 m-1"><i className="fas fa-map-marker-alt"></i>
                                            {get(service, 'branch.name', '')}
                                        </div>
                                        <div className="btn vm_bg_gray2 m-1">
                                            <i className="fas fa-map-marker-alt"></i>
                                            {get(service, 'name', '')}
                                        </div>
                                        {!isEmpty(otherServices) && (
                                            <div onClick={() => this.setState({isOpen: true, iaSelect: true})}
                                                 className="btn vm_bg_green mt-2 mt-md-0 vm_cursor_pointer">
                                                <i className="fa fa-plus"></i> Add other services
                                            </div>
                                        )}
                                    </div>
                                    <div className="col-md-3 text-right">
                                        <div className="btn vm_bg_light_gray2 m-1" style={{cursor: 'default'}}>
                                            <DatePickerBtn
                                                getValue={date => this.onChangeDate(date)}
                                                date={moment().add(2, 'day')}>
                                                <i style={{cursor: 'pointer'}}
                                                   className="fa fa-calendar-alt vm_text_gray"></i>
                                            </DatePickerBtn>
                                        </div>
                                        <div onClick={this.goToPreviousWeek}
                                             style={moment(date).isSameOrBefore(moment().format('YYYY-MM-DD'), 'day')
                                                 ? {pointerEvents: 'none', opacity: 0.5} : {}}
                                             className="btn vm_bg_light_gray2 m-1"><i
                                            className="fa fa-arrow-left vm_text_gray"></i>
                                        </div>
                                        <div onClick={this.goToNextWeek}
                                             className="btn vm_bg_light_gray2 m-1"><i
                                            className="fa fa-arrow-right vm_text_gray"></i></div>
                                    </div>
                                </div>

                                <div className={classes.slotColumn}
                                     onScroll={(event) => this.handleScroll(event)}
                                     ref={this.mayCalendarRef}>
                                    {formatDate.map(day => {
                                        return (
                                            <div className={classes.singleColumn}>
                                                <CalendarColumn dataSet={day}
                                                                index={1}
                                                                noOfShift={day.shifts.length}
                                                                addSlots={(val, service_id, shift_id ,price) => this.addSlot(val, service_id, shift_id ,price)}
                                                                removeSlots={(val, service_id) => this.removeSlot(val, service_id)}
                                                                handleChangeShift={(day, currentShift) => console.log(day, currentShift)}/>
                                            </div>
                                        )
                                    })}
                                </div>
                                <CalenderFooter/>
                            </div>

                        )}
                    </div>


                    {isOpen && otherServices && (
                        <CustomDialog closeDialog={() => this.setState({isOpen: false, iaSelect: false})}
                                      isNoteOpen={isOpen}>
                            {iaSelect && (
                                <ServiceListView
                                    onChangeService={(val) => this.onChangeService(val)}
                                    services={otherServices}
                                />
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
                </div>
            </PublicRootElement>
        )
    }
}

const mapStateToProps = state => {
    const {slots, auth, membership, user ,bookingDetails} = state;
    console.log(slots);
    return {slots, auth, membership, user ,bookingDetails};
}

ServiceBooking = withStyles(styles)(ServiceBooking);
export default connect(mapStateToProps, null)(ServiceBooking);


