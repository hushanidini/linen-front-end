import React, {useEffect} from 'react';
import {isEmpty} from "lodash";
import DiscountCart from "../DiscountCart";

const DiscountDetails= props=> {

    const {discounts ,addNewDiscount ,deleteDiscount ,openUpdate} = props;
    // const [discountsData , setDiscount] = useState(discounts);
    useEffect(()=>{
        // setDiscount(discounts);
    })
    return (
        <div style={{width: '50%' , minWidth:'600px' ,padding:'12px'}} >
            <div className="card">
                <div className="card-header" style={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    backgroundColor:'#ffe7e7'
                }}>
                    <div>Discount</div>
                    <div>
                        <button style={{margin: '0px'}}
                                className="btn btn-light"
                                onClick={addNewDiscount}
                        >Add
                        </button>
                    </div>
                </div>
                <div className="card-body">
                    {!isEmpty(discounts) && (
                        discounts.map(discount=>{
                            return <DiscountCart
                                openDiscountUpdateForm={()=>openUpdate(discount)}
                                removeDiscount={()=>deleteDiscount(discount)}
                                initialValues={discount}/>
                        })

                    )}

                </div>
                <div style={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '0 20px 10px 0'
                }}>
                </div>
            </div>
        </div>
    )
}
export default DiscountDetails;
