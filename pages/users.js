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
import Chip from '@material-ui/core/Chip';
import { getUsers, getUsersCount } from '../src/gql/user'
import { forceCheck } from 'react-lazyload';
import { getClientGqlSsr } from '../src/getClientGQL'
import Router from 'next/router'
import { getCategories } from '../src/gql/category'
import styleSubcategory from '../src/styleMUI/other/subcategory'
import Avatar from '@material-ui/core/Avatar';
import { getSubcategories } from '../src/gql/subcategory'
import { getCity } from '../src/lib'
const height = 230

const Users = React.memo((props) => {
    const classesPageList = stylePageList();
    const { data } = props;
    const { search, isMobileApp } = props.app;
    let [list, setList] = useState(data.list);
    const classesSubcategory = styleSubcategory();
    let [count, setCount] = useState(data.count);
    let [category, setCategory] = useState(null);
    const changeCategory = useRef(false);
    const initialRender = useRef(true);
    let [searchTimeOut, setSearchTimeOut] = useState(null);
    const getList = async ()=>{
        setList(await getUsers({search, skip: 0, ...category?{category: category._id}:{}}));
        setCount(await getUsersCount({search, ...category?{category: category._id}:{}}));
        (document.getElementsByClassName('App-body'))[0].scroll({top: 0, left: 0, behavior: 'instant'});
        forceCheck();
        paginationWork.current = true
    }
    let paginationWork = useRef(true)
    const checkPagination = async()=>{
        if(paginationWork.current&&!initialRender.current){
            let addedList = await getUsers({search, skip: list.length, ...category?{category: category._id}:{}})
            if(addedList.length>0)
                setList([...list, ...addedList])
            else
                paginationWork.current = false
        }
    }
    useEffect(()=>{
        (async()=>{
            if(!initialRender.current) {
                await getList()
                changeCategory.current = false
            }
        })()
    },[category])
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
        <App pageName='Пользователи' searchShow paginationWork={paginationWork} checkPagination={checkPagination} setGeo={setGeo}>
            <Head>
                <title>Пользователи</title>
                <meta name='description' content='OPUS.KG' />
                <meta property='og:title' content='Пользователи' />
                <meta property='og:description' content='OPUS.KG' />
                <meta property='og:type' content='website' />
                <meta property='og:image' content={`${urlMain}/static/512x512.png`} />
                <meta property='og:url' content={`${urlMain}/users`} />
                <link rel='canonical' href={`${urlMain}/users`}/>
            </Head>
            <div className={classesPageList.page} style={{paddingTop: isMobileApp?110:130}}>
                <div className={classesSubcategory.divChip} style={isMobileApp?{'&::-webkit-scrollbar': {display: 'none'}}:{}}>
                      <Chip
                        className={classesSubcategory.chip}
                        onClick={()=>{
                            if(!changeCategory.current&&category) {
                                changeCategory.current = true
                                setCategory(null)
                            }
                        }}
                        color={!category?'primary':'default'}
                        label='Все'
                    />
                    {process.browser&&data.categories?data.categories.map((element, idx)=><Chip
                            key={`categorie${idx}`}
                            onClick={()=>{
                                if(!changeCategory.current) {
                                    changeCategory.current = true;
                                    setCategory(element);
                                }
                            }}
                            color={category&&category.name===element.name?'primary':'default'}
                            className={classesSubcategory.chip}
                            label={element.name}
                        />):null}
                </div>
                {
                    list?list.map((element, idx)=> {
                        if(idx<=data.limit)
                            return <CardUser category={category} list={list} geo={geo} subcategoriesById={data.subcategoriesById} element={element}/>
                        else
                            return <LazyLoad scrollContainer={'.App-body'} key={element._id} height={height} offset={[height, 0]} debounce={0} once={true}  placeholder={<CardPlaceholder height={height}/>}>
                                <CardUser category={category} list={list} geo={geo} subcategoriesById={data.subcategoriesById} element={element}/>
                            </LazyLoad>
                    }):null
                }
                <div className='count'>
                    {`Всего: ${count}`}
                </div>
            </div>
        </App>
    )
})

Users.getInitialProps = async function(ctx) {
    await initialApp(ctx)
    if('admin'!==ctx.store.getState().user.profile.role)
        if(ctx.res) {
            ctx.res.writeHead(302, {
                Location: '/'
            })
            ctx.res.end()
        } else
            Router.push('/')
    let subcategories = await getSubcategories({compressed: true}, ctx.req?await getClientGqlSsr(ctx.req):undefined), subcategoriesById = {}
    for(let i=0; i<subcategories.length; i++) {
        subcategoriesById[subcategories[i]._id] = subcategories[i].name
    }
    let limit
    if(process.browser&&sessionStorage.scrollPostionLimit)
        limit = parseInt(sessionStorage.scrollPostionLimit)
    return {
        data: {
            limit,
            subcategoriesById,
            categories: await getCategories({compressed: true}, ctx.req?await getClientGqlSsr(ctx.req):undefined),
            list: await getUsers({skip: 0, limit}, ctx.req?await getClientGqlSsr(ctx.req):undefined),
            count: await getUsersCount({}, ctx.req?await getClientGqlSsr(ctx.req):undefined),
        }
    };
};

function mapStateToProps (state) {
    return {
        user: state.user,
        app: state.app,
    }
}

export default connect(mapStateToProps)(Users);