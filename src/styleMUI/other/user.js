import { makeStyles } from '@material-ui/core/styles';
import { userSelectNone } from '../lib';
export default makeStyles({
    online: {
        color: '#00a948',
        fontWeight: 'bold',
        fontSize: '0.875rem'
    },
    near: {
        color: 'blue',
        fontWeight: 'bold',
        fontSize: '0.875rem'
    },
    name: {
        fontFamily: 'Roboto',
        fontSize: '1rem',
        fontWeight: 500,
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        width: 235,
        marginBottom: 5
    },
    field: {
        fontFamily: 'Roboto',
        fontSize: '0.875rem',
        fontWeight: 500,
        width: 235,
        color: 'rgba(0, 0, 0, 0.6)',
    },
    rowSpecialist: {
        display: 'flex',
        marginBottom: 5,
        flexDirection: 'row',
    },
    rowProfile: {
        display: 'flex',
        flexDirection: 'row',
    },
    valueRatinig: {
        fontSize: '1.125rem',
        fontWeight: 'bold',
        color: 'black',
        height: 23,
        marginRight: 5
    },
    rowRatinig: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center'
    },
    columnProfile: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
    },
    raitingProfile: {
        width: 'calc(100vw - 52px)',
        maxWidth: 400,
        display: 'flex',
        justifyContent: 'center',
        marginBottom: 10
    },
    textProfile: {
        fontFamily: 'Roboto',
        fontSize: '0.875rem',
        fontWeight: 500,
        whiteSpace: 'pre-wrap',
        marginBottom: 5
    },
    dividerProfile: {
        marginBottom: 10,
        marginTop: 10,
        height: 1,
        background: 'rgba(0, 0, 0, 0.1)'
    },
    br: {
        height: 10,
    },
    divAvatarProfileM: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: 'calc(100vw - 52px)',
        maxWidth: 400,
    },
    divAvatarProfileD: {
        marginRight: 20,
    },
    divProfile: {
        width: '100%',
        background: 'white',
        paddingTop: 10,
        paddingRight: 10,
        paddingLeft: 10,
        borderBottom: '1px solid #aeaeae',
    },
    iconButtonProfile: {
        fontSize: 35,
        cursor: 'pointer'
    },
    pinProfile: {
        position: 'absolute',
        right: 20,
        top: 20,
        display: 'flex',
        gap: '10px',
        flexDirection: 'column'
    },
    avatarProfile: {
        objectFit: 'cover',
        height: 150,
        width: 150,
        cursor: 'pointer',
        borderRadius: 75
    },
    nameProfileM: {
        fontSize: '1.125rem',
        fontFamily: 'Roboto',
        fontWeight: 600,
        marginTop: 10,
        marginBottom: 10,
        width: 'calc(100vw - 40px)',
        textAlign: 'center'
    },
    rowCenterProfile:{
        justifyContent: 'center',
        display: 'flex',
        flexDirection: 'row',
        width: '100%'
    },
    columnDataProfile:{
        maxWidth: 400
    },
    nameProfileD: {
        fontFamily: 'Roboto',
        fontSize: '1.125rem',
        fontWeight: 600,
        marginTop: 10,
        //marginBottom: 10,
        width: 400,
    },
    priceListProfile: {
        fontSize: '0.875rem',
        fontFamily: 'Roboto',
        fontWeight: 600,
        marginTop: 10,
        marginBottom: 10,
        textAlign: 'center',
        color: 'rgba(0, 0, 0, 0.6)',
        padding: 10,
        border: '1px solid #00C853',
        cursor: 'pointer',
        borderRadius: 5,
        ...userSelectNone,
    },
    divForm: {
        width: 'calc(100vw - 20px)',
        maxWidth: 780,
    },
})