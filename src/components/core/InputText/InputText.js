import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import * as PropTypes from "prop-types";


const useStyles = makeStyles((theme) => ({
    root: {
        '& > *': {
            margin: theme.spacing(1),
            width: '25ch',
        },
    },
    helperText:{
        color: 'red!important',
    },
    label:{
        // fontSize:'30px'
    }
}));

const InputText =({value,label , getValue , error , errorMessage , placeholder , ...props})=> {
    const classes = useStyles();
    const getInputValue = event =>{
        if(getValue){
            getValue(event.target.value);
        }
    }
    return (
                <TextField
                    id="standard-full-width"
                    label={label}
                    value={value}
                    style={{ margin: 8 }}
                    placeholder={placeholder}
                    helperText={error?errorMessage:''}
                    fullWidth
                    margin="normal"
                    InputLabelProps={{
                        shrink: true,
                        classes:{
                            root:classes.label
                        }
                    }}
                    FormHelperTextProps={{
                        classes:{
                            root:classes.helperText
                        }
                    }}
                    onChange={event=>getInputValue(event )}
                    {...props}
                />
        );
}

InputText.propTypes = {
    error:PropTypes.bool,
    errorMessage: PropTypes.string,
    name:PropTypes.string,
    label:PropTypes.string,
    value:PropTypes.string,
}
InputText.defaultProps = {
    error:false,
    errorMessage:'The field is required',
    placeholder:'Type here',
    label:'Text',
    value:null
}

export default InputText;
