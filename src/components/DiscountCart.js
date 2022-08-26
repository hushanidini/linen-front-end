import React from 'react';
import EditIcon from '@material-ui/icons/Edit';
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";

const DiscountCart = (props) => {
    const {initialValues} = props;
    return (
        <div style={{paddingTop: '0'}}>
            <div className="form-row">
                <div className=" col-4">
                    <p>Hours (eg:1-2 hrs)</p>
                </div>
                <div className=" col-2">
                    <p>{initialValues.start}Hrs</p>
                </div>
                <div className=" col-1">
                    <p>to</p>
                </div>
                <div className=" col-2">
                    <p>{initialValues.end}Hrs</p>
                </div>

                <div className=" col-2">
                    <p>{initialValues.discount}%</p>
                </div>

                <div className=" col-1"
                     style={{cursor: 'pointer', display: 'flex', justifyContent: 'end'}}>
                    <EditIcon onClick={props.openDiscountUpdateForm} style={{padding: '0px 2px'}}/>
                    <DeleteForeverIcon
                        onClick={props.removeDiscount}
                        style={{color: "red", padding: '0px 2px'}}/>
                </div>
            </div>
            {/*</form>*/}
        </div>

    );
}
export default DiscountCart;
