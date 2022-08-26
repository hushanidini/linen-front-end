import React, {useState} from 'react';
import { isEmpty} from "lodash";
import MultipleSelect from "../core/MultipleSelect/MultipleSelect";

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

const ManagersTable=({header ,tableDatas ,branches,addBranches ,goToDetails})=>{
    const [values , setValues] = useState(false)
    const mapSelectedUsers=selectedBranches=>{
        let selectedOptions=[];
        selectedBranches.forEach(selectBranch=>{
            const data = branches.filter(data=>data.id === selectBranch.id)[0];
            if(!isEmpty(data)){
                selectedOptions.push(data);
            }
        });
        return selectedOptions;
    }

    return (
        <table className="table">
            <TableHead header={header}/>
            <tbody>
            {tableDatas.map(data =>{
                return (
                    <tr>
                        <td onClick={() =>goToDetails(data.id)}
                            style={{textAlign:'left' ,cursor: 'pointer'}}>{data.firstname}</td>
                            <td style={{textAlign:'left'}}>{data.lastname}</td>
                        <td style={{textAlign:'left'}}>{data.email}</td>
                        <td style={{textAlign:'left'}}>
                                <MultipleSelect setValue={val=>setValues(val)}
                                                       selected={mapSelectedUsers(data.branches)}
                                                       options={branches}/>
                        </td>
                        <td>
                            <div style={{ minWidth:150,justifyContent: 'center',}}>
                                <button disabled={!values} className="btn btn-primary" onClick={()=> {
                                    addBranches(values, data);
                                    setValues(false);
                                }}>Done</button>
                            </div>
                        </td>
                    </tr>
                )
            })}
            </tbody>
        </table>
    )
}
export default ManagersTable;

