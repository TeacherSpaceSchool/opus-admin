import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as mini_dialogActions from '../../redux/actions/mini_dialog'
import * as appActions from '../../redux/actions/app'
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import InputAdornment from '@material-ui/core/InputAdornment';
import dialogContentStyle from '../../src/styleMUI/dialogContent'
import { validPhoneLogin, inputPhoneLogin } from '../../src/lib'
import { changePhone } from '../../src/gql/passport'
import * as snackbarActions from '../../redux/actions/snackbar'
import Router from 'next/router'

const Sign =  React.memo(
    (props) =>{
        const { isMobileApp } = props.app;
        const { showMiniDialog } = props.mini_dialogActions;
        const { showSnackBar } = props.snackbarActions;
        const { showLoad } = props.appActions;
        const { classes } = props;
        const width = isMobileApp? (window.innerWidth-112) : 500
        let [phone, setPhone] = useState('');
        let handlePhone =  (event) => {
            setPhone(inputPhoneLogin(event.target.value))
        };
        let [step, setStep] = useState(0);
        let [password, setPassword] = useState('');
        let handlePassword =  (event) => {
            if(event.target.value.length<7)
                setPassword(event.target.value)
        };
        return (
            <div className={classes.main} style={{width}}>
                {
                    !step?
                        <>
                        <TextField
                            error={!validPhoneLogin(phone)}
                            id='standard-search'
                            label='Телефон. Формат: +996559871952'
                            type={ isMobileApp?'number':'login'}
                            className={classes.input}
                            margin='normal'
                            value={phone}
                            onChange={handlePhone}
                            InputProps={{
                                startAdornment: <InputAdornment position='start'>+996</InputAdornment>,
                            }}
                            onKeyPress={async (event) => {
                                if (event.key === 'Enter'&&validPhoneLogin(phone)){
                                    await showLoad(true)
                                    if(await changePhone({newPhone: phone})==='OK')
                                        setStep(1)
                                    else
                                        showSnackBar('Ошибка', 'error')
                                    await showLoad(false)
                                }
                            }}
                        />
                        <div>Код действителен в течение 5 минут</div>
                        <br/>
                        <div>
                            <Button variant='contained' color='primary' onClick={async ()=>{
                                if(validPhoneLogin(phone)){
                                    await showLoad(true)
                                    if(await changePhone({newPhone: phone})==='OK')
                                        setStep(1)
                                    else
                                        showSnackBar('Ошибка', 'error')
                                    await showLoad(false)
                                }
                            }} className={classes.button}>
                                Получить код
                            </Button>
                            <Button variant='contained' color='secondary' onClick={()=>{showMiniDialog(false);}} className={classes.button}>
                                Закрыть
                            </Button>
                        </div>
                        </>
                        :
                        <>
                        <TextField
                            type='number'
                            error={password.length<6}
                            label='Код'
                            className={classes.textField}
                            margin='normal'
                            value={password}
                            onChange={handlePassword}
                            style={{width}}
                        />
                        <br/>
                        <div>
                            <Button variant='contained' color='primary' onClick={async ()=>{
                                if(password.length===6){
                                    await showLoad(true)
                                    if(await changePhone({newPhone: phone, password})==='OK')
                                        Router.reload()
                                    else
                                        showSnackBar('Ошибка', 'error')
                                    await showLoad(false)
                                }
                            }} className={classes.button}>
                                Изменить
                            </Button>
                            <Button variant='contained' color='secondary' onClick={()=>{showMiniDialog(false);}} className={classes.button}>
                                Закрыть
                            </Button>
                        </div>
                        </>
                }
            </div>
        );
    }
)

function mapStateToProps (state) {
    return {
        user: state.user,
        app: state.app
    }
}

function mapDispatchToProps(dispatch) {
    return {
        mini_dialogActions: bindActionCreators(mini_dialogActions, dispatch),
        snackbarActions: bindActionCreators(snackbarActions, dispatch),
        appActions: bindActionCreators(appActions, dispatch),
    }
}

Sign.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(dialogContentStyle)(Sign));