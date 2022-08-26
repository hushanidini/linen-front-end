import React from 'react';
import PropTypes from "prop-types";
import {withStyles} from "@material-ui/core";
import moment from "moment";
import {isEqual} from "lodash";

const styles = theme => ({
    chip: {
        display: 'inlineBlock',
        fontWeight: 'bold',
        fontSize: '16px',
        lineHeight: '40px',
        borderRadius: '6px',
        width: '124px',
        backgroundColor: props => chipBgColor(props.status),
        // borderColor: props => chipColor(props.label),
        color: props => chipColor(props.status),
        textTransform: props => (props.uppercase ? 'uppercase' : 'capitalize'),
        '&> :hover': {
            backgroundColor: props=> props.status.toUpperCase() !== 'BOOKED' ?'#5b9541':'',
            color: props=> props.status.toUpperCase() !== 'BOOKED' ? '#fff':'',
            borderRadius: '6px',
        },
    },
    closeBtn: {
        paddingRight: '10px',
        color: '#5d5d5d',
        fontWeight: 'bold',
        float: 'right',
        fontSize: '20px',
        cursor: 'pointer',
        '&> :hover': {
            color: 'red'
        }
    }
});
const chipBgColor = type => {
    switch (type.toUpperCase()) {
        case 'AVAILABLE':
            return '#f6f6f6';
        case 'HOLIDAYS':
            return '#2a2a2a';
        case 'BOOKING':
            return '#5b9541';
        case 'BOOKED':
            return '#959595';

        default:
            return '#ff357d';
    }
}
const chipColor = type => {
    switch (type.toUpperCase()) {
        case 'AVAILABLE':
            return '#7e7e7e';
        case 'HOLIDAYS':
            return '#ffffff';
        case 'BOOKING':
            return '#ffffff';
        case 'BOOKED':
            return '#fff';

        default:
            return '#f8f1f1';
    }
};
// class CustomChips extends Component
const CustomChips = props => {
    const {classes, status, dateWithTime, onCloseChips, onClickChip, data} = props;

    const handleClick = (date, service_id) => {
        if (onClickChip) {
            onClickChip(date, service_id);
        }
    }
    const handleClose = (date, service_id) => {
        if (onCloseChips) {
            onCloseChips(date, service_id);
        }
    }

    return (
        <div className={classes.chip}>
            {isEqual(status, 'holidays') && (
                <p style={{margin: 0 , fontSize:14}}>
                    HOLIDAY
                </p>
            )}
            {isEqual(status, 'available') && (
                <p style={{margin: 0, cursor: 'pointer' , fontSize:14}} onClick={() => handleClick(dateWithTime, data.service_id)}>
                    {moment(dateWithTime).format('hh:mm:a')}
                </p>
            )}
            {isEqual(status, 'booking') && (
                <p style={{margin: 0 , fontSize:14}}>
                    {moment(dateWithTime).format('hh:mm:a')}
                    <span className={classes.closeBtn}
                          onClick={() => handleClose(dateWithTime, data.service_id)}>&times;</span>
                </p>
            )}
            {isEqual(status, 'booked') && (
                <p style={{margin: 0, textDecoration: 'line-through' , fontSize:14}}>
                    {moment(dateWithTime).format('hh:mm:a')}
                </p>
            )}
        </div>
    )
}

CustomChips.defaultProps = {
    status: 'available',
    variant: "outline",
    upperCase: false,
    isCloseBtn: false,
}
CustomChips.propTypes = {
    label: PropTypes.string,
    variant: PropTypes.string,
    upperCase: PropTypes.bool,
    isCloseBtn: PropTypes.bool,
}
export default withStyles(styles)(CustomChips);
