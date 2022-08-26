import React from 'react';
import './facilitiesStyle.css';

const FacilitiesTables=()=>{
    return (
        <div>
            <div className="container">
                <div className="row">
                    <div className="col-12">
                        <table className="table table-image">
                            <thead>
                            <tr>
                                <th className="col col-sm-6 col-md-6 col-lg-6">Image</th>
                                <th className="col col-sm-2 col-md-2 col-lg-2">Facility</th>
                                <th className="col col-sm-2 col-md-2 col-lg-2">price per hour</th>
                                <th className="col col-sm-2 col-md-2 col-lg-2">Action</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr>
                                <td className="w-25">
                                    <img
                                        src="https://s3.eu-central-1.amazonaws.com/bootstrapbaymisc/blog/24_days_bootstrap/sheep-3.jpg"
                                        className="img-fluid img-thumbnail" alt="Sheep" />
                                </td>
                                <td>Makeup station</td>
                                <td>11</td>
                                <td style={{paddingTop:'0px!important',
                                            paddingBottom:'0px!important'}}>
                                    <button className="button">ADD</button>
                                </td>
                            </tr>
                            <tr>
                                <td className="w-25">
                                    <img
                                        src="https://s3.eu-central-1.amazonaws.com/bootstrapbaymisc/blog/24_days_bootstrap/sheep-5.jpg"
                                        className="img-fluid img-thumbnail" alt="Sheep" />
                                </td>
                                <td>Lighting</td>
                                <td>10</td>
                                <td>ADD</td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default FacilitiesTables;
