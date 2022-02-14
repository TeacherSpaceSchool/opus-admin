import Head from 'next/head';
import React, {useState, useRef, useEffect} from 'react';
import App from '../layouts/App';
import { connect } from 'react-redux'
import stylePageList from '../src/styleMUI/list'
import { urlMain } from '../redux/constants/other'
import initialApp from '../src/initialApp'
import LazyLoad from 'react-lazyload';
import CardPlaceholder from '../components/CardPlaceholder'
import CardUser from '../components/CardUser'
import Fab from '@material-ui/core/Fab';
import { getUsers, getUsersCount } from '../src/gql/user'
import { forceCheck } from 'react-lazyload';
import { getClientGqlSsr } from '../src/getClientGQL'
import Router from 'next/router'
import AddIcon from '@material-ui/icons/Add';
import Link from 'next/link';
const height = 243

const Employments = React.memo((props) => {
    const classesPageList = stylePageList();
    const { data } = props;
    const { search } = props.app;
    let [list, setList] = useState(data.list);
    let [count, setCount] = useState(data.count);
    const initialRender = useRef(true);
    let [searchTimeOut, setSearchTimeOut] = useState(null);
    const getList = async ()=>{
        setList(await getUsers({search, skip: 0, employment: true}));
        setCount(await getUsersCount({search, employment: true}));
        (document.getElementsByClassName('App-body'))[0].scroll({top: 0, left: 0, behavior: 'instant'});
        forceCheck();
        paginationWork.current = true
    }
    let paginationWork = useRef(true);
    const checkPagination = async()=>{
        if(paginationWork.current&&!initialRender.current){
            let addedList = await getUsers({search, skip: list.length, employment: true})
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
                if (searchTimeOut)
                    clearTimeout(searchTimeOut)
                searchTimeOut = setTimeout(async () => {
                    await getList()
                }, 500)
                setSearchTimeOut(searchTimeOut)
            }
        })()
    },[search])
    const [geo, setGeo] = useState();
    return (
        <App pageName='Сотрудники' searchShow paginationWork={paginationWork} checkPagination={checkPagination} setGeo={setGeo}>
            <Head>
                <title>Сотрудники</title>
                <meta name='description' content='OPUS.KG' />
                <meta property='og:title' content='Сотрудники' />
                <meta property='og:description' content='OPUS.KG' />
                <meta property='og:type' content='website' />
                <meta property='og:image' content={`${urlMain}/static/512x512.png`} />
                <meta property='og:url' content={`${urlMain}/users`} />
                <link rel='canonical' href={`${urlMain}/users`}/>
            </Head>
            <div className={classesPageList.page} style={{paddingTop: 72}}>
                {
                    list?list.map((element, idx)=> {
                        if(idx<=data.limit)
                            return <CardUser employment list={list} geo={geo} element={element}/>
                        else
                            return <LazyLoad scrollContainer={'.App-body'} key={element._id} height={height} offset={[height, 0]} debounce={0} once={true}  placeholder={<CardPlaceholder height={height}/>}>
                                <CardUser employment list={list} geo={geo} element={element}/>
                            </LazyLoad>
                    }):null
                }
                <div className='count'>
                    {`Всего: ${count}`}
                </div>
                <Link href='/employment/[id]' as='/employment/new'>
                    <Fab color='primary' aria-label='add' className={'fab'}>
                        <AddIcon/>
                    </Fab>
                </Link>
            </div>
        </App>
    )
})

Employments.getInitialProps = async function(ctx) {
    await initialApp(ctx)
    if('admin'!==ctx.store.getState().user.profile.role)
        if(ctx.res) {
            ctx.res.writeHead(302, {
                Location: '/'
            })
            ctx.res.end()
        } else
            Router.push('/')
    let limit
    if(process.browser&&sessionStorage.scrollPostionLimit)
        limit = parseInt(sessionStorage.scrollPostionLimit)
    return {
        data: {
            limit,
            list: await getUsers({
                    employment: true,
                    skip: 0,
                    limit
                }, ctx.req?await getClientGqlSsr(ctx.req):undefined),
            count: await getUsersCount({employment: true}, ctx.req?await getClientGqlSsr(ctx.req):undefined),
        }
    };
};

function mapStateToProps (state) {
    return {
        user: state.user,
        app: state.app,
    }
}

export default connect(mapStateToProps)(Employments);