import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as mini_dialogActions from '../../redux/actions/mini_dialog'
import * as userActions from '../../redux/actions/user'
import * as appActions from '../../redux/actions/app'
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import InputAdornment from '@material-ui/core/InputAdornment';
import dialogContentStyle from '../../src/styleMUI/dialogContent'
import { validPhoneLogin, inputPhoneLogin } from '../../src/lib'
import { getUserByPhone } from '../../src/gql/passport'
import Link from 'next/link';
import * as snackbarActions from '../../redux/actions/snackbar'

const Sign =  React.memo(
    (props) =>{
        const { error } = props.user;
        const { isMobileApp, isApple } = props.app;
        const { showSnackBar } = props.snackbarActions;
        const { showMiniDialog } = props.mini_dialogActions;
        const { showLoad } = props.appActions;
        const { signin, clearErrorAuthenticated } = props.userActions;
        const { classes } = props;
        const width = isMobileApp? (window.innerWidth-112) : 500
        let [phone, setPhone] = useState('');
        let handlePhone =  (event) => {
            setPhone(inputPhoneLogin(event.target.value))
        };
        let [type, setType] = useState('');
        let [password, setPassword] = useState('');
        let handlePassword =  (event) => {
            if(type==='enterEmployment'||event.target.value.length<7)
                setPassword(event.target.value)
        };
        let [code, setCode] = useState(sessionStorage.code?sessionStorage.code:'');
        let handleCode =  (event) => {
            setCode(event.target.value)
        };
        let [name, setName] = useState('');
        let handleName =  (event) => {
            setName(event.target.value)
        };
        return (
            <div className={classes.main} style={{width}}>
                {
                    !type?
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
                                if (event.key === 'Enter')
                                    if(validPhoneLogin(phone)){
                                        await showLoad(true)
                                        setType(await getUserByPhone(phone))
                                        await showLoad(false)
                                    }
                                    else
                                        showSnackBar('Заполните все поля')
                            }}
                        />
                        <div>Код действителен в течение 5 минут</div>
                        <br/>
                        <div>
                            <Button variant='contained' color='primary' onClick={async ()=>{
                                if(validPhoneLogin(phone)){
                                    await showLoad(true)
                                    setType(await getUserByPhone(phone))
                                    await showLoad(false)
                                }
                                else
                                    showSnackBar('Заполните все поля')
                            }} className={classes.button}>
                                Получить код
                            </Button>
                            <Button variant='contained' color='secondary' onClick={()=>{
                                clearErrorAuthenticated();
                                showMiniDialog(false);
                            }} className={classes.button}>
                                Закрыть
                            </Button>
                        </div>
                        </>
                        :
                        <>
                        <TextField
                            type={type!=='enterEmployment'?'number':'text'}
                            error={password.length<6}
                            label='Код*'
                            className={classes.textField}
                            margin='normal'
                            value={password}
                            onChange={handlePassword}
                            style={{width}}
                            onKeyPress={async (event) => {
                                if (event.key === 'Enter')
                                    if(validPhoneLogin(phone)&&(type==='enterEmployment'||password.length===6)&&(type!=='reg'||name.length))
                                        signin({login: phone, password, name, code, isApple})
                                    else
                                        showSnackBar('Заполните все поля')
                            }}
                        />
                        {
                            type==='reg'?
                                <>
                                <TextField
                                    error={!name.length}
                                    label='Имя*'
                                    className={classes.textField}
                                    margin='normal'
                                    value={name}
                                    onChange={handleName}
                                    style={{width}}
                                />
                                <TextField
                                    label='Промокод (если есть)'
                                    className={classes.textField}
                                    margin='normal'
                                    value={code}
                                    onChange={handleCode}
                                    style={{width}}
                                />
                                </>
                                :
                                null
                        }
                        <br/>
                        {error?
                            <>
                            <div style={{width}} className={classes.error_message}>Неверный логин или код</div>
                            <br/>
                            </>
                            :
                            null
                        }
                        <div>Нажимая «Войти» вы принимаете положения документов <Link href='/privacy'><a><b onClick={()=>{showMiniDialog(false);}}>«Соглашение об использовании»</b></a></Link>.</div>
                        <br/>
                        <div>
                            <Button variant='contained' color='primary' onClick={async ()=>{
                                if(validPhoneLogin(phone)&&(type==='enterEmployment'||password.length===6)&&(type!=='reg'||name.length)){
                                    signin({login: phone, password, name, code, isApple})
                                }
                                else
                                    showSnackBar('Заполните все поля')
                            }} className={classes.button}>
                                Войти
                            </Button>
                            <Button variant='contained' color='secondary' onClick={()=>{
                                clearErrorAuthenticated();
                                showMiniDialog(false);
                            }} className={classes.button}>
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
        snackbarActions: bindActionCreators(snackbarActions, dispatch),
        mini_dialogActions: bindActionCreators(mini_dialogActions, dispatch),
        userActions: bindActionCreators(userActions, dispatch),
        appActions: bindActionCreators(appActions, dispatch),
    }
}

Sign.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(dialogContentStyle)(Sign));