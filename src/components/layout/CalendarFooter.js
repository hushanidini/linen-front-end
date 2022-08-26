import React from 'react';

export default function CalenderFooter(){

    return(
        <div className="status"  style={{ marginTop: '10px'}}>
            <div className="row d-flex justify-content-center" style={{ paddingTop: '15px' , borderTop: '1px solid #5d5d5d'}}>
                <div className="col-md-2">
                    <i className="fas fa-circle vm_text_green"></i> My Booking
                </div>
                <div className="col-md-2">
                    <i className="fas fa-circle vm_text_gray"></i> Reserved
                </div>
                <div className="col-md-2">
                    <i className="fas fa-circle vm_text_light_gray2"></i> Available
                </div>
            </div>
        </div>
    )
}
