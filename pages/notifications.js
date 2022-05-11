import Head from 'next/head';
import React, {useState, useRef, useEffect} from 'react';
import App from '../layouts/App';
import { connect } from 'react-redux'
import stylePageList from '../src/styleMUI/list'
import { urlMain } from '../redux/constants/other'
import initialApp from '../src/initialApp'
import * as appActions from '../redux/actions/app'
import { bindActionCreators } from 'redux'
import LazyLoad from 'react-lazyload';
import CardPlaceholder from '../components/CardPlaceholder'
import CardChat from '../components/CardChat'
import CardNotification from '../components/CardNotification'
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import { getNotifications } from '../src/gql/notification'
import { getChats } from '../src/gql/chat'
import Router from 'next/router'
import { getClientGqlSsr } from '../src/getClientGQL'
import { forceCheck } from 'react-lazyload';
import { checkInt } from '../src/lib'
import { readUser } from '../src/gql/user';
import Badge from '@material-ui/core/Badge';
import Input from '@material-ui/core/Input';
import { useRouter } from 'next/router';
import {useSwipeable} from 'react-swipeable';
import { getPushNotifications } from '../src/gql/pushNotification'
import CardPushNotification from '../components/CardPushNotification'
import InputAdornment from '@material-ui/core/InputAdornment';
import SearchIcon from '@material-ui/icons/Search';
import CancelIcon from '@material-ui/icons/Cancel';
import IconButton from '@material-ui/core/IconButton';
const height = 100

const Notifications = React.memo((props) => {
    const classesPageList = stylePageList();
    const { data } = props;
    const { profile } = props.user;
    const router = useRouter();
    const initialRender = useRef(true);
    let [list, setList] = useState(data.list);
    const [page, setPage] = useState(data.page);
    const [unreadP, setUnreadP] = useState(data.unreadP);
    const getList = async()=>{
        setList(page===0?await getChats({skip: 0, user: router.query.user, search}):profile.role!=='admin'||router.query.user?await getNotifications({skip: 0, user: router.query.user}):await getPushNotifications({search, skip: 0}));
        (document.getElementsByClassName('App-body'))[0].scroll({top: 0, left: 0, behavior: 'instant' });
        forceCheck()
        paginationWork.current = true;
    }
    const handlePage = (event, newPage) => {
        router.replace(`${router.pathname}?page=${newPage}`, undefined, { shallow: true })
        setList([])
        setPage(newPage);
        if(unreadP[0]||unreadP[1]) {
            readUser('all')
            setUnreadP({});
        }
        (document.getElementsByClassName('App-body'))[0].scroll({top: 0, left: 0, behavior: 'instant' });
    };
    let paginationWork = useRef(true);
    const checkPagination = async()=>{
        if(paginationWork.current&&!initialRender.current){
            let addedList = page===0?
                await getChats({skip: list.length, user: router.query.user, search})
                :
                profile.role!=='admin'||router.query.user?
                await getNotifications({skip: list.length, user: router.query.user})
                    :
                    await getPushNotifications({skip: list.length, search})
            if(addedList.length>0)
                setList([...list, ...addedList])
            else
                paginationWork.current = false
        }
    }
    useEffect(()=>{
        (async()=>{
            if(!initialRender.current) getList()
        })()
    },[page])
    const handlerSwipe = useSwipeable({
        onSwipedLeft: () => {
            if(page!==1)
                handlePage({}, 1)
        },
        onSwipedRight: () => {
            if(page!==0)
                handlePage({}, 0)
        },
        delta: 80
    });
    const { search } = props.app;
    const { setSearch } = props.appActions;
    let handleSearch = (event) => {
        setSearch(event.target.value)
    };
    let [searchTimeOut, setSearchTimeOut] = useState(null);
    useEffect(()=>{
        (async()=>{
            if(initialRender.current) {
                initialRender.current = false;
            } else if(page===0||profile.role==='admin'&&!router.query.user){
                if (searchTimeOut)
                    clearTimeout(searchTimeOut)
                searchTimeOut = setTimeout(async () => {
                    await getList()
                }, 500)
                setSearchTimeOut(searchTimeOut)
            }
        })()
    },[search])
    return (
        <App setUnreadP={setUnreadP} pageName='Чаты/Уведомления' paginationWork={paginationWork} checkPagination={checkPagination} list={list} setList={setList} page={page} handlerSwipe={handlerSwipe}>
            <Head>
                <title>Чаты/Уведомления</title>
                <meta name='description' content='OPUS.KG' />
                <meta property='og:title' content='Чаты/Уведомления' />
                <meta property='og:description' content='OPUS.KG' />
                <meta property='og:type' content='website' />
                <meta property='og:image' content={`${urlMain}/static/512x512.png`} />
                <meta property='og:url' content={`${urlMain}/notifications`} />
                <link rel='canonical' href={`${urlMain}/notifications`}/>
            </Head>
            <div className={classesPageList.page} style={{paddingTop: 0}}>
                <div className={classesPageList.stickyTab} id='scroll-hide'>
                    <Tabs
                        value={page}
                        onChange={handlePage}
                        indicatorColor='primary'
                        textColor='primary'
                        centered
                    >
                        <Tab label={<Badge color='secondary' variant='dot' invisible={!unreadP[0]}>Чаты</Badge>} />
                        <Tab label={<Badge color='secondary' variant='dot' invisible={!unreadP[1]}>Уведомления</Badge>} />
                    </Tabs>
                    {
                        page===0||profile.role==='admin'&&!router.query.user?
                            <Input className='SearchField'
                                   type={'login'}
                                   placeholder='Поиск...'
                                   value={search}
                                   onChange={handleSearch}
                                   endAdornment={
                                       search?
                                           <InputAdornment position='end'>
                                               <IconButton aria-label='Search' onClick={()=>{setSearch('');}}>
                                                   <CancelIcon />
                                               </IconButton>
                                           </InputAdornment>
                                           :
                                           null
                                   }
                                   startAdornment={
                                       <InputAdornment position='end'>
                                           <SearchIcon/>
                                       </InputAdornment>
                                   }
                            />
                            :
                            null
                    }
                </div>
                {
                    page===1&&profile.role==='admin'&&!router.query.user?
                        <CardPushNotification setList={setList} list={list}/>
                        :
                        null
                }
                {
                    list?list.map((element, idx)=> {
                        if(element) {
                            if (idx<=data.limit)
                                if(page===0)
                                    return <CardChat list={list} _user={router.query.user} element={element} key={element._id}/>
                                else {
                                    if (profile.role !== 'admin' || router.query.user)
                                        return <CardNotification list={list} setList={setList} element={element}
                                                                 key={element._id}/>
                                    else
                                        return <CardPushNotification element={element}/>
                                }
                            else
                                return (
                                <LazyLoad scrollContainer={'.App-body'} key={element._id} height={height}
                                          offset={[height, 0]} debounce={0} once={true}
                                          placeholder={<CardPlaceholder height={height}/>}>
                                    {
                                        page === 0 ?
                                            element.part1?
                                                <CardChat list={list} _user={router.query.user} element={element} key={element._id}/>
                                                :
                                                null
                                            :
                                            page === 1 && (profile.role!=='admin'||router.query.user)?
                                                element.whom?
                                                    <CardNotification list={list} setList={setList} element={element} key={element._id}/>
                                                    :
                                                    null
                                                :
                                                <CardPushNotification element={element}/>
                                    }
                                </LazyLoad>
                            )
                        }
                    }):null
                }
            </div>
        </App>
    )
})

Notifications.getInitialProps = async function(ctx) {
    await initialApp(ctx)
    if(!ctx.store.getState().user.profile.role||ctx.store.getState().user.profile.role==='manager')
        if(ctx.res) {
            ctx.res.writeHead(302, {
                Location: '/'
            })
            ctx.res.end()
        } else
            Router.push('/')
    let page = checkInt(ctx.query.page)
    let unreadP = {}
    if(ctx.store.getState().user.profile.unreadBN&&(ctx.store.getState().user.profile.unreadBN.notifications0||ctx.store.getState().user.profile.unreadBN.notifications1)) {
        if(ctx.store.getState().user.profile.unreadBN.notifications1&&!page)
            unreadP = {1: true}
        if(ctx.store.getState().user.profile.unreadBN.notifications0&&page)
            unreadP = {0: true}
        readUser('all', ctx.req ? await getClientGqlSsr(ctx.req) : undefined)
        ctx.store.getState().user.profile.unreadBN = {}
    }
    let limit
    if(process.browser&&sessionStorage.scrollPostionLimit)
        limit = parseInt(sessionStorage.scrollPostionLimit)
    return {
        data: {
            unreadP,
            page,
            limit,
            list: !page?
                await getChats({skip: 0, user: ctx.query.user, limit},ctx.req?await getClientGqlSsr(ctx.req):undefined)
                :
                'admin'!==ctx.store.getState().user.profile.role||ctx.query.user?
                    await getNotifications({skip: 0, user: ctx.query.user, limit},ctx.req?await getClientGqlSsr(ctx.req):undefined)
                    :
                    await getPushNotifications({search: '', skip: 0},ctx.req?await getClientGqlSsr(ctx.req):undefined)
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
        appActions: bindActionCreators(appActions, dispatch),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Notifications);