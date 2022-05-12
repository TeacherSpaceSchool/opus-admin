import { makeStyles } from '@material-ui/core/styles';
export default makeStyles({
    nameNotify: {
        fontFamily: 'Roboto',
        fontSize: '1rem',
        fontWeight: 500,
        marginBottom: 5
    },
    nameChat: {
        textOverflow: 'ellipsis',
        fontFamily: 'Roboto',
        fontSize: '1rem',
        fontWeight: 500,
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        width: 'calc(100% - 93px)',
        marginBottom: 5
    },
    rowChat: {
        display: 'flex',
        flexDirection: 'row',
    },
    columnChat: {
        width: 'calc(100% - 70px)'
    },
    textChat: {
        fontFamily: 'Roboto',
        fontSize: '0.875rem',
        whiteSpace: 'pre-wrap'
    },
    unreadChat: {
        background: 'red',
        width: 10,
        height: 10,
        borderRadius: 10
    },
    timeChat: {
        fontFamily: 'Roboto',
        fontSize: '0.875rem',
        color: 'rgba(0, 0, 0, 0.5)',
        position: 'absolute',
        right: 0,
        top: 0
    },
    shapkaChat: {
        height: 50,
        padding: '10px 10px 10px 0px',
        display: 'flex',
        flexDirection: 'row',
        background: 'white',
        borderBottom: '1px solid #aeaeae',
        alignItems: 'center'
    },
    titleShapkaChat: {
        textOverflow: 'ellipsis',
        fontFamily: 'Roboto',
        fontSize: '1rem',
        fontWeight: 500,
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        width: '100%',
        alignItems: 'center',
        height: 20
    },
    listMessageChat: {
        '&::-webkit-scrollbar': {display: 'none'},
        height: 'calc(100vh - 166px)',
        overflowY: 'auto',
        display: 'flex',
        paddingTop: 10,
        flexDirection: 'column-reverse',
        width: '100vw',
        maxWidth: 800
    },
    bottomChat: {
        display: 'flex',
        flexDirection: 'row',
        background: 'white',
        borderTop: '1px solid #aeaeae',
        alignItems: 'center',
        padding: '10px 0px',
        width: '100%',
        position: 'fixed',
        height: 'auto',
        maxWidth: 800,
        bottom: 56
    },
    inputBottomChat: {
        width: '100%'
    },
    divLeftBubleChat: {
        width: '100%',
        padding: '0px 50px 10px 10px'
    },
    divRightBubleChat: {
        width: '100%',
        padding: '0px 10px 10px 50px',
        display: 'flex',
        flexDirection: 'row-reverse'
    },
    timeLeftBubleChat: {
        fontFamily: 'Roboto',
        fontSize: '0.875rem',
        color: 'rgba(0, 0, 0, 0.5)',
        position: 'absolute',
        right: 10,
        bottom: 5
    },
    leftBubleChat: {
        minWidth: 110,
        color: 'black',
        position: 'relative',
        fontFamily: 'Roboto',
        fontSize: '0.875rem',
        whiteSpace: 'pre-wrap',
        background: 'white',
        borderRadius: 10,
        padding: '10px 10px 25px 10px',
        width: 'fit-content'
    },
    timeRightBubleChat: {
        fontFamily: 'Roboto',
        fontSize: '0.875rem',
        color: 'rgba(0, 0, 0, 0.5)',
        position: 'absolute',
        right: 10,
        bottom: 5
    },
    imageBubleChat: {
        objectFit: 'cover',
        height: 200,
        width: 200,
        cursor: 'pointer',
    },
    rightBubleChat: {
        textAlign: 'end',
        minWidth: 110,
        position: 'relative',
        fontFamily: 'Roboto',
        fontSize: '0.875rem',
        whiteSpace: 'pre-wrap',
        background: 'white',
        color: 'black',
        borderRadius: 10,
        padding: '10px 10px 25px 10px',
        width: 'fit-content'
    }
})