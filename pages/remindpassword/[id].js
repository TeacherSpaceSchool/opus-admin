import Head from 'next/head';
import React, {useState} from 'react';
import App from '../../layouts/App';
import { connect } from 'react-redux'
import stylePageList from '../../src/styleMUI/list'
import { urlMain } from '../../redux/constants/other'
import initialApp from '../../src/initialApp'
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import { remindPassword, checkRemindPassword } from '../../src/gql/user'
import { getClientGqlSsr } from '../../src/getClientGQL'
import { useRouter } from 'next/router';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
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
import Router from 'next/router';

const RemindPassword = React.memo((props) => {
    const classesPageList = stylePageList();
    const { showSnackBar } = props.snackbarActions;
    const { showMiniDialog, setMiniDialog } = props.mini_dialogActions;
   const { data } = props;
    const router = useRouter();
    const [password, setPassword] = useState('');
    const [repeatPassword, setRepeatPassword] = useState('');
    const [error, setError] = useState(data.error);
    let [hide, setHide] = useState('password');
    let handleHide =  () => {
        setHide(!hide)
    };
    return (
        <App pageName='Восстановление пароля'>
            <Head>
                <title>Восстановление пароля</title>
                <meta name='description' content='OPUS.KG' />
                <meta property='og:title' content='Восстановление пароля' />
                <meta property='og:description' content='OPUS.KG' />
                <meta property='og:type' content='website' />
                <meta property='og:avatar' content={`${urlMain}/static/512x512.png`} />
                <meta property='og:url' content={`${urlMain}/remindpassword/${router.query.id}`} />
                <link rel='canonical' href={`${urlMain}/remindpassword/${router.query.id}`}/>
            </Head>
            <Card className={classesPageList.page}>
                <CardContent className={classesPageList.column}>
                    {
                        !error?
                            <>
                            <FormControl className={classesPageList.input}>
                                <InputLabel htmlFor='adornment-password'>Придумайте пароль</InputLabel>
                                <Input
                                    type={hide ? 'password' : 'text' }
                                    value={password}
                                    onChange={(event)=>{setPassword(event.target.value)}}
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
                            <FormControl className={classesPageList.input}>
                                <InputLabel htmlFor='adornment-password'>Повторите пароль</InputLabel>
                                <Input
                                    type={hide ? 'password' : 'text' }
                                    value={repeatPassword}
                                    onChange={(event)=>{setRepeatPassword(event.target.value)}}
                                    endAdornment={
                                        <InputAdornment position='end'>
                                            <IconButton aria-label='Toggle password visibility' onClick={handleHide}>
                                                {hide ? <VisibilityOff />:<Visibility />  }
                                            </IconButton>
                                        </InputAdornment>
                                    }
                                />
                            </FormControl>
                            {password.length<8?
                                <div className={classesPageList.error_message}>Недостаточная длина пароля</div>
                                :
                                null
                            }
                            {password!==repeatPassword?
                                <div className={classesPageList.error_message}>Пароли не совпадают</div>
                                :
                                null
                            }
                            </>
                            :
                            null
                    }
                    {error?
                        <div className={classesPageList.error_message}>Неверный код</div>
                        :
                        null
                    }
                    {!error&&password.length>7&&password===repeatPassword?
                        <Button onClick={async()=>{
                            const action = async() => {
                                let res = await remindPassword({code: router.query.id, password})
                                if(res==='OK') {
                                    showSnackBar('Пароль успешно изменен')
                                    Router.push('/')
                                } else {
                                    setError(true)
                                    showSnackBar('Ошибка')
                                }
                            }
                            setMiniDialog('Вы уверены?', <Confirmation action={action}/>)
                            showMiniDialog(true)
                        }} color='primary'>
                            Сохранить
                        </Button>
                        :
                        null
                    }
                </CardContent>
            </Card>
        </App>
    )
})

RemindPassword.getInitialProps = async function(ctx) {
    await initialApp(ctx)
    if(ctx.store.getState().user.profile.role)
        if(ctx.res) {
            ctx.res.writeHead(302, {
                Location: '/'
            })
            ctx.res.end()
        } else
            Router.push('/')
    return {
        data: {
            error: await checkRemindPassword(ctx.query.id, ctx.req?await getClientGqlSsr(ctx.req):undefined)!=='OK'
        }
    };
};

function mapStateToProps (state) {
    return {
        user: state.user
    }
}

function mapDispatchToProps(dispatch) {
    return {
        snackbarActions: bindActionCreators(snackbarActions, dispatch),
        mini_dialogActions: bindActionCreators(mini_dialogActions, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(RemindPassword);