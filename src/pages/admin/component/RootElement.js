import React, { useState} from 'react';
import {AppBar, Drawer, Hidden, withStyles} from "@material-ui/core";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from '@material-ui/icons/Menu';
import HomeIcon from '@material-ui/icons/Home';
import SideMenu from "./SideMenu";
import {useHistory} from "react-router";
// import {withRouter} from "react-router";


const drawerWidth = '220px';
const styles = theme => ({
    root: {
        display: 'flex',
    },
    drawer: {
        [theme.breakpoints.up('sm')]: {
            // width: drawerWidth,
            flexShrink: 0,
        },
        [theme.breakpoints.down('sm')]: {
            width: '0',
            flexShrink: 0,
        },
    },
    appBar: {
        backgroundColor: '#c4c4c4',
        boxShadow: 'none',
        height: '70px',
        [theme.breakpoints.down('md')]: {
            width: '100%',
            height: '70px',
            // marginLeft: drawerWidth,
            boxShadow: 'none',
            display: 'flex',
            justifyContent: 'center',
        },
        [theme.breakpoints.down('sm')]: {
            width: '100%',
            height: '70px',
            display: 'flex',
            justifyContent: 'center',
        },
    },
    menuButton: {
        color: 'primary',
        marginLeft: theme.spacing(2),
        justifyContent: 'center',
        alignItems: 'center',
        [theme.breakpoints.up('sm')]: {
            display: 'none',
        },
    },
    homeMenu: {
        color: 'primary',
        marginLeft: theme.spacing(2),
        justifyContent: 'center',
        alignItems: 'center',
        [theme.breakpoints.down('xs')]: {
            display: 'none',
        },
    },
    toolbar: theme.mixins.toolbar,
    drawerPaper: {
        width: drawerWidth,
        backgroundColor: '#FAFAFA',
        borderRight: 'none',
        padding:'12px',
        paddingRight:'0px',
        overflow: 'hidden',
        marginTop:'70px',
        [theme.breakpoints.down('xs')]: {
            width: drawerWidth,
        },
    },
    content: {
        marginTop:'70px',
        marginLeft:drawerWidth,
        flexGrow: 1,
        padding: theme.spacing(3),
        overflow: 'auto',
        width:`calc(100vw - ${drawerWidth})`,
        height:'calc(100vh - 70px)',
        [theme.breakpoints.down('xs')]: {
            padding: `${theme.spacing(5)} 0`,
            marginLeft:'0px',
            width:`calc(100vw - 0px)`,
        },
    },
    menu: {
        width: '250px',
        top: '80px !important',
        boxShadow: '0px 0px 40px #00000015',
    },

    title: {
        display: 'none',
        [theme.breakpoints.down('sm')]: {
            display: 'flex',
            fontSize: '18px',
            color: '#212C56',
            marginLeft: '-20px',
        },
    },

});

const RootElement =(props)=> {
    const [mobileOpen , setMobileOpen] = useState(false);

    const history = useHistory();
    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen)
    };
        const { classes, container, children, user, title} = props;
        return(
            <div className={classes.root}>
                <AppBar position="fixed" className={classes.appBar} >
                    <Toolbar variant="dense">
                        <div style={{display: 'flex', flex:1, alignItems: 'center' , height: '70px'}}>
                            <IconButton
                                color="inherit"
                                aria-label="open drawer"
                                edge="start"
                                onClick={() => handleDrawerToggle()}
                                className={classes.menuButton}
                            >
                                <MenuIcon />
                            </IconButton>
                            <IconButton
                                color="inherit"
                                aria-label="open drawer"
                                edge="start"
                                onClick={() => history.push('/')}
                                className={classes.homeMenu}
                            >
                                <HomeIcon />
                            </IconButton>
                            <div className={classes.title}>{title}</div>
                        </div>
                    </Toolbar>
                </AppBar>


               <nav className={classes.drawer} aria-label="mailbox folders">
                    <Hidden xsUp implementation="css">
                        <Drawer
                            container={container}
                            variant="temporary"
                            anchor={'left'}
                            open={mobileOpen}
                            onClose={() => handleDrawerToggle()}
                            classes={{
                                paper: classes.drawerPaper,
                            }}
                            ModalProps={{
                                keepMounted: true, // Better open performance on mobile.
                            }}
                        >
                            <SideMenu user={user} />
                        </Drawer>
                    </Hidden>
                    <Hidden xsDown implementation="css">
                        <Drawer
                            classes={{
                                paper: classes.drawerPaper,
                            }}
                            variant="permanent"
                            open={false}
                        >
                            <SideMenu user={user} />
                        </Drawer>
                    </Hidden>
                </nav>

                <main className={classes.content}>
                    {/*<div className={classes.toolbar} />*/}
                    {children}
                </main>
            </div>
        );
}
export default withStyles(styles)(RootElement);
