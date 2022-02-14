import Head from 'next/head';
import React, {useState, useRef, useEffect} from 'react';
import App from '../../layouts/App';
import { connect } from 'react-redux'
import stylePageList from '../../src/styleMUI/list'
import styleCategory from '../../src/styleMUI/other/category'
import styleSubcategory from '../../src/styleMUI/other/subcategory'
import { urlMain } from '../../redux/constants/other'
import initialApp from '../../src/initialApp'
import LazyLoad from 'react-lazyload';
import CardPlaceholder from '../../components/CardPlaceholder'
import CardSpecialist from '../../components/CardSpecialist'
import Link from 'next/link';
import * as mini_dialogActions from '../../redux/actions/mini_dialog'
import { bindActionCreators } from 'redux'
import { getSubcategory, getSubcategories } from '../../src/gql/subcategory'
import { getUsers, getUsersCount } from '../../src/gql/user'
import { forceCheck } from 'react-lazyload';
import { getClientGqlSsr } from '../../src/getClientGQL'
import { useRouter } from 'next/router';
import Button from '@material-ui/core/Button';
import Sign from '../../components/dialog/Sign'
import AddIcon from '@material-ui/icons/Add';
const height = 150

const Specialists = React.memo((props) => {
    const classesPageList = stylePageList();
    const classesCategory = styleCategory();
    const classesSubcategory = styleSubcategory();
    const { data } = props;
    const { search } = props.app;
    const { authenticated } = props.user;
    const { setMiniDialog, showMiniDialog } = props.mini_dialogActions;
    let [list, setList] = useState(data.list);
    let [subcategory] = useState(data.subcategory);
    let [count, setCount] = useState(data.count);
    const router = useRouter();
    const initialRender = useRef(true);
    let [searchTimeOut, setSearchTimeOut] = useState(null);
    const getList = async ()=>{
        if(subcategory) {
            setList(await getUsers({ skip: 0, search, category: subcategory.category._id, subcategory: subcategory._id}));
            setCount(await getUsersCount({search, category: subcategory.category._id, subcategory: subcategory._id}));
            (document.getElementsByClassName('App-body'))[0].scroll({top: 0, left: 0, behavior: 'instant'});
            forceCheck();
            paginationWork.current = true
        }
    }
    let paginationWork = useRef(true);
    const checkPagination = async()=>{
        if(paginationWork.current&&!initialRender.current&&subcategory){
            let addedList = await getUsers({search, skip: list.length, category: subcategory.category._id, subcategory: subcategory._id})
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
        <App pageName={subcategory?subcategory.name:'Ничего не найдено'} searchShow={'Поиск исполнителя...'} paginationWork={paginationWork} checkPagination={checkPagination} setGeo={setGeo}>
            <Head>
                <title>{subcategory?subcategory.name:'Ничего не найдено'}</title>
                <meta name='description' content='OPUS.KG' />
                <meta property='og:title' content={subcategory?subcategory.name:'Ничего не найдено'} />
                <meta property='og:description' content='OPUS.KG' />
                <meta property='og:type' content='website' />
                <meta property='og:image' content={`${urlMain}/static/512x512.png`} />
                <meta property='og:url' content={`${urlMain}/specialists/${router.query.id}`} />
                <link rel='canonical' href={`${urlMain}/specialists/${router.query.id}`}/>
            </Head>
            <div className={classesPageList.page} style={{paddingTop: 95}}>
                {
                    subcategory?
                        <>
                        <div className={classesSubcategory.divCount}>
                            Исполнителей в подкатегории:&nbsp;<b>{count}</b>
                        </div>
                        {
                            list?list.map((element, idx)=> {
                                if(idx<=data.limit)
                                    return <CardSpecialist geo={geo} list={list} subcategoriesById={data.subcategoriesById} element={element}/>
                                else
                                    return(
                                        <LazyLoad scrollContainer={'.App-body'} key={element._id} height={height} offset={[height, 0]} debounce={0} once={true}  placeholder={<CardPlaceholder height={height}/>}>
                                            <CardSpecialist geo={geo} list={list} subcategoriesById={data.subcategoriesById} element={element}/>
                                        </LazyLoad>
                                    )}
                            ):null
                        }
                        {
                            authenticated?
                                <Link
                                    href={{
                                        pathname: '/order/[id]',
                                        query: {category: subcategory.category._id, subcategory: subcategory._id}
                                    }}
                                    as={
                                        `/order/new?category=${subcategory.category._id}&subcategory=${subcategory._id}`
                                    }
                                >
                                    <Button
                                        variant='contained'
                                        color='primary'
                                        className={classesCategory.cardAO}
                                        startIcon={<AddIcon />}
                                    >
                                        Создать заказ
                                    </Button>
                                </Link>
                                :
                                <Button
                                    variant='contained'
                                    color='primary'
                                    className={classesCategory.cardAO}
                                    startIcon={<AddIcon />}
                                    onClick={()=>{
                                        setMiniDialog('', <Sign/>)
                                        showMiniDialog(true)
                                    }}
                                >
                                    Создать заказ
                                </Button>
                        }
                        </>
                        :
                        null
                }
            </div>
        </App>
    )
})

Specialists.getInitialProps = async function(ctx) {
    await initialApp(ctx)
    let subcategories = await getSubcategories({}, ctx.req?await getClientGqlSsr(ctx.req):undefined), subcategoriesById = {}
    for(let i=0; i<subcategories.length; i++) {
        subcategoriesById[subcategories[i]._id] = subcategories[i].name
    }
    let subcategory = await getSubcategory({_id: ctx.query.id}, ctx.req?await getClientGqlSsr(ctx.req):undefined)
    let limit
    if(process.browser&&sessionStorage.scrollPostionLimit)
        limit = parseInt(sessionStorage.scrollPostionLimit)
    return {
        data: {
            limit,
            list:
                subcategory?
                    await getUsers({category: subcategory.category._id, subcategory: ctx.query.id, skip: 0, limit}, ctx.req?await getClientGqlSsr(ctx.req):undefined)
                    :
                    [],
            subcategoriesById,
            count: subcategory?
                await getUsersCount({category: subcategory.category._id, subcategory: ctx.query.id}, ctx.req?await getClientGqlSsr(ctx.req):undefined)
                :
                0,
            subcategory
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
        mini_dialogActions: bindActionCreators(mini_dialogActions, dispatch),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Specialists);