import React, {Component} from 'react';
import PublicRootElement from "./admin/component/PublicRootElement";
import {connect} from "react-redux";
import {fetchBookingDetailsById} from "../services/private/InvoiceService";
import InvoiceComponent from "../components/Invoice";
import {isEmpty, cloneDeep, chain} from 'lodash';
import {getAllServices} from "../services/private/ServicesService";
import CustomLoader from "../components/CustomLoader";
import {checkAvailability, saveBookingData} from "../services/private/BookingService";

class Invoice extends Component {

    constructor(props) {
        super(props);
        this.state = {
            invoiceDetails: [],
            isLoading: false,
            tableHeader: [
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
            ],
            services:[]
        }
    }

    componentDidMount = async () => {
        this.setState({isLoading:true});
        const {user} = this.props;
        const {match: {params},} = this.props;
        let requestData={};
        try {
            if(user.roles.includes("user")){
                requestData={
                    user_id: user.id
                }
            }

            const details = await fetchBookingDetailsById(params.invoiceId ,requestData);
            const servicesResponse = await getAllServices();
            const copyData = cloneDeep(details.data);
            const mappingWithService = copyData.slots_details.map(slot=>({
                ...slot,
                service:servicesResponse.data.filter(item=>item.id === slot.service_id)[0]
            }));
            details.data.slots_details = mappingWithService;
            this.setState({invoiceDetails: details.data ,isLoading:false});
        } catch (err) {
            this.setState({isLoading:false});
        }
    }

    formatForCheckAvailability = (slots) => {
        const groupData = chain(slots).groupBy('service_id').map((value ,key) =>({
            service_id: key,
            data: value,
        })).value();
        console.log(groupData);
        return groupData.map((slot) => ({
            service_id: slot.service_id,
            slots: slot.data.map((item) => {
                return item.slot
            })
        }));
    }

    payAgain =async (data) => {

        const groupData = chain(this.state.invoiceDetails.slots_details).groupBy('service_id').map((value, key) => ({
            service_id: parseInt(key),
            slots: value.map(item => ({
                price: item.price,
                shift_id: item.shift_id,
                slot: item.slot
            }))
        })).value();
        const dataFormat = {
            booking_detail_id: data.id,
            payment: {
                sub_total: data.payments[ data.payments.length - 1].sub_total,
                discount: data.payments[ data.payments.length - 1].discount,
                coupon_discount: data.payments[ data.payments.length - 1].coupon_discount,
                grant_total: data.payments[ data.payments.length - 1].grant_total,
                promo_code_ids: data.payments[ data.payments.length - 1].promo_code_id||null,
                used_points: data.payments[ data.payments.length - 1].used_points ,
                tax_amount: data.payments[ data.payments.length - 1].tax_amount,
                booked_by: data.payments[ data.payments.length - 1].booked_by,
                payment_status: 'SUCCESS',
                payment_type: 'ONLINE',
                gateway_response: '{}',
            },
            booking_data:groupData
        };
        try {
            console.log(data ,dataFormat);
            await checkAvailability(this.formatForCheckAvailability(data.slots_details));
            await saveBookingData(data.user_id, dataFormat);
        }catch(e){

        }


    }

    render() {
        const {match: {params},} = this.props;
        const {invoiceDetails, isLoading} = this.state;
        return (
            <PublicRootElement>
                {!isEmpty(invoiceDetails) && (
                    <InvoiceComponent
                        payAgain = {data=>this.payAgain(data)}
                        invoiceId={params.invoiceId} data={invoiceDetails}/>
                )}
                {isLoading && (
                    <CustomLoader isNoteOpen={true}/>
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
