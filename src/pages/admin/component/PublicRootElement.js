import React, {Component} from 'react';
import {AppBar, Button, Drawer, withStyles} from "@material-ui/core";
import Toolbar from "@material-ui/core/Toolbar";
import {withRouter} from "react-router";
import {connect} from "react-redux";
import {chain, cloneDeep, findIndex, isEmpty} from 'lodash';
import {logOut} from "../../../services/AuthService";
import RolePermission from "../../../components/RolePermission/RolePermission";
import {getAllBranches} from "../../../services/private/BranchService";
import NestedMenu from "../../../components/nestedMenu/NestedMenu";
import * as PropTypes from "prop-types";
import moment from "moment";
import BookedListTable from "../../../components/tables/BookedListTable";
import {getAllServices} from "../../../services/private/ServicesService";
import {checkPromoCode} from "../../../services/CouponService";
import {fetchDiscounts} from "../../../services/DiscountService";
import {getAllShifts} from "../../../services/private/ShiftService";
import store from "../../../store";
import {clearSlots, removeSlots} from "../../../store/actions/bookingAction";
import {removeBookingDetails} from "../../../store/actions/bookingDetailsAction";
import AlertBar from "../../../components/core/Alert/AlertBar";
import {checkAvailability, saveBookingData} from "../../../services/private/BookingService";

const styles = theme => ({
    root: {
        display: 'flex',
        justifyContent: 'center',
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
    appBar: {
        backgroundColor: '#c4c4c4',
        boxShadow: 'none',
        height: '70px',
        alignItems: 'center',
        justifyContent: 'center',
        [theme.breakpoints.down('md')]: {
            width: '100%',
            height: '70px',
            // marginLeft: drawerWidth,
            boxShadow: 'none',
            display: 'flex',
            justifyContent: 'center',
        },
        [theme.breakpoints.down('sm')]: {
            width: '100%',
            height: '70px',
            display: 'flex',
            justifyContent: 'center',
        },
    },
    gutters: {
        display: 'flex',
        padding: 0,
        width: '90%',
        maxWidth: '1160px',
        alignItems: 'center',
        justifyContent: 'center',
    },
    menuButton: {
        color: 'primary',
        marginLeft: theme.spacing(2),
        justifyContent: 'center',
        alignItems: 'center',
        [theme.breakpoints.up('sm')]: {
            display: 'none',
        },
    },
    homeMenu: {
        color: 'primary',
        marginLeft: theme.spacing(2),
        justifyContent: 'center',
        alignItems: 'center',
        [theme.breakpoints.down('xs')]: {
            display: 'none',
        },
    },
    toolbar: theme.mixins.toolbar,
    content: {
        marginTop: '70px',
        flexGrow: 1,
        overflow: 'auto',
        display: 'flex',
        padding: 0,
        alignItems: 'center',
        justifyContent: 'center',
        [theme.breakpoints.down('xs')]: {
            padding: `${theme.spacing(5)} 0`,
            marginLeft: '0px',
            width: `calc(100vw - 0px)`,
        },
    },
    menu: {
        width: '250px',
        top: '80px !important',
        boxShadow: '0px 0px 40px #00000015',
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

class PublicRootElement extends Component {

    constructor(props) {
        super(props);
        this.state = {
            mobileOpen: false,
            isDrawer: false,
            services: [],
            branches: [],
            allServices: [],
            slotsDetails: [],
            coupons: [],
            discounts: [],
            shifts: [],
            alertOpen:false,
            alertMessage:'',
            alertType:''
        };
    }

    componentDidMount = async () => {
        try {
            const responseBranches = await getAllBranches();
            const allServices = await getAllServices();
            const discountsResponse = await fetchDiscounts(); //all discount
            const responseShifts = await getAllShifts();
            this.setState({
                allServices: allServices.data,
                discounts: discountsResponse.data,
                shifts: responseShifts.data,
                branches: responseBranches.data.map(branch=>({
                    ...branch,
                    services: branch.services.filter(service => service.type === 'studio')
                }))});
        } catch (e) {

        }
    }

    countBookedSlots = () => {
        const {slots} = this.props;
        let count = 0;
        slots.forEach(itme => {
            count = count + itme.slots.length;
        });
        return count;
    }

    openDrawer = () => {
        this.setState({isDrawer: !this.state.isDrawer, slotsDetails: this.tableFormat()});
    }

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

    mapShift = (slots) => {
        const {shifts} = this.state;
        return slots.map(sl => ({
            slot: sl.slot,
            shift: shifts.filter(shift => shift.id === sl.shift_id)[0]
        }));
    };

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

    removeSlot = async (slot, service_id) => {
        try{
            await store.dispatch(removeSlots({slot, service_id}));
            console.log(this.props.slots[0].slots);
            if(this.props.slots[0].slots <= 0){
                await store.dispatch(removeBookingDetails(null));
            }
            this.setState({
                alertOpen: true,
                alertMessage: "Slot removed from cart",
                alertType: 'success',
                slotsDetails: this.tableFormat()
            });
        }catch (e){

        }

    }

    clearSlots = async () => {
        try{
            await store.dispatch(clearSlots([]));
            await store.dispatch(removeBookingDetails(null));
            this.setState({
                alertOpen: true,
                alertMessage: "Removed all from cart",
                alertType: 'success',
            });
        }catch (e){

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

    proceedNext = async (isError, data) => {
        if (!isEmpty(isError)) {
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
            });
            setTimeout(() =>
                this.props.history.push('/login'), 500
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
            // const reqDate = {
            //     start_date: moment(this.state.date, 'YYYY-MM-DD HH:mm:ss').subtract(1, 'days').format('YYYY-MM-DD HH:mm:ss'),
            //     end_date: moment(this.state.date, 'YYYY-MM-DD HH:mm:ss').add(7, 'days').format('YYYY-MM-DD HH:mm:ss')
            // }
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

    render() {
        const {branches , isDrawer ,
            slotsDetails ,allServices ,
            discounts,
            alertOpen,
            alertMessage,
            coupons,
            alertType} = this.state;
        const {classes, children, membership, auth } = this.props;
        const menu = [
            {
                label: 'Booking',
                url: 'invoices'
            }, {
                label: 'Profile',
                url: 'profile',
            }
        ]
        return (
            <div className={classes.root}>
                <AppBar position="fixed" classes={{root: classes.appBar}}>
                    <Toolbar variant="dense"
                             classes={{
                                 gutters: classes.gutters
                             }}
                    >
                        <div style={{
                            flexGrow: 1, display: 'flex',
                            alignItems: 'center',
                            height: '70px',
                            justifyContent: 'space-between',
                        }}>
                            <div style={{ display:'flex', flexDirection:'row' ,alignItems:'center',}}>
                                <RolePermission roles={['super_admin']}>
                                    {!isEmpty(auth) && (
                                        <Button
                                            color="inherit"
                                            aria-label="open drawer"
                                            edge="start"
                                            onClick={() => this.props.history.push('/dashboard')}
                                            className={classes.homeMenu}
                                        >Admin
                                        </Button>
                                    )}
                                </RolePermission>

                                {menu.map((item) => {
                                    return (
                                        <Button
                                            color="inherit"
                                            aria-label="open drawer"
                                            edge="start"
                                            onClick={() => this.props.history.push(`/${item.url}/`)}
                                            className={classes.homeMenu}
                                        >{item.label}
                                        </Button>
                                    )
                                })}
                                <div className={classes.homeMenu} style={{cursor: 'pointer'}}>
                                    {!isEmpty(branches) && (
                                        <NestedMenu title='STUDIOS' data={branches}
                                                    onSelect={(branch_id,service_id) => this.props.history.push('/booking/' + branch_id +'/' +service_id)}
                                        />
                                    )}
                                </div>

                            </div>
                            {isEmpty(auth) ? (
                                <div style={{cursor: 'pointer'}}
                                     onClick={() => this.props.history.push('/login')}>Login</div>
                            ) : (
                                <div style={{cursor: 'pointer'}} onClick={() => logOut()}>Logout</div>
                            )}

                        </div>
                    </Toolbar>
                </AppBar>

                    <div style={this.countBookedSlots() <= 0 ? {pointerEvents: 'none', opacity: 0.5} : {}}>
                        <button
                            onClick={()=>this.openDrawer()}
                            // onClick={() => this.props.history.push('/booking/'+branches[0].id + '/'+branches[0].services[0].id)}
                                className="btn cart_butn">
                            <i className="fa fa-shopping-cart"></i>
                            <div>
                                <span>{this.countBookedSlots()}</span>
                            </div>
                        </button>
                    </div>
                <Drawer
                    variant="temporary"
                    anchor={'right'}
                    open={isDrawer}
                    onClose={() => this.setState({isDrawer: !isDrawer})}
                    classes={{
                        paper: classes.drawerPaper,
                    }}
                    ModalProps={{
                        keepMounted: true, // Better open performance on mobile.
                    }}>
                    {!isEmpty(slotsDetails) && isDrawer && (
                        <BookedListTable
                            membership={membership}
                            proceedNext={(isError, data) => this.proceedNext(isError, data)}
                            couponsProps={coupons}
                            onCheckPromoCode={(code) => this.addPromoCode(code)}
                            discounts={discounts}
                            services={allServices}
                            slots={slotsDetails}
                            removeSlots={(slot, service_id) => this.removeSlot(slot, service_id)}
                            clearSlots={() => this.clearSlots()}
                            onClose={() => this.setState({isDrawer: false})}/>
                    )}

                </Drawer>
                {alertOpen && (
                    <AlertBar alertMessage={alertMessage}
                              alertType={alertType}
                              onClose={() => this.setState({alertOpen: false})}/>
                )}
                <main className={classes.content}>
                    {/*<div className={classes.toolbar} />*/}
                    {children}
                </main>
            </div>
        );
    }
}

PublicRootElement.propTypes = {
    isShow:PropTypes.bool
}
PublicRootElement.defaultProps = {
    isShow:true
}

const mapStateToProps = state => {
    const {slots, auth, membership, user} = state;
    return {slots, auth, membership, user};
}

PublicRootElement = withStyles(styles)(PublicRootElement);
PublicRootElement = withRouter(PublicRootElement);
export default connect(mapStateToProps, null)(PublicRootElement);
