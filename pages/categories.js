import Head from 'next/head';
import React, { useState, useRef, useEffect } from 'react';
import App from '../layouts/App';
import { connect } from 'react-redux'
import stylePageList from '../src/styleMUI/list'
import styleCategory from '../src/styleMUI/other/category'
import { urlMain } from '../redux/constants/other'
import initialApp from '../src/initialApp'
import LazyLoad from 'react-lazyload';
import CardPlaceholder from '../components/CardPlaceholder'
import CardCategory from '../components/CardCategory'
import Link from 'next/link';
import * as mini_dialogActions from '../redux/actions/mini_dialog'
import { bindActionCreators } from 'redux'
import { getCategories, getCategoriesCount, getSearchWordsCategories } from '../src/gql/category'
import { getClientGqlSsr } from '../src/getClientGQL'
import { forceCheck } from 'react-lazyload';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import SearchIcon from '@material-ui/icons/Search';
import Sign from '../components/dialog/Sign'
import Chip from '@material-ui/core/Chip';
import styleOrder from '../src/styleMUI/other/order'
import * as appActions from '../redux/actions/app'
const height = 115
const width = 115

const Categories = React.memo((props) => {
    const classesPageList = stylePageList();
    const classesCategory = styleCategory();
    const { data } = props;
    const { search } = props.app;
    const { setMiniDialog, showMiniDialog } = props.mini_dialogActions;
    const { setSearch } = props.appActions;
    const classesOrder = styleOrder();
    const { profile, authenticated } = props.user;
    const initialRender = useRef(true);
    let [searchTimeOut, setSearchTimeOut] = useState(null);
    let [list, setList] = useState(data.list);
    let [count, setCount] = useState(data.count);
    const getList = async ()=>{
        setList((await getCategories({search, skip: 0})));
        setCount(await getCategoriesCount({search}));
        (document.getElementsByClassName('App-body'))[0].scroll({top: 0, left: 0, behavior: 'instant' });
        forceCheck();
        paginationWork.current = true
    }
    let paginationWork = useRef(true);
    const checkPagination = async()=>{
        if(paginationWork.current&&!initialRender.current){
            let addedList = await getCategories({skip: list.length, search})
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
                if(searchTimeOut)
                    clearTimeout(searchTimeOut)
                searchTimeOut = setTimeout(async()=>{
                    await getList()
                }, 500)
                setSearchTimeOut(searchTimeOut)
            }
        })()
    },[ search])
    return (
        <App pageName='Категории' searchShow={'Опишите задачу...'} paginationWork={paginationWork} checkPagination={checkPagination}>
            <Head>
                <title>Категории</title>
                <meta name='description' content='OPUS.KG' />
                <meta property='og:title' content='Категории' />
                <meta property='og:description' content='OPUS.KG' />
                <meta property='og:type' content='website' />
                <meta property='og:image' content={`${urlMain}/static/512x512.png`} />
                <meta property='og:url' content={`${urlMain}/categories`} />
                <link rel='canonical' href={`${urlMain}/categories`}/>
            </Head>
            {
                data.searchWords&&data.searchWords.length?
                    <div className={classesOrder.stickyDiv}>
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
                    </div>
                    :
                    null
            }
            <div className={classesPageList.page} style={{paddingTop: 5, ...profile.role==='admin'?{gap: '10px'}:{gap: '5px'}}}>
                {
                    profile.role==='admin'?
                        <CardCategory list={list} setList={setList}/>
                        :
                        null
                }
                {
                    list?list.map((element, idx)=> {
                        return(
                            <LazyLoad scrollContainer={'.App-body'} key={element._id} height={height} offset={[height, 0]} debounce={0} once={true}  placeholder={<CardPlaceholder height={height} width={width}/>}>
                                <CardCategory list={list} idx={idx} element={element} setList={setList}/>
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
                                <Link  href='/application/[id]' as={'/application/new'}>
                                    <Button
                                        color='primary'
                                        variant='contained'
                                        style={{width: 174}}
                                        startIcon={<SearchIcon/>}
                                    >
                                        Найти работу
                                    </Button>
                                </Link>
                                <Link href={'/order/[id]'} as={'/order/new'}>
                                    <Button
                                        color='primary'
                                        variant='contained'
                                        style={{width: 174}}
                                        startIcon={<AddIcon/>}
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

Categories.getInitialProps = async function(ctx) {
    await initialApp(ctx)
    return {
        data: {
            list: await getCategories({skip: 0}, ctx.req?await getClientGqlSsr(ctx.req):undefined),
            count: await getCategoriesCount({}, ctx.req?await getClientGqlSsr(ctx.req):undefined),
            searchWords: await getSearchWordsCategories(ctx.req?await getClientGqlSsr(ctx.req):undefined)
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

export default connect(mapStateToProps, mapDispatchToProps)(Categories);