import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import {FormControlLabel, Radio} from '@material-ui/core';
import * as PropTypes from "prop-types";

const useStyles = makeStyles((theme) => ({
    main: {
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
    },
    root: {
        justifyContent: 'space-between',
        borderBottom: '1px solid rgba(0, 0, 0, 0.42)'
    },
    helperText: {
        color: 'red!important',
    },
    label: {
        // fontSize:'30px'
    }
}));

const InputRadio = ({value, label, getValue, error, errorMessage, ...props}) => {
    const classes = useStyles();
    const [selectedValue, setSelectedValue] = React.useState(value);

    const handleChange = (event) => {
        setSelectedValue(!selectedValue);
        if (getValue) {
            getValue(event.target.value === 'true');
        }
    };
    return (
        <div className={classes.main}>
            <FormControlLabel
                control={<Radio
                    checked={selectedValue}
                    onClick={event => handleChange(event)}
                    value={!selectedValue}
                    color="primary"/>}
                label={label}
                labelPlacement="start"
                classes={{
                    root: classes.root
                }}
                style={{margin: 8}}
                {...props}
            />
            <p style={{marginLeft: 16, fontSize: '0.75rem', color: 'red'}}>{error ? errorMessage : ''}</p>
        </div>

    );
}

InputRadio.propTypes = {
    error: PropTypes.bool,
    errorMessage: PropTypes.string,
    label: PropTypes.string,
    value: PropTypes.string,
}
InputRadio.defaultProps = {
    error: false,
    errorMessage: 'The field is required',
    label: 'Text',
    value: false
}

export default InputRadio;
