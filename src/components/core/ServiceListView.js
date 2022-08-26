import React from 'react';


const ServiceListView = ({ services ,onChangeService})=>{

    return (
        <div className="add_extra_features">
                <div className="modal-dialog modal-lg" role="document">
                    <div className="modal-content">
                        <div className="modal-body p-4">
                            <div className="row">

                                {services.map((service)=>{
                                    return (
                                        <div className="col-md-6 pb-5">
                                            <div className="item p-4 border">
                                                <div className="row">
                                                    <div className="col-md-6">
                                                        <img src="https://source.unsplash.com/random" alt="" className="w-100" />
                                                    </div>
                                                    <div className="col-md-6">
                                                        <h5 className="rounded-pill d-inline position-absolute vm_bg_gray offer p-2 text-white">20%</h5>
                                                        <h5>{service.type} | {service.name}</h5>
                                                        <div className="price vm_text_green">
                                                            <b><span className="vm_text_gray pr-2">$100</span>$80</b>
                                                        </div>
                                                        <div onClick={()=>onChangeService(service)}  className="btn mt-2 vm_bg_green text-white">Select</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                    )
                                })}

                            </div>
                        </div>
                    </div>
                </div>
        </div>
    );
}
export default ServiceListView;
