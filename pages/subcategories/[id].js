import Head from 'next/head';
import React, {useState, useRef, useEffect} from 'react';
import App from '../../layouts/App';
import { connect } from 'react-redux'
import stylePageList from '../../src/styleMUI/list'
import styleCategory from '../../src/styleMUI/other/category'
import { urlMain } from '../../redux/constants/other'
import initialApp from '../../src/initialApp'
import LazyLoad from 'react-lazyload';
import CardPlaceholder from '../../components/CardPlaceholder'
import CardSubcategory from '../../components/CardSubcategory'
import Link from 'next/link';
import * as mini_dialogActions from '../../redux/actions/mini_dialog'
import { bindActionCreators } from 'redux'
import { getCategory } from '../../src/gql/category'
import { getSubcategories, getSubcategoriesCount, getSearchWordsSubcategories } from '../../src/gql/subcategory'
import { forceCheck } from 'react-lazyload';
import { getClientGqlSsr } from '../../src/getClientGQL'
import { useRouter } from 'next/router';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import Sign from '../../components/dialog/Sign'
import Chip from '@material-ui/core/Chip';
import styleOrder from '../../src/styleMUI/other/order'
import * as appActions from '../../redux/actions/app'
import SearchIcon from '@material-ui/icons/Search';
const height = 115
const width = 115

const Subcategories = React.memo((props) => {
    const classesPageList = stylePageList();
    const classesCategory = styleCategory();
    const { setMiniDialog, showMiniDialog } = props.mini_dialogActions;
    const { data } = props;
    const { search } = props.app;
    const { profile, authenticated } = props.user;
    const classesOrder = styleOrder();
    const { setSearch } = props.appActions;
    let [list, setList] = useState(data.list);
    let [category] = useState(data.category?data.category:{});
    let [count, setCount] = useState(data.count);
    const router = useRouter();
    const initialRender = useRef(true);
    let [searchTimeOut, setSearchTimeOut] = useState(null);
    const getList = async ()=>{
        if(category) {
            setList((await getSubcategories({search, skip: 0, category: category._id})));
            setCount(await getSubcategoriesCount({search, category: category._id}));
            (document.getElementsByClassName('App-body'))[0].scroll({top: 0, left: 0, behavior: 'instant'});
            forceCheck();
            paginationWork.current = true
        }
    }
    let paginationWork = useRef(true);
    const checkPagination = async()=>{
        if(paginationWork.current&&!initialRender.current&&category){
            let addedList = await getSubcategories({search, skip: list.length, category: category._id})
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
    return (
        <App pageName={category?category.name:'Ничего не найдено'} searchShow={'Опишите задачу...'} paginationWork={paginationWork} checkPagination={checkPagination}>
            <Head>
                <title>{category?category.name:'Ничего не найдено'}</title>
                <meta name='description' content='OPUS.KG' />
                <meta property='og:title' content={category?category.name:'Ничего не найдено'} />
                <meta property='og:description' content='OPUS.KG' />
                <meta property='og:type' content='website' />
                <meta property='og:image' content={`${urlMain}/static/512x512.png`} />
                <meta property='og:url' content={`${urlMain}/subcategories/${router.query.id}`} />
                <link rel='canonical' href={`${urlMain}/subcategories/${router.query.id}`}/>
            </Head>
            {
                data.searchWords&&data.searchWords.length?
                    <div className={classesOrder.divChip} style={{paddingTop: 72}}>
                        {
                            data.searchWords.map((element, idx)=> {
                                    if(element.includes(search))
                                        return <Chip
                                            key={`searchWords${idx}`}
                                            color={search===element?'primary':'default'}
                                            className={classesOrder.chip}
                                            onClick={()=>{
                                                setSearch(element)
                                            }}
                                            label={element}
                                        />
                                }
                            )
                        }
                    </div>
                    :
                    null
            }
            <div className={classesPageList.page} style={{paddingTop: 5, ...profile.role==='admin'?{gap: '10px'}:{gap: '5px'}}}>
                {
                    profile.role==='admin'?
                        <CardSubcategory list={list} category={category._id} setList={setList}/>
                        :
                            null
                }
                {
                    list?list.map((element, idx)=> {
                        return(
                            <LazyLoad scrollContainer={'.App-body'} key={element._id} height={height} offset={[height, 0]} debounce={0} once={true}  placeholder={<CardPlaceholder width={width} height={height}/>}>
                                <CardSubcategory category={category._id} list={list} idx={idx} element={element} setList={setList}/>
                            </LazyLoad>
                        )}
                    ):null
                }
                {
                    profile.role==='admin'?
                        <div className='count'>
                            {`Всего: ${count}`}
                        </div>
                        :
                        authenticated?
                            <div className={classesCategory.cardAOW}>
                                <Link
                                    href={{
                                        pathname: '/application/[id]',
                                        query: {category: router.query.id}
                                    }}
                                    as={
                                        `/application/new?category=${router.query.id}`
                                    }
                                >
                                    <Button
                                        style={{width: 174}}
                                        variant='contained'
                                        color='primary'
                                        startIcon={<SearchIcon/>}
                                    >
                                        Найти работу
                                    </Button>
                                </Link>
                                <Link
                                    href={{
                                        pathname: '/order/[id]',
                                        query: {category: router.query.id}
                                    }}
                                    as={
                                        `/order/new?category=${router.query.id}`
                                    }
                                >
                                    <Button
                                        style={{width: 174}}
                                        variant='contained'
                                        color='primary'
                                        startIcon={<AddIcon />}
                                    >
                                        Создать заказ
                                    </Button>
                                </Link>
                            </div>
                            :
                            <div className={classesCategory.cardAOW}>
                                <Button
                                    color='primary'
                                    variant='contained'
                                    style={{width: 174}}
                                    startIcon={<SearchIcon/>}
                                    onClick={()=>{
                                        setMiniDialog('', <Sign/>)
                                        showMiniDialog(true)
                                    }}
                                >
                                    Найти работу
                                </Button>
                                <Button
                                    color='primary'
                                    variant='contained'
                                    style={{width: 174}}
                                    startIcon={<AddIcon/>}
                                    onClick={()=>{
                                        setMiniDialog('', <Sign/>)
                                        showMiniDialog(true)
                                    }}
                                >
                                    Создать заказ
                                </Button>
                            </div>
                }
            </div>
        </App>
    )
})

Subcategories.getInitialProps = async function(ctx) {
    await initialApp(ctx)
    return {
        data: {
            list: await getSubcategories({category: ctx.query.id}, ctx.req?await getClientGqlSsr(ctx.req):undefined),
            count: await getSubcategoriesCount({category: ctx.query.id}, ctx.req?await getClientGqlSsr(ctx.req):undefined),
            category: await getCategory({_id: ctx.query.id}, ctx.req?await getClientGqlSsr(ctx.req):undefined),
            searchWords: await getSearchWordsSubcategories({category: ctx.query.id}, ctx.req?await getClientGqlSsr(ctx.req):undefined)
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
        appActions: bindActionCreators(appActions, dispatch),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Subcategories);