import Head from 'next/head';
import React, {useState, useEffect} from 'react';
import App from '../../layouts/App';
import { connect } from 'react-redux'
import stylePageList from '../../src/styleMUI/list'
import styleUser from '../../src/styleMUI/other/user'
import { urlMain } from '../../redux/constants/other'
import initialApp from '../../src/initialApp'
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import { getUser, setUser, addEmployment } from '../../src/gql/user'
import { validPhoneLogin, validEmail, cities, inputInt } from '../../src/lib'
import { getClientGqlSsr } from '../../src/getClientGQL'
import { useRouter } from 'next/router';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import Input from '@material-ui/core/Input';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import { bindActionCreators } from 'redux'
import * as snackbarActions from '../../redux/actions/snackbar'
import * as mini_dialogActions from '../../redux/actions/mini_dialog'
import Confirmation from '../../components/dialog/Confirmation'
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import Router from 'next/router'
import IconButton from '@material-ui/core/IconButton';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import * as appActions from '../../redux/actions/app'
const roles = ['manager']

const Employment = React.memo((props) => {
    const classesPageList = stylePageList();
    const classesUser = styleUser();
    const { showSnackBar } = props.snackbarActions;
    const { showMiniDialog, setMiniDialog } = props.mini_dialogActions;
    const { data } = props;
    const { isMobileApp, isApple } = props.app;
    const router = useRouter();
    let [hide, setHide] = useState('password');
    let handleHide =  () => {
        setHide(!hide)
    };
    const [name, setName] = useState(data.user&&data.user.name?data.user.name:'');
    const [login, setLogin] = useState(data.user&&data.user.login?data.user.login:'');
    const [password, setPassword] = useState(data.user&&data.user.password?data.user.password:'');
    const [city, setCity] = useState(data.user&&data.user.city?data.user.city:'Бишкек');
    let handleCity = event => setCity(event.target.value)
    const [role, setRole] = useState(data.user&&data.user.role?data.user.role:'manager');
    let handleRole = event => setRole(event.target.value)
    const [email, setEmail] = useState(data.user&&data.user.email?data.user.email:'');
    useEffect(() => {
        if(!name)
            showSnackBar('Пожалуйста, укажите имя')
    }, []);
    return (
        <App pageName={data.user?data.user.name:'Ничего не найдено'} >
            <Head>
                <title>{data.user?data.user.name:'Ничего не найдено'}</title>
                <meta name='description' content='' />
                <meta property='og:title' content={data.user?data.user.name:'Ничего не найдено'} />
                <meta property='og:description' content='' />
                <meta property='og:type' content='website' />
                <meta property='og:avatar' content={data.user?data.user.avatar:`${urlMain}/static/512x512.png`} />
                <meta property='og:url' content={`${urlMain}/employment/${router.query.id}`} />
                <link rel='canonical' href={`${urlMain}/employment/${router.query.id}`}/>
            </Head>
            {
                data.user?
                    <>
                    <div className={classesPageList.page}>
                        <Card className={classesUser.divForm}>
                            <CardContent>
                                <br/>
                                <TextField
                                    value={login}
                                    onChange={(event)=>{setLogin(inputInt(event.target.value))}}
                                    error={!validPhoneLogin(login)}
                                    label='Телефон*. Формат: +996559871952'
                                    type='login'
                                    className={classesPageList.input}
                                    margin='normal'
                                    InputProps={{
                                        startAdornment: <InputAdornment position='start'>+996</InputAdornment>,
                                    }}
                                />
                                <Input
                                    error={router.query.id!=='new'?password.length&&password.length<8:password.length<8}
                                    value={password}
                                    onChange={(event)=>{setPassword(event.target.value)}}
                                    placeholder={router.query.id!=='new'?'Новый пароль':'Пароль'}
                                    autoComplete='new-password'
                                    type={hide ? 'password' : 'text' }
                                    className={classesPageList.input}
                                    endAdornment={
                                        <InputAdornment position='end'>
                                            <IconButton aria-label='Toggle password visibility' onClick={handleHide}>
                                                {hide ? <VisibilityOff />:<Visibility />  }
                                            </IconButton>
                                        </InputAdornment>
                                    }
                                />
                                <TextField
                                    error={!name.length}
                                    label='Имя*'
                                    value={name}
                                    onChange={(event)=>{setName(event.target.value)}}
                                    className={classesPageList.input}
                                    inputProps={{
                                        'aria-label': 'description'
                                    }}
                                />
                                <TextField
                                    type='email'
                                    label='Email'
                                    className={classesPageList.input}
                                    error={email.length&&!validEmail(email)}
                                    value={email}
                                    onChange={(event)=>{setEmail(event.target.value)}}
                                />
                                <FormControl className={classesPageList.input}>
                                    <InputLabel>Город</InputLabel>
                                    <Select value={city} onChange={handleCity}
                                            inputProps={{
                                                'aria-label': 'description'
                                            }}>
                                        {cities.map((element)=>
                                            <MenuItem key={element} value={element} ola={element}>{element}</MenuItem>
                                        )}
                                    </Select>
                                </FormControl>
                                <FormControl className={classesPageList.input}>
                                    <InputLabel>Роль</InputLabel>
                                    <Select value={role} onChange={handleRole}
                                            inputProps={{
                                                'aria-label': 'description'
                                            }}>
                                        {roles.map((element)=>
                                            <MenuItem key={element} value={element} ola={element}>{element}</MenuItem>
                                        )}
                                    </Select>
                                </FormControl>
                            </CardContent>
                        </Card>
                        <IconButton className={classesPageList.backArrow}
                                    onClick={()=>Router.back()}>
                            <ArrowBackIcon/>
                        </IconButton>
                    </div>
                    <div className={isMobileApp?isApple?classesPageList.bottomDivMA:classesPageList.bottomDivM:classesPageList.bottomDivD}>
                        <Button onClick={async()=>{
                            if (name&&validPhoneLogin(login)&&(!email||validEmail(email))&&(router.query.id!=='new'||password.length>7)) {
                                let action
                                if(router.query.id!=='new') {
                                    let editElement = {_id: router.query.id}
                                    if (city && city !== data.user.city) editElement.city = city
                                    if (name && name !== data.user.name) editElement.name = name
                                    if (password && password.length > 7) editElement.password = password
                                    if (login && login !== data.user.login) editElement.login = login
                                    if (email && email !== data.user.email) editElement.email = email
                                    action = async () => {
                                        await setUser(editElement)
                                        Router.reload()
                                    }
                                }
                                else {
                                    action = async () => {
                                        await addEmployment({login, password, name, city, role, email})
                                        Router.push('/employments')
                                    }
                                }
                                setMiniDialog('Вы уверены?', <Confirmation action={action}/>)
                                showMiniDialog(true)
                            } else {
                                showSnackBar('Заполните все красные поля')
                            }
                        }} color='primary'>
                            {router.query.id==='new'?'Добавить':'Сохранить'}
                        </Button>
                    </div>
                    </>
                    :
                    null
            }
        </App>
    )
})

Employment.getInitialProps = async function(ctx) {
    await initialApp(ctx)
    if('admin'!==ctx.store.getState().user.profile.role)
        if(ctx.res) {
            ctx.res.writeHead(302, {
                Location: '/'
            })
            ctx.res.end()
        } else
            Router.push('/')
    return {
        data: {
            user: ctx.query.id==='new'? {
                login: '', password: '', name: '', city: 'Бишкек', role: 'manager', email: ''
            }:await getUser({_id: ctx.query.id}, ctx.req?await getClientGqlSsr(ctx.req):undefined)
        }
    };
};

function mapStateToProps (state) {
    return {
        user: state.user,
        app: state.app,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        snackbarActions: bindActionCreators(snackbarActions, dispatch),
        mini_dialogActions: bindActionCreators(mini_dialogActions, dispatch),
        appActions: bindActionCreators(appActions, dispatch),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Employment);