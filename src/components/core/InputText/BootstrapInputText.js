import React, {useState} from 'react';
import * as PropTypes from "prop-types";


const BootstrapInputText = ({value, getValue, error, errorMessage, placeholder , ...props}) => {
    const [inputValue , setValue] = useState(value)

    const getInputValue = event => {
        if (getValue) {
            getValue(event.target.value);
        }
        setValue(event.target.value);
    }
    return (
        <>
            <input
                className="form-control"
                value={inputValue}
                style={error?{borderColor:'red'}:{}}
                placeholder={placeholder}
                onChange={event => getInputValue(event)}
                {...props}
            />
            {error && (
                <p style={{color: 'red', marginTop: '0px' , marginLeft:'0px'}}>{errorMessage}</p>
            )}
        </>

    );
}

BootstrapInputText.propTypes = {
    error: PropTypes.bool,
    errorMessage: PropTypes.string,
    name: PropTypes.string,
    label: PropTypes.string,
    value: PropTypes.string,
}
BootstrapInputText.defaultProps = {
    error: false,
    errorMessage: 'The field is required',
    placeholder: 'Type here',
    label: 'Text',
    value: ''
}

export default BootstrapInputText;
