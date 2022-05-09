import { makeStyles } from '@material-ui/core/styles';
import { userSelectNone } from '../lib';
export default makeStyles({
    divMainCategory: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        width: '100%',
        maxWidth: 800,
        height: '100%',
        gap: '5px !important',
        ...userSelectNone
    },
    card: {
        background: 'white',
        width: /*120*/115,
        height: /*120*/115,
        borderRadius: '15px  !important',
        position: 'relative',
        padding: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        cursor: 'pointer',
        ...userSelectNone
    },
    buttonAddCategory: {
        marginTop: 10,
        width: 219,
        borderRadius: '12px  !important',
        marginBottom: '50px  !important'
    },
    title: {
        lineHeight: 1.1,
        width: '100%',
        height: /*50*/40,
        fontSize: /*'0.875rem'*/'0.8rem',
        fontFamily: 'Roboto',
        fontWeight: 500,
        fontStyle: 'normal',
        alignItems: 'center',
        display: 'flex',
        overflow: 'hidden',
        textAlign: 'center',
        justifyContent: 'center',
    },
    count: {
        height: 17,
        fontSize: '0.8125rem',
        color: '#858585',
        fontFamily: 'Roboto',
        fontWeight: 500,
        fontStyle: 'normal',
        textAlign: 'center'
    },
    media: {
        objectFit: 'cover',
        height: /*66*/64,
        width: /*66*/64,
        //marginBottom: 4
    },
    mediaAC: {
        marginRight: 10,
        objectFit: 'cover',
        height: 24,
        width: 24
    },
    titleAC: {
        marginRight: 30,
        fontSize: '1rem',
        fontFamily: 'Roboto',
        fontWeight: 600,
        fontStyle: 'normal'
    },
    cardAC: {
        background: 'white',
        width: 'calc(100vw - 10px)',
        maxWidth: 355,
        height: 70,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        cursor: 'pointer',
        borderRadius: '15px  !important',
        ...userSelectNone
    },
    cardAO: {
        position: 'fixed !important',
        bottom: '40px !important',
        width: '222px !important',
        borderRadius: '12px !important',
        marginBottom: '50px  !important',
        left: 'calc((100vw - 222px) / 2) !important'
    },
    cardAOW: {
        gap: '3px',
        display: 'flex',
        position: 'fixed !important',
        bottom: '40px !important',
        width: '350px !important',
        borderRadius: '12px !important',
        marginBottom: '50px  !important',
        left: 'calc((100vw - 350px) / 2) !important'
    }
})