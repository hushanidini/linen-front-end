import React from 'react';
import {makeStyles, useTheme} from '@material-ui/core/styles';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Chip from '@material-ui/core/Chip';
import * as PropTypes from "prop-types";
import {findIndex, uniqBy} from 'lodash';

const useStyles = makeStyles((theme) => ({
    root:{
        width:'100%'
        // minWidth: 80,
        // maxWidth: 300,
    },
    formControl: {
        width: '100%',
        marginLeft:8,
        // marginTop:-8,
    },
    chips: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    chip: {
        margin: 2,
    },
    noLabel: {
        marginTop: theme.spacing(3),
    },
}));

const ITEM_HEIGHT = 60;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};

function getStyles(id, selectedNames, theme) {
    return {
        fontSize:
            findIndex(selectedNames , {id:id}) === -1
                ? 14
                : 18,
    };
}

const MultipleSelect = ({setValue, options, label, selected ,error,errorMessage}) => {
    const classes = useStyles();
    const theme = useTheme();
    const [selectName, setSelectName] = React.useState(selected);

    const handleChange = (event) => {
        const unique = uniqBy(event.target.value ,'id');
        setSelectName(unique);
        const ids = unique.map(user => {
            return user.id;
        })
        if (setValue) {
            setValue(ids);
        }
    };

    return (
            <FormControl className={classes.formControl}>
                <InputLabel id="demo-mutiple-chip-label">{label}</InputLabel>
                <Select
                    classes={{root:classes.root}}
                    labelId="demo-mutiple-chip-label"
                    id="demo-mutiple-chip"
                    multiple
                    value={selectName}
                    onChange={handleChange}
                    input={<Input id="select-multiple-chip" placeholder="Vipi"/>}
                    renderValue={(value) => (
                        <div className={classes.chips}>
                            {value.map((value) => (
                                <Chip key={value.id} label={value.name} className={classes.chip}/>
                            ))}
                        </div>
                    )}
                    MenuProps={MenuProps}
                >
                    {options && options.map((option) => (
                        <MenuItem key={option.name} value={option} style={getStyles(option.id, selectName, theme)}>
                            {option.name}
                        </MenuItem>
                    ))}
                    {!options && (
                        <MenuItem>
                            Empty
                        </MenuItem>
                    )}
                </Select>
                <p style={{marginLeft: 1, fontSize: '0.75rem', color: 'red'}}>{error ? errorMessage : ''}</p>

            </FormControl>
    );
}
MultipleSelect.propTypes = {
    error: PropTypes.bool,
    errorMessage: PropTypes.string,
    label: PropTypes.string,
    options: PropTypes.array,
    selected: PropTypes.array,
}
MultipleSelect.defaultProps = {
    error: false,
    errorMessage: 'The field is required',
    label: 'Select',
    options: [],
    selected: []
}
export default MultipleSelect;
