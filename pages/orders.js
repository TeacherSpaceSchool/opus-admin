import Head from 'next/head';
import React, {useState, useRef, useEffect} from 'react';
import App from '../layouts/App';
import { connect } from 'react-redux'
import stylePageList from '../src/styleMUI/list'
import { urlMain } from '../redux/constants/other'
import initialApp from '../src/initialApp'
import LazyLoad from 'react-lazyload';
import CardPlaceholder from '../components/CardPlaceholder'
import CardOrder from '../components/CardOrder'
import Link from 'next/link';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import { getOrders, getNearOrders, getOrdersCount } from '../src/gql/order'
import Sign from '../components/dialog/Sign'
import Filter from '../components/dialog/Filter'
import { getClientGqlSsr } from '../src/getClientGQL'
import styleCategory from '../src/styleMUI/other/category'
import styleOrder from '../src/styleMUI/other/order'
import { forceCheck } from 'react-lazyload';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import { useRouter } from 'next/router';
import {useSwipeable} from 'react-swipeable';
import { checkInt } from '../src/lib'
import Chip from '@material-ui/core/Chip';
import Avatar from '@material-ui/core/Avatar';
import { bindActionCreators } from 'redux'
import * as appActions from '../redux/actions/app'
import * as mini_dialogActions from '../redux/actions/mini_dialog'
import Router from 'next/router'
import { getSubcategories } from '../src/gql/subcategory'
import { getCategories } from '../src/gql/category'
const height = 147

const Orders = React.memo((props) => {
    const classesPageList = stylePageList();
    const router = useRouter();
    const classesCategory = styleCategory();
    const classesOrder = styleOrder();
    const { data } = props;
    const { profile, authenticated } = props.user;
    const { filter } = props.app;
    const { setMiniDialog, showMiniDialog } = props.mini_dialogActions;
    let [dateStart, setDateStart] = useState(null);
    let [dateEnd, setDateEnd] = useState(null);
    let [list, setList] = useState(data.list);
    let [count, setCount] = useState(data.count);
    let [subcategory, setSubcategory] = useState(undefined);
    let [category, setCategory] = useState(undefined);
    const { setFilter, showLoad } = props.appActions;
    const initialRender = useRef(true);
    const [page, setPage] = useState(profile.specializations&&profile.specializations.length?router.query.page?checkInt(router.query.page):1:0);
    const [geo, setGeo] = useState();
    useEffect(()=>{
        if(process.browser) {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition((position) => {
                    if(position) {
                        setGeo([position.coords.latitude, position.coords.longitude])
                    }
                })
            }
        }
    },[process.browser])
    const getList = async()=>{
        if(page===2) {
            await showLoad(true)
            setList(await getNearOrders(geo));
            await showLoad(false)
        }
        else {
            setList(await getOrders({
                skip: 0,
                ...page === 0 ? {my: true, status: filter} : {subcategory},
                ...profile.role==='admin'?
                    {
                        ...category?{category: category._id}:{},
                        ...subcategory?{subcategory: subcategory._id}:{},
                        ...dateStart?{dateStart}:{},
                        ...dateEnd?{dateEnd}:{},
                    }
                    :
                    {},
                user: router.query.user,
            }));
            if(profile.role==='admin')
                setCount(await getOrdersCount({
                    ...category?{category: category._id}:{},
                    ...subcategory?{subcategory: subcategory._id}:{},
                    ...dateStart?{dateStart}:{},
                    ...dateEnd?{dateEnd}:{},
                    user: router.query.user,
                }))
        }
        (document.getElementsByClassName('App-body'))[0].scroll({top: 0, left: 0, behavior: 'instant' });
        forceCheck()
        paginationWork.current = true
    }
    const handlePage = (event, newValue) => {
        if(newValue!==2)
            router.replace(`${router.pathname}?page=${newValue}`, undefined, { shallow: true })
        setList([])
        setPage(newValue);
        (document.getElementsByClassName('App-body'))[0].scroll({top: 0, left: 0, behavior: 'instant' });
    };
    let paginationWork = useRef(true);
    const checkPagination = async()=>{
        if(paginationWork.current&&!initialRender.current){
            let addedList = await getOrders({
                skip: list.length,
                ...profile.role==='admin'?
                    {
                        ...category?{category: category._id}:{},
                        ...subcategory?{subcategory: subcategory._id}:{},
                        ...dateStart?{dateStart}:{},
                        ...dateEnd?{dateEnd}:{},
                    }
                    :
                    {},
                ...page===0?{ my: true, status: filter}:{subcategory},
                user: router.query.user
            })
            if(addedList.length>0)
                setList([...list, ...addedList])
            else
                paginationWork.current = false
        }
    }
    useEffect(()=>{
        (async()=>{
            if(initialRender.current) {
                initialRender.current = false;
            } else {
                getList()
            }
        })()
    },[page, filter, subcategory, category, dateStart, dateEnd])
    const handlerSwipe = useSwipeable({
        onSwipedLeft: (eventData) => {
            if(authenticated&&profile.role==='client'&&!eventData.event.target.className.includes('MuiChip')){
                if(page===0)
                    handlePage({}, 1)
                else if(page===1&&geo&&profile.specializations&&profile.specializations.length)
                    handlePage({}, 2)
            }
        },
        onSwipedRight: (eventData) => {
            if(authenticated&&profile.role==='client'&&page!==0&&!eventData.event.target.className.includes('MuiChip')) {
                if (page === 1)
                    handlePage({}, 0)
                else if (page === 2)
                    handlePage({}, 1)
            }
        },
        delta: 80
    });
    return (
        <App pageName='????????????' paginationWork={paginationWork} checkPagination={checkPagination} handlerSwipe={handlerSwipe}>
            <Head>
                <title>????????????</title>
                <meta name='description' content='OPUS.KG' />
                <meta property='og:title' content='????????????' />
                <meta property='og:description' content='OPUS.KG' />
                <meta property='og:type' content='website' />
                <meta property='og:image' content={`${urlMain}/static/512x512.png`} />
                <meta property='og:url' content={`${urlMain}/orders`} />
                <link rel='canonical' href={`${urlMain}/orders`}/>
            </Head>
            {
                authenticated?
                    <div className={classesOrder.stickyDiv} id='scroll-hide'>
                        {
                            profile.role==='client'?
                                <Tabs
                                    className={classesOrder.tab}
                                    value={page}
                                    onChange={handlePage}
                                    indicatorColor='primary'
                                    textColor='primary'
                                    centered
                                >
                                    <Tab label='?????? ????????????'/>
                                    <Tab label='?????? ????????????'/>
                                    {
                                        profile.specializations&&geo&&profile.specializations.length?
                                            <Tab label='??????????'/>
                                            :
                                            null
                                    }
                                </Tabs>
                                :
                                null
                        }
                        {
                            page===0?
                                <div className={classesOrder.divChip}>
                                    <Chip
                                        avatar={count[0]!=undefined?<Avatar>{count[0]}</Avatar>:null}
                                        className={classesOrder.chip}
                                        onClick={()=>{
                                            setFilter('')
                                        }}
                                        color={!filter?'primary':'default'}
                                        label='??????'
                                    />
                                    <Chip
                                        avatar={count[1]!=undefined?<Avatar>{count[1]}</Avatar>:null}
                                        onClick={()=>{
                                            if(filter!=='????????????????')
                                                setFilter('????????????????')
                                        }}
                                        color={filter==='????????????????'?'primary':'default'}
                                        className={classesOrder.chip}
                                        label='????????????????'
                                    />
                                    <Chip
                                        color={filter==='????????????'?'primary':'default'}
                                        avatar={count[2]!=undefined?<Avatar>{count[2]}</Avatar>:null}
                                        onClick={()=>{
                                            if(filter!=='????????????')
                                                setFilter('????????????')
                                        }}
                                        className={classesOrder.chip}
                                        label='????????????'
                                    />
                                    <Chip
                                        color={filter==='????????????????'?'primary':'default'}
                                        avatar={count[3]!=undefined?<Avatar>{count[3]}</Avatar>:null}
                                        onClick={()=>{
                                            if(filter!=='????????????????')
                                                setFilter('????????????????')
                                        }}
                                        className={classesOrder.chip}
                                        label='????????????????'
                                    />
                                    <Chip
                                        color={filter==='????????????'?'primary':'default'}
                                        avatar={count[4]!=undefined?<Avatar>{count[4]}</Avatar>:null}
                                        onClick={()=>{
                                            if(filter!=='????????????')
                                                setFilter('????????????')
                                        }}
                                        className={classesOrder.chip}
                                        label='????????????'
                                    />
                                </div>
                                :
                                profile.specializations&&profile.specializations.length>1?
                                    <div className={classesOrder.divChip}>
                                        <Chip
                                            className={classesOrder.chip}
                                            onClick={()=>{
                                                setSubcategory(undefined)
                                            }}
                                            color={!subcategory?'primary':'default'}
                                            label='??????'
                                        />
                                        {
                                            profile.specializations.map((element, idx)=> {
                                                    return <Chip
                                                        key={`specialization${idx}`}
                                                        className={classesOrder.chip}
                                                        onClick={()=>{
                                                            setSubcategory(element.subcategory)
                                                        }}
                                                        color={subcategory===element.subcategory?'primary':'default'}
                                                        label={data.subcategoriesById[element.subcategory]}
                                                    />
                                                }
                                            )
                                        }
                                    </div>
                                    :
                                    null
                        }
                    </div>
                    :
                    null
            }
            <div className={classesPageList.page}>
                {
                    list?list.map((element, idx)=> {
                        if (element) {
                                if (idx<=data.limit)
                                    return <CardOrder list={list} my={authenticated&&page===0} element={element}/>
                                else
                                    return (
                                        <LazyLoad scrollContainer={'.App-body'} key={element._id} height={height}
                                                  offset={[height, 0]} debounce={0} once={true}
                                                  placeholder={<CardPlaceholder height={height}/>}>
                                            <CardOrder list={list} my={authenticated&&page===0} element={element}/>
                                        </LazyLoad>
                                    )
                            }
                        }
                    ):null
                }
            </div>
            {
                page===0&&profile.role==='client'?
                    <Link href='/order/[id]' as={'/order/new'}>
                        <Button
                            variant='contained'
                            color='primary'
                            className={classesCategory.cardAO}
                            startIcon={<AddIcon />}
                        >
                            ?????????????? ??????????
                        </Button>
                    </Link>
                    :
                    profile.specializations&&!profile.specializations.length?
                    <Link href='/application/[id]' as={'/application/new'}>
                        <Button
                            variant='contained'
                            color='primary'
                            className={classesCategory.cardAO}
                        >
                            ?????????? ????????????????????????
                        </Button>
                    </Link>
                        :
                        !authenticated?
                            <Button
                                onClick={()=>{
                                    setMiniDialog('????????', <Sign/>)
                                    showMiniDialog(true)
                                }}
                                variant='contained'
                                color='primary'
                                className={classesCategory.cardAO}
                            >
                                ?????????? ????????????????????????
                            </Button>
                            :
                            profile.role==='admin'&&!router.query.user?
                                <Button
                                    onClick={async ()=>{
                                        setMiniDialog('????????????', <Filter
                                            categories={data.categories}
                                            type='????????????'
                                            category={category}
                                            setCategory={setCategory}
                                            subcategory={subcategory}
                                            setSubcategory={setSubcategory}
                                            dateStart={dateStart}
                                            setDateStart={setDateStart}
                                            dateEnd={dateEnd}
                                            setDateEnd={setDateEnd}
                                        />)
                                        showMiniDialog(true)
                                    }}
                                    variant='contained'
                                    color='primary'
                                    className={classesCategory.cardAO}
                                >
                                    ????????????
                                </Button>
                                :
                                null
            }
        </App>
    )
})

Orders.getInitialProps = async function(ctx) {
    await initialApp(ctx)
    if('manager'===ctx.store.getState().user.profile.role)
        if(ctx.res) {
            ctx.res.writeHead(302, {
                Location: '/'
            })
            ctx.res.end()
        } else
            Router.push('/')
    let my = ctx.store.getState().user.authenticated&&(!(ctx.store.getState().user.profile.specializations&&ctx.store.getState().user.profile.specializations.length)||ctx.query.page==0)
    let limit
    if(process.browser&&sessionStorage.scrollPostionLimit)
        limit = parseInt(sessionStorage.scrollPostionLimit)
    let subcategories = await getSubcategories({compressed: true}, ctx.req?await getClientGqlSsr(ctx.req):undefined), subcategoriesById = {}
    for(let i=0; i<subcategories.length; i++) {
        subcategoriesById[subcategories[i]._id] = subcategories[i].name
    }
    return {
        data: {
            ...'admin'===ctx.store.getState().user.profile.role?{categories: await getCategories({compressed: true}, ctx.req?await getClientGqlSsr(ctx.req):undefined)}:{},
            subcategoriesById,
            list: await getOrders({skip: 0, ...my?{my, status: ctx.store.getState().app.filter}:{}, user: ctx.query.user, limit}, ctx.req?await getClientGqlSsr(ctx.req):undefined),
            count: /*ctx.store.getState().user.profile.role==='client'||ctx.query.user?*/await getOrdersCount({user: ctx.query.user}, ctx.req?await getClientGqlSsr(ctx.req):undefined)/*:[]*/,
            limit
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
        mini_dialogActions: bindActionCreators(mini_dialogActions, dispatch),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Orders);