import { makeStyles } from '@material-ui/core/styles';
import { userSelectNone } from '../lib';
export default makeStyles({
    main: {
        width: '100vw',
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column'
    },
    input: {
        margin: '10px !important',
        width: 'calc(100% - 20px)',
    },
    text: {
        cursor: 'pointer',
        height: 427
    },
    bottom: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: 'white',
        position: 'fixed',
        width: '100vw',
        height: 60,
        bottom: 0,
        left: 0
    }
})