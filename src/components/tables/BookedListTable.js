import React, {useEffect, useState} from 'react';
import {get, isEmpty} from 'lodash';
import {connect} from "react-redux";
import moment from 'moment';

//nWrcTdj6
const BookedListTable = ({
                             onClose, clearSlots,
                             removeSlots, slots,
                             discounts, couponsProps,
                             onCheckPromoCode, proceedNext,
                             membership, ...props
                         }) => {

    const [promoCode, setPromoCode] = useState();
    const [coupons, setCoupons] = useState(couponsProps);
    const [usedPoints, setPoints] = useState(0);
    const [error, setError] = useState('');

    let totalCouponDiscount = 0.00;
    let totalMultiHoursDiscount = 0.00;


    let totalPrice = 0.00; //  mean with groping discount
    let totalTax = 0.00;
    let totalPriceWithoutDiscount = 0.00;

    useEffect(() => {
        setCoupons(couponsProps);
    });

    const clearBooked = async () => {
        clearSlots();
        onClose();
    }

    const remove = (slot, service_id) => {
        if (slots[0].slots.length === 1) {
            onClose();
        }
        removeSlots(slot, service_id);
    }

    const discountPercentage = (count, service_id) => {
        let percentage = 0;
        discounts.forEach(discount => {
            if (discount.start <= count && count <= discount.end && discount.service_id === service_id) {
                percentage = discount.discount;
                return percentage;
            }
        });
        return percentage;
    }

    const calculatePrice = (item, serviceSlots) => {
        let price = 0;
        let couponDiscount =0;
        item.data.forEach(data => {
            price = price + data.shift.actual_price;
        });
        const discount = discountPercentage(item.data.length, serviceSlots.service.id);
        const total = price - (price * discount / 100);
        if(coupons.length >0){
            couponDiscount = calculateCouponDiscountPrice(total , serviceSlots);
            totalCouponDiscount = totalCouponDiscount + couponDiscount;
            // alert(totalCouponDiscount);
        }
        totalPriceWithoutDiscount=totalPriceWithoutDiscount+price;
        totalMultiHoursDiscount = totalMultiHoursDiscount + (price * discount / 100);
        totalPrice = totalPrice + total - couponDiscount;
        return (total - couponDiscount).toFixed(2);
    }

    const calculateSubTotal = (item, serviceSlots)=>{
        let price = 0;
        item.data.forEach(data => {
            price = price + data.shift.actual_price;
        });
        const discount = discountPercentage(item.data.length, serviceSlots.service.id);
        const total = price - (price * discount / 100);
        return total.toFixed(2);
    }

    const calculateDiscountPrice = (item, serviceSlots) => {
        let price = 0;
        item.data.forEach(data => {
            price = price + data.shift.actual_price;
        });
        const discount = discountPercentage(item.data.length, serviceSlots.service.id);
        const discountPrice = (price * discount / 100);
        if (discountPrice === 0) {
            return false;
        }
        return discountPrice.toFixed(2);
    }

    const calculateCouponDiscountPrice = (sub_total, serviceSlots) => {
        if (isEmpty(get(serviceSlots, 'service', {}))) {
            return;
        }
        const {user} = props;
        if (isEmpty(coupons)) {
            return false;
        }
        let discountPercentage = 0;
        let discountPrice = 0;
        let totalDiscountPrice = 0;
        const validCouponsAll = coupons.filter(coupon =>
                                (isEmpty(coupon.member_ship_ids) || coupon.member_ship_ids.includes(user.member_ship.id))
                                &&
                                (isEmpty(coupon.user_ids) || coupon.user_ids.includes(user.id))
                                &&
                                coupon.branch_ids.includes(get(serviceSlots, 'service.branch_id', false))
                                &&
                                coupon.service_ids.includes(get(serviceSlots, 'service.id', true)));
        if(validCouponsAll.length > 0) {
            validCouponsAll.forEach(coupon => {
                if (coupon.off_percentage !== null) {
                    discountPercentage = discountPercentage + coupon.off_percentage;
                }
                if (coupon.off_amount !== null) {
                    discountPrice = discountPrice + coupon.off_amount;
                }
            });
            if( discountPercentage !== 0 ){
                totalDiscountPrice = totalDiscountPrice + sub_total *  discountPercentage / 100;
            }
            if(discountPrice !== 0 ){
                totalDiscountPrice = totalDiscountPrice + discountPrice;
            }
            return totalDiscountPrice;
        }
    return false;
    }

    const calculateTaxes = (item, serviceSlots) => {
        let price = 0;
        item.data.forEach(data => {
            price = price + data.shift.actual_price;
        });
        const discount = discountPercentage(item.data.length, serviceSlots.service.id);

        const total = price - (price * discount / 100).toFixed(2);

        totalTax = totalTax + ((total / 100) * serviceSlots.service.tax);

        const taxPrice = (total / 100) * serviceSlots.service.tax;


        return taxPrice.toFixed(2);

    }

    const calculateGrantTotal = () => {
        const price = totalPrice + totalTax - usedPoints;
        return price.toFixed(2);
    }

    const checkPromoCode = () => {
        onCheckPromoCode(promoCode);
    }

    const onChangePromoCode = event => {
        setPromoCode(event.target.value);
    }

    const onChangePoints = event => {
        setPoints(event.target.value);
        setError(null);
        const grant_total = totalPrice + totalTax - totalCouponDiscount;
        const max = parseFloat(grant_total.toFixed(2));

        if (max >= event.target.value &&
            get(props.user, 'total_points', null) >= event.target.value &&
            0 <= event.target.value) {
            setError(null);
        } else {
            setError('Points should be in between your points and grand total');
        }
    }

    const nextProcess = () => {
        setError('');
        const max = parseFloat(calculateGrantTotal() - usedPoints);
        const total_discount = (totalCouponDiscount + totalMultiHoursDiscount);
        const data = {
            totalPriceWithoutDiscount,
            grant_total: calculateGrantTotal(),
            totalPrice,
            tax: totalTax.toFixed(2),
            total_discount: total_discount.toFixed(2),
            coupon_discount: totalCouponDiscount,
            promo_code_id: coupons ? coupons.map(coupon => {
                return coupon.id
            }) : null,
            used_points: parseFloat(usedPoints)
        }

        if (isEmpty(membership)) {
            proceedNext(error, data);
            return;
        }
        if (max >= usedPoints && get(props.user, 'total_points', null) >= usedPoints && 0 <= usedPoints) {
            proceedNext(error, data);
        } else {
            setError('Points should be in between your points and grand total');
        }
    }

    return (
        <div className="show_shopping_cart">
            <div className="modal-dialog modal-lg">
                <div className="modal-content">
                    <div className="modal-header">
                        <h4 className="modal-title"><b>
                            <i className="fa fa-shopping-cart"></i> Your Cart
                        </b>
                            <i onClick={() => clearBooked()}
                               data-toggle="tooltip"
                               title="Clear all"
                               style={{padding: '0 20px', cursor: 'pointer'}}
                               className="fa fa-eraser  vm_text_red"></i>
                        </h4>
                        <button onClick={() => onClose && onClose()}
                                type="button"
                                className="close"
                                data-dismiss="modal"
                                aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>

                    {!isEmpty(membership) && (
                        <div className="cart">
                            <div className="row">
                                <div className="col-md-9 col-6 item text-md-right text-left">
                                    <h5 className="m-0"><b>You have {get(props.user, 'total_points', null)} points <span
                                        className="vm_text_green">
                                        {/*(you will get {membership.points_per_booking} points per booking)*/}
                                    </span></b>
                                    </h5></div>
                            </div>
                        </div>
                    )}


                    <div className="modal-body">

                        <div style={{maxHeight: 'calc(100vh - 500px)', overflowY: 'auto', overflowX: 'hidden'}}>
                            {slots && slots.map(serviceSlots => {
                                // console.log(serviceSlots);
                                return serviceSlots.groupByDate.map((item, index) => {
                                    return (
                                        <div className="cart">
                                            <div style={{display: 'flex', flexDirection: 'row'}}>
                                                <div className="col-6 item text-left">
                                                    <h4 className="vm_text_green">
                                                        <b>{get(serviceSlots, 'service.name', '')}</b>
                                                    </h4>
                                                </div>
                                                <div className="col-6 item text-left">
                                                    <h5 className="vm_text_green">
                                                        <b>{item.date}</b>
                                                        ({item.data.length})
                                                    </h5>
                                                </div>
                                            </div>

                                            {item.data.map(slot => {
                                                return (
                                                    <div style={{display: 'flex', flexDirection: 'row'}}>
                                                        <div className="col-7 item">
                                                            <p>{moment(slot.slot, 'YYYY-MM-DD HH:mm:ss').format('hh:mm:A')}</p>
                                                        </div>
                                                        <div className="col-2 item text-right"
                                                             style={{textDecoration: 'line-through'}}>${slot.shift.price}</div>
                                                        <div
                                                            className="col-2 item text-right">${slot.shift.actual_price}</div>
                                                        <div className="col-1 item text-right"
                                                             style={{cursor: 'pointer'}}
                                                             onClick={() => remove(slot.slot, serviceSlots.service.id)}>
                                                            <i className="fa fa-times vm_text_red"></i>
                                                        </div>
                                                    </div>
                                                )
                                            })}

                                            {calculateDiscountPrice(item, serviceSlots) && (
                                                <div
                                                    style={{display: 'flex', flexDirection: 'row', fontWeight: 'bold'}}>
                                                    <div
                                                        className="col-6 item text-left">Multi hours discounts({discountPercentage(item.data.length, serviceSlots.service.id)}%)
                                                    </div>
                                                    <div className="col-5 item text-right">
                                                        -${calculateDiscountPrice(item, serviceSlots)}
                                                    </div>
                                                    <div className="col-1 item text-right"></div>
                                                </div>
                                            )}

                                            {/*coupon discounts*/}
                                            {calculateCouponDiscountPrice(calculateSubTotal(item, serviceSlots), serviceSlots) &&
                                            (
                                                <div
                                                    style={{display: 'flex', flexDirection: 'row', fontWeight: 'bold'}}>
                                                    <div className="col-6 item text-left">Coupon</div>
                                                    <div className="col-5 item text-right">
                                                        -${calculateCouponDiscountPrice(calculateSubTotal(item, serviceSlots), serviceSlots)}
                                                    </div>
                                                    <div className="col-1 item text-right"></div>
                                                </div>
                                            )}

                                            <div style={{display: 'flex', flexDirection: 'row', fontWeight: 'bold'}}>
                                                <div className="col-6 item text-left">Sub total($)</div>
                                                <div className="col-5 item text-right">
                                                    ${calculatePrice(item, serviceSlots)}
                                                </div>
                                                <div className="col-1 item text-right"></div>
                                            </div>




                                            <div style={{display: 'flex', flexDirection: 'row', fontWeight: 'bold'}}>
                                                <div className="col-6 item text-left">Tax
                                                    ({serviceSlots.service.tax} %)
                                                </div>
                                                <div className="col-5 item text-right">
                                                    +${calculateTaxes(item, serviceSlots)}
                                                </div>
                                                <div className="col-1 item text-right"></div>
                                            </div>


                                        </div>
                                    )
                                });
                            })}
                        </div>

                        <br/>

                        <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
                            <div className="input-group item" style={{float: 'right', width: 250}}>
                                {membership && (
                                    <div className="form-group">
                                        <label>Add your points</label>
                                        <input type="number" className="form-control"
                                               value={usedPoints}
                                               placeholder="Add your points"
                                               onChange={(event) => onChangePoints(event)}/>
                                        <small style={{color: 'red'}}
                                               className="form-text">
                                            {error}</small>
                                    </div>
                                )}
                            </div>

                            <div className="input-group item" style={{float: 'right', width: 250}}>
                                <div className="form-group">
                                    <label>Add promo code</label>
                                    <div style={{display: 'flex', flexDirection: 'row'}}>
                                        <input type="text"
                                               value={promoCode}
                                               className="form-control"
                                               placeholder="Promo code"
                                               onChange={(event) => onChangePromoCode(event)}
                                        />
                                        <div className="input-group-append">
                                    <span style={{cursor: 'pointer', color: '#fff', height: 39}}
                                          type="submit"
                                          onClick={checkPromoCode}
                                          className="input-group-text bg-success">Apply</span>
                                        </div>
                                    </div>

                                </div>
                            </div>


                        </div>

                        <br/>

                        <div className="cart">
                            <div className="row">
                                <div className="col-md-9 col-6 item text-md-right text-left">
                                    <h5 className="m-0">
                                        <b>Total price<span
                                            className="vm_text_red">($)</span>
                                        </b>
                                    </h5>
                                </div>
                                <div className="col-md-3 col-6 item text-right"><h5 className="m-0">
                                    <b>${totalPrice.toFixed(2)}</b>
                                </h5></div>
                            </div>
                        </div>

                        {usedPoints > 0 && (
                            <div className="cart">
                                <div className="row">
                                    <div className="col-md-9 col-6 item text-md-right text-left">
                                        <h5 className="m-0">
                                            <b>Points<span className="vm_text_red"></span></b>
                                        </h5>
                                    </div>
                                    <div className="col-md-3 col-6 item text-right"><h5 className="m-0">
                                        <b>-${usedPoints}</b>
                                    </h5></div>
                                </div>
                            </div>
                        )}


                        <div className="cart">
                            <div className="row">
                                <div className="col-md-9 col-6 item text-md-right text-left">
                                    <h5 className="m-0">
                                        <b>Total tax<span className="vm_text_red">($)</span></b>
                                    </h5>
                                </div>
                                <div className="col-md-3 col-6 item text-right"><h5 className="m-0">
                                    <b>${totalTax.toFixed(2)}</b>
                                </h5></div>
                            </div>
                        </div>

                        <div className="cart">
                            <div className="row">
                                <div className="col-md-9 col-6 item text-md-right text-left"><h5 className="m-0">
                                    <b><span
                                        className="vm_text_red">Grand Total (CAD)</span></b></h5></div>
                                <div className="col-md-3 col-6 item text-right"><h5 className="m-0">
                                    <span className="vm_text_red">
                                        <b>${calculateGrantTotal()}</b>
                                    </span>
                                </h5></div>
                            </div>
                        </div>
                    </div>

                    <div style={{display: 'flex', justifyContent: 'center', padding: 10}}>
                        <button onClick={() => nextProcess()} className="btn btn-success">Proceed next</button>
                    </div>
                </div>

            </div>
        </div>
    )
}

const mapStateToProps = state => {
    const {user} = state;
    return {user};
}

export default connect(mapStateToProps, null)(BookedListTable);
