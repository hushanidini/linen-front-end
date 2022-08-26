import {green, red} from '@material-ui/core/colors';
import {createMuiTheme} from '@material-ui/core/styles';
import PoppinsWoff2 from './../assets/fonts/poppins-v9-latin-regular.woff2';

const Poppins = {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontDisplay: 'swap',
    fontWeight: 400,
    src: `
    local('Poppins'),
    local('Poppins-Regular'),
    url(${PoppinsWoff2}) format('woff2')
  `,
    unicodeRange:
        'U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF',
};

// A custom theme for this app
const theme = createMuiTheme({
    overrides: {
        MuiCssBaseline: {
            '@global': {
                '@font-face': [Poppins],
            },
        },
        MuiInputLabel: {
            root: {
                color: '#3F4451',
                fontSize: '16px',
                fontWeight: 600,
                lineHeight: '23px',
            },
        },
        MuiTableCell: {
            root: {
                borderBottom: 'none !important',
            },
        },
        MuiButtonBase: {
            root: {
                boxShadow: 'none !important',
            },
        },
        MuiChip: {
            root: {
                backgroundColor: '#4E598310',
            },
        },
        MuiListItemIcon: {
            root: {
                justifyContent: 'center',
            },
        },
        MuiIcon: {
            root: {
                display: 'flex',
            },
        },
        MuiListItem: {
            button: {
                justifyContent: 'center',
                height: '60px',
            },
        },
        MuiBadge: {
            colorSecondary: {
                backgroundColor: '#5b9541',
            },
        },
    //    for date picker
        MuiPickersToolbar: {
            toolbar: {
                backgroundColor: '#5b9541',
            },
        },
        MuiPickersCalendarHeader: {
            switchHeader: {
                // backgroundColor: green.A200,
                // color: "white",
            },
        },
        MuiPickersDay: {
            day: {
                color: '#5d5d5d',
            },
            daySelected: {
                backgroundColor: green["400"],
            },
            dayDisabled: {
                color: green["100"],
            },
            current: {
                color: green["900"],
            },
        },
        MuiPickersModal: {
            dialogAction: {
                color: green["400"],
            },
        },
    //    end date picker
    },
    palette: {
        primary: {
            main: '#5b9541',
        },
        secondary: {
            main: '#959595',
        },
        error: {
            main: red.A400,
        },
        background: {
            default: '#f3f3f3',
        },
        text: {
            primary: '#212C56',
            secondary: 'rgba(0, 0, 0, 0.54)',
            disabled: 'rgba(0, 0, 0, 0.38)',
            hint: 'rgba(0, 0, 0, 0.38)',
        },
        linen: {
            secondary: '#959595',
            primary: '#5b9541',
            lightGray: '#f6f6f6',
            lightGray2: '#f3f3f3',
            gray: '#5d5d5d',
            gray2: '#959595',
            white: 'white',
            bodyColor: '#fcfcfc',
            red: 'red'
        },
    },
    typography: {
        fontFamily: 'Poppins, Arial',
        h4: {
            fontSize: '32px',
            lineHeight: '48px',
            fontWeight: 600,
        },
        h5: {
            height: '39px',
            fontSiz: '28px',
            letterSpacing: '0',
            color: '#212C56',
            fontWeight: 600,
        },
        button: {
            fontWeight: 500,
            fontSize: '14px',
            lineHeight: 1.75,
            letterSpacing: '0.02857em',
            textTransform: 'uppercase',
        },
    },
});

export default theme;
