import { makeStyles } from '@material-ui/core/styles';
export default makeStyles({
    page: {
        position: 'relative',
        margin: 10
    },
    status: {
        padding: 4,
        borderRadius: 10,
        fontSize: '0.75rem',
        fontWeight: 'bold',
        fontFamily: 'Roboto',
        top: 5,
        right: 10,
        position: 'absolute',
        color: '#10183D',
        cursor: 'pointer'
    },
    backArrow: {
        top: '0px !important',
        left: '0px !important',
        fontFamily: 'Roboto',
        fontSize: 35,
        position: 'absolute !important',
        cursor: 'pointer !important'
    },
    geo: {
        width: 180,
        textAlign: 'center',
        marginBottom: 15,
        fontSize: '0.875rem',
        fontFamily: 'Roboto',
        whiteSpace: 'pre-wrap',
        cursor: 'pointer',
        color: '#00C853',
        borderBottom: '1px dashed #00C853'
    },
    bottomDivD: {
        width: 800,
        borderTop: '1px #aeaeae solid',
        background: '#fff',
        height: 60,
        position: 'fixed',
        bottom: 56,
        right: 'calc(50vw - 400px)',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        paddingLeft: 16,
        paddingRight: 16,
        zIndex: 1000
    },
    bottomDivM: {
        width: '100vw',
        borderTop: '1px #aeaeae solid',
        background: '#fff',
        height: 50,
        position: 'fixed',
        bottom: 56,
        right: 0,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        paddingLeft: 10,
        paddingRight: 10,
        zIndex: 1000
    },
    bottomDivMA: {
        width: '100vw',
        borderTop: '1px #aeaeae solid',
        background: '#fff',
        height: 50,
        position: 'fixed',
        bottom: 70,
        right: 0,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        paddingLeft: 10,
        paddingRight: 10,
        zIndex: 1000
    },
    quickButton: {
        position: 'fixed !important',
        right: '5px !important'
    },
    row:{
        display: 'flex',
        flexDirection: 'row',
    },
    column:{
        display: 'flex',
        flexDirection: 'column',
    },
    mediaM: {
        objectFit: 'cover',
        height: 'calc(100vw - 52px)',
        width: 'calc(100vw - 52px)',
        marginBottom: 10,
    },
    mediaD: {
        objectFit: 'cover',
        height: 300,
        width: 300,
        marginRight: 10,
        marginBottom: 10,
        cursor: 'pointer'
    },
    name: {
        marginBottom: 10,
        fontWeight: 'bold',
        fontSize: '1.25rem',
        fontFamily: 'Roboto'
    },
    value: {
        marginBottom: 10,
        fontWeight: '500',
        fontSize: '0.875rem',
        fontFamily: 'Roboto',
        wordBreak: 'break-all'
    },
    nameField: {
        width: 80,
        marginBottom: 10,
        fontWeight: 'bold',
        fontSize: '0.875rem',
        fontFamily: 'Roboto',
        color: '#A0A0A0'
    },
    info: {
        color: '#455A64',
        marginBottom: 10,
        fontSize: '0.875rem',
        fontFamily: 'Roboto',
        whiteSpace: 'pre-wrap'
    },
    input: {
        marginBottom: '10px !important',
        width: '100%',
    },
    mediaSocial: {
        objectFit: 'cover',
        height: 32,
        width: 32,
        margin: 10,
    },

})