import React from 'react';

const MembershipComponent = ({getMembership, membership}) => {

    return (
        <div className="item" style={{margin:'0 6px'}}>
            <h4 className="title">{membership.name}</h4>
            <div className="content">
                <h5>Membership Fee ${membership.fee}</h5>
                <h5 className="text-muted">Each booking will get {membership.points_per_booking} points per slot</h5>
                <h5>Reinstate fee :<br/><span
                    className="text-muted">Change membership fee ${membership.exchange}</span></h5>
                <h5><i className="fa fa-star"></i> Earn {membership.init_points} Points</h5>
                <h5>Valid time {membership.valid_duration} months</h5>
            </div>
            <div className="footer">
                <a href={true} onClick={() => getMembership(membership)}>
                    <div className="btn">Continue</div>
                </a>
            </div>
        </div>

    )
}
export default MembershipComponent;
