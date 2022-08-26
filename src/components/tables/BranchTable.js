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

const BranchTable=({header ,branches ,openUpdateForm ,handleDelete,changeStatus,goToDetails})=>{
    return (
        <table className="table">
            <TableHead header={header}/>
            <tbody>
            {branches.map(branch =>{
                return (
                    <tr>
                        <td onClick={()=>{goToDetails && goToDetails(branch)}}
                            style={{textAlign:'left' ,cursor: 'pointer'}}>{branch.name}</td>
                        <td style={{textAlign:'left'}}>{branch.email}</td>
                        <td style={{textAlign:'left'}}>{branch.address}</td>
                        <td style={{textAlign:'left'}}>{branch.phone}</td>
                        <td style={{ minWidth:150 ,justifyContent: 'center' , alignItems:'center'}}>
                                <Switch
                                    checked={branch.status}
                                    onChange={()=>changeStatus(branch)}
                                    color="primary"
                                    inputProps={{ 'aria-label': 'checkbox with default color' }}
                                />
                                <EditIcon onClick={()=>{openUpdateForm && openUpdateForm(branch)}} color="action" style={{cursor: 'pointer', margin:2}}/>
                                <DeleteForeverIcon onClick={()=>{handleDelete && handleDelete(branch)}}color="action" style={{cursor: 'pointer' , margin:2}} />
                        </td>
                    </tr>
                )
            })}
            </tbody>
        </table>
    );
}
export default BranchTable;
