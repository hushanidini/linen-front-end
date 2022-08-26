import React, {Component} from 'react';
import RootElement from "./component/RootElement";
import {confirmCancel, fetchBookingDetails} from "../../services/private/InvoiceService";
import {connect} from "react-redux";
import InvoiceTable from "../../components/tables/InvoiceTable";
import CustomLoader from "../../components/CustomLoader";
import AlertBar from "../../components/core/Alert/AlertBar";
import Swal from "sweetalert2";
import {find} from "lodash";
import DateNavigator from "../../components/core/dateNavigator/DateNavigator";
import moment from "moment";

class BookingDetails extends Component {
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
            date:moment().format('YYYY-MM-DD')
        }
    }

    componentDidMount = async () => {
        this.setState({isLoading: true});

        try {
            const reqDate = {
                start_date: moment().format('YYYY-MM-DD'),
                end_date: moment().add(1,'weeks').format('YYYY-MM-DD')
            }
            const bookingDetailsResponse = await fetchBookingDetails(reqDate);
            this.setState({bookingDetails: bookingDetailsResponse.data , isLoading: false})
        } catch (e) {

        }
    }

    handleChangeDate=async value => {
        this.setState({isLoading: true});
        try {
            const reqDate = {
                start_date: moment(value).format('YYYY-MM-DD'),
                end_date: moment(value).add(1, 'weeks').format('YYYY-MM-DD')
            }
            const bookingDetailsResponse = await fetchBookingDetails(reqDate);
            this.setState({bookingDetails: bookingDetailsResponse.data,
                date:value,
                isLoading: false})
        } catch (e) {

        }
    }

    filterByBookingStatus=status=>{

    }

    confirmCancel=async data => {
        const {user} = this.props;
        const {date} = this.state;
        const swal = await Swal.fire({
            title: 'Are you sure?',
            text: 'You want to confirm the cancellation.',
            icon: 'success',
            showCloseButton: true,
            showCancelButton: true,
            reverseButtons: true,
            cancelButtonText: `Cancel`,
            confirmButtonText: `Confirm`,
            confirmButtonColor: '#5cb85c'
        });
        if (swal.value) {
            try {
                const reqData={
                    "sub_total": find(data.payments ,{payment_status : 'SUCCESS'}).sub_total,
                    "discount": find(data.payments ,{payment_status : 'SUCCESS'}).discount,
                    "grant_total": find(data.payments ,{payment_status : 'SUCCESS'}).grant_total,
                    "booked_by": `cancel by ${user.name}`
                }

                const response = await confirmCancel(data.id,reqData);
                const req = {
                    start_date: moment(date).format('YYYY-MM-DD'),
                    end_date: moment(date).add(1, 'weeks').format('YYYY-MM-DD')
                }
                const bookingDetailsResponse = await fetchBookingDetails(req);

                this.setState({
                    bookingDetails: bookingDetailsResponse.data ,
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
            <RootElement>

                <div>
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
                            confirmCancel={data => this.confirmCancel(data)}
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
            </RootElement>
        )
    }
}


const mapStateToProps = state => {
    const {user} = state;
    return {user};

}
export default connect(mapStateToProps, null)(BookingDetails);

