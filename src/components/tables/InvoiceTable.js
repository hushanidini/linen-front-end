import React from 'react';
import moment from 'moment';
import {find, isEmpty, isEqual} from "lodash";
import '../../theme/css/invoiceTable.css'
import RolePermission from "../RolePermission/RolePermission";


function TableHead({header}) {
    return (
        <thead>
        <tr>
            {header.map(header => {
                return (
                    <th style={{textAlign: header.align, border: 'none'}} scope="col">{header.label}</th>
                )
            })}
        </tr>
        </thead>
    );
}

const InvoiceTable = ({
                          header,
                          bookingDetails,
                          editBooking,
                          goToDetails,
                          requestToCancel,
                          confirmCancel
                      }) => {
    return (
        <table className="table">
            <TableHead header={header}/>
            <tbody>
            {bookingDetails.map(bookingDetail => {
                return (
                    <tr>
                        <td style={{textAlign: 'left'}}>{moment(bookingDetail.updated_at).format('YYYY-MM-DD')}</td>
                        <td style={{textAlign: 'left'}}>{bookingDetail.photographer_name}</td>
                        <td style={{textAlign: 'left'}}>{bookingDetail.shoot_type}</td>
                        <td style={{textAlign: 'left'}}>{bookingDetail.slots_details.length}</td>
                        <td style={{textAlign: 'left'}}>
                            {!isEmpty(bookingDetail.cancel_type) ? bookingDetail.status === 'CANCELLING' ? 'Request to cancel':bookingDetail.status :
                                isEmpty(find(bookingDetail.payments, {payment_status: "SUCCESS"})) ? "UNPAID" : "PAID"}
                        </td>
                        <td className="td-actions"
                            style={{textAlign: 'center', display: 'flex', justifyContent: 'space-around',}}>

                            <button style={{marginTop: 0}}
                                    onClick={() => {
                                        goToDetails && goToDetails(bookingDetail)
                                    }}
                                    type="button" rel="tooltip" className="btn btn-info btn-link btn-just-icon btn-sm"
                                    data-original-title="" title="">
                                <i className="material-icons">description</i>
                            </button>
                            <RolePermission roles={['super_admin']}>
                                <button
                                    style={{marginTop: 0}}
                                    disabled={!isEqual(bookingDetail.status, "CANCELLING")}
                                    onClick={() => {
                                        confirmCancel && confirmCancel(bookingDetail)
                                    }}
                                    type="button" rel="tooltip"
                                    className="btn btn-success btn-link btn-just-icon btn-sm"
                                    data-original-title="" title="">
                                    <i className="material-icons">check</i>
                                </button>
                            </RolePermission>
                            <RolePermission roles={['user']}>
                                <button
                                    style={{marginTop: 0}}
                                    disabled={!isEmpty(find(bookingDetail.payments, {payment_status: "SUCCESS"}))}
                                    onClick={() => {
                                        editBooking && editBooking(bookingDetail)
                                    }}
                                    type="button" rel="tooltip"
                                    className="btn btn-success btn-link btn-just-icon btn-sm" data-original-title=""
                                    title="">
                                    <i className="material-icons">edit</i>
                                </button>
                                <button
                                    style={{marginTop: 0}}
                                    disabled={isEmpty(find(bookingDetail.payments, {payment_status: "SUCCESS"})) ||
                                    !isEmpty(find(bookingDetail.cancel_type))}
                                    onClick={() => {
                                        requestToCancel && requestToCancel(bookingDetail)
                                    }}
                                    type="button" rel="tooltip" className="btn btn-danger btn-link btn-just-icon btn-sm"
                                    data-original-title="" title="">
                                    <i className="material-icons">close</i>
                                </button>
                            </RolePermission>

                        </td>
                    </tr>
                )
            })}
            </tbody>
        </table>
    );
}
export default InvoiceTable;
