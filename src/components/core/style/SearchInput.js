import React, {useState} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import * as PropTypes from "prop-types";
import {InputAdornment} from "@material-ui/core";
import {Search} from "@material-ui/icons";

const useStyles = makeStyles((theme) => ({
    root: {
        '& > *': {
            margin: theme.spacing(1),
            width: '25ch',
        },
    },
    helperText: {
        color: 'red!important',
    },
    label: {
        // fontSize:'30px'
    }
}));

const SearchInput = ({ label, onChangeSearch, onClickSearch, error, errorMessage, placeholder, ...props}) => {
    const classes = useStyles();
    const [value, setValue] = useState();

    const getInputValue = event => {
        setValue(event.target.value);
        if (onChangeSearch) {
            onChangeSearch(event.target.value);
        }
    }
    const onClickInputValue = () => {
        if (onClickSearch) {
            onClickSearch(value);
        }
    }
    return (
        <TextField
            // id="standard-full-width"
            // value={value}
            // style={{margin: 8}}
            placeholder={placeholder}
            helperText={error ? errorMessage : ''}
            fullWidth
            margin="normal"
            InputLabelProps={{
                shrink: true,
                classes: {
                    root: classes.label
                }
            }}
            FormHelperTextProps={{
                classes: {
                    root: classes.helperText
                }
            }}
            onChange={event => getInputValue(event)}
            InputProps={{
                endAdornment: (
                    <InputAdornment position="end">
                        <Search style={{
                            cursor: 'pointer',
                        }} onClick={()=>onClickInputValue()}/>
                    </InputAdornment>
                ),
            }}
            {...props}
        />
    );
}

SearchInput.propTypes = {
    error: PropTypes.bool,
    errorMessage: PropTypes.string,
    name: PropTypes.string,
}
SearchInput.defaultProps = {
    error: false,
    errorMessage: 'The field is required',
    placeholder: 'Type here',
}

export default SearchInput;
