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
import CardApplication from '../components/CardApplication'
import Link from 'next/link';
import { getApplications, getApplicationsCount } from '../src/gql/application'
import { getClientGqlSsr } from '../src/getClientGQL'
import { forceCheck } from 'react-lazyload';
import styleSubcategory from '../src/styleMUI/other/subcategory'
import Chip from '@material-ui/core/Chip';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import { useRouter } from 'next/router';
const height = 136

const Applications = React.memo((props) => {
    const classesPageList = stylePageList();
    const classesCategory = styleCategory();
    const classesSubcategory = styleSubcategory();
    const router = useRouter();
    const { data } = props;
    const { search } = props.app;
    const { profile } = props.user;
    const initialRender = useRef(true);
    let [searchTimeOut, setSearchTimeOut] = useState(null);
    let [verification, setVerification] = useState(router.query.verification==='1'?true:null);
    let [list, setList] = useState(data.list);
    let [count, setCount] = useState(data.count);
    let [status, setStatus] = useState('');
    const getList = async ()=>{
        setList((await getApplications({search, verification, status, skip: 0})));
        setCount(await getApplicationsCount({search, verification, status}));
        (document.getElementsByClassName('App-body'))[0].scroll({top: 0, left: 0, behavior: 'instant' });
        forceCheck();
        paginationWork.current = true
    }
    let paginationWork = useRef(true);
    const checkPagination = async()=>{
        if(paginationWork.current&&!initialRender.current){
            let addedList = await getApplications({skip: list.length, verification, search, status})
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
            }
        })()
    },[ status, verification])
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
        <App pageName='Заявки на исполнителя' searchShow={profile.role!=='client'} backBarShow={profile.role==='client'} paginationWork={paginationWork} checkPagination={checkPagination}>
            <Head>
                <title>Заявки на исполнителя</title>
                <meta name='description' content='OPUS.KG' />
                <meta property='og:title' content='Заявки на исполнителя' />
                <meta property='og:description' content='OPUS.KG' />
                <meta property='og:type' content='website' />
                <meta property='og:image' content={`${urlMain}/static/512x512.png`} />
                <meta property='og:url' content={`${urlMain}/applications`} />
                <link rel='canonical' href={`${urlMain}/applications`}/>
            </Head>
            <div className={classesPageList.page} style={{paddingTop: profile.role!=='client'?110:58}}>
                {
                    list?list.map((element, idx)=> {
                        if(idx<=data.limit)
                            return <CardApplication element={element} list={list}/>
                        else
                            return(
                            <LazyLoad scrollContainer={'.App-body'} key={element._id} height={height} offset={[height, 0]} debounce={0} once={true}  placeholder={<CardPlaceholder height={height}/>}>
                                <CardApplication element={element} list={list}/>
                            </LazyLoad>
                        )}
                    ):null
                }
                {
                    profile.role!=='client'?
                        <div className={classesSubcategory.divChip} style={{'&::-webkit-scrollbar': {display: 'none'}}}>
                            <Chip
                                avatar={verification?<Avatar>{count[2]}</Avatar>:null}
                                className={classesSubcategory.chip}
                                onClick={()=>{
                                    router.replace(`${router.pathname}`, undefined, { shallow: true })
                                    setVerification(null)
                                }}
                                color={!verification?'primary':'default'}
                                label='заявка'
                            />
                            <Chip
                                avatar={!verification?<Avatar>{count[2]}</Avatar>:null}
                                onClick={()=>{
                                    router.replace(`${router.pathname}?verification=1`, undefined, { shallow: true })
                                    setVerification(true)
                                }}
                                className={classesSubcategory.chip}
                                label='подтверждение'
                                color={verification?'primary':'default'}
                            />
                            <Chip
                                avatar={<Avatar>{count[0]+count[1]}</Avatar>}
                                className={classesSubcategory.chip}
                                onClick={()=>{
                                    setStatus('')
                                }}
                                color={!status?'primary':'default'}
                                label='Все'
                            />
                            <Chip
                                avatar={<Avatar>{count[0]}</Avatar>}
                                onClick={()=>{
                                    if(status!=='активный')
                                        setStatus('активный')
                                }}
                                className={classesSubcategory.chip}
                                label='активный'
                                color={status==='активный'?'primary':'default'}
                            />
                            <Chip
                                avatar={<Avatar>{count[1]}</Avatar>}
                                onClick={()=>{
                                    if(status!=='принят')
                                        setStatus('принят')
                                }}
                                className={classesSubcategory.chip}
                                label='принят'
                                color={status==='принят'?'primary':'default'}
                            />
                        </div>
                        :
                        <Link  href='/application/[id]' as={'/application/new'}>
                            <Button
                                variant='contained'
                                color='primary'
                                className={classesCategory.cardAO}
                                startIcon={<AddIcon />}
                            >
                                Подать заявку
                            </Button>
                        </Link>
                }
            </div>
        </App>
    )
})

Applications.getInitialProps = async function(ctx) {
    await initialApp(ctx)
    let limit
    if(process.browser&&sessionStorage.scrollPostionLimit)
        limit = parseInt(sessionStorage.scrollPostionLimit)
    return {
        data: {
            list: await getApplications({skip: 0, limit, ...ctx.query.verification==='1'?{verification: true}:{}}, ctx.req?await getClientGqlSsr(ctx.req):undefined),
            count: await getApplicationsCount({...ctx.query.verification==='1'?{verification: true}:{}}, ctx.req?await getClientGqlSsr(ctx.req):undefined),
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

export default connect(mapStateToProps)(Applications);