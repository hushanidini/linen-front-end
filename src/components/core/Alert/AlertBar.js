import {Component} from "react";
import * as PropTypes from "prop-types";
import Swal from "sweetalert2";

class AlertBar extends Component {
    constructor(props) {
        super(props);
        const {alertMessage ,alertType ,onClose} = this.props;
        Swal.fire({
            toast: true,
            position: 'top-right',
            icon: alertType,
            title: alertMessage,
            showClass: {
                popup: 'animate__animated animate__fadeInDown',
                // icon: '',

            },
            hideClass: {
                popup: 'animate__animated animate__fadeOutUp',
            },
            timer: 2000,
            timerProgressBar: true,
            showConfirmButton: false,
            width: 'auto',
            padding: '14px',
            onClose: onClose
        });
    }

    render() {
        return null;
    }
}

AlertBar.propTypes = {
    onClose: PropTypes.func,
    alertType: PropTypes.any,
    alertMessage: PropTypes.any
};

export default AlertBar;
