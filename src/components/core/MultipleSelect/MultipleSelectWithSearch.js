import React, {useEffect ,useState} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Chip from '@material-ui/core/Chip';
import * as PropTypes from "prop-types";
import {findIndex, isEmpty, uniqBy, cloneDeep, find} from 'lodash';
import SearchInput from "../style/SearchInput";
import {Avatar} from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
    root:{
        width:'100%'
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
    searchInput:{
        display: 'flex',
        width:'100%'
    }
}));

const ITEM_HEIGHT = 60;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
            overflow: 'hidden',
        },
    },
};

// function getStyles(id, selectedNames, theme) {
//     return {
//         fontSize:
//             findIndex(selectedNames , {id:id}) === -1
//                 ? 14
//                 : 18,
//     };
// }

const MultipleSelectWithSearch = ({setValue,
                                      searchValue,
                                      options, label, selected ,error,errorMessage}) => {
    const classes = useStyles();
    const [selectedValues , setSelectedValues] = useState(selected);
    const [selectedWithOptions , setSelectedWithOptions] = useState([...selected,...options]);

    useEffect(() => {
        if(!isEmpty(options)){
            const unique = uniqBy([...options ,...selectedValues] ,'id');
            setSelectedWithOptions(unique);
        }
    });

    const handleChange = (event) => {
        // const unique = uniqBy(event.target.value ,'id');
        // setSelectName(unique);
        // const ids = unique.map(user => {
        //     return user.id;
        // })
        // if (setValue) {
        //     setValue(ids);
        // }
    };
    const onSearch=value=>{
        if(searchValue){
            searchValue(value);
        }
    }


    const handleClick = (value) => {
        const isInSelect = findIndex(selectedValues,{id:value.id});
        if(isInSelect !== -1){
            const oriSelectedValues = cloneDeep(selectedValues);
            oriSelectedValues.splice(isInSelect ,1);
            setSelectedValues(oriSelectedValues);
            const ids = oriSelectedValues.map(user => {
                return user.id;
            })
            if (setValue) {
                setValue(ids);
            }
        }else{
            const oriSelectedValues = cloneDeep(selectedValues);
            oriSelectedValues.push(find(selectedWithOptions,{id:value.id}));
            setSelectedValues(oriSelectedValues);
            const ids = oriSelectedValues.map(user => {
                return user.id;
            })
            if (setValue) {
                setValue(ids);
            }

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
                value={selectedValues}
                onChange={event=>handleChange(event)}
                input={<Input id="select-multiple-chip" placeholder="Vipi"/>}
                renderValue={(value) => (
                    <div className={classes.chips}>
                        {value.map((value) => (
                            <Chip
                                avatar={<Avatar>{value.name[0].toUpperCase()}</Avatar>}
                                // onDelete={(e)=> {
                                //     e.stopPropagation();
                                //     console.log('onDelete');
                                // }}
                                variant="outlined"
                                key={value.id} label={value.name} className={classes.chip}/>
                        ))}
                    </div>
                )}
                MenuProps={MenuProps}
            >
                <div style={{width: '100%', display: 'flex', justifyContent: 'center'}}>
                    <div style={{width: '90%',
                        display: 'flex',
                        flexDirection: 'column' ,
                        justifyContent: 'center' }}>
                        <SearchInput
                            className={classes.searchInput}
                            // onChangeSearch={event=>onSearch(event)}
                            onClickSearch={event=>onSearch(event)}
                            type="text" placeholder="Search.." name="search"
                        />
                        <div style={{
                            overflow: 'auto',
                            height: '210px',
                        }}>
                            {!isEmpty(selectedWithOptions)? selectedWithOptions.map((option) => (
                                <MenuItem key={option.name}
                                          style={{background:findIndex(selectedValues,{id:option.id}) !== -1?'rgba(0, 0, 0, 0.2)':''}}
                                          onClick={()=>handleClick(option)}
                                          value={option}
                                    // style={getStyles(option.id, selectName, theme)}
                                >
                                    {option.name}
                                </MenuItem>
                            )):(
                                <MenuItem>
                                    Empty
                                </MenuItem>
                            )}
                        </div>

                    </div>
                </div>

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
MultipleSelectWithSearch.propTypes = {
    error: PropTypes.bool,
    errorMessage: PropTypes.string,
    label: PropTypes.string,
    options: PropTypes.array,
    selected: PropTypes.array,
}
MultipleSelectWithSearch.defaultProps = {
    error: false,
    errorMessage: 'The field is required',
    label: 'Select',
    options: [],
    selected: []
}
export default MultipleSelectWithSearch;
