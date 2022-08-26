import React from 'react';
import {get} from 'lodash';
import BookedHistory from "./bookedHIstory/BookedHistory";
import StarImg from '../assets/img/linen_and_love_studio_appointed_date.png';
import CalendarImg from '../assets/img/linen_and_love_studio_points_icon.png';

export default function Profile({membership ,user}) {


    return (
        <div className="dashboard">
            <div className="container">
                <div className="row">
                    <div className="col-md-4">
                        <div className="card_wrapper profile_details">
                            <div className="row">
                                <div className="col-md-12 d-flex justify-content-center align-items-center text-center">
                                    <div className="vm_bg_gray w-100 d-flex rounded align-items-center">
                                        <div className="vm_bg_green p-2 rounded-top rounded-left">
                                            <i className="fa fa-star text-white"></i>
                                        </div>
                                        <p className="text-white">{get(user ,'name' ,'')}</p>
                                    </div>
                                </div>
                                <div className="col-md-12 d-flex justify-content-center">
                                    <div className="circle_1 rounded-circle border p-2">
                                        <div className="vm_bg_gray rounded-circle circle_2 text-center text-white pt-5">
                                            <h1 className="pt-2"><b>{get(user ,'name' ,'').substring(0,2).toUpperCase()}</b></h1>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-12 pt-3 d-flex justify-content-center">
                                    <h4 className="text-uppercase"><b><i className="fa fa-user"></i>{get(user ,'lastname' ,'')}</b>
                                    </h4>
                                </div>
                                <hr className="w-100 mt-2"/>
                                    <div className="col-md-12">
                                        <p className="text-center">{user.email}</p>
                                    </div>
                            </div>
                        </div>
                    </div>

                    <div className="col-md-4">
                        <div className="card_wrapper">
                            <div className="row">
                                <div className="col-md-5">
                                        <img src={CalendarImg} alt="" className="w-100"/>
                                    <h3>{get(membership ,'name' ,'')}</h3>
                                </div>
                                <h2>{get(user ,'total_points' ,'')}</h2>

                            </div>
                        </div>
                    </div>

                    <div className="col-md-4">
                        <div className="card_wrapper">
                            <div className="row">
                                <div className="col-md-5">
                                    <img src={StarImg} alt="" className="w-100"/>
                                    <h4>Last booked details</h4>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
                <div style={{marginTop: '20px'}}>
                    <div className="card_wrapper">
                            <BookedHistory/>
                    </div>
                </div>

            </div>
        </div>
)
}
