import Head from 'next/head';
import React, { useState, useRef, useEffect } from 'react';
import App from '../../layouts/App';
import { connect } from 'react-redux'
import { getApplication, setApplication, addApplication, deleteApplication } from '../../src/gql/application'
import { getCategories } from '../../src/gql/category'
import { getSubcategories } from '../../src/gql/subcategory'
import stylePage from '../../src/styleMUI/list'
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Input from '@material-ui/core/Input';
import Button from '@material-ui/core/Button';
import {useSwipeable} from 'react-swipeable';
import { bindActionCreators } from 'redux'
import * as mini_dialogActions from '../../redux/actions/mini_dialog'
import * as snackbarActions from '../../redux/actions/snackbar'
import * as appActions from '../../redux/actions/app'
import Remove from '@material-ui/icons/Remove';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import TextField from '@material-ui/core/TextField';
import Confirmation from '../../components/dialog/Confirmation'
import { urlMain } from '../../redux/constants/other'
import { getClientGqlSsr } from '../../src/getClientGQL'
import initialApp from '../../src/initialApp'
import Router from 'next/router'
import { useRouter } from 'next/router';
import { pdDDMMYYHHMM } from '../../src/lib'
import Link from 'next/link';
import Autocomplete from '@material-ui/lab/Autocomplete';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

const Application = React.memo((props) => {
    const classesPage = stylePage();
    const { setMiniDialog, showMiniDialog } = props.mini_dialogActions;
    const { data } = props;
    const { isMobileApp, isApple } = props.app;
    const { profile } = props.user;
    const { showSnackBar } = props.snackbarActions;
    const initialRender = useRef(true);
    const router = useRouter();
    const { setShowLightbox, setImagesLightbox, setIndexLightbox } = props.appActions;
    const [page, setPage] = useState(profile.role==='client'&&data.object.unread?1:0);
    const handlePage = async (event, newValue) => {
        setPage(newValue);
        (document.getElementsByClassName('App-body'))[0].scroll({top: 0, left: 0, behavior: 'instant' });
    };
    let [info, setInfo] = useState(data.object&&data.object.info?data.object.info:'');
    let [comments, setComments] = useState(data.object&&data.object.comments?[...data.object.comments]:[]);
    let addComment = ()=>{
        if(data.object.status==='активный'&&['manager', 'admin'].includes(profile.role)){
            comments = ['', ...comments]
            setComments(comments)
        }
    };
    let editComment = (event, idx)=>{
        if(data.object.status==='активный'&&['manager', 'admin'].includes(profile.role)) {
            comments[idx] = event.target.value
            setComments([...comments])
        }
    };
    let deleteComment = (idx)=>{
        if(data.object.status==='активный'&&['manager', 'admin'].includes(profile.role)) {
            comments.splice(idx, 1);
            setComments([...comments])
        }
    };
    let [edit] = useState(router.query.id==='new'||data.object&&data.object.user._id===profile._id&&data.object.status==='активный');
    let [category, setCategory] = useState(data.object?data.object.category:null);
    let [subcategory, setSubcategory] = useState(data.object?data.object.subcategory:null);
    let documentRef = useRef(null);
    let [documents, setDocuments] = useState(data.object&&data.object.documents?[...data.object.documents]:[]);
    let [uploads, setUploads] = useState([]);
    let handleChangeDocuments = (async (event) => {
        if(documents.length<5) {
            if(event.target.files[0]&&event.target.files[0].size / 1024 / 1024 < 50) {
                setUploads([event.target.files[0], ...uploads])
                setDocuments([URL.createObjectURL(event.target.files[0]), ...documents])
            } else {
                showSnackBar('Файл слишком большой')
            }
        } else {
            showSnackBar('Cлишком много изображений')
        }
    })
    let [subcategories, setSubcategories] = useState([]);
    useEffect(() => {
        (async()=>{
            if(category) {
                setSubcategories(await getSubcategories({category: category._id}))
            }
            else
                setSubcategories([])
            if(!initialRender.current)
                setSubcategory(null)
            else
                initialRender.current = false
        })()
    }, [category]);
    const handlerSwipe = useSwipeable({
        onSwipedLeft: (eventData) => {
            if(page!==1&&!eventData.event.target.className.includes('noteImage'))
                handlePage({}, 1)
        },
        onSwipedRight: () => {
            if(page!==0)
                handlePage({}, 0)
        },
        delta: 80
    });
    return (
        <App pageName={data.object?'Заявка на исполнителя':'Ничего не найдено'}  handlerSwipe={handlerSwipe}>
            <Head>
                <title>{data.object?'Заявка на исполнителя':'Ничего не найдено'}</title>
                <meta name='description' content='Заявка на исполнителя' />
                <meta property='og:title' content={data.object?'Заявка на исполнителя':'Ничего не найдено'} />
                <meta property='og:description' content='Заявка на исполнителя' />
                <meta property='og:type' content='website' />
                <meta property='og:image' content={`${urlMain}/static/512x512.png`} />
                <meta property='og:url' content={`${urlMain}/application/${router.query.id}`} />
                <link rel='canonical' href={`${urlMain}/application/${router.query.id}`}/>
            </Head>
            {
                data.object?
                    <>
                    <div className={classesPage.page}>
                            <Card className={classesPage.card}>
                                {
                                    router.query.id !== 'new' ?
                                        <Tabs
                                            value={page}
                                            onChange={handlePage}
                                            indicatorColor='primary'
                                            textColor='primary'
                                            centered
                                        >
                                            <Tab label='Заявка'/>
                                            <Tab label={`Комментарии(${comments.length})`}/>
                                        </Tabs>
                                        :
                                        null
                                }
                                <CardContent className={classesPage.column}>
                                    {
                                        page===0?
                                            <>
                                            {
                                                router.query.id==='new'?
                                                    <>
                                                    <br/>
                                                    <Autocomplete
                                                        options={data.categories}
                                                        value={category}
                                                        onChange={(event, newValue) => {
                                                            setCategory(newValue);
                                                        }}
                                                        className={classesPage.input}
                                                        getOptionLabel={(option) => option.name}
                                                        renderInput={(params) => <TextField error={!category} {...params} label='Выберите категорию' />}
                                                    />
                                                    {
                                                        subcategories&&subcategories.length?
                                                            <Autocomplete
                                                                options={subcategories}
                                                                value={subcategory}
                                                                onChange={(event, newValue) => {
                                                                    setSubcategory(newValue);
                                                                }}
                                                                className={classesPage.input}
                                                                getOptionLabel={(option) => option.name}
                                                                renderInput={(params) => <TextField error={!subcategory} {...params} label='Выберите подкатегорию' />}
                                                            />
                                                            :
                                                            null
                                                    }
                                                    </>
                                                    :
                                                    <>
                                                    <div className={classesPage.row}>
                                                        <div className={classesPage.nameField}>
                                                            Создан:&nbsp;
                                                        </div>
                                                        <div className={classesPage.value}>
                                                            {pdDDMMYYHHMM(data.object.createdAt)}
                                                        </div>
                                                    </div>
                                                    <Link href='/user/[id]' as={`/user/${data.object.user._id}`}>
                                                        <a>
                                                            <div className={classesPage.row}>
                                                                <div className={classesPage.nameField}>
                                                                    Заявитель:&nbsp;
                                                                </div>
                                                                <div className={classesPage.value}>
                                                                    {data.object.user.name}
                                                                </div>
                                                            </div>
                                                        </a>
                                                    </Link>
                                                    {
                                                        data.object.approvedUser&&profile.role==='admin'?
                                                            data.object.approvedUser.role!=='admin'?
                                                                <Link href='/employment/[id]' as={`/employment/${data.object.user._id}`}>
                                                                    <a>
                                                                        <div className={classesPage.row}>
                                                                            <div className={classesPage.nameField}>Принял:&nbsp;</div>
                                                                            <div className={classesPage.value}>{`${data.object.approvedUser.role} ${data.object.approvedUser.name}`}</div>
                                                                        </div>
                                                                    </a>
                                                                </Link>
                                                                :
                                                                <div className={classesPage.row}>
                                                                    <div className={classesPage.nameField}>Принял:&nbsp;</div>
                                                                    <div className={classesPage.value}>{`${data.object.approvedUser.role}${data.object.approvedUser.name?data.object.approvedUser.name:''}`}</div>
                                                                </div>
                                                            :
                                                            null
                                                    }
                                                    <div className={classesPage.row}>
                                                        <div className={classesPage.nameField}>
                                                            Категория:&nbsp;
                                                        </div>
                                                        <div className={classesPage.value}>
                                                            {data.object.category.name}
                                                        </div>
                                                    </div>
                                                    <div className={classesPage.row}>
                                                        <div className={classesPage.nameField}>
                                                            Подкатегория:&nbsp;
                                                        </div>
                                                        <div className={classesPage.value}>
                                                            {data.object.subcategory.name}
                                                        </div>
                                                    </div>
                                                    </>
                                            }
                                            <br/>
                                            <div className={classesPage.row}>
                                                <div className={classesPage.nameField}>Документы:&nbsp;&nbsp;</div>
                                                <div className={classesPage.noteImageList}>
                                                    {
                                                        edit?
                                                            <img className={classesPage.noteImage} src='/static/add.png' onClick={()=>{documentRef.current.click()}} />
                                                            :
                                                            null
                                                    }
                                                    {documents.map((element, idx)=> <div key={`noteImageDiv${idx}`} className={classesPage.noteImageDiv}>
                                                        <img className={classesPage.noteImage} src={element} onClick={()=>{
                                                            setShowLightbox(true)
                                                            setImagesLightbox(documents)
                                                            setIndexLightbox(idx)
                                                        }}/>
                                                        {
                                                            edit?
                                                                <div className={classesPage.noteImageButton} style={{background: 'red'}} onClick={()=>{
                                                                    documents.splice(idx, 1)
                                                                    setDocuments([...documents])
                                                                }}>X</div>
                                                                :
                                                                null
                                                        }
                                                    </div>)}
                                                </div>
                                            </div>
                                            <br/>
                                            {router.query.id==='new'?
                                                <>
                                                <div className={classesPage.nameField}>
                                                    "Помощь на дороге" подкатегориясы үчүн сүрөт жана документ талап кылынбайт.
                                                </div>
                                                <div className={classesPage.nameField}>
                                                    Для подкатегории "Помощь на дороге" фото документов не требуется.
                                                </div>
                                                </>
                                                :
                                                null
                                            }
                                            <TextField
                                                multiline={true}
                                                label='Информация'
                                                value={info}
                                                className={classesPage.input}
                                                onChange={(event)=>{if(edit)setInfo(event.target.value)}}
                                                inputProps={{
                                                    'aria-label': 'description',
                                                }}
                                            />
                                            {
                                                router.query.id==='new'?
                                                    <Button onClick={async()=>{
                                                        window.open('/static/application.pdf','_blank')
                                                    }} color='primary'>
                                                        Как подать заявку?
                                                    </Button>
                                                    :
                                                    null
                                            }
                                            </>
                                            :
                                            <>
                                            {comments.map((element, idx)=>
                                                <FormControl key={`phone${idx}`} className={classesPage.input}>
                                                    <InputLabel>Комментарий</InputLabel>
                                                    <Input
                                                        value={element}
                                                        onChange={(event)=>{editComment(event, idx)}}
                                                        inputProps={{
                                                            'aria-label': 'description',
                                                        }}
                                                        endAdornment={
                                                            data.object.status==='активный'&&['manager', 'admin'].includes(profile.role)?
                                                                <InputAdornment position='end'>
                                                                    <IconButton
                                                                        onClick={()=>{
                                                                            deleteComment(idx)
                                                                        }}
                                                                        aria-label='toggle password visibility'
                                                                    >
                                                                        <Remove/>
                                                                    </IconButton>
                                                                </InputAdornment>
                                                                :
                                                                null
                                                        }
                                                    />
                                                </FormControl>
                                            )}
                                            {
                                                ['manager', 'admin'].includes(profile.role)&&data.object.status==='активный'?
                                                    <Button onClick={async()=>{
                                                        addComment()
                                                    }} color='primary'>
                                                        Добавить комментарий
                                                    </Button>
                                                    :
                                                    null
                                            }
                                            </>
                                    }
                                </CardContent>
                        </Card>
                        <IconButton className={classesPage.backArrow} onClick={()=>Router.back()}>
                            <ArrowBackIcon/>
                        </IconButton>
                    </div>
                    {
                        edit||data.object.status==='активный'&&['manager', 'admin'].includes(profile.role)?
                            <div className={isMobileApp?isApple?classesPage.bottomDivMA:classesPage.bottomDivM:classesPage.bottomDivD}>
                                {
                                    router.query.id==='new'?
                                        <>
                                        <Button onClick={async()=>{
                                            if (category&&subcategory) {
                                                const action = async() => {
                                                    await addApplication({
                                                        uploads,
                                                        info,
                                                        category: category._id,
                                                        subcategory: subcategory._id
                                                    })
                                                    Router.push('/applications')
                                                }
                                                setMiniDialog('Подать заявку?', <Confirmation action={action}/>)
                                                showMiniDialog(true)
                                            } else {
                                                showSnackBar('Заполните все красные поля')
                                            }
                                        }} color='primary'>
                                            Подать
                                        </Button>
                                        </>
                                        :
                                        <>
                                        {
                                            data.object.status==='активный'&&['manager', 'admin'].includes(profile.role)&&page===1?
                                                <Button onClick={async()=>{
                                                    let editElement = {_id: router.query.id}
                                                    if(JSON.stringify(comments)!==JSON.stringify(data.object.comments))editElement.comments = comments
                                                    const action = async() => {
                                                        await setApplication(editElement)
                                                        Router.reload()
                                                    }
                                                    setMiniDialog('Вы уверены?', <Confirmation action={action}/>)
                                                    showMiniDialog(true)
                                                }} color='primary'>
                                                    Сохранить
                                                </Button>
                                                :
                                                null
                                        }
                                        {
                                            edit?
                                                <Button onClick={async()=>{
                                                    let editElement = {_id: router.query.id}
                                                    if(uploads.length)editElement.uploads = uploads
                                                    if(JSON.stringify(documents)!==JSON.stringify(data.object.documents))editElement.documents = documents
                                                    if(info!==data.object.info)editElement.info = info
                                                    const action = async() => {
                                                        await setApplication(editElement)
                                                        Router.reload()
                                                    }
                                                    setMiniDialog('Вы уверены?', <Confirmation action={action}/>)
                                                    showMiniDialog(true)
                                                }} color='primary'>
                                                    Сохранить
                                                </Button>
                                                :
                                                <Button onClick={async()=>{
                                                    let editElement = {_id: router.query.id, approve: true}
                                                    const action = async() => {
                                                        await setApplication(editElement)
                                                        Router.reload()
                                                    }
                                                    setMiniDialog('Вы уверены?', <Confirmation action={action}/>)
                                                    showMiniDialog(true)
                                                }} color='primary'>
                                                    Принять
                                                </Button>
                                        }
                                        <Button onClick={async()=>{
                                            const action = async() => {
                                                await deleteApplication(router.query.id)
                                                Router.push('/applications')
                                            }
                                            setMiniDialog('Вы уверены?', <Confirmation action={action}/>)
                                            showMiniDialog(true)
                                        }} color='secondary' className={isMobileApp?classesPage.quickButtonM:classesPage.quickButtonD}>
                                            Удалить
                                        </Button>
                                        </>
                                }
                            </div>
                            :
                            null
                    }
                    </>
                    :
                    null
            }
            <input
                accept='image/*'
                style={{ display: 'none' }}
                ref={documentRef}
                type='file'
                onChange={handleChangeDocuments}
            />
        </App>
    )
})

Application.getInitialProps = async function(ctx) {
    await initialApp(ctx)
    if(['manager', 'admin'].includes(ctx.store.getState().user.profile.role)&&ctx.query.id==='new'||!ctx.store.getState().user.profile.role)
        if(ctx.res) {
            ctx.res.writeHead(302, {
                Location: '/'
            })
            ctx.res.end()
        } else
            Router.push('/')
    return {
        data: {
            object: ctx.query.id==='new'? {documents: [], info: '', category: ctx.query.categoryId?{_id: ctx.query.categoryId, name: ctx.query.categoryName}:null, subcategory: ctx.query.subcategoryId?{_id: ctx.query.subcategoryId, name: ctx.query.subcategoryName}:null}:await getApplication({_id: ctx.query.id}, ctx.req?await getClientGqlSsr(ctx.req):undefined),
            categories: await getCategories({}, ctx.req?await getClientGqlSsr(ctx.req):undefined)
        }
    };
};

function mapStateToProps (state) {
    return {
        user: state.user,
        app: state.app
    }
}

function mapDispatchToProps(dispatch) {
    return {
        mini_dialogActions: bindActionCreators(mini_dialogActions, dispatch),
        snackbarActions: bindActionCreators(snackbarActions, dispatch),
        appActions: bindActionCreators(appActions, dispatch),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Application);