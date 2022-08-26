import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import PropTypes from 'prop-types';

const styles = theme => ({
    background: {
        width: '100% !important',
        height: '100% !important',
        margin: '0',
        maxWidth: '100%',
        maxHeight: '100%',
        borderRadius: '0',
        position: 'fixed',
        top: '0',
        left: '0',
        zIndex: '5000',
        backgroundColor: 'rgba(27, 27, 27, 0.55)'
    },
    root: {
        position: 'fixed',
        top: '50%',
        left: '50%',
        zIndex: '5500'
    },
    bottom: {
        color: 'transparent !important',
    },
    top: {
        color: '#cafef9',
        animationDuration: '550ms',
        position: 'absolute',
        left: 0,
    },
    circle: {
        strokeLinecap: 'round',
    },
});

class CustomLoader extends Component {

    render() {
        const { classes, isNoteOpen } = this.props;
        return (
            isNoteOpen ?
                <div className={classes.background}>
                    <div className={classes.root}>
                        <CircularProgress
                            variant="determinate"
                            className={classes.bottom}
                            size={50}
                            thickness={4}
                            value={100}
                        />
                        <CircularProgress
                            variant="indeterminate"
                            disableShrink
                            className={classes.top}
                            classes={{
                                circle: classes.circle,
                            }}
                            size={50}
                            thickness={4}
                        />
                    </div>
                </div> : null
        );
    }
}

CustomLoader.defaultProps = {
    isNoteOpen: true,
    fullWidth: false
};

CustomLoader.propTypes = {
    isNoteOpen: PropTypes.bool,
    fullWidth: PropTypes.bool,
    closeDialog: PropTypes.func,
};

export default withStyles(styles)(CustomLoader);
