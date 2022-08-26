import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import {useHistory, useLocation} from "react-router";
import ExitToAppOutlinedIcon from '@material-ui/icons/ExitToAppOutlined';
import {connect} from "react-redux";
import RolePermission from "../../../components/RolePermission/RolePermission";
import  Location from '@material-ui/icons/MyLocationOutlined';
import  Studio from '@material-ui/icons/CameraEnhanceOutlined';
import  Shift from '@material-ui/icons/FilterTiltShiftOutlined';
import  Memberships from '@material-ui/icons/SupervisorAccountOutlined';
import  Managers from '@material-ui/icons/EmojiPeopleOutlined';
import  Profile from '@material-ui/icons/PersonOutlineOutlined';
import  Booking from '@material-ui/icons/NoteOutlined';
import  History from '@material-ui/icons/RestorePageOutlined';
import  Points from '@material-ui/icons/GradeOutlined';
import  Tickets from '@material-ui/icons/DescriptionOutlined';
import  Coupon from '@material-ui/icons/AttachMoney';
import {logOut} from "../../../services/AuthService";


const useStyles = makeStyles((theme) => ({
    root: {
        // width: 360,
        maxWidth: 360,
        backgroundColor: '#ffffff',
        overflow:'auto',
        overflowX:'hidden',
        maxHeight:'calc(100vh - 83px)'
    },
    nested: {
        paddingLeft: theme.spacing(4),
    },
    listItem:{
        margin:'12px'
    },
    textRoot : {
        paddingRight : 23,
    }
}));

const  SideMenu =(props)=> {
    const history = useHistory();
    const location = useLocation();
    const classes = useStyles();

    const routNavigation = url=> {
        history.push(url);
    }

    const signOut = async ()=> {
        try{
            await logOut();
        }catch (e) {
        }
    }

    const isSameURL =(pathname, url)=> {
        return (pathname.split('/')[1] === url.split('/')[1]);
    }
        const menu=[
            {
                key:'location',
                icon: <Location/>,
                url:'/location',
                name:'Location',
                roles:['super_admin']
            },
            {
                key:'service',
                icon:<Studio/>,
                url:'/service',
                name:'Services',
                roles:['super_admin'  , 'manager']
            },
            {
                key:'shift',
                icon:<Shift/>,
                url:'/shift',
                name:'Shifts',
                roles:['super_admin']
            },
            {
                key:'membership',
                icon:<Memberships/>,
                url:'/membership',
                name:'Memberships',
                roles:['super_admin']
            },
            {
                key:'managers',
                icon:<Managers/>,
                url:'/managers',
                name:'Managers',
                roles:['super_admin']
            },
            {
                key:'Coupon',
                icon:<Coupon/>,
                url:'/coupon',
                name:'Coupons',
                roles:['super_admin']
            },
            {
                key:'profile',
                icon:<Profile/>,
                url:'/profile',
                name:'Profile',
                roles:['super_admin' , 'manager']
            },
            {
                key:'booking',
                icon:<Booking/>,
                url:'/booking-slots',
                name:'Booking',
                roles:['super_admin' , 'manager']

            },
            {
                key:'booking-details',
                icon:<Points/>,
                url:'/booking-details',
                name:'Details',
                roles:['super_admin' , 'manager']

            },
            {
                key:'history',
                icon:<History/>,
                url:'/history',
                name:'History',
                roles:['user']
            },
            {
                key:'points',
                icon:<Points/>,
                url:'/points',
                name:'Points',
                roles:['user']
            },
            {
                key:'tickets',
                icon:<Tickets/>,
                url:'/tickets',
                name:'Tickets',
                roles:['user']
            }

        ];

        return (
            <List
                component="nav"
                aria-labelledby="nested-list-subheader"
                classes={{
                    root: classes.root,
                }}
            >
                {menu.map((menuItem , index) =>{
                    // const isAllow = menuItem.roles.includes(this.props.user.role);

                    return (
                        <RolePermission roles ={menuItem.roles} key={index}>
                            <ListItem button onClick={()=>routNavigation(menuItem.url)}
                                      style={isSameURL(location.pathname , menuItem.url) ?
                                            {
                                              borderLeft: '6px solid red',
                                              marginLeft:'0px',
                                              boxShadow: '0px 10px 30px rgb(190, 190, 190)',
                                              borderRadius: '6px',
                                              background:'linear-gradient(270deg, rgba(255,0,0,0.08) 0%, rgba(255,255,255,0.499019676229867) 100%)' }:
                                          {marginLeft:'6px'}}
                            >
                                <ListItemIcon>
                                    {menuItem.icon}
                                </ListItemIcon>
                                <ListItemText primary={menuItem.name} />
                            </ListItem>
                        </RolePermission>

                    )
                })}
                <ListItem button onClick={()=>signOut()}
                          style={{alignItems:'center' ,justifyContent:'center' ,cursor:'pointer'}}>
                    <ListItemIcon>
                        <ExitToAppOutlinedIcon />
                    </ListItemIcon>
                </ListItem>

            </List>
        );
}

const mapStateToProps=state=>{
    const {user} = state;
    return {user};
}

export default connect(mapStateToProps)(SideMenu);

