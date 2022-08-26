import React from 'react';
import {find, findIndex, get ,isEmpty} from 'lodash';
import moment from 'moment';
import '../theme/css/invoice.css'
import jsPDF from "jspdf";
import 'jspdf-autotable';
import Moment from "react-moment";
import pdfLogo from '../assets/logo.png';

const InvoiceComponent = ({data, invoiceId ,payAgain}) => {

    const invoicePaymentType = data => {
        if (!data) {
            return 0;
        }
        const isSuccess = findIndex(data, {payment_status: "SUCCESS"});
        if (isSuccess === -1) {
            return data[0].payment_type;
        } else {
            return data[isSuccess].payment_type;
        }
    }

    const invoiceStatus = data => {
        if (!data) {
            return 0;
        }
        console.log(data);
        if(get(data,'cancel_type' , false)){
            if(data.status === 'CANCELLING'){
                return 'Request to cancel'
            }else{
                return data.status;
            }
        }else{
            if(isEmpty(find(data.payments, {payment_status: "SUCCESS"}))){
                return 'UNPAID';

            }else {
                return 'PAID';
            }
        }
    }


    const generatePdf = () => {
        const doc = new jsPDF();
        var pageWidth = doc.internal.pageSize.width || doc.internal.pageSize.getWidth();
        // var pageHeight = doc.internal.pageSize.height || doc.internal.pageSize.getHeight();

        const tableColumn = [
            'No',
            'Service name',
            'Slot',
            'Price($)',
        ];
        const tableRow = [];

        data.slots_details.forEach((slot, index) => {
            const ticketData = [
                index + 1,
                slot.service.name,
                moment(slot.slot, 'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DD hh:mm:A'),
                get(slot, 'price', 0).toFixed(2),
            ]
            tableRow.push(ticketData);
        });
        doc.addImage(pdfLogo, 14, 15, 40, 11);
        doc.setFontSize(8);
        doc.text(`First name : ${data.user.firstname}`, 14, 32);
        doc.text(`Last name  : ${data.user.lastname}`, 14, 36);
        doc.text(`Phone      : ${data.user.phone}`, 14, 40);

        doc.text(`Booked by  : ${invoicePaymentType(get(data, 'payments', null))}`, pageWidth - 100, 32);
        doc.text(`Status     : ${invoiceStatus(data)}`, pageWidth - 100, 36);
        doc.text(`Booked date : ${moment(get(data, 'updated_at', null)).format('YYYY-MM-DD')}`, pageWidth - 100, 40);
        doc.text(`Invoice id  : ${get(data, 'id', null)}`, pageWidth - 100, 44);

        doc.setFontSize(14);
        doc.text('Invoice', pageWidth / 2, 50, 'center');
        doc.autoTable(tableColumn, tableRow, {
            theme: 'striped',
            columnStyles: {
                3: {halign: 'right'}
            },
            headerStyles: {
                fillColor:[121 , 169 , 197],
                3: {halign: 'right'}
            },
            startY: 54
        });

        let finalY = doc.lastAutoTable.finalY;

        doc.setFontSize(10);
        doc.setTextColor("rgb(121 , 169 , 197 )");
        doc.text(`Sub total :`, pageWidth / 2, finalY + 10);
        doc.text(`Discount :`, pageWidth / 2, finalY + 14);
        doc.text(`Coupon discount :`, pageWidth / 2, finalY + 18);
        doc.text(`Used points :`, pageWidth / 2, finalY + 22);
        doc.text(`Total discount :`, pageWidth / 2, finalY + 26);
        doc.text(`Tax price : `, pageWidth / 2, finalY + 30);
        doc.setFontSize(12);
        doc.text(`Grant total: `, pageWidth / 2, finalY + 36);

        doc.setFontSize(10);
        doc.text(`${get(paymentObject(), 'sub_total', 0).toFixed(2)}`, pageWidth - 14, finalY + 10, {align: 'right'});
        doc.text(`${get(paymentObject(), 'discount', 0).toFixed(2)}`, pageWidth - 14, finalY + 14, {align: 'right'});
        doc.text(`${get(paymentObject(), 'coupon_discount', 0).toFixed(2)}`, pageWidth - 14, finalY + 18, {align: 'right'});
        doc.text(`${get(paymentObject(), 'used_points', 0).toFixed(2)}`, pageWidth - 14, finalY + 22, {align: 'right'});
        doc.text(`${(get(paymentObject(), 'discount', 0) +
                         get(paymentObject(), 'coupon_discount', 0)).toFixed(2)}`, pageWidth - 14, finalY + 26, {align: 'right'});
        doc.text(`${get(paymentObject(), 'tax_amount', 0).toFixed(2)}`, pageWidth - 14, finalY + 30, {align: 'right'});
        doc.setFontSize(12);
        doc.text(`${get(paymentObject(), 'grant_total', 0).toFixed(2)}`, pageWidth - 14, finalY + 36, {align: 'right'});

        doc.save(`Invoice-${moment().format('YYYY-MM-DD')}.pdf`);

    }

    const gotoPayment = () => {
        payAgain(data);
    }

    const paymentObject = () => {
       const obj = find(data.payments, {payment_status: 'SUCCESS'});
       if(isEmpty(obj)){
           return data.payments[data.payments.length - 1];
       }else{
           return obj
       }
    }


    return (
        <div className="container">
            <div className="page-content container">

                <div className="page-header text-blue-d2">
                    <h1 className="page-title text-secondary-d1">
                        Invoice
                        <small className="page-info">
                            <i className="fa fa-angle-double-right text-80"></i>
                            ID: {invoiceId}
                        </small>
                    </h1>

                    <div className="page-tools">
                        <div className="action-buttons">
                            <a href={true} onClick={() => generatePdf()} className="btn bg-white btn-light mx-1px text-95"
                               data-title="PDF">
                                <i className="mr-1 fa fa-file-pdf-o text-danger-m1 text-120 w-2"></i>
                                Export
                            </a>
                        </div>
                    </div>
                </div>

                <div className="container px-0">
                    <div className="row">
                        <div className="col-12 col-lg-10 offset-lg-1">
                            <div className="row">
                                <div className="col-sm-6">
                                    <div>
                                        <span className="text-sm text-grey-m2 align-middle">To:</span>
                                        <span
                                            className="text-600 text-110 text-blue align-middle">{get(data, 'user.firstname', '')}</span>
                                    </div>
                                    <div className="text-grey-m2">
                                        <div className="my-1">
                                            {get(data, 'user.lastname', '')}
                                        </div>
                                        <div className="my-1">
                                            {get(data, 'user.email', '')}
                                        </div>
                                        <div className="my-1"><i
                                            className="fa fa-phone fa-flip-horizontal text-secondary"></i> <b
                                            className="text-600">{get(data, 'user.phone', '')}</b></div>
                                    </div>
                                </div>
                                {/*// <!-- /.col -->*/}

                                <div
                                    className="text-95 col-sm-6 align-self-start d-sm-flex justify-content-end">
                                    <hr className="d-sm-none"/>
                                    <div className="text-grey-m2">
                                        <div className="mt-1 mb-2 text-secondary-m1 text-600 text-125">
                                            Invoice
                                        </div>

                                        <div className="my-2">
                                            <i className="fa fa-circle text-blue-m2 text-xs mr-1"></i> <span
                                            className="text-600 text-90">ID:</span> {get(data, 'id', '')}
                                        </div>

                                        <div className="my-2">
                                            <i className="fa fa-circle text-blue-m2 text-xs mr-1"></i> <span
                                            className="text-600 text-90">Booked by:</span>
                                            {invoicePaymentType(get(data, 'payments', null))}
                                        </div>

                                        <div className="my-2">
                                            <i className="fa fa-circle text-blue-m2 text-xs mr-1"></i> <span
                                            className="text-600 text-90">Status:</span> <span
                                            className="badge badge-warning badge-pill px-25">
                                            {invoiceStatus(data)}</span>
                                        </div>
                                    </div>
                                </div>
                                {/*// <!-- /.col -->*/}
                            </div>

                            <div className="mt-4">
                                <div className="row text-600 text-white bgc-default-tp1 py-25">
                                    <div className="d-none d-sm-block col-1">#</div>
                                    <div className="col-4">Service name</div>
                                    <div className="col-5">Time</div>
                                    <div style={{textAlign: 'right'}}
                                         className="col-2">Unit Price($)</div>
                                </div>

                                <div className="text-95 text-secondary-d3">
                                    {data.slots_details.map((slot, index) => {
                                        return (
                                            <div className="row mb-2 mb-sm-0 py-25">
                                                <div className="d-none d-sm-block col-1">{index + 1}</div>
                                                <div className="col-4">{slot.service.name}</div>
                                                <div className="col-5">
                                                    <Moment
                                                        format='YYYY-MM-DD hh:mm:A'>{moment(slot.slot, 'YYYY-MM-DD hh:mm:ss')}</Moment>
                                                </div>
                                                <div className="d-none d-sm-block col-2 text-95"
                                                     style={{textAlign: 'right'}}>${get(slot, 'price', 0).toFixed(2)}</div>
                                            </div>
                                        )
                                    })}
                                </div>

                                <div className="row border-b-2 brc-default-l2"></div>

                                <div className="row mt-3">
                                    <div className="col-12 col-sm-7 text-grey-d2 text-95 mt-2 mt-lg-0">
                                        Extra note such as company or payment information...
                                    </div>

                                    <div className="col-12 col-sm-5 text-grey text-90 order-first order-sm-last">
                                        <div className="row my-2">
                                            <div className="col-7 text-right">
                                                SubTotal
                                            </div>
                                            <div className="col-5" style={{textAlign: 'right'}}>
                                                <span className="text-120 text-secondary-d1">
                                                    {get(paymentObject(), 'sub_total', 0).toFixed(2)}
                                                </span>
                                            </div>
                                        </div>



                                        <div className="row my-2">
                                            <div className="col-7 text-right">
                                                Coupon discount
                                            </div>
                                            <div className="col-5" style={{textAlign: 'right'}}>
                                                <span className="text-120 text-secondary-d1">
                                                    {get(paymentObject(), 'coupon_discount', 0).toFixed(2)}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="row my-2">
                                            <div className="col-7 text-right">
                                                Used points
                                            </div>
                                            <div className="col-5" style={{textAlign: 'right'}}>
                                                <span className="text-120 text-secondary-d1">
                                                    {get(paymentObject(), 'used_points', 0).toFixed(2)}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="row my-2">
                                            <div className="col-7 text-right">
                                                Total discount
                                            </div>
                                            <div className="col-5" style={{textAlign: 'right'}}>
                                                <span className="text-120 text-secondary-d1">
                                                    {get(paymentObject(), 'discount', 0).toFixed(2)}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="row my-2">
                                            <div className="col-7 text-right">
                                                Total Tax ($)
                                            </div>
                                            <div className="col-5" style={{textAlign: 'right'}}>
                                                <span className="text-110 text-secondary-d1">
                                                    {get(paymentObject(), 'tax_amount', 0).toFixed(2)}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="row my-2 align-items-center bgc-primary-l3 p-2">
                                            <div className="col-7 text-right">
                                                Total Amount
                                            </div>
                                            <div className="col-5" style={{textAlign: 'right'}}>
                                                        <span
                                                            className="text-150 text-success-d3 opacity-2">
                                                            {get(paymentObject(), 'grant_total', 0).toFixed(2)}
                                                        </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <hr/>

                                {invoiceStatus(data) === 'UNPAID' && (
                                    <div>
                                        <span className="text-secondary-d1 text-105">Thank you for your business</span>
                                        <a href={true} onClick={gotoPayment} className="btn btn-info btn-bold px-4 float-right mt-3 mt-lg-0">Pay
                                            Now</a>
                                    </div>
                                )}

                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    )
}
export default InvoiceComponent;
