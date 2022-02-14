import { makeStyles } from '@material-ui/core/styles';
export default makeStyles({


    stickyDiv:{
        position: 'sticky',
        top: 0,
        width: '100%',
        background: 'white',
        borderBottom: '1px solid #aeaeae',
        zIndex: 1000
    },
    tab:{
        width: '100%',
    },
    divChip: {
        '&::-webkit-scrollbar': {display: 'none'},
        width: '100%',
        padding: '8px 10px 5px 10px',
        alignItems: 'center',
        display: 'flex',
        flexDirection: 'row',
        overflowX: 'auto'
    },
    chip: {
        marginRight: 5,
    },
    rowPrice: {
        overflowX: 'auto',
        height: 51,
        width: '100%',
        display: 'flex',
        flexDirection: 'row'
    },
    rowUrgency: {
        margin: '10px 0px 5px 10px'
    },

    rowSee: {
        alignItems: 'center',
        display: 'flex',
        flexDirection: 'row',
        paddingLeft: 5,
        fontWeight: 500,
        fontSize: '0.8125rem',
        fontFamily: 'Roboto',
        color: '#A0A0A0'
    },
    status: {
        padding: 4,
        borderRadius: 10,
        fontSize: '0.75rem',
        fontWeight: 'bold',
        color: 'white',
        fontFamily: 'Roboto',
        background: 'red',
        marginTop: 5,
        width: 'fit-content'
    },
    iconSee: {
        width: 17,
        height: 17
    },
    title: {
        fontFamily: 'Roboto',
        fontSize: '1rem',
        fontWeight: 'bold',
        width: '100%',
    },
    price: {
        fontFamily: 'Roboto',
        fontSize: '1rem',
        fontWeight: 500,
        width: '100%',
        color: 'rgba(0, 0, 0, 0.8)'
    },
    card: {
        background: 'white',
        width: 'calc(100vw - 20px)',
        maxWidth: 780,
        position: 'relative',
        borderRadius: '15px  !important',
        height: 'auto !important',
    },
    media: {
        objectFit: 'cover',
        height: 80,
        width: 80,
        marginRight: 10,
        cursor: 'pointer'
    },
    buttonAccept: {
        width: '300px !important',
        color: 'white',
        display: 'flex',
        position: 'fixed !important',
        bottom: '80px !important',
    },
})