import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as mini_dialogActions from '../../redux/actions/mini_dialog'
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import dialogContentStyle from '../../src/styleMUI/dialogContent'
import { responseOrder } from '../../src/gql/order'
import * as snackbarActions from '../../redux/actions/snackbar'
import IconButton from '@material-ui/core/IconButton';
import Clear from '@material-ui/icons/Clear';
import { pdDDMMYYHHMM, pdHHMM } from '../../src/lib'

const ResponseOrder =  React.memo(
    (props) =>{
        const { classes, _id, setShowResponseOrder } = props;
        let [message, setMessage] = useState('');
        let [dateStart, setDateStart] = useState(null);
        const { isMobileApp } = props.app;
        const { showMiniDialog } = props.mini_dialogActions;
        const { showSnackBar } = props.snackbarActions;
        const width = isMobileApp? (window.innerWidth-112) : 500
        return (
            <div className={classes.main}>
                <TextField
                    style={{width: width}}
                    placeholder='Готов выполнить заказ'
                    label='Сообщение'
                    className={classes.textField}
                    margin='normal'
                    value={message}
                    onChange={(event)=>{setMessage(event.target.value)}}
                />
                <br/>
                <div className={classes.row}>
                    <TextField
                        className={classes.input}
                        label='Буду на месте'
                        type='datetime-local'
                        InputLabelProps={{
                            shrink: true,
                        }}
                        value={dateStart}
                        inputProps={{
                            'aria-label': 'description',
                        }}
                        onChange={ event => setDateStart(event.target.value) }
                    />
                    <IconButton
                        onClick={()=>{
                            setDateStart('')
                        }}
                    >
                        <Clear/>
                    </IconButton>
                </div>
                <br/>
                <div>
                    <Button variant='contained' color='primary' onClick={async()=>{
                        if(dateStart) {
                            let now = new Date()
                            dateStart = new Date(dateStart)
                            let today = dateStart.getDate()===now.getDate()&&dateStart.getFullYear()===now.getFullYear()&&dateStart.getMonth()===now.getMonth()
                            message = `Буду на месте в ${today?pdHHMM(dateStart):pdDDMMYYHHMM(dateStart)}.${message?` ${message}`:''}`
                        }
                        let _responseOrder = await responseOrder({_id, message})
                        if(_responseOrder==='OK') {
                            setShowResponseOrder(false)
                            showSnackBar('Ответ отправлен')
                        }
                       showMiniDialog(false);
                    }} className={classes.button}>
                        Отправить
                    </Button>
                    <Button variant='contained' color='secondary' onClick={()=>{showMiniDialog(false);}} className={classes.button}>
                        Закрыть
                    </Button>
                </div>
            </div>
        );
    }
)

function mapStateToProps (state) {
    return {
        app: state.app
    }
}

function mapDispatchToProps(dispatch) {
    return {
        snackbarActions: bindActionCreators(snackbarActions, dispatch),
        mini_dialogActions: bindActionCreators(mini_dialogActions, dispatch),
    }
}

ResponseOrder.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(dialogContentStyle)(ResponseOrder));