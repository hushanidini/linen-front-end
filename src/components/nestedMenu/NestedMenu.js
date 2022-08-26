import React, { useState } from "react";
import { Menu, MenuItem, Typography } from "@material-ui/core";

import NestedMenuItem from "material-ui-nested-menu-item";
import {isEmpty} from "lodash";

export const NestedMenu = ({title,data ,onSelect}) => {
    const [menuPosition, setMenuPosition] = useState(null);

    const handleClick = (event: React.MouseEvent) => {
        if (menuPosition) {
            return;
        }
        event.preventDefault();
        setMenuPosition({
            top: event.pageY,
            left: event.pageX
        });
    };

    const handleItemClick = (event: React.MouseEvent) => {
        setMenuPosition(null);
    };

    const handleSelect = (branch_id , service_id) => {
        onSelect(branch_id ,service_id);
    };

    return (
        <div onClick={handleClick}>
            <Typography>{title}</Typography>
            <Menu
                open={!!menuPosition}
                onClose={() => setMenuPosition(null)}
                anchorReference="anchorPosition"
                anchorPosition={menuPosition}
            >
                {data.map(item => {
                    return (
                        <>
                            {isEmpty(item.services) ?
                                (
                                    <MenuItem  style={{pointerEvents:'none' , opacity:0.6}} onClick={handleItemClick}>{item.name}</MenuItem>
                                ):(
                                    <NestedMenuItem
                                        label={item.name}
                                        parentMenuOpen={!!menuPosition}
                                        // onClick={handleItemClick}
                                    >
                                        {item.services.map(service =>{
                                            return (
                                                <MenuItem
                                                    onClick={()=> {
                                                        handleItemClick();
                                                        handleSelect(item.id , service.id);
                                                    }}>{service.name}</MenuItem>
                                            )
                                        })}
                                    </NestedMenuItem>
                                )}
                        </>
                    )
                })}
            </Menu>
        </div>
    );
};

export default NestedMenu;
