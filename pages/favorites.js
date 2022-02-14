import Head from 'next/head';
import React, {useState, useRef} from 'react';
import App from '../layouts/App';
import { connect } from 'react-redux'
import stylePageList from '../src/styleMUI/list'
import { urlMain } from '../redux/constants/other'
import initialApp from '../src/initialApp'
import LazyLoad from 'react-lazyload';
import CardPlaceholder from '../components/CardPlaceholder'
import CardSpecialist from '../components/CardSpecialist'
import Router from 'next/router'
import { getUsers } from '../src/gql/user'
import { getClientGqlSsr } from '../src/getClientGQL'
import { getSubcategories } from '../src/gql/subcategory'
const height = 150

const Subcategories = React.memo((props) => {
    const classesPageList = stylePageList();
    const { data } = props;
    let [list, setList] = useState(data.specialists);
    let paginationWork = useRef(true);
    const checkPagination = async()=>{
        if(paginationWork.current){
            let addedList = await getUsers({skip: list.length, favorite: true})
            if(addedList.length>0)
                setList([...list, ...addedList])
            else
                paginationWork.current = false
        }
    }
    return (
        <App backBarShow pageName='Избранные исполнители' paginationWork={paginationWork} checkPagination={checkPagination}>
            <Head>
                <title>Избранные исполнители</title>
                <meta name='description' content='OPUS.KG' />
                <meta property='og:title' content='Избранные исполнители' />
                <meta property='og:description' content='OPUS.KG' />
                <meta property='og:type' content='website' />
                <meta property='og:image' content={`${urlMain}/static/512x512.png`} />
                <meta property='og:url' content={`${urlMain}/favorites`} />
                <link rel='canonical' href={`${urlMain}/favorites`}/>
            </Head>
            <div className={classesPageList.page} style={{paddingTop: 58}}>
                {
                    list?list.map((element)=> {
                        return(
                            <LazyLoad scrollContainer={'.App-body'} key={element._id} height={height} offset={[height, 0]} debounce={0} once={true}  placeholder={<CardPlaceholder height={height}/>}>
                                <CardSpecialist subcategoriesById={data.subcategoriesById} element={element}/>
                            </LazyLoad>
                        )}
                    ):null
                }
            </div>
        </App>
    )
})

Subcategories.getInitialProps = async function(ctx) {
    await initialApp(ctx)
    if('client'!==ctx.store.getState().user.profile.role)
        if(ctx.res) {
            ctx.res.writeHead(302, {
                Location: '/'
            })
            ctx.res.end()
        } else
            Router.push('/')

    let subcategories = await getSubcategories({}, ctx.req?await getClientGqlSsr(ctx.req):undefined), subcategoriesById = {}
    for(let i=0; i<subcategories.length; i++) {
        subcategoriesById[subcategories[i]._id] = subcategories[i].name
    }
    return {
        data: {
            subcategoriesById,
            specialists: await getUsers({favorite: true, skip: 0}, ctx.req?await getClientGqlSsr(ctx.req):undefined),
        }
    };
};

function mapStateToProps (state) {
    return {
        user: state.user,
        app: state.app,
    }
}

export default connect(mapStateToProps)(Subcategories);