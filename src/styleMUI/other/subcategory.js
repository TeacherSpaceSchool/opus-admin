import { makeStyles } from '@material-ui/core/styles';
export default makeStyles({
    divChip: {
        width: '100%',
        maxWidth: 800,
        padding: '8px 10px 5px 10px',
        alignItems: 'center',
        display: 'flex',
        flexDirection: 'row',
        overflowX: 'auto',
        position: 'fixed',
        top: 63,
        background: '#F5F5F5',
        zIndex: 1000
    },
    chip: {
        marginRight: 5,
    },
    divCount: {
        '&::-webkit-scrollbar': {display: 'none'},
        width: '100%',
        maxWidth: 800,
        fontFamily: 'Roboto',
        padding: '7px 10px 5px 10px',
        alignItems: 'center',
        display: 'flex',
        flexDirection: 'row',
        position: 'fixed',
        top: 62,
        background: '#F5F5F5',
        zIndex: 1000,
        fontSize: '0.8125rem'
    },
})