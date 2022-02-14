import { makeStyles } from '@material-ui/core/styles';
export default makeStyles({
    title: {
        fontFamily: 'Roboto',
        fontSize: '1rem',
        fontWeight: 500,
        textAlign: 'center',
        marginBottom: 5,
    },
    value: {
        fontFamily: 'Roboto',
        fontSize: '1rem',
        fontWeight: 'bold',
        textAlign: 'center',
        color: 'rgba(156,39,176,1)',
        marginBottom: 10,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    divBonus: {
        width: 'calc(100% - 20px)',
        margin: 10,
    }
})