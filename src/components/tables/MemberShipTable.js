import React from 'react';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import EditIcon from '@material-ui/icons/Edit';

function TableHead({header}) {
    return (
        <thead>
        <tr>
            {header.map(header => {
                return (
                    <th style={{textAlign: header.align}} scope="col">{header.label}</th>
                )
            })}
        </tr>
        </thead>
    );
}

const MembershipTable = ({header, memberships, openUpdateForm, handleDelete}) => {
    return (
        <table className="table">
            <TableHead header={header}/>
            <tbody>
            {memberships.map(membership => {
                return (
                    <tr>
                        <td style={{textAlign: 'left'}}>{membership.name}</td>
                        <td style={{textAlign: 'right'}}>{membership.fee} $</td>
                        <td style={{textAlign: 'right'}}>{membership.points_per_booking} $</td>
                        <td style={{textAlign: 'right'}}>{membership.cancellation} %</td>
                        <td style={{textAlign: 'right'}}>{membership.exchange} %</td>
                        <td>
                            <div style={{ minWidth:150,justifyContent: 'center',}}>
                                <EditIcon onClick={() => {
                                    openUpdateForm && openUpdateForm(membership)
                                }} color="action" style={{cursor: 'pointer', margin: 2}}/>
                                <DeleteForeverIcon onClick={() => {
                                    handleDelete && handleDelete(membership)
                                }} color="action" style={{cursor: 'pointer', margin: 2}}/>
                            </div>
                        </td>
                    </tr>
                );
            })}
            </tbody>
        </table>
    );
}
export default MembershipTable;
