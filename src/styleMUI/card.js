import { makeStyles } from '@material-ui/core/styles';
export default makeStyles({
    cardM: {
        background: 'white',
        width: 'calc(100vw - 20px) !important',
        //marginBottom: 10,
        position: 'relative',
        borderRadius: '15px  !important',
        height: 'auto !important',
        //padding: 10
    },
    notification: {
        fontFamily: 'Roboto',
        position: 'absolute',
        top: 5,
        right: 5,
        fontSize: 15
    },
    cardD: {
        background: 'white',
        width: 385,
        //margin: 5,
        borderRadius: '15px  !important',
        position: 'relative',
        height: 'auto !important',
        //padding: 10
    },
    shapka: {
        margin: 10,
        display: 'flex',
        flexDirection: 'row',
        //alignItems: 'baseline'
    },
    title: {
        fontSize: '1rem',
        fontFamily: 'Roboto',
        fontWeight: 'bold',
        width: 'calc(100% - 80px)'
    },
    avatar: {
        objectFit: 'cover',
        height: 60,
        width: 60,
        borderRadius: 30
    },
    mediaM: {
        objectFit: 'cover',
        height: 'calc((100vw - 40px) / 2)',
        width: 'calc(100vw - 40px)'
    },
    mediaD: {
        objectFit: 'cover',
        height: 190,
        width: 380,
        cursor: 'pointer'
    },
    input: {
        width: '100%',
        marginBottom: '10px !important'
    },
    halfInput: {
        width: 224,
        marginBottom: 10
    },
    column: {
        display: 'flex',
        //alignItems: 'baseline',
        justifyContent: 'center',
        flexDirection: 'column',
    },
    row: {
        alignItems: 'center',
        display: 'flex',
        flexDirection: 'row',
    },
    value: {
        marginBottom: 10,
        fontWeight: '500',
        fontSize: '0.875rem',
        fontFamily: 'Roboto',
        wordBreak: 'break-all'
    },
    nameField: {
        marginBottom: 10,
        fontWeight: 'bold',
        fontSize: '0.875rem',
        fontFamily: 'Roboto',
        color: '#A0A0A0'
    },
    number: {
        marginBottom: 10,
        fontWeight: 'bold',
        fontSize: '1rem',
        fontFamily: 'Roboto',
    },
    date: {
        fontSize: '0.875rem',
        fontFamily: 'Roboto',
        color: '#A0A0A0'
    },
    listStatus: {
        position: 'absolute',
        top: 10,
        right: 10,
        height: 256,
        overflow: 'scroll',
        '&::-webkit-scrollbar': {
            display: 'none'
        },
    },
    pinRightTop: {
        position: 'absolute',
        top: 10,
        right: 10,
    },
    status: {
        padding: 4,
        borderRadius: 10,
        fontSize: '0.75rem',
        fontWeight: 'bold',
        color: 'white',
        fontFamily: 'Roboto',
        top: 5,
        right: 10,
        position: 'absolute',
    },
    status1: {
        padding: 4,
        borderRadius: 10,
        fontSize: '0.75rem',
        fontWeight: 'bold',
        color: 'white',
        fontFamily: 'Roboto',
        top: 40,
        right: 10,
        position: 'absolute',
    },
})