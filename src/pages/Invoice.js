import React, {Component} from 'react';
import PublicRootElement from "./admin/component/PublicRootElement";
import {fetchBookingDetails, requestToCancel} from "../services/private/InvoiceService";
import {connect} from "react-redux";
import InvoiceTable from "../components/tables/InvoiceTable";
import CustomLoader from "../components/CustomLoader";
import AlertBar from "../components/core/Alert/AlertBar";
import Swal from "sweetalert2";
import {chain} from 'lodash';
import store from "../store";
import {clearSlots, initLoadSlots} from "../store/actions/bookingAction";
import {addBookingDetails, removeBookingDetails} from "../store/actions/bookingDetailsAction";
import DateNavigator from "../components/core/dateNavigator/DateNavigator";
import moment from "moment";

class Invoice extends Component {

    constructor(props) {
        super(props);
        this.state = {
            bookingDetails: [],
            isLoading: false,
            tableHeader: [
                {
                    align: 'left',
                    key: 'date',
                    label: 'Booked date'
                },
                {
                    align: 'left',
                    key: 'photographer_name',
                    label: 'Photographer name'
                },
                {
                    align: 'left',
                    key: 'shoot_type',
                    label: 'Shoot type'
                },
                {
                    align: 'left',
                    key: 'No of slots',
                    label: 'No of slots'
                },
                {
                    align: 'left',
                    key: 'status',
                    label: 'Status'
                },
                {
                    align: 'center',
                    key: 'action',
                    label: 'Action'
                },
            ],
            alertOpen: false,
            alertMessage: '',
            errors: {},
            alertType: '',
            date:moment(),
        }
    }

    componentDidMount = async () => {
        const {user} = this.props;
        this.setState({isLoading: true});

        try {
            const reqDate = {
                user_id: user.id,
                // payment_status:"SUCCESS"
            }
            const bookingDetailsResponse = await fetchBookingDetails(reqDate);
            this.setState({bookingDetails: bookingDetailsResponse.data , isLoading: false})
        } catch (e) {

        }
    }

    reRenderApi = async ()=>{
        const {user} = this.props;
        try {
            const reqDate = {
                user_id: user.id,
            }
            const bookingDetailsResponse = await fetchBookingDetails(reqDate);
            this.setState({bookingDetails: bookingDetailsResponse.data})
        } catch (e) {

        }
    }

    requestToCancel = async data => {


        const inputOptions = new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    'MOVE_TO_POINTS': 'Move to points',
                    'REFUND': 'Refund',
                })
            }, 100)
        })

        const { value: type } = await Swal.fire({
            title: `Are you sure? You want to cancel`,
            text: 'Please select the cancel option',
            input: 'radio',
            inputOptions: inputOptions,
            inputValidator: (value) => {
                if (!value) {
                    return 'You need to choose something!'
                }
            },
            showCloseButton:true,
            showCancelButton: true,
            reverseButtons:true,
            cancelButtonText: `Cancel`,
            confirmButtonText: `Confirm`,
            confirmButtonColor:'#5cb85c'
        });
        if (type){
            this.setState({isLoading: true});

            try {
                const response = await requestToCancel(data.id, {cancel_type: type});
                this.reRenderApi().then(r =>
                    this.setState({
                        isLoading: false,
                        alertOpen: true,
                        alertMessage: response.message,
                        alertType: 'success'
                    })
                );

            } catch (e) {
                if (e.response && e.response.data && e.response.data.errors) {
                    this.setState({
                        isLoading: false,
                        errors: e.response.data.errors,
                        alertOpen: true,
                        alertMessage:  e.response.data.errors.message?e.response.data.errors.message:"Something went wrong",
                        alertType: 'error'
                    });
                } else {
                    this.setState({
                        isLoading: false,
                        alertOpen: true,
                        alertMessage: "Something went wrong",
                        alertType: 'error'
                    });
                }
            }
        }


    }

    editBooking=async data => {
        const groupData = chain(data.slots_details).groupBy('service_id').map((value, key) => ({
            service_id: parseInt(key),
            slots: value.map(item => ({
                price: item.price,
                shift_id: item.shift_id,
                slot: item.slot
            }))
        })).value();
        await store.dispatch(clearSlots([]));
        await store.dispatch(removeBookingDetails(null));
        await store.dispatch(initLoadSlots(groupData));
        await store.dispatch(addBookingDetails(data));
        this.props.history.push('/booking/' + groupData[0].service_id);
    }
    handleChangeDate=async value => {
        const {user} = this.props;
        this.setState({isLoading: true});
        try {
            const reqDate = {
                user_id: user.id,
                start_date: moment(value).format('YYYY-MM-DD'),
                end_date: moment(value).add(1, 'weeks').format('YYYY-MM-DD')
            }
            const bookingDetailsResponse = await fetchBookingDetails(reqDate);

            this.setState({
                bookingDetails: bookingDetailsResponse.data,
                date:value,
                isLoading: false})
        } catch (e) {
            this.setState({
                isLoading: false
            })
        }
    }


    render() {
        const {
            bookingDetails, tableHeader,
            isLoading,
            alertOpen,
            alertMessage,
            alertType,
            date
        } = this.state;
        return (
            <PublicRootElement>

                <div className="container">
                    <DateNavigator
                        disablePast={false}
                        disableFuture={false}
                        type={'WEEK'}
                        isShowDate={true}
                        date={date}
                        onChangeDate={date=>this.handleChangeDate(date)}
                    />

                    {bookingDetails && (
                        <InvoiceTable
                            goToDetails={data => this.props.history.push('/invoices/' + data.id)}
                            requestToCancel={data => this.requestToCancel(data)}
                            editBooking={data => this.editBooking(data)}
                            header={tableHeader}
                            bookingDetails={bookingDetails}/>
                    )}
                </div>


                {isLoading && (
                    <CustomLoader isNoteOpen={true}/>
                )}
                {alertOpen && (
                    <AlertBar alertMessage={alertMessage}
                              alertType={alertType}
                              onClose={() => this.setState({alertOpen: false})}/>
                )}

            </PublicRootElement>
        )
    }

}

const mapStateToProps = state => {
    const {user} = state;
    return {user};

}
export default connect(mapStateToProps, null)(Invoice);
