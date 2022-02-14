import { makeStyles } from '@material-ui/core/styles';
export default makeStyles({
    card: {
        background: 'white',
        width: 'calc(50vw - 15px) !important',
        position: 'relative',
        borderRadius: '15px  !important',
        height: 95,
        maxWidth: 385
    },
    row: {
        alignItems: 'center',
        display: 'flex',
        flexDirection: 'column',
        padding: 10
    },
    title: {
        fontFamily: 'Roboto',
        fontWeight: 500,
        fontSize: '0.875rem !important',
        textAlign: 'center',
        height: 40,
        display: 'flex',
        alignItems: 'center'
    },
    icon: {
        height: '35px !important',
        width: '35px !important',
        color: '#00C853'
    }
})