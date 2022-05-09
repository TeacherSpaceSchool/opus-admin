import Head from 'next/head';
import React, { useState, useRef, useEffect } from 'react';
import App from '../../layouts/App';
import { connect } from 'react-redux'
import { getApplication, setApplication, addApplication, deleteApplication, addCommentForApplication, deleteCommentForApplication } from '../../src/gql/application'
import { getCategories, getCategory } from '../../src/gql/category'
import { getSubcategories, getSubcategory } from '../../src/gql/subcategory'
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
import Send from '@material-ui/icons/Send';
import AttachFile from '@material-ui/icons/AttachFile';
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
    let [edit] = useState(router.query.id==='new'||data.object&&data.object.user._id===profile._id&&data.object.status==='активный');
    let [newComment, setNewComment] = useState('');
    let [category, setCategory] = useState(data.category?data.category:data.object?data.object.category:null);
    let [subcategory, setSubcategory] = useState(data.subcategory?data.subcategory:data.object?data.object.subcategory:null);
    let documentRef = useRef(null);
    let fileCommentRef = useRef(null);
    let [fileComment, setFileComment] = useState(null);
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
    let handleChangeFileComment = (async (event) => {
        if(event.target.files[0]&&event.target.files[0].size / 1024 / 1024 < 50)
            setFileComment(event.target.files[0])
        else
            showSnackBar('Файл слишком большой')
    })
    let [subcategories, setSubcategories] = useState(data.subcategories);
    useEffect(() => {
        if(initialRender.current)
            initialRender.current = false
        else
            (async()=>{
                if(category) {
                    setSubcategories(await getSubcategories({category: category._id}))
                }
                else
                    setSubcategories([])
                setSubcategory(null)
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
                                                    {
                                                        !data.category?
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
                                                            :
                                                            <div className={classesPage.row}>
                                                                <div className={classesPage.nameField}>
                                                                    Категория:&nbsp;
                                                                </div>
                                                                <div className={classesPage.value}>
                                                                    {data.category.name}
                                                                </div>
                                                            </div>
                                                    }
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
                                                            data.subcategory?
                                                                <div className={classesPage.row}>
                                                                    <div className={classesPage.nameField}>
                                                                        Подкатегория:&nbsp;
                                                                    </div>
                                                                    <div className={classesPage.value}>
                                                                        {data.subcategory.name}
                                                                    </div>
                                                                </div>
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
                                                                    <div className={classesPage.value}>{`${data.object.approvedUser.role} ${data.object.approvedUser.name?data.object.approvedUser.name:''}`}</div>
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
                                            {
                                                false?
                                                    <>
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
                                                    </>
                                                    :
                                                    null
                                            }
                                            {
                                                false?
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
                                                    :
                                                    null
                                            }
                                            <br/>
                                            {router.query.id==='new'?
                                                <>
                                                <div className={classesPage.nameField}>
                                                    Чексиз сандаган категорияларды кошуп, көбүрөөк тапшырык алыңыз!<br/>
                                                    Бул үчүн жаңы категорияны тандап, "Подать" баскычын басыңыз.
                                                </div>
                                                <div className={classesPage.nameField}>
                                                    Добавляйте неограниченное количество категорий и получайте больше заказов!<br/>
                                                    Для этого, выберите новую категорию и нажмите "Подать"
                                                </div>
                                                </>
                                                :
                                                null
                                            }
                                            {
                                                /*router.query.id==='new'*/false?
                                                    <Button onClick={()=>{
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
                                            {
                                                data.object.status==='активный'&&['manager', 'admin'].includes(profile.role)?
                                                    <>
                                                    <FormControl className={classesPage.input}>
                                                        <InputLabel>Комментарий</InputLabel>
                                                        <Input
                                                            multiline
                                                            value={newComment}
                                                            onChange={event=>setNewComment(event.target.value)}
                                                            inputProps={{
                                                                'aria-label': 'description',
                                                            }}
                                                            startAdornment={
                                                                <InputAdornment position='start'>
                                                                    <IconButton
                                                                        onClick={()=>{
                                                                            fileCommentRef.current.click()
                                                                        }}
                                                                        aria-label='toggle password visibility'
                                                                    >
                                                                        <AttachFile color={fileComment?'primary':'default'}/>
                                                                    </IconButton>
                                                                </InputAdornment>
                                                            }
                                                            endAdornment={
                                                                <InputAdornment position='end'>
                                                                    <IconButton
                                                                        onClick={async ()=>{
                                                                            if(newComment) {
                                                                                let res = await addCommentForApplication({_id: router.query.id, file: fileComment, comment: newComment})
                                                                                setNewComment('')
                                                                                setFileComment(null)
                                                                                setComments([res, ...comments])
                                                                            }
                                                                            else showSnackBar('Заполните все поля')
                                                                        }}
                                                                        aria-label='toggle password visibility'
                                                                    >
                                                                        <Send color={newComment?'primary':'default'}/>
                                                                    </IconButton>
                                                                </InputAdornment>
                                                            }
                                                        />
                                                    </FormControl>
                                                    <br/>
                                                    </>
                                                    :
                                                    null
                                            }
                                            {comments.map((element, idx)=>{
                                                if(element.substring(0,4)==='http')
                                                    return <div key={`phone${idx}`}>
                                                        <div key={`phone${idx}`} className={classesPage.row}>
                                                            <a href={element.split(' | ')[0]} target='_blank' style={{width: '100%'}}>
                                                                <div className={classesPage.value} style={{width: '100%'}}>
                                                                    {element.split(' | ')[1]}
                                                                </div>
                                                            </a>
                                                            {
                                                                data.object.status==='активный'&&['manager', 'admin'].includes(profile.role)?
                                                                    <div className={classesPage.value}  onClick={async()=>{
                                                                        let res = await deleteCommentForApplication({_id: router.query.id, idx})
                                                                        if(res==='OK') {
                                                                            comments.splice(idx, 1);
                                                                            setComments([...comments])
                                                                        }
                                                                    }}>
                                                                        ❌
                                                                    </div>
                                                                    :
                                                                    null
                                                            }
                                                        </div>
                                                        {
                                                            data.object.status==='активный'&&['manager', 'admin'].includes(profile.role)?
                                                                <br/>
                                                                :
                                                                null
                                                        }
                                                    </div>
                                                else
                                                    return <div key={`phone${idx}`}>
                                                        <div className={classesPage.row}>
                                                            <div className={classesPage.value} style={{width: '100%'}}>
                                                                {element}
                                                            </div>
                                                            {
                                                                data.object.status==='активный'&&['manager', 'admin'].includes(profile.role)?
                                                                    <div className={classesPage.value}  onClick={async()=>{
                                                                        let res = await deleteCommentForApplication({_id: router.query.id, idx})
                                                                        if(res==='OK') {
                                                                            comments.splice(idx, 1);
                                                                            setComments([...comments])
                                                                        }
                                                                    }}>
                                                                        ❌
                                                                    </div>
                                                                    :
                                                                    null
                                                            }
                                                        </div>
                                                        {
                                                            data.object.status==='активный'&&['manager', 'admin'].includes(profile.role)?
                                                                <br/>
                                                                :
                                                                null
                                                        }
                                                    </div>
                                            })}
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
            <input
                accept='*/*'
                style={{ display: 'none' }}
                ref={fileCommentRef}
                type='file'
                onChange={handleChangeFileComment}
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
    let category, subcategory
    if(ctx.query.category)
        category = await getCategory({_id: ctx.query.category}, ctx.req?await getClientGqlSsr(ctx.req):undefined)
    if(ctx.query.subcategory)
        subcategory = await getSubcategory({_id: ctx.query.subcategory}, ctx.req?await getClientGqlSsr(ctx.req):undefined)
    return {
        data: {
            object: ctx.query.id==='new'? {documents: [], info: '', category: ctx.query.categoryId?{_id: ctx.query.categoryId, name: ctx.query.categoryName}:null, subcategory: ctx.query.subcategoryId?{_id: ctx.query.subcategoryId, name: ctx.query.subcategoryName}:null}:await getApplication({_id: ctx.query.id}, ctx.req?await getClientGqlSsr(ctx.req):undefined),
            categories: !ctx.query.category?await getCategories({}, ctx.req?await getClientGqlSsr(ctx.req):undefined):[],
            subcategories: !ctx.query.subcategory&&ctx.query.id==='new'&&ctx.query.category?await getSubcategories({category: ctx.query.category}, ctx.req?await getClientGqlSsr(ctx.req):undefined):[],
            category,
            subcategory
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