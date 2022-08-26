import React from 'react';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import EditIcon from '@material-ui/icons/Edit';
import {Switch} from "@material-ui/core";

function TableHead({header}){
    return (
        <thead>
        <tr>
            {header.map(header =>{
                return (
                    <th style={{textAlign: header.align}} scope="col">{header.label}</th>
                )
            })}
        </tr>
        </thead>
    );
}

const CouponTable=({header ,coupons ,openUpdateForm ,handleDelete,changeStatus,goToDetails})=>{
    return (
        <table className="table">
            <TableHead header={header}/>
            <tbody>
            {coupons.map(coupon =>{
                return (
                    <tr>
                        <td onClick={()=>{goToDetails && goToDetails(coupon)}}
                            style={{textAlign:'left' ,cursor: 'pointer'}}>{coupon.title}</td>
                        <td style={{textAlign:'left'}}>{coupon.code}</td>
                        <td style={{textAlign:'left'}}>{coupon.off_percentage} %</td>
                        <td style={{textAlign:'left'}}>{coupon.coupon_start}</td>
                        <td style={{textAlign:'left'}}>{coupon.coupon_expire}</td>
                        <td style={{textAlign:'left'}}>{coupon.max_no_of_use}</td>
                        <td style={{textAlign:'left'}}>{coupon.no_of_used}</td>
                        <td style={{justifyContent: 'center' , alignItems:'center' , minWidth:150}}>
                            <Switch
                                checked={coupon.status}
                                onChange={()=>changeStatus(coupon)}
                                color="primary"
                                inputProps={{ 'aria-label': 'checkbox with default color' }}
                            />
                            <EditIcon onClick={()=>{openUpdateForm && openUpdateForm(coupon)}} color="action" style={{cursor: 'pointer', margin:2}}/>
                            <DeleteForeverIcon onClick={()=>{handleDelete && handleDelete(coupon)}}color="action" style={{cursor: 'pointer' , margin:2}} />
                        </td>
                    </tr>
                )
            })}
            </tbody>
        </table>
    );
}
export default CouponTable;
