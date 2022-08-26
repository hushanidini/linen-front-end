import React from 'react';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import EditIcon from '@material-ui/icons/Edit';
import moment from "moment";
import {get} from "lodash";

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

const ShiftTable=({header ,shifts ,openUpdateForm ,handleDelete})=>{
    return(
        <table className="table">
            <TableHead header={header}/>
            <tbody>
            {shifts.map(shift =>{
                return (
                    <tr>
                        <td style={{textAlign:'left'}}>{shift.name}</td>
                        <td style={{textAlign:'left'}}>{get(shift.service ,'name' ,'')}</td>
                        <td style={{textAlign:'left'}}>{shift.day}</td>
                        <td style={{textAlign:'right'}}>{shift.price} $</td>
                        <td style={{textAlign:'right'}}>{shift.actual_price} $</td>
                        <td style={{textAlign:'left'}}>{moment(shift.start_time, 'hh:mm:ss').format('hh:mm A')}</td>
                        <td style={{textAlign:'left'}}>{moment(shift.end_time ,'hh:mm:ss').format( 'hh:mm A')}</td>
                        <td style={{textAlign:'left'}}>{shift.status?'Active':'Inactive'}</td>
                        <td>
                            <div style={{ minWidth:150,justifyContent: 'center',}}>
                                <EditIcon onClick={()=>{openUpdateForm && openUpdateForm(shift)}} color="action" style={{cursor: 'pointer', margin:2}}/>
                                <DeleteForeverIcon onClick={()=>{handleDelete && handleDelete(shift)}}color="action" style={{cursor: 'pointer' , margin:2}} />
                            </div>
                        </td>
                    </tr>
                );
            })}
            </tbody>
        </table>
    );
}
export default ShiftTable;
