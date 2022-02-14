import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as mini_dialogActions from '../../redux/actions/mini_dialog'
import * as userActions from '../../redux/actions/user'
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import InputAdornment from '@material-ui/core/InputAdornment';
import classNames from 'classnames';
import IconButton from '@material-ui/core/IconButton';
import dialogContentStyle from '../../src/styleMUI/dialogContent'
import { validPhoneLogin, inputPhoneLogin, validEmail } from '../../src/lib'
import { remindPassword } from '../../src/gql/user'
import Link from 'next/link';

const Sign =  React.memo(
    (props) =>{
        let [messageRemind, setMessageRemind] = useState(false);
        let [emailRemind, setEmailRemind] = useState('');
        let handleEmailRemind =  (event) => {
            setEmailRemind(event.target.value)
        };
        let [passEnter, setPassEnter] = useState('');
        let handlePassEnter =  (event) => {
            setPassEnter(event.target.value)
        };
        let [loginEnter, setLoginEnter] = useState('');
        let handleLoginEnter =  (event) => {
            setLoginEnter(inputPhoneLogin(event.target.value))
        };
        let [hide, setHide] = useState('password');
        let handleHide =  () => {
            setHide(!hide)
        };
        const { error } = props.user;
        const { isMobileApp } = props.app;
        const { showMiniDialog } = props.mini_dialogActions;
        const { signin, signup } = props.userActions;
        const { classes } = props;
        const width = isMobileApp? (window.innerWidth-112) : 500
        let [errorPassRepeat, setErrorPassRepeat] = useState(false);
        let [loginReg, setLoginReg] = useState('');
        let [passReg, setPassReg] = useState('');
        let [codeReg, setCodeReg] = useState(sessionStorage.code?sessionStorage.code:'');
        let handleCodeReg =  (event) => {
            setCodeReg(event.target.value)
        };
        let [nameReg, setNameReg] = useState('');
        let handleNameReg =  (event) => {
            setNameReg(event.target.value)
        };
        let [passRepeatReg, setPassRepeatReg] = useState('');
        let handlePassReg =  (event) => {
            setPassReg(event.target.value)
            if(event.target.value!==passRepeatReg){
                setErrorPassRepeat(true)
            }
            else {
                setErrorPassRepeat(false)
            }
            if(event.target.value.length<8){
                setErrorPass(true)
            }
            else {
                setErrorPass(false)
            }
        };
        let handlePassRepeatReg =  (event) => {
            setPassRepeatReg(event.target.value)
            if(event.target.value!==passReg){
                setErrorPassRepeat(true)
            }
            else {
                setErrorPassRepeat(false)
            }
        };
        let handleLoginReg =  (event) => {
            setLoginReg(inputPhoneLogin(event.target.value))
        };
        let [errorPass, setErrorPass] = useState(false);
        let [type, setType] = useState('enter');

        return (
            <div className={classes.main} style={{width}}>
                {
                    ['enter', 'reg'].includes(type)?
                        <div className={classes.rowCenter}>
                            <Button size='large' variant={type==='enter'?'contained':'outlined'} color='primary' onClick={()=>{setType('enter')}} className={classes.button}>
                                Вход
                            </Button>
                            <Button size='large' variant={type==='reg'?'contained':'outlined'} color='primary' onClick={()=>{setType('reg')}} className={classes.button}>
                                Регистрация
                            </Button>
                        </div>
                        :
                        null
                }
                {type==='enter'?
                    <>
                    <TextField
                        error={!validPhoneLogin(loginEnter)}
                        id='standard-search'
                        label='Телефон. Формат: +996559871952'
                        type={ isMobileApp?'number':'login'}
                        className={classes.input}
                        margin='normal'
                        value={loginEnter}
                        onChange={handleLoginEnter}
                        InputProps={{
                            startAdornment: <InputAdornment position='start'>+996</InputAdornment>,
                        }}
                        onKeyPress={event => {
                            if (event.key === 'Enter') {
                                if(validPhoneLogin(loginEnter)&&passEnter.length>7)
                                    signin({login: loginEnter, password: passEnter})
                                else
                                    document.getElementById('adornment-password').focus()
                            }
                        }}
                    />
                    <br/>
                    <FormControl className={classNames(classes.margin, classes.input)}>
                        <InputLabel htmlFor='adornment-password'>Пароль</InputLabel>
                        <Input
                            id='adornment-password'
                            type={hide ? 'password' : 'text' }
                            value={passEnter}
                            onChange={handlePassEnter}
                            onKeyPress={event => {
                                if (event.key === 'Enter'&&validPhoneLogin(loginEnter)&&passEnter.length>7)
                                    signin({login: loginEnter, password: passEnter})
                            }}
                            endAdornment={
                                <InputAdornment position='end'>
                                    <IconButton aria-label='Toggle password visibility' onClick={handleHide}>
                                        {hide ? <VisibilityOff />:<Visibility />  }
                                    </IconButton>
                                </InputAdornment>
                            }
                        />
                    </FormControl>
                    {error?
                        <div style={{width}} className={classes.error_message}>Неверный логин или пароль</div>
                        :
                        null
                    }
                    <div style={{width}} className={classes.message} onClick={()=>{setType('remind')}}>Восстановить пароль</div>
                    <br/>
                    <div>
                        <Button variant='contained' color='primary' onClick={()=>{
                            if(validPhoneLogin(loginEnter)&&passEnter.length>7)
                                signin({login: loginEnter, password: passEnter})
                        }} className={classes.button}>
                            Войти
                        </Button>
                        <Button variant='contained' color='secondary' onClick={()=>{showMiniDialog(false);}} className={classes.button}>
                            Закрыть
                        </Button>
                    </div>
                    </>
                    :
                    type==='reg'?
                        <>
                        <TextField
                            error={!nameReg}
                            label='Имя'
                            className={classes.textField}
                            margin='normal'
                            value={nameReg}
                            onChange={handleNameReg}
                            style={{width}}
                        />
                        <br/>
                        <TextField
                            error={!validPhoneLogin(loginReg)}
                            id='standard-search'
                            label='Телефон. Формат: +996559871952'
                            InputProps={{
                                startAdornment: <InputAdornment position='start'>+996</InputAdornment>,
                            }}
                            type={ isMobileApp?'number':'login'}
                            className={classes.textField}
                            margin='normal'
                            value={loginReg}
                            onChange={handleLoginReg}
                            style={{width}}
                        />
                        <br/>
                        <FormControl style={{width}} className={classNames(classes.margin, classes.textField)}>
                            <InputLabel htmlFor='adornment-password'>Придумайте пароль</InputLabel>
                            <Input
                                id='adornment-password'
                                type={hide ? 'password' : 'text' }
                                value={passReg}
                                onChange={handlePassReg}
                                endAdornment={
                                    <InputAdornment position='end'>
                                        <IconButton aria-label='Toggle password visibility' onClick={handleHide}>
                                            {hide ? <VisibilityOff />:<Visibility />  }
                                        </IconButton>
                                    </InputAdornment>
                                }
                            />
                        </FormControl>
                        <br/>
                        <FormControl style={{width}} className={classNames(classes.margin, classes.textField)}>
                            <InputLabel htmlFor='adornment-password'>Повторите пароль</InputLabel>
                            <Input
                                id='adornment-password'
                                type={hide ? 'password' : 'text' }
                                value={passRepeatReg}
                                onChange={handlePassRepeatReg}
                                endAdornment={
                                    <InputAdornment position='end'>
                                        <IconButton aria-label='Toggle password visibility' onClick={handleHide}>
                                            {hide ? <VisibilityOff />:<Visibility />  }
                                        </IconButton>
                                    </InputAdornment>
                                }
                            />
                        </FormControl>
                        <br/>
                        <TextField
                            label='Промокод (если есть)'
                            className={classes.textField}
                            margin='normal'
                            value={codeReg}
                            onChange={handleCodeReg}
                            style={{width}}
                        />
                        <br/>
                        {error?
                            <div style={{width}} className={classes.error_message}>Неверный логин или пароль</div>
                            :
                            null
                        }
                        {errorPass?
                            <div style={{width}} className={classes.error_message}>Недостаточная длина пароля</div>
                            :
                            null
                        }
                        {errorPassRepeat?
                            <div style={{width}} className={classes.error_message}>Пароли не совпадают</div>
                            :
                            null
                        }
                        <br/>
                        <div>
                            <Button variant='contained' color='primary' onClick={()=>{if(!errorPass&&!errorPassRepeat&&nameReg&&validPhoneLogin(loginReg))signup({name: nameReg, login: loginReg, password: passReg, code: codeReg})}} className={classes.button}>
                                Зарегистрироваться
                            </Button>
                            <Button variant='contained' color='secondary' onClick={()=>{showMiniDialog(false);}} className={classes.button}>
                                Закрыть
                            </Button>
                        </div>
                        </>
                        :
                        <>
                        <TextField
                            label='Email'
                            type='email'
                            className={classes.input}
                            margin='normal'
                            value={emailRemind}
                            onChange={handleEmailRemind}
                        />
                        {!validEmail(emailRemind)?
                            <div style={{width}} className={classes.error_message}>Неверный email</div>
                            :
                            null
                        }
                        {messageRemind?
                            <div style={{width}} className={classes.message}>Проверьте свой email</div>
                            :
                            null
                        }
                        <div>
                            {/*<div style={{width: width}} className={classes.message} onClick={()=>{setType('reg')}}>Зарегистрироваться</div>*/}
                            <div style={{width: width}}>Если забыли свой email или он не был привязан к аккаунту, то перейдите в раздел <Link href={'/contact'}><a>"Контакты"</a></Link> и свяжитесь с нашими специалистами.</div>
                        </div>
                        <br/>
                        <div>
                            <Button variant='contained' color='primary' onClick={async()=>{
                                if(validEmail(emailRemind)) {
                                    if(await remindPassword({email: emailRemind})==='OK')
                                        setMessageRemind(true)
                                    else
                                        setEmailRemind('')
                                }
                            }} className={classes.button}>
                                Восстановить
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
        userActions: bindActionCreators(userActions, dispatch),
    }
}

Sign.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(dialogContentStyle)(Sign));