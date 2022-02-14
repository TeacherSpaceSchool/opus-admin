import { makeStyles } from '@material-ui/core/styles';
import { userSelectNone } from '../lib';
export default makeStyles({
    media: {
        objectFit: 'cover',
        width: 'calc((100vw - 20px) / 2) !important',
        maxWidth: 385,
        height: 'calc((100vw - 20px) / 8 * 3) !important',
        maxHeight: 290,
        //marginBottom: 10
    },
    card: {
        alignItems: 'center',
        display: 'flex',
        flexDirection: 'column',
        background: 'white',
        width: 'calc((100vw - 20px) / 2) !important',
        maxWidth: 385,
        position: 'relative',
        borderRadius: '15px  !important',
        height: 'auto !important',
        cursor: 'pointer'
    },
    text: {
        fontSize: '0.875rem',
        fontFamily: 'Roboto',
        fontWeight: 500,
        whiteSpace: 'pre-wrap',
        color: 'rgba(0, 0, 0, 0.6)',
        padding: 10,
        width: '100%',
        ...userSelectNone
    },
    row: {
        justifyContent: 'center',
        alignItems: 'center',
        display: 'flex',
        flexDirection: 'row',
        gap: '10px',
        flexWrap: 'wrap'
    },
})