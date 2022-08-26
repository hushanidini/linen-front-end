import React, {useEffect, useState} from 'react';
import {FormControl, InputLabel, MenuItem, Select} from "@material-ui/core";
import {isEmpty, isEqual} from "lodash";
import PropTypes from "prop-types";
import {makeStyles} from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
    formControl: {
        margin: theme.spacing(1),
        minWidth: "100%",
    },
    selectEmpty: {
        marginTop: theme.spacing(2),
    },
}));

const InputSelect =props=> {
    const classes = useStyles();
    const {selected ,options} = props;
    const [selectedValue , setSelectedValue] = useState(selected?selected:{});
    const [selectOptions , setOptions] = useState(options);
    useEffect(()=>{

        if(isEqual(selectOptions , options)){
            setOptions(
                !isEmpty(options) || (isEmpty(selected) || selected === 'default')
                    ? [{label: placeholder, value: 'default'}, ...options]
                    : [{label: placeholder, value: 'default'}]
            )
        }
        if (!isEqual(selected , selectedValue)){
            setSelectedValue(
                isEmpty(selected)
                    ? placeholder===null? options[0].value
                    :'default' : selectedValue,
            )
        }
    });

    const getInputValue=event => {
        const {getValue} =props;
        setSelectedValue(event.target.value);
        if (getValue){
            getValue(event.target.value);
        }
    }
        const {placeholder ,isLabel ,label} = props;
        // const {
        //     selectedValue,
        //     options
        // } = this.state;
        return (
            <FormControl className={classes.formControl}>
                {isLabel && (
                    <InputLabel
                        shrink={true}
                        id="demo-simple-select-label">{label}</InputLabel>
                )}
                <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    onChange={event => getInputValue(event)}
                    value={selectedValue?selectedValue:'default'}
                    InputLabelProps={{
                        shrink: false,
                    }}

                >
                         {selectOptions && selectOptions.map(item => {
                             return (
                                 <MenuItem value={item.value}>{item.label}</MenuItem>
                             )
                             // return <option selected={isEqual(selectedValue, service.value)}
                             //                value={service.value}
                             // >{service.label}</option>
                         })}
                </Select>
            </FormControl>
        );

}

InputSelect.defaultProps = {
    option: [],
    selected: 'default',
    placeholder: null,
    label: 'label',
    isLabel: true,
};
InputSelect.propTypes = {
    option: PropTypes.any,
    selected: PropTypes.any,
    getValue: PropTypes.func,
    placeholder: PropTypes.string,
    label: PropTypes.string,
    isLabel:PropTypes.bool,
};
export default InputSelect;
