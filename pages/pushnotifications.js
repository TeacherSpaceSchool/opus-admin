import Head from 'next/head';
import React, { useState, useEffect, useRef } from 'react';
import App from '../layouts/App';
import { connect } from 'react-redux'
import { getPushNotifications, getPushNotificationsCount } from '../src/gql/pushNotification'
import pageListStyle from '../src/styleMUI/list'
import CardPushNotification from '../components/CardPushNotification'
import { urlMain } from '../redux/constants/other'
import LazyLoad from 'react-lazyload';
import CardPushNotificationPlaceholder from '../components/CardPlaceholder'
import { getClientGqlSsr } from '../src/getClientGQL'
import initialApp from '../src/initialApp'
import Router from 'next/router'
import { forceCheck } from 'react-lazyload';
const height = 440

const PushNotification = React.memo((props) => {
    const classes = pageListStyle();
    const { data } = props;
    let [list, setList] = useState(data.list);
    let [count, setCount] = useState(data.count);
    const { search } = props.app;
    let [searchTimeOut, setSearchTimeOut] = useState(null);
    const initialRender = useRef(true);
    const getList = async ()=>{
        setList((await getPushNotifications({search, skip: 0})));
        setCount(await getPushNotificationsCount({search}));
        (document.getElementsByClassName('App-body'))[0].scroll({top: 0, left: 0, behavior: 'instant' });
        forceCheck();
        paginationWork.current = true
    }
    useEffect(()=>{
        (async()=>{
            if(initialRender.current) {
                initialRender.current = false;
            } else {
                if(searchTimeOut)
                    clearTimeout(searchTimeOut)
                searchTimeOut = setTimeout(async()=>{
                    await getList()
                }, 500)
                setSearchTimeOut(searchTimeOut)
            }
        })()
    },[ search])
    let paginationWork = useRef(true);
    const checkPagination = async()=>{
        if(paginationWork.current&&!initialRender.current){
            let addedList = await getPushNotifications({skip: list.length, search})
            if(addedList.length>0)
                setList([...list, ...addedList])
            else
                paginationWork.current = false
        }
    }
    return (
        <App searchShow={true} paginationWork={paginationWork} checkPagination={checkPagination} pageName='Пуш-уведомления'>
            <Head>
                <title>Пуш-уведомления</title>
                <meta name='description' content='OPUS.KG' />
                <meta property='og:title' content='Пуш-уведомления' />
                <meta property='og:description' content='OPUS.KG' />
                <meta property='og:type' content='website' />
                <meta property='og:image' content={`${urlMain}/static/512x512.png`} />
                <meta property='og:image:width' content='512' />
                <meta property='og:image:height' content='512' />
                <meta property='og:url' content={`${urlMain}/pushnotifications`} />
                <link rel='canonical' href={`${urlMain}/pushnotifications`}/>
            </Head>
            <div className='count'>
                {`Всего: ${count}`}
            </div>
            <div className={classes.page} style={{paddingTop: 72}}>
                <CardPushNotification setList={setList} list={list}/>
                {list?list.map((element)=>
                    <LazyLoad scrollContainer={'.App-body'} key={element._id} height={height} offset={[height, 0]} debounce={0} once={true}  placeholder={<CardPushNotificationPlaceholder heightM={height} heightD={height}/>}>
                        <CardPushNotification element={element}/>
                    </LazyLoad>
                ):null}
            </div>
        </App>
    )
})

PushNotification.getInitialProps = async function(ctx) {
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
            list: await getPushNotifications({search: '', skip: 0},ctx.req?await getClientGqlSsr(ctx.req):undefined),
            count: await getPushNotificationsCount({search: ''},ctx.req?await getClientGqlSsr(ctx.req):undefined),
        }
    };
};

function mapStateToProps (state) {
    return {
        app: state.app,
    }
}

export default connect(mapStateToProps)(PushNotification);