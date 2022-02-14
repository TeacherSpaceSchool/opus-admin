import Head from 'next/head';
import React, { useState, useRef } from 'react';
import App from '../layouts/App';
import { connect } from 'react-redux'
import stylePageList from '../src/styleMUI/list'
import styleBonus from '../src/styleMUI/other/bonus'
import { urlMain } from '../redux/constants/other'
import initialApp from '../src/initialApp'
import CardBonus from '../components/CardBonus'
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import { getBonus, getBonusHistory } from '../src/gql/bonus'
import { getClientGqlSsr } from '../src/getClientGQL'
import LazyLoad from 'react-lazyload';
import CardPlaceholder from '../components/CardPlaceholder'
import Router from 'next/router'
import IconButton from '@material-ui/core/IconButton';
import ShareleIcon from '@material-ui/icons/Share';
import Button from '@material-ui/core/Button';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
const height = 100

const User = React.memo((props) => {
    const classesPageList = stylePageList();
    const classesBonus = styleBonus();
    const { data } = props;
    const { isMobileApp } = props.app;
    let [list, setList] = useState(data.list);
    let paginationWork = useRef(true);
    const checkPagination = async()=>{
        if(paginationWork.current){
            let addedList = await getBonusHistory({skip: list.length})
            if(addedList.length>0)
                setList([...list, ...addedList])
            else
                paginationWork.current = false
        }
    }
    return (
        <App pageName={data.bonus?'Бонусы':'Ничего не найдено'} paginationWork={paginationWork} checkPagination={checkPagination}>
            <Head>
                <title>{data.bonus?'Бонусы':'Ничего не найдено'}</title>
                <meta name='description' content='OPUS.KG' />
                <meta property='og:title' content={data.bonus?'Бонусы':'Ничего не найдено'} />
                <meta property='og:description' content='OPUS.KG' />
                <meta property='og:type' content='website' />
                <meta property='og:avatar' content={`${urlMain}/static/512x512.png`} />
                <meta property='og:url' content={`${urlMain}/bonus`} />
                <link rel='canonical' href={`${urlMain}/bonus`}/>
            </Head>
            <div className={classesPageList.page} style={{paddingTop: 0}}>
                {
                    data.bonus?
                        <>
                        <Card className={classesBonus.divBonus}>
                            <CardContent>
                                <IconButton className={classesPageList.backArrow} onClick={()=>Router.back()}>
                                    <ArrowBackIcon/>
                                </IconButton>
                                <div className={classesBonus.title}>
                                    Мой промокод
                                </div>
                                <div className={classesBonus.value}>
                                    {
                                        isMobileApp?
                                            <>
                                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                            {data.bonus.code}
                                            &nbsp;
                                            <IconButton onClick={()=>{
                                                navigator.share({
                                                    url: `${urlMain}?code=${data.bonus.code}`
                                                })
                                            }}>
                                                <ShareleIcon/>
                                            </IconButton>
                                            </>
                                            :
                                            data.bonus.code
                                    }
                                </div>
                                <div className={classesBonus.title}>
                                    Всего бонусов
                                </div>
                                <div className={classesBonus.value}>
                                    {data.bonus.count}
                                </div>
                                <Button style={{width: '100%'}} onClick={async()=>{
                                    window.open('/static/application.pdf','_blank')
                                }} color='primary'>
                                    Как использовать бонусы?
                                </Button>
                            </CardContent>
                        </Card>
                        {
                            list?list.map((element)=> {
                                return(
                                    <LazyLoad scrollContainer={'.App-body'} key={element._id} height={height} offset={[height, 0]} debounce={0} once={true}  placeholder={<CardPlaceholder height={height}/>}>
                                        <CardBonus element={element}/>
                                    </LazyLoad>
                                )}
                            ):null
                        }
                        </>
                        :
                        null
                }
            </div>
        </App>
    )
})

User.getInitialProps = async function(ctx) {
    await initialApp(ctx)

    if(!ctx.store.getState().user.profile.role)
        if(ctx.res) {
            ctx.res.writeHead(302, {
                Location: '/other'
            })
            ctx.res.end()
        } else
            Router.push('/other')

    return {
        data: {
            bonus: await getBonus({}, ctx.req?await getClientGqlSsr(ctx.req):undefined),
            list: await getBonusHistory({skip: 0}, ctx.req?await getClientGqlSsr(ctx.req):undefined)
        }
    };
};

function mapStateToProps (state) {
    return {
        app: state.app,
    }
}

export default connect(mapStateToProps)(User);