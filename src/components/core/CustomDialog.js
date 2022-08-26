import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Dialog from '@material-ui/core/Dialog';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import PropTypes from 'prop-types';
import { Hidden } from '@material-ui/core';

const styles = theme => ({
    appBar: {
        position: 'relative',
    },
    title: {
        marginLeft: theme.spacing(2),
        flex: 1,
    },
    paper: {
        [theme.breakpoints.down('sm')]: {
            width: '100% !important',


            maxWidth: '900px',

            borderRadius: '0',
        },
        [theme.breakpoints.up('sm')]: {
            width: '100% !important',
            maxWidth: '900px',
        },
    },
});

class CustomDialog extends Component {
    constructor(props) {
        super(props);
        this.state = {
            open: true,
        };
    }

    componentDidMount() {
        this.setState(state => {
            return { open: true };
        });
    }

    handleClickOpen = () => {
        this.setState(state => {
            return { open: true };
        });
    };

    handleClose = () => {
        this.setState(state => {
            return { open: false };
        });
        this.props.closeDialog();
    };

    render() {
        const { classes, children, title } = this.props;
        const { open } = this.state;

        return (
            <Dialog
                open={open}
                onClose={this.handleClose}
                fullWidth={true}
                classes={{
                    paper: classes.paper,
                }}
            >
                <Hidden smUp implementation="css">
                    <AppBar className={classes.appBar}>
                        <Toolbar>
                            <IconButton
                                edge="start"
                                color="inherit"
                                onClick={this.handleClose}
                                aria-label="close"
                            >
                                <CloseIcon />
                            </IconButton>
                            <Typography variant="h6" className={classes.title}>
                                {title}
                            </Typography>
                            {/*<Button autoFocus color="inherit" onClick={this.handleClose}>
                save
              </Button>*/}
                        </Toolbar>
                    </AppBar>
                </Hidden>
                <Hidden xsDown implementation="css">
                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <IconButton
                            edge="start"
                            color="inherit"
                            onClick={this.handleClose}
                            aria-label="close"
                        >
                            <CloseIcon />
                        </IconButton>
                    </div>
                </Hidden>
                <div style={{overflow: 'auto' , maxHeight:'90%'}}>
                    {children}
                </div>
            </Dialog>
        );
    }
}

CustomDialog.defaultProps = {
    isNoteOpen: false,
    fullWidth: true,
    closeDialog: function() {},
    title: '',
};

CustomDialog.propTypes = {
    isNoteOpen: PropTypes.bool,
    fullWidth: PropTypes.bool,
    closeDialog: PropTypes.func,
    title: PropTypes.string,
};

export default withStyles(styles)(CustomDialog);
