import Head from 'next/head';
import React, { useState, useEffect, useRef } from 'react';
import App from '../layouts/App';
import { connect } from 'react-redux'
import { getComplaints, getComplaintsCount } from '../src/gql/complaint'
import pageListStyle from '../src/styleMUI/list'
import CardComplaints from '../components/CardComplaint'
import { urlMain } from '../redux/constants/other'
import LazyLoad from 'react-lazyload';
import { forceCheck } from 'react-lazyload';
import CardComplaintsPlaceholder from '../components/CardPlaceholder'
import { getClientGqlSsr } from '../src/getClientGQL'
import initialApp from '../src/initialApp'
const filters = [
    {
        name: 'Все',
        value: ''
    },
    {
        name: 'Активный',
        value: 'активный'
    }
]
const height = 160

const Complaints = React.memo((props) => {
    const classes = pageListStyle();
    const { profile } = props.user;
    const { data } = props;
    let [list, setList] = useState(data.list?data.list:[]);
    const initialRender = useRef(true);
    let [count, setCount] = useState(data.count);
    const { filter } = props.app;
    let paginationWork = useRef(true)
    const checkPagination = async()=>{
        if(paginationWork.current&&!initialRender.current){
            let addedList = await getComplaints({filter: filter, skip: list.length})
            if(addedList.length>0)
                setList([...list, ...addedList])
            else
                paginationWork.current = false
        }
    }
    const getList = async()=>{
        setList(await getComplaints({filter: filter, skip: 0}))
        setCount(await getComplaintsCount({filter: filter,}));
        (document.getElementsByClassName('App-body'))[0].scroll({top: 0, left: 0, behavior: 'instant' });
        forceCheck()
        paginationWork.current = true
    }
    useEffect(()=>{
        (async () => {
            if(!initialRender.current)
                await getList()
            else
                initialRender.current = false
        })()
    },[filter])
    return (
        <App organizations backBarShow paginationWork={paginationWork} checkPagination={checkPagination} setList={setList} list={list} filters={filters} pageName='Жалобы и предложения'>
            <Head>
                <title>Жалобы и предложения</title>
                <meta name='description' content='OPUS.KG' />
                <meta property='og:title' content='Жалобы и предложения' />
                <meta property='og:description' content='OPUS.KG' />
                <meta property='og:type' content='website' />
                <meta property='og:image' content={`${urlMain}/static/512x512.png`} />
                <meta property='og:url' content={`${urlMain}/complaints`} />
                <link rel='canonical' href={`${urlMain}/complaints`}/>
            </Head>
            <div className={classes.page} style={{paddingTop: 58}}>
                {
                    'admin'!==profile.role?
                        <CardComplaints list={list} setList={setList}/>
                        :
                        null
                }
                {
                    list?list.map((element, idx)=> {
                        return(
                            <LazyLoad scrollContainer={'.App-body'} key={element._id} height={height} offset={[height, 0]} debounce={0} once={true}  placeholder={<CardComplaintsPlaceholder height={height}/>}>
                                <CardComplaints list={list} idx={idx} element={element} setList={setList}/>
                            </LazyLoad>
                        )}
                    ):null
                }
            </div>
            {
                profile.role?
                    <div className='count'>
                        {
                            `Всего: ${count}`
                        }
                    </div>
                    :
                    null
            }
        </App>
    )
})

Complaints.getInitialProps = async function(ctx) {
    await initialApp(ctx)
    return {
        data: {
            list: await getComplaints({skip: 0, filter: ''}, ctx.req?await getClientGqlSsr(ctx.req):undefined),
            count: await getComplaintsCount({filter: ''}, ctx.req?await getClientGqlSsr(ctx.req):undefined),
        }
    };
};

function mapStateToProps (state) {
    return {
        app: state.app,
        user: state.user,
    }
}

export default connect(mapStateToProps)(Complaints);