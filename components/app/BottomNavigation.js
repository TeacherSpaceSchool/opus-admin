import React from 'react';
import { connect } from 'react-redux'
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction'
import HomeIcon from '@material-ui/icons/Home';
import ViewListIcon from '@material-ui/icons/ViewList';
import QuestionAnswerIcon from '@material-ui/icons/QuestionAnswer';
import AppsIcon from '@material-ui/icons/Apps';
import Router from 'next/router'
import Badge from '@material-ui/core/Badge';
import * as mini_dialogActions from '../../redux/actions/mini_dialog'
import { bindActionCreators } from 'redux'
import Sign from '../dialog/Sign'
import { makeStyles } from '@material-ui/core/styles';
import { useRouter } from 'next/router';
import Confirmation from '../../components/dialog/Confirmation'

const iphoneStyle = makeStyles({
    root: {
        paddingBottom: 10,
        height: 70,
        maxWidth: 800,
        zIndex: 1201,
        width: '100%',
        bottom: 0,
        position: 'fixed',
        borderTop: '1px solid #aeaeae',
        background: 'white',
        overflow: 'hidden'
    },
});

const otherStyle = makeStyles({
    root: {
        maxWidth: 800,
        zIndex: 1201,
        width: '100%',
        bottom: 0,
        position: 'fixed',
        borderTop: '1px solid #aeaeae',
        background: 'white',
        overflow: 'hidden'
    },
});

const MyBottomNavigation = React.memo((props) => {
    const classesIphone = iphoneStyle();
    const classesOther = otherStyle();
    const {  bottomNavigationNumber, isApple } = props.app;
    const { profile, authenticated } = props.user;
    const router = useRouter();
    const { unreadBN, save } = props;
    const { setMiniDialog, showMiniDialog } = props.mini_dialogActions;
    return (
        <BottomNavigation
            className={isApple?classesIphone.root:classesOther.root}
            value={bottomNavigationNumber}
            showLabels
        >
            <BottomNavigationAction label='Главная' icon={<HomeIcon/>} onClick={()=>{
                if(router.asPath==='/order/new') {
                    const action = async() => Router.push('/')
                    setMiniDialog('Выйти из заказа?', <Confirmation action={action}/>)
                    showMiniDialog(true)
                }
                else if(save&&router.query.change==='true') {
                    const action = async() => {
                        await save()
                        Router.push('/')
                    }
                    const actionCancel = async() => {
                        Router.push('/')
                    }
                    setMiniDialog('Сохранить изменения?', <Confirmation action={action} actionCancel={actionCancel}/>)
                    showMiniDialog(true)
                }
                else
                    Router.push('/')
            }}/>
            <BottomNavigationAction label='Заказы' icon={<Badge color='secondary' variant='dot' invisible={!unreadBN.order}><ViewListIcon /></Badge>}
                                    onClick={()=>{
                                        if(router.asPath==='/order/new') {
                                            const action = async() => Router.push('/orders')
                                            setMiniDialog('Выйти из заказа?', <Confirmation action={action}/>)
                                            showMiniDialog(true)
                                        }
                                        else if(save&&router.query.change==='true') {
                                            const action = async() => {
                                                await save()
                                                Router.push('/orders')
                                            }
                                            const actionCancel = async() => {
                                                Router.push('/orders')
                                            }
                                            setMiniDialog('Сохранить изменения?', <Confirmation action={action} actionCancel={actionCancel}/>)
                                            showMiniDialog(true)
                                        }
                                        else
                                            Router.push('/orders')
                                    }}
            />
            <BottomNavigationAction label='Чаты'
                                    icon={<Badge color='secondary' variant='dot' invisible={!unreadBN.notifications0&&!unreadBN.notifications1}><QuestionAnswerIcon/></Badge>}
                                    onClick={()=>{
                                        if(authenticated) {
                                            if (router.asPath === '/order/new') {
                                                const action = async () => Router.push(`/notifications?page=${unreadBN.notifications1 ? 1 : 0}`)
                                                setMiniDialog('Выйти из заказа?', <Confirmation action={action}/>)
                                                showMiniDialog(true)
                                            }
                                            else if(save&&router.query.change==='true') {
                                                const action = async() => {
                                                    await save()
                                                    Router.push(`/notifications?page=${unreadBN.notifications1 ? 1 : 0}`)
                                                }
                                                const actionCancel = async() => {
                                                    Router.push(`/notifications?page=${unreadBN.notifications1 ? 1 : 0}`)
                                                }
                                                setMiniDialog('Сохранить изменения?', <Confirmation action={action} actionCancel={actionCancel}/>)
                                                showMiniDialog(true)
                                            }
                                            else
                                                Router.push(`/notifications?page=${unreadBN.notifications1 ? 1 : 0}`)
                                        }
                                        else {
                                            setMiniDialog('', <Sign/>)
                                            showMiniDialog(true)
                                        }
                                    }}
            />
            <BottomNavigationAction label='Меню' icon={<AppsIcon />} onClick={()=>{
                if(router.asPath==='/order/new') {
                    const action = async() => Router.push('/other')
                    setMiniDialog('Выйти из заказа?', <Confirmation action={action}/>)
                    showMiniDialog(true)
                }
                else if(save&&router.query.change==='true') {
                    const action = async() => {
                        await save()
                        Router.push('/other')
                    }
                    const actionCancel = async() => {
                        Router.push('/other')
                    }
                    setMiniDialog('Сохранить изменения?', <Confirmation action={action} actionCancel={actionCancel}/>)
                    showMiniDialog(true)
                }
                else
                    Router.push('/other')
            }}/>
        </BottomNavigation>
    )
})

function mapStateToProps (state) {
    return {
        app: state.app,
        user: state.user,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        mini_dialogActions: bindActionCreators(mini_dialogActions, dispatch),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(MyBottomNavigation)