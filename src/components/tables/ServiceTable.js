import React from 'react';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import EditIcon from '@material-ui/icons/Edit';
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

const ServiceTable=({header ,services ,openUpdateForm ,handleDelete ,goToDetails})=>{
    return (
        <table className="table">
            <TableHead header={header}/>
            <tbody>
            {services.map(service =>{
                return (
                    <tr>
                        <td onClick={() =>goToDetails(service.id)}
                            style={{textAlign:'left' ,cursor: 'pointer'}}>{service.name}</td>
                        <td style={{textAlign:'left'}}>{get(service.branch ,'name')}</td>
                        <td style={{textAlign:'left'}}>{service.type}</td>
                        <td style={{textAlign:'left'}}>{service.max_reservation}</td>
                        <td style={{textAlign:'left'}}>{service.tax} %</td>
                        <td style={{textAlign:'left'}}>{service.status?'Active':'Inactive'}</td>
                        <td>
                            <div style={{ minWidth:150,justifyContent: 'center',}}>
                                <EditIcon onClick={()=>{openUpdateForm && openUpdateForm(service)}} color="action" style={{cursor: 'pointer', margin:2}}/>
                                <DeleteForeverIcon onClick={()=>{handleDelete && handleDelete(service)}}color="action" style={{cursor: 'pointer' , margin:2}} />
                            </div>
                        </td>
                    </tr>
                )
            })}
            </tbody>
        </table>
    )
}
export default ServiceTable;
