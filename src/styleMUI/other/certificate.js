import { makeStyles } from '@material-ui/core/styles';
export default makeStyles({
    noteImage: {
        width: 80,
        height: 80,
        objectFit: 'cover',
        cursor: 'pointer'
    },
    noteImageDiv: {
        width: 80,
        height: 80,
        position: 'relative'
    },
    noteImageList: {
        paddingLeft: 10,
        gap: '10px',
        display: 'flex',
        overflowX: 'auto',
        marginBottom: 5
    },
    nameField: {
        marginLeft: 10,
        marginTop: 5,
        marginBottom: 5,
        fontSize: '0.875rem',
        fontFamily: 'Roboto',
        color: 'rgba(0, 0, 0, 0.54)'
    },
    card: {
        alignItems: 'center',
        display: 'flex',
        flexDirection: 'column',
        background: 'white',
        width: 'calc(100vw - 20px) !important',
        maxWidth: 780,
        position: 'relative',
        borderRadius: '15px  !important',
        height: 'auto !important',
        cursor: 'pointer'
    }
})