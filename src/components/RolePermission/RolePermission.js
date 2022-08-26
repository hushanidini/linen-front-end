import PropTypes from 'prop-types';
import {connect} from 'react-redux';

const RolePermission = props =>{

    if (props.roles && props.user){
        let couldShow;
        props.user.roles.forEach(role=>{
            couldShow = props.roles.includes(role);
        })
        return couldShow? props.children : null;
    }
    return null;

}
RolePermission.protoType = {
    roles:PropTypes.string.isRequired
}
const mapStateToProps=state=>{
    const {user} = state;
    return {user};
}

export default connect(mapStateToProps)(RolePermission);
