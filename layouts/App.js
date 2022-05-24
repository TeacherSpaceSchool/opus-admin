import React, { useEffect, useState, useRef } from 'react';
import Dialog from '../components/app/Dialog'
import FullDialog from '../components/app/FullDialog'
import SnackBar from '../components/app/SnackBar'
import SnackBarNotify from '../components/app/SnackBarNotify'
import WelcomePage from '../components/WelcomePage'
import BottomNavigation from '../components/app/BottomNavigation'
import Search from '../components/app/Search'
import BackBar from '../components/app/BackBar'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as userActions from '../redux/actions/user'
import * as appActions from '../redux/actions/app'
import CircularProgress from '@material-ui/core/CircularProgress';
import '../scss/app.scss'
import 'react-awesome-lightbox/build/style.css';
import Router from 'next/router'
import { useBottomScrollListener } from 'react-bottom-scroll-listener';
import * as snackbarActions from '../redux/actions/snackbar'
import Lightbox from 'react-awesome-lightbox';
import Card from '@material-ui/core/Card';
import 'react-image-gallery/styles/css/image-gallery.css'
import { useSubscription } from '@apollo/react-hooks';
import { subscriptionData } from '../src/gql/data';
import { readChat } from '../src/gql/chat';
import { onlineUser, readUser } from '../src/gql/user';
import { useRouter } from 'next/router';
import { checkApple } from '../src/lib'
import { Alert } from '@material-ui/lab';
import Snackbar from '@material-ui/core/Snackbar';
export const mainWindow = React.createRef();
export const alert = React.createRef();
export let containerRef;

const App = React.memo(props => {
    const { setProfile, logout } = props.userActions;
    const { setIsMobileApp, setShowLightbox, setIsApple } = props.appActions;
    const { profile, authenticated } = props.user;
    const { load, showLightbox, imagesLightbox, indexLightbox, ua, showWelcomePage, expired } = props.app;
    let { checkPagination, searchShow, list, setList, page, setUnreadP, setGeo, handlerSwipe, save, paginationWork, backBarShow, pageName, adminChat } = props;
    const [_expired, _setExpired] = useState(expired);
    const [reloadPage, setReloadPage] = useState(false);
    const [snackBarNotify, setSnackBarNotify] = useState({});
    const [showSnackBarNotify, setShowSnackBarNotify] = useState(false);
    const closeShowSnackBarNotify = ()=>{
        setShowSnackBarNotify(false)
    }
    const [unreadBN, setUnreadBN] = useState(profile.unreadBN?profile.unreadBN:{});
    const { showSnackBar } = props.snackbarActions;
    const router = useRouter();
    let geoRef = useRef();
    let prevScrollpos = useRef();
    useEffect( ()=>{
        if(authenticated&&!profile.role)
            setProfile()
        else if(!authenticated&&profile.role)
            logout(false)
    },[authenticated])
    useEffect( ()=>{
        if(mainWindow.current&&mainWindow.current.offsetWidth<900) {
            setIsMobileApp(true)
        }
    },[mainWindow])

    useEffect( ()=>{
        (async ()=>{
            if(process.browser) {
                let scrollHide = (document.getElementById('scroll-hide'))
                if(scrollHide) {
                    let appBody = (document.getElementsByClassName('App-body'))[0]
                    prevScrollpos.current = appBody.offsetTop;
                    setTimeout(()=>{
                        const onScroll = () => {
                            let currentScrollPos = appBody.scrollTop;
                            if (prevScrollpos.current > currentScrollPos)
                                scrollHide.style.top = '0';
                            else
                                scrollHide.style.top = `-${scrollHide.offsetHeight}px`;
                            prevScrollpos.current = currentScrollPos;
                        }
                        appBody.addEventListener('scroll', onScroll)
                        return () => appBody.removeEventListener('scroll', onScroll);
                    }, 100)
                }
                window.addEventListener('offline', ()=>{showSnackBar('Нет подключения к Интернету', 'error')})
                if(profile.role) {
                    if (navigator.geolocation) {
                        navigator.geolocation.getCurrentPosition((position) => {
                            if(position) {
                                if (setGeo)
                                    setGeo([position.coords.latitude, position.coords.longitude])
                                geoRef.current = [position.coords.latitude, position.coords.longitude]
                            }
                            if(profile.role==='client')
                                onlineUser(geoRef.current)
                        })
                    }
                    else if(profile.role==='client')
                        onlineUser()
                    let onlineUserRef = setInterval(() => {
                        if (navigator.geolocation) navigator.geolocation.getCurrentPosition((position) => {
                            if(position) {
                                if (setGeo)
                                    setGeo([position.coords.latitude, position.coords.longitude])
                                geoRef.current = [position.coords.latitude, position.coords.longitude]
                            }
                        })
                        if(profile.role==='client')
                            onlineUser(geoRef.current)
                    }, 5 * 60 * 1000)
                    return () => {
                        clearInterval(onlineUserRef)
                    }

                }
        }})();
    },[process.browser])

    useEffect(()=>{
        if(ua) {
            setIsApple(checkApple(ua))
        }

        const routeChangeStart = (url)=>{
            setReloadPage(true)
             if(sessionStorage.scrollPostionName&&
                !(
                    url.includes('order')&&sessionStorage.scrollPostionName==='order'
                    ||
                    url.includes('application')&&sessionStorage.scrollPostionName==='application'
                    ||
                    url.includes('employment')&&sessionStorage.scrollPostionName==='employment'
                    ||
                    (url.includes('user')||url.includes('subcategories'))&&sessionStorage.scrollPostionName==='user'
                    ||
                    (url.includes('user')||url.includes('order')||url.includes('notifications')||url.includes('chat'))&&url!=='/orders'&&sessionStorage.scrollPostionName==='notification'
                ))
            {
                sessionStorage.scrollPostionStore = undefined
                sessionStorage.scrollPostionName = undefined
                sessionStorage.scrollPostionLimit = undefined

            }
        }
        const routeChangeComplete = (url) => {
            if(sessionStorage.scrollPostionName&&(
                    url.includes('/notifications')&&sessionStorage.scrollPostionName==='notification'
                    ||
                    url.includes('/orders')&&sessionStorage.scrollPostionName==='order'
                    ||
                    url.includes('/employments')&&sessionStorage.scrollPostionName==='employment'
                    ||
                    url==='/applications'&&sessionStorage.scrollPostionName==='application'
                    ||
                    (url==='/users'||url.includes('subcategories'))&&sessionStorage.scrollPostionName==='user'
                ))
            {
                let appBody = (document.getElementsByClassName('App-body'))[0]
                appBody.scroll({
                    top: parseInt(sessionStorage.scrollPostionStore),
                    left: 0,
                    behavior: 'instant'
                });
                sessionStorage.scrollPostionStore = undefined
                sessionStorage.scrollPostionName = undefined
                sessionStorage.scrollPostionLimit = undefined
            }
            setReloadPage(false)
        }
        Router.events.on('routeChangeStart', routeChangeStart)
        Router.events.on('routeChangeComplete', routeChangeComplete);
        return () => {
            Router.events.off('routeChangeStart', routeChangeStart)
            Router.events.off('routeChangeComplete', routeChangeComplete)
        }
    },[])

    containerRef = useBottomScrollListener(async()=>{
        if(paginationWork&&paginationWork.current) {
            //setReloadPage(true)
            await checkPagination()
            //setReloadPage(false)
        }
    });

    let subscriptionDataRes = useSubscription(subscriptionData);
    useEffect(()=>{
        if (
            subscriptionDataRes &&
            authenticated &&
            profile.role &&
            subscriptionDataRes.data &&
            subscriptionDataRes.data.reloadData
        ) {
            if (router.pathname==='/notifications'&&subscriptionDataRes.data.reloadData.notification&&subscriptionDataRes.data.reloadData.notification.type!==99||subscriptionDataRes.data.reloadData.message&&(router.pathname.includes('chat')&&(router.query.id===subscriptionDataRes.data.reloadData.message.chat||subscriptionDataRes.data.reloadData.mailing&&adminChat)||router.pathname==='/notifications')) {
                if(subscriptionDataRes.data.reloadData.notification) {
                    if ([0, 1, 2, 3, 4, 5].includes(subscriptionDataRes.data.reloadData.notification.type)) {
                        if (page === 1) {
                            setList([subscriptionDataRes.data.reloadData.notification, ...list])
                            readUser('notifications1')
                        }
                        else {
                            setUnreadP({1: true})
                            setSnackBarNotify(subscriptionDataRes.data.reloadData.notification)
                            setShowSnackBarNotify(true)
                        }
                    }
                }
                else if(subscriptionDataRes.data.reloadData.message) {
                    if (router.pathname === '/notifications'){
                        if (page === 0) {
                            for(let i=0; i<list.length; i++) {
                                if(list[i]._id===subscriptionDataRes.data.reloadData.message.chat||profile.role!=='admin'&&list[i].part1.name==='OPUS'&&subscriptionDataRes.data.reloadData.mailing){
                                    list[i].lastMessage = {type: subscriptionDataRes.data.reloadData.message.type, text: subscriptionDataRes.data.reloadData.message.text}
                                    list[i].part1Unread = true
                                    list[i].part2Unread = true
                                    list[i] = {...list[i]}
                                    readUser('notifications0')
                                }
                            }
                            setList([...list])
                        }
                        else
                            setUnreadP({0: true})
                    }
                    else {
                        setList([subscriptionDataRes.data.reloadData.message, ...list])
                        readChat(subscriptionDataRes.data.reloadData.message.chat?subscriptionDataRes.data.reloadData.message.chat:router.query.id)
                        readUser('notifications0')
                    }
                }
            }
            else {
                setUnreadBN(
                    subscriptionDataRes.data.reloadData.notification&&subscriptionDataRes.data.reloadData.notification.type===99?
                    {...unreadBN, order: true}
                    :
                    subscriptionDataRes.data.reloadData.message?
                    {...unreadBN, notifications0: true, notifications1: false}
                    :
                    {...unreadBN, notifications0: false, notifications1: true}
                )
                if(!subscriptionDataRes.data.reloadData.message) {
                    setSnackBarNotify(subscriptionDataRes.data.reloadData.notification)
                    setShowSnackBarNotify(true)
                }
            }
            if (navigator.vibrate || navigator.webkitVibrate || navigator.mozVibrate || navigator.msVibrate)
                navigator.vibrate(200);
         }
    },[subscriptionDataRes.data])
    return(
        showWelcomePage?
            <WelcomePage/>
            :
            <div ref={mainWindow} className='App'>
                {
                    searchShow?
                        <Search searchShow={searchShow}/>
                        :
                        backBarShow?
                            <BackBar backBarShow={pageName}/>
                            :
                            null
                }
                <Card ref={containerRef} className='App-body'>
                    {
                        handlerSwipe?
                            <div className='SwipeDiv' {...handlerSwipe}>
                                {props.children}
                            </div>
                            :
                            props.children

                    }
                </Card>
                <BottomNavigation unreadBN={unreadBN} save={save}/>
                <FullDialog/>
                <Dialog />
                <SnackBar/>
                <SnackBarNotify snackBarNotify={snackBarNotify} showSnackBarNotify={showSnackBarNotify} closeShowSnackBarNotify={closeShowSnackBarNotify}/>
                {showLightbox?
                    <Lightbox
                        images={imagesLightbox.length>1?imagesLightbox:null}
                        image={imagesLightbox.length===1?imagesLightbox[0]:null}
                        startIndex={indexLightbox}
                        onClose={() => { setShowLightbox(false)}}
                    />
                    :
                    null
                }
                <audio src='/static/alert.mp3' ref={alert}/>
                {load||reloadPage?
                    <div className='load'>
                        <CircularProgress disableShrink/>
                    </div>
                    :
                    null
                }
                <Snackbar
                    anchorOrigin={{
                        vertical: 'top',
                        horizontal: 'center',
                    }}
                    open={_expired}
                    autoHideDuration={5000}
                    onClick={()=>{_setExpired(false)}}
                    onClose={()=>{_setExpired(false)}}>
                    <Alert variant='filled' severity='warning'>
                        {expired}
                    </Alert>
                </Snackbar>
            </div>
    )
});

function mapStateToProps (state) {
    return {
        user: state.user,
        app: state.app
    }
}

function mapDispatchToProps(dispatch) {
    return {
        userActions: bindActionCreators(userActions, dispatch),
        appActions: bindActionCreators(appActions, dispatch),
        snackbarActions: bindActionCreators(snackbarActions, dispatch),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);