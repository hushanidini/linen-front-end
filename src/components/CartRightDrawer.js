import React from 'react';
import {get} from 'lodash';
import moment from 'moment';


const CartRightDrawer = ({onClose , clearSlots , removeSlots , slots}) => {
    const clearBooked = async () => {
        clearSlots();
        onClose();
    }

    const remove=(slot , service_id)=>{
        if(slots[0].slots.length === 1){
            onClose();
        }
        removeSlots(slot , service_id);
    }

    return (
        <div className="show_shopping_cart">
            <div className="modal-dialog modal-lg">
                <div className="modal-content">
                    <div className="modal-header">
                        <h4 className="modal-title"><b>
                            <i className="fa fa-shopping-cart"></i> Your Cart
                        </b>
                            <i onClick={()=>clearBooked()}
                               data-toggle="tooltip"
                               title="Clear all"
                               style={{padding: '0 20px' , cursor: 'pointer'}}
                               className="fa fa-eraser  vm_text_red"></i>
                        </h4>
                        <button onClick={()=>onClose && onClose()}
                                type="button"
                                className="close"
                                data-dismiss="modal"
                                aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>

                    <div className="modal-body" >
                        <div className="header d-md-block d-none">
                            <div className="row">
                                <div className="col-md-3 col-3 item">Time</div>
                                <div className="col-md-3 col-3 item">Date</div>
                                <div className="col-md-3 col-2 item">Room</div>
                                <div className="col-md-2 col-4 item text-right">Price</div>
                                <div className="col-md-1 d-none d-md-block item text-left text-md-center"></div>
                            </div>
                        </div>
                        <div  style={{maxHeight:'calc(100vh - 400px)' , overflowY: 'auto' , overflowX: 'hidden'}}>
                            {slots && slots.map(serviceSlots=>{
                                return serviceSlots.slots.map(slot => {
                                    return (
                                        <div className="cart">
                                            <div className="row">
                                                <div className="col-md-2 col-12 item d-md-none"><h4 className="vm_text_green">
                                                    <b>{serviceSlots.service.name}</b></h4></div>
                                                <div className="col-md-3 col-4 item">{moment(slot.slot , 'YYYY-MM-DD HH:mm:ss').format('hh:mm:a')}</div>
                                                <div className="col-md-3 col-5 item">{moment(slot.slot , 'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DD')}</div>
                                                <div className="col-md-3 col-2 item d-none d-md-block">{get(serviceSlots , 'service.name','')}</div>
                                                <div className="col-md-2 col-3 item text-right"><b>${get(slot.shift, 'price' , '')}</b></div>
                                                <div style={{cursor: 'pointer'}}
                                                     onClick={()=>remove(slot.slot , serviceSlots.service.id )}
                                                     className="col-md-1 col-12 item text-left text-md-center d-flex justify-content-md-center justify-content-end">
                                                    <i className="fa fa-times vm_text_red"></i>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                });
                            })}
                        </div>
                        <br/>
                        <br/>
                        <div className="cart">
                            <div className="row">
                                <div className="col-md-9 col-6 item text-md-right text-left"><h5 className="m-0"><b>Discount<span
                                    className="vm_text_red">(20%)</span></b></h5></div>
                                <div className="col-md-2 col-6 item text-right"><h5 className="m-0"><b>-$28.5</b>
                                </h5></div>
                            </div>
                        </div>
                        <div className="cart">
                            <div className="row">
                                <div className="col-md-9 col-6 item text-md-right text-left">
                                    <h5 className="m-0">
                                        <b>Tax<span className="vm_text_red">(13%)</span></b>
                                    </h5>
                                </div>
                                <div className="col-md-2 col-6 item text-right"><h5 className="m-0"><b>-$33.34</b>
                                </h5></div>
                            </div>
                        </div>
                        <div className="cart">
                            <div className="row">
                                <div className="col-md-9 col-6 item text-md-right text-left"><h5 className="m-0"><b><span
                                    className="vm_text_red">Grand Total (CAD)</span></b></h5></div>
                                <div className="col-md-2 col-6 item text-right"><h5 className="m-0"><span
                                    className="vm_text_red"><b>$289.85</b></span></h5></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )}
export default CartRightDrawer;
