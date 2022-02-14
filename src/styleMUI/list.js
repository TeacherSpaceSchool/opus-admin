import { makeStyles } from '@material-ui/core/styles';

export default makeStyles({
    noteImageDiv: {
        position: 'relative'
    },
    noteImage: {
        objectFit: 'cover',
        width: 80,
        height: 80,
        cursor: 'pointer'
    },
    backArrow: {
        top: '10px !important',
        left: '10px !important',
        fontFamily: 'Roboto',
        fontSize: 35,
        position: 'absolute !important',
        cursor: 'pointer !important'
    },
    rightTopDiv: {
        top: '10px !important',
        right: '10px !important',
        fontFamily: 'Roboto',
        position: 'absolute !important',
        cursor: 'pointer !important',
        height: 48,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    error_message: {
        color: 'red',
        fontSize: '1rem',
        fontWeight: 'bold',
        fontFamily: 'Roboto',
        width: '100%',
        textAlign: 'center',
        marginBottom: 10
    },
    divider: {
        height: 1,
        background: 'rgba(0, 0, 0, 0.1)'
    },
    stickyTab:{
        position: 'sticky',
        top: 0,
        width: '100%',
        background: 'white',
        borderBottom: '1px solid #aeaeae',
        marginBottom: 10,
        zIndex: 1000
    },
    noteImageButton: {
        top: 0,
        right: 0,
        position: 'absolute',
        marginLeft: 10,
        width: 24,
        height: 24,
        cursor: 'pointer',
        color: 'white',
        fontWeight: 'bold',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    divC: {
        '&::-webkit-scrollbar': {display: 'none'},
        width: '100%',
        padding: '15px 10px 15px 10px',
        alignItems: 'center',
        display: 'flex',
        flexDirection: 'row',
        overflowX: 'scroll',
        position: 'absolute',
        background: '#F5F5F5'
    },
    chipC: {
        marginRight: 10,
    },
    noteImageList: {
        gap: '10px',
        display: 'flex',
        overflowX: 'auto'
    },
    discountPriceI: {
        fontSize: '1rem',
        fontFamily: 'Roboto',
        fontWeight: 'bold',
        color: 'red',
        textAlign: 'end'
    },
    mediaSocial: {
        objectFit: 'cover',
        height: 32,
        width: 32,
        margin: 10,
    },
    oldPriceI: {
        fontSize: '0.875rem',
        fontWeight: 'bold',
        fontFamily: 'Roboto',
        color: '#707070',
        textDecoration: 'line-through',
        textAlign: 'end'
    },
    logoO: {
        objectFit: 'cover',
        height: 40,
        width: 40,
        borderRadius: 20,
        marginRight: 5,
        cursor: 'pointer'
    },
    divI: {
        position: 'relative',
        cursor: 'pointer',
        border: '1px solid #00C853',
        borderRadius: 5,
        marginBottom: 20,
        padding: 10,
        alignItems: 'center',
        display: 'flex',
        flexDirection: 'row',
    },
    divPriceI: {
        display: 'flex',
        flexDirection: 'column',
        width: '50%'
    },
    divO: {
        position: 'relative',
        padding: '20px 10px 10px 10px',
        borderRadius: 10,
        border: '1px solid #00C853'
    },
    borderTitle: {
        padding: '0px 10px',
        background: 'white',
        top: -9,
        color: '#00C853',
        left: 20,
        position: 'absolute',
        fontSize: '0.8125rem',
        fontFamily: 'Roboto',
        fontWeight: 'bold'
    },
    namePriceI: {
        fontSize: '1rem',
        fontWeight: 'bold',
        fontFamily: 'Roboto',
        color: '#262626',
        width: '100%'
    },
    countPriceI: {
        fontSize: '0.8125rem',
        fontWeight: '500',
        fontFamily: 'Roboto',
        color: '#707070',
        width: '100%'
    },
    media: {
        objectFit: 'cover',
        maxHeight: 'calc(100vw - 72px)',
        maxWidth: 'calc(100vw - 72px)',
        height: 300,
        width: 300,
        marginRight: 20,
        marginBottom: 20,
        cursor: 'pointer'
    },
    carousel: {
        maxWidth: 'calc(100vw - 32px)',
        width: 400,
        marginBottom: 20,
        marginRight: 20
    },
    page: {
        '&::-webkit-scrollbar': {display: 'none'},
        position: 'relative',
        paddingTop: 10,
        paddingBottom: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: '10px'
    },
    geo: {
        width: 180,
        textAlign: 'center',
        marginBottom: 10,
        fontSize: '0.875rem',
        fontFamily: 'Roboto',
        whiteSpace: 'pre-wrap',
        cursor: 'pointer',
        color: '#00C853',
        borderBottom: '1px dashed #00C853'
    },
    row:{
        //alignItems: 'baseline',
        display: 'flex',
        flexDirection: 'row',
        width: '100%',
    },
    rowCenter:{
        alignItems: 'center',
        justifyContent: 'center',
        display: 'flex',
        flexDirection: 'row',
        width: '100%',
    },
    column:{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
    },
    columnCenter:{
        alignItems: 'center',
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
    },
    input: {
        margin: '10px !important',
        width: 'calc(100% - 20px)',
    },
    value: {
        marginLeft: 5,
        marginBottom: 10,
        fontWeight: '500',
        fontSize: '0.875rem',
        fontFamily: 'Roboto',
        wordBreak: 'break-all',
        whiteSpace: 'pre-wrap'
    },
    name: {
        marginLeft: 10,
        marginBottom: 10,
        fontWeight: 'bold',
        fontSize: '1.125rem',
        fontFamily: 'Roboto',
    },
    status: {
        padding: 4,
        borderRadius: 10,
        fontSize: '0.75rem',
        fontWeight: 'bold',
        color: 'white',
        fontFamily: 'Roboto',
        top: 5,
        right: 10,
        position: 'absolute',
    },
    nameField: {
        marginLeft: 10,
        marginBottom: 10,
        fontWeight: 'bold',
        fontSize: '0.875rem',
        fontFamily: 'Roboto',
        color: '#A0A0A0'
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
    quickButtonM: {
        position: 'fixed !important',
        right: '20px !important'
    },
    quickButtonD: {
        position: 'fixed !important',
        right: 'calc((100vw - 800px) / 2 + 20px) !important'
    },
    info: {
        color: '#455A64',
        marginBottom: 10,
        fontSize: '1rem',
        fontFamily: 'Roboto',
        whiteSpace: 'pre-wrap'
    },
    card: {
        borderRadius: '15px  !important',
        width: 'calc(100vw - 20px)',
        maxWidth: 780
    },
})