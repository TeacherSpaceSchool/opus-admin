import Head from 'next/head';
import React, { useState, useRef, useEffect } from 'react';
import App from '../../layouts/App';
import { connect } from 'react-redux'
import {getOrder, addOrder, deleteOrder, setOrder, confirmOrder, cloneOrder} from '../../src/gql/order'
import { getCategories } from '../../src/gql/category'
import ShareleIcon from '@material-ui/icons/Share';
import { getSubcategories, getSubcategoriesBySpecialist, getSubcategory } from '../../src/gql/subcategory'
import stylePage from '../../src/styleMUI/list'
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import { bindActionCreators } from 'redux'
import * as mini_dialogActions from '../../redux/actions/mini_dialog'
import * as snackbarActions from '../../redux/actions/snackbar'
import * as appActions from '../../redux/actions/app'
import TextField from '@material-ui/core/TextField';
import Confirmation from '../../components/dialog/Confirmation'
import CancelOrder from '../../components/dialog/CancelOrder'
import ResponseOrder from '../../components/dialog/ResponseOrder'
import { urlMain } from '../../redux/constants/other'
import { getClientGqlSsr } from '../../src/getClientGQL'
import initialApp from '../../src/initialApp'
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Router from 'next/router'
import { useRouter } from 'next/router';
import { pdDDMMYYHHMM, inputInt, checkInt, pdtDatePickerTime } from '../../src/lib'
import Link from 'next/link';
import Autocomplete, { createFilterOptions } from '@material-ui/lab/Autocomplete';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import dynamic from 'next/dynamic'
const Geo = dynamic(import('../../components/dialog/Geo'), { ssr: false });
import Clear from '@material-ui/icons/Clear';
import styleOrder from '../../src/styleMUI/other/order'
import styleCategory from '../../src/styleMUI/other/category'
import { approveExecutor } from '../../src/gql/order'
import VisibilityIcon from '@material-ui/icons/Visibility';
import CardNotification from '../../components/CardNotification'
import { getNotifications } from '../../src/gql/notification'
import { forceCheck } from 'react-lazyload';
import LazyLoad from 'react-lazyload';
import CardPlaceholder from '../../components/CardPlaceholder'
import IconButton from '@material-ui/core/IconButton';
import {useSwipeable} from 'react-swipeable';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import Chip from '@material-ui/core/Chip';
import AddReview from '../../components/dialog/AddReview'
import Sign from '../../components/dialog/Sign'
import InputAdornment from '@material-ui/core/InputAdornment';
import CancelIcon from '@material-ui/icons/Cancel';
import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import PhoneIcon from '@material-ui/icons/Phone';
import QuestionAnswerIcon from '@material-ui/icons/QuestionAnswer';
import Autocomplect2gis from '../../components/app/Autocomplect2gis'
const statusColor = {
    'активный': 'orange',
    'принят': 'blue',
    'выполнен': 'green',
    'отмена': 'red'
}
const height = 100
const filterOptionsCategory = createFilterOptions({
    stringify: (option) => `${option.name}${option.searchWords}`,
});

const Order = React.memo((props) => {
    const classesPage = stylePage();
    const { setMiniDialog, showMiniDialog, setFullDialog, showFullDialog } = props.mini_dialogActions;
    const classesOrder = styleOrder();
    const classesCategory = styleCategory();
    const { data } = props;
    const { isMobileApp, isApple } = props.app;
    const initialRender = useRef(true);
    const { profile, authenticated } = props.user;
    const { showSnackBar } = props.snackbarActions;
    const router = useRouter();
    const { setShowLightbox, setImagesLightbox, setIndexLightbox, setFilter } = props.appActions;
    let [list, setList] = useState(data.list);
    const [page, setPage] = useState(data.page);
    const [addresses] = useState(profile.addresses?profile.addresses:[]);
    const handlePage = async (event, newValue) => {
        router.replace(`${router.pathname}?page=${newValue}`, `/order/${router.query.id}?page=${newValue}`, { shallow: true })
        if(newValue===1){
            setList(await getNotifications({skip: 0, order: router.query.id}))
            paginationWork.current = true;
        }
        else {
            setList([])
            paginationWork.current = false
        }
        setPage(newValue);
        (document.getElementsByClassName('App-body'))[0].scroll({top: 0, left: 0, behavior: 'instant' });
        forceCheck()
    };
    let paginationWork = useRef(data.page==1);
    const checkPagination = async()=>{
        if(paginationWork){
            let addedList = await getNotifications({skip: list.length, order: router.query.id})
            if(addedList.length>0){
                setList([...list, ...addedList])
            }
            else
                paginationWork.current = false
        }
    }
    let [alowEdit] = useState(router.query.id==='new'||data.object&&(data.object.customer._id==profile._id||profile.role==='admin')&&data.object.status==='активный');
    let [edit, setEdit] = useState(router.query.id==='new');

    let [category, setCategory] = useState(null);
    let [quickTitles, setQuickTitles] = useState(data.quickTitles);
    let [subcategories, setSubcategories] = useState(data.subcategories);
    let [subcategory, setSubcategory] = useState(null);
    let [name, setName] = useState(data.object&&data.object.name?data.object.name:'');
    let [showResponseOrder, setShowResponseOrder] = useState(data.showResponseOrder);
    let [info, setInfo] = useState(data.object&&data.object.info?data.object.info:'');
    let [address, setAddress] = useState(data.object&&data.object.address?data.object.address:'');
    let [apartment, setApartment] = useState(data.object&&data.object.apartment?data.object.apartment:'');
    let [geo, setGeo] = useState(data.object&&data.object.geo?data.object.geo:[42.8700000, 74.5900000]);
    let [dateStart, setDateStart] = useState(data.object&&data.object.dateStart?pdtDatePickerTime(data.object.dateStart):null);
    let [dateEnd, setDateEnd] = useState(data.object&&data.object.dateEnd?pdtDatePickerTime(data.object.dateEnd):null);
    let [price, setPrice] = useState(data.object&&data.object.price?data.object.price:'');
    let [urgency, setUrgency] = useState(data.object&&data.object.urgency?data.object.urgency:false);
    let imageRef = useRef(null);
    let [images, setDocuments] = useState(data.object&&data.object.images?[...data.object.images]:[]);
    let [uploads, setUploads] = useState([]);
    let handleChangeDocuments = (async (event) => {
        if(images.length<5) {
            if(event.target.files[0]&&event.target.files[0].size / 1024 / 1024 < 50) {
                setUploads([event.target.files[0], ...uploads])
                setDocuments([URL.createObjectURL(event.target.files[0]), ...images])
            } else {
                showSnackBar('Файл слишком большой')
            }
        } else {
            showSnackBar('Cлишком много изображений')
        }
    })
    const allowBack = useRef(router.query.id!=='new');
    useEffect(() => {
        if(router.query.id==='new'&&process.browser) {
            router.beforePopState(() => {
                if(allowBack.current)
                    return true
                history.go(1)
                const action = async() => {
                    allowBack.current = true
                    Router.back()
                }
                setMiniDialog('Выйти из заказа?', <Confirmation action={action}/>)
                showMiniDialog(true)
                return false
            })
            return () => {
                router.beforePopState(() => {
                    return true
                })
            }
        }
    }, [process.browser]);
    useEffect(() => {
        if(!initialRender.current) {
            if (subcategory && subcategory.searchWords && subcategory.searchWords.length)
                setQuickTitles(subcategory.searchWords.split(', '))
            else
                setQuickTitles([])
        }
    }, [subcategory]);
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
            if(data.object.customer&&(profile.role==='admin'||data.object.customer._id===profile._id)&&page!==1&&!eventData.event.target.className.includes('noteImage')&&!eventData.event.target.className.includes('media'))
                handlePage({}, 1)
        },
        onSwipedRight: () => {
            if(data.object.customer&&(profile.role==='admin'||data.object.customer._id===profile._id)&&page!==0)
                handlePage({}, 0)
        },
        delta: 80
    });
    return (
        <App pageName={router.query.id==='new'?'Добавить':data.object?name:'Ничего не найдено'} paginationWork={paginationWork} checkPagination={checkPagination} handlerSwipe={handlerSwipe}>
            <Head>
                <title>{router.query.id==='new'?'Добавить':data.object?name:'Ничего не найдено'}</title>
                <meta name='description' content={data.object?info:'Ничего не найдено'} />
                <meta property='og:title' content={router.query.id==='new'?'Добавить':data.object?name:'Ничего не найдено'} />
                <meta property='og:description' content={data.object?info:'Ничего не найдено'} />
                <meta property='og:type' content='website' />
                <meta property='og:image' content={`${urlMain}/static/512x512.png`} />
                <meta property='og:url' content={`${urlMain}/order/${router.query.id}`} />
                <link rel='canonical' href={`${urlMain}/order/${router.query.id}`}/>
            </Head>
            {
                data.object?
                    <>
                    {
                        data.object.customer&&(profile.role==='admin'||data.object.customer._id===profile._id)?
                            <Tabs
                                className={classesPage.stickyTab}
                                value={page}
                                onChange={handlePage}
                                indicatorColor='primary'
                                textColor='primary'
                                centered
                            >
                                <Tab label='Заказ' />
                                <Tab label='Отклики' />
                            </Tabs>
                            :
                            null
                    }
                    <div className={classesPage.page}>
                               {
                                    page===0||profile.role!=='admin'&&data.object.customer._id!==profile._id?
                                        edit?
                                            <Card className={classesPage.card}>
                                                <IconButton className={classesPage.backArrow} onClick={()=>Router.back()}>
                                                    <ArrowBackIcon/>
                                                </IconButton>
                                                <br/>
                                                <CardContent className={classesPage.column}>
                                                    {
                                                        router.query.id==='new'?
                                                            router.query.executor?
                                                                data.subcategories&&data.subcategories.length?
                                                                    <Autocomplete
                                                                        options={data.subcategories}
                                                                        filterOptions={filterOptionsCategory}
                                                                        value={subcategory}
                                                                        onChange={(event, newValue) => {
                                                                            setSubcategory(newValue);
                                                                        }}
                                                                        className={classesPage.input}
                                                                        getOptionLabel={(option) => option.name}
                                                                        renderInput={(params) => <TextField error={!subcategory} {...params} label='Выберите подкатегорию*' />}
                                                                    />
                                                                    :
                                                                    null
                                                                :
                                                                <>
                                                                {
                                                                    !router.query.category?
                                                                        <Autocomplete
                                                                            options={data.categories}
                                                                            value={category}
                                                                            onChange={(event, newValue) => {
                                                                                setCategory(newValue);
                                                                            }}
                                                                            filterOptions={filterOptionsCategory}
                                                                            className={classesPage.input}
                                                                            getOptionLabel={(option) => option.name}
                                                                            renderInput={(params) => <TextField error={!category} {...params} label='Выберите категорию*' />}
                                                                        />
                                                                        :
                                                                        null
                                                                }
                                                                {
                                                                    !router.query.subcategory&&subcategories&&subcategories.length?
                                                                        <Autocomplete
                                                                            options={subcategories}
                                                                            filterOptions={filterOptionsCategory}
                                                                            value={subcategory}
                                                                            onChange={(event, newValue) => {
                                                                                setSubcategory(newValue);
                                                                            }}
                                                                            className={classesPage.input}
                                                                            getOptionLabel={(option) => option.name}
                                                                            renderInput={(params) => <TextField error={!subcategory} {...params} label='Выберите подкатегорию*' />}
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
                                                            <Link href='/user/[id]' as={`/user/${data.object.customer._id}`}>
                                                                <a>
                                                                    <div className={classesPage.row}>
                                                                        <div className={classesPage.nameField}>
                                                                            Заказчик:&nbsp;
                                                                        </div>
                                                                        <div className={classesPage.value}>
                                                                            {data.object.customer.name}
                                                                        </div>
                                                                    </div>
                                                                </a>
                                                            </Link>
                                                            {
                                                                data.object.executor?
                                                                    <Link href='/user/[id]' as={`/user/${data.object.executor._id}`}>
                                                                        <a>
                                                                            <div className={classesPage.row}>
                                                                                <div className={classesPage.nameField}>
                                                                                    Исполнитель:&nbsp;
                                                                                </div>
                                                                                <div className={classesPage.value}>
                                                                                    {data.object.executor.name}
                                                                                </div>
                                                                            </div>
                                                                        </a>
                                                                    </Link>
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
                                                    <FormControl className={classesPage.input}>
                                                        <InputLabel
                                                            htmlFor='title'
                                                            error={!name.length}>
                                                            Задача*
                                                        </InputLabel>
                                                        <Input
                                                            id='title'
                                                            error={!name.length}
                                                            value={name}
                                                            onChange={(event)=>{setName(event.target.value)}}
                                                            endAdornment={
                                                                name.length?
                                                                    <InputAdornment position='end'>
                                                                        <IconButton aria-label='title' onClick={()=>{setName('');}}>
                                                                            <CancelIcon />
                                                                        </IconButton>
                                                                    </InputAdornment>
                                                                    :
                                                                    null
                                                            }
                                                        />
                                                    </FormControl>
                                                    {
                                                        quickTitles.length?
                                                            <div className={classesOrder.row}>
                                                                {
                                                                    quickTitles.map((element, idx)=> {
                                                                        return(
                                                                            <Chip
                                                                                className={classesOrder.chip}
                                                                                onClick={()=>setName(element)}
                                                                                color={name===element?'primary':'default'}
                                                                                label={element}
                                                                                key={`${element}${idx}`}
                                                                            />
                                                                        )}
                                                                    )
                                                                }
                                                            </div>
                                                            :
                                                            null
                                                    }
                                                    <TextField
                                                        multiline={true}
                                                        label='Информация'
                                                        value={info}
                                                        className={classesPage.input}
                                                        onChange={(event)=>{setInfo(event.target.value)}}
                                                        inputProps={{
                                                            'aria-label': 'description',
                                                        }}
                                                    />
                                                    <br/>
                                                    <div className={classesPage.row}>
                                                        <div className={classesPage.nameField}>Изображения:&nbsp;&nbsp;</div>
                                                        <div className={classesPage.noteImageList}>
                                                            {
                                                                edit?
                                                                    <img className={classesPage.noteImage} src='/static/add.png' onClick={()=>{imageRef.current.click()}} />
                                                                    :
                                                                    null
                                                            }
                                                            {images.map((element, idx)=> <div key={`noteImageDiv${idx}`} className={classesPage.noteImageDiv}>
                                                                <img className={classesPage.noteImage} src={element} onClick={()=>{
                                                                    setShowLightbox(true)
                                                                    setImagesLightbox(images)
                                                                    setIndexLightbox(idx)
                                                                }}/>
                                                                {
                                                                    edit?
                                                                        <div className={classesPage.noteImageButton} style={{background: 'red'}} onClick={()=>{
                                                                            images.splice(idx, 1)
                                                                            setDocuments([...images])
                                                                        }}>X</div>
                                                                        :
                                                                        null
                                                                }
                                                            </div>)}
                                                        </div>
                                                    </div>
                                                    <div className={classesPage.column}>
                                                        <TextField
                                                            error={!price}
                                                            type={'text'}
                                                            label={'Цена*'}
                                                            value={price}
                                                            className={classesPage.input}
                                                            onChange={(event)=>{
                                                                setPrice(inputInt(event.target.value))
                                                            }}
                                                            inputProps={{
                                                                'aria-label': 'description',
                                                            }}
                                                        />
                                                        <div className={classesOrder.rowPrice}>
                                                            <Chip
                                                                className={classesOrder.chip}
                                                                onClick={()=>{
                                                                    setPrice('Договорная цена')
                                                                }}
                                                                color={price==='Договорная цена'?'primary':'default'}
                                                                label='Договорная цена'
                                                            />
                                                            <Chip
                                                                className={classesOrder.chip}
                                                                onClick={()=>{
                                                                    setPrice('До 500 сом')
                                                                }}
                                                                color={price==='До 500 сом'?'primary':'default'}
                                                                label='До 500 сом'
                                                            />
                                                            <Chip
                                                                className={classesOrder.chip}
                                                                onClick={()=>{
                                                                    setPrice('500-1 000 сом')
                                                                }}
                                                                color={price==='500-1 000 сом'?'primary':'default'}
                                                                label='500-1 000 сом'
                                                            />
                                                            <Chip
                                                                className={classesOrder.chip}
                                                                onClick={()=>{
                                                                    setPrice('1 000-5 000 сом')
                                                                }}
                                                                color={price==='1 000-5 000 сом'?'primary':'default'}
                                                                label='1 000-5 000 сом'
                                                            />
                                                            <Chip
                                                                className={classesOrder.chip}
                                                                onClick={()=>{
                                                                    setPrice('5 000-10 000 сом')
                                                                }}
                                                                color={price==='5 000-10 000 сом'?'primary':'default'}
                                                                label='5 000-10 000 сом'
                                                            />
                                                            <Chip
                                                                className={classesOrder.chip}
                                                                onClick={()=>{
                                                                    setPrice('10 000-50 000 сом')
                                                                }}
                                                                color={price==='10 000-50 000 сом'?'primary':'default'}
                                                                label='10 000-50 000 сом'
                                                            />
                                                            <Chip
                                                                className={classesOrder.chip}
                                                                onClick={()=>{
                                                                    setPrice('50 000-100 000 сом')
                                                                }}
                                                                color={price==='50 000-100 000 сом'?'primary':'default'}
                                                                label='50 000-100 000 сом'
                                                            />
                                                            <Chip
                                                                className={classesOrder.chip}
                                                                onClick={()=>{
                                                                    setPrice('100 000-250 000 сом')
                                                                }}
                                                                color={price==='100 000-250 000 сом'?'primary':'default'}
                                                                label='100 000-250 000 сом'
                                                            />
                                                            <Chip
                                                                className={classesOrder.chip}
                                                                onClick={()=>{
                                                                    setPrice('250 000-500 000 сом')
                                                                }}
                                                                color={price==='250 000-500 000 сом'?'primary':'default'}
                                                                label='250 000-500 000 сом'
                                                            />
                                                            <Chip
                                                                className={classesOrder.chip}
                                                                onClick={()=>{
                                                                    setPrice('От 500 000 сом')
                                                                }}
                                                                color={price==='От 500 000 сом'?'primary':'default'}
                                                                label='От 500 000 сом'
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className={classesOrder.rowUrgency}>
                                                        <FormControlLabel
                                                            control={
                                                                <Checkbox
                                                                    checked={urgency}
                                                                    onChange={()=>setUrgency(!urgency)}
                                                                    color='primary'
                                                                />
                                                            }
                                                            label='Срочный заказ'
                                                        />
                                                    </div>
                                                    <div className={isMobileApp?classesPage.column:classesPage.row}>
                                                        <div className={classesPage.row}>
                                                            <TextField
                                                                className={classesPage.input}
                                                                label='Дата начала'
                                                                type='datetime-local'
                                                                InputLabelProps={{
                                                                    shrink: true,
                                                                }}
                                                                value={dateStart}
                                                                inputProps={{
                                                                    'aria-label': 'description',
                                                                }}
                                                                onChange={ event => setDateStart(event.target.value) }
                                                            />
                                                            {
                                                                isMobileApp?
                                                                    <IconButton
                                                                        onClick={()=>{
                                                                            setDateStart('')
                                                                        }}
                                                                    >
                                                                        <Clear/>
                                                                    </IconButton>
                                                                    :
                                                                    null
                                                            }
                                                        </div>
                                                        <div className={classesPage.row}>
                                                            <TextField
                                                                className={classesPage.input}
                                                                label='Дата окончания'
                                                                type='datetime-local'
                                                                InputLabelProps={{
                                                                    shrink: true,
                                                                }}
                                                                value={dateEnd}
                                                                inputProps={{
                                                                    'aria-label': 'description',
                                                                }}
                                                                onChange={ event => setDateEnd(event.target.value) }
                                                            />
                                                            {
                                                                isMobileApp?
                                                                    <IconButton
                                                                        onClick={()=>{
                                                                            setDateEnd('')
                                                                        }}
                                                                    >
                                                                        <Clear/>
                                                                    </IconButton>
                                                                    :
                                                                    null
                                                            }
                                                        </div>
                                                    </div>
                                                    <TextField
                                                        label={'Квартира'}
                                                        value={apartment}
                                                        className={classesPage.input}
                                                        onChange={(event)=>{
                                                            setApartment(event.target.value)
                                                        }}
                                                        inputProps={{
                                                            'aria-label': 'description',
                                                        }}
                                                    />
                                                    <Autocomplect2gis
                                                        setAddress={(address)=>{setAddress(address)}}
                                                        setGeo={(geo)=>{setGeo(geo)}}
                                                        defaultValue={address}
                                                        _inputValue={address}
                                                        label='Адрес'
                                                    />
                                                    <div className={classesPage.geo} onClick={()=>{
                                                        setFullDialog('Геолокация', <Geo change={true} geo={geo} setAddressGeo={newGeo=>setGeo([...newGeo])} setAddressName={setAddress}/>)
                                                        showFullDialog(true)
                                                    }}>
                                                        {
                                                            geo[0]===42.8700000&&geo[1]===74.5900000?
                                                                'Задайте геолокацию'
                                                                :
                                                                'Изменить геолокацию'
                                                        }
                                                    </div>
                                                    {
                                                        addresses&&addresses.length?
                                                            <div className={classesOrder.rowPrice}>
                                                                {
                                                                    addresses.map((element, idx)=> {
                                                                        return(
                                                                            <Chip
                                                                                className={classesOrder.chip}
                                                                                onClick={()=>{
                                                                                    setAddress(element.address)
                                                                                    setApartment(element.apartment)
                                                                                    setGeo(element.geo)
                                                                                }}
                                                                                color={address===element.address?'primary':'default'}
                                                                                label={element.address}
                                                                                key={`${element.address}${idx}`}
                                                                            />
                                                                        )}
                                                                    )
                                                                }
                                                            </div>
                                                            :
                                                            null
                                                    }
                                                </CardContent>
                                            </Card>
                                            :
                                            <>
                                            <Card className={classesOrder.card}>
                                                <div className={classesPage.row}>
                                                    <IconButton onClick={()=>Router.back()}>
                                                        <ArrowBackIcon/>
                                                    </IconButton>
                                                    <div style={{width: '100%'}}/>
                                                    {
                                                        data.object.chat?
                                                            <Link
                                                                href={{pathname: '/chat/[id]'}}
                                                                as={`/chat/${data.object.chat._id}`}
                                                            >
                                                                <IconButton>
                                                                    <QuestionAnswerIcon/>
                                                                </IconButton>
                                                            </Link>
                                                            :
                                                            null
                                                    }
                                                    {
                                                        isMobileApp?
                                                            data.object.executor?
                                                                <a href={`tel:+996${data.object.executor._id!==profile._id?data.object.executor.login:data.object.customer.login}`}>
                                                                    <IconButton>
                                                                        <PhoneIcon/>
                                                                    </IconButton>
                                                                </a>
                                                                :
                                                                <div className={classesPage.rightTopDiv}>
                                                                    <IconButton onClick={()=>{
                                                                        navigator.share({url: `${urlMain}/order/${router.query.id}`})
                                                                    }}>
                                                                        <ShareleIcon/>
                                                                    </IconButton>
                                                                </div>
                                                            :
                                                            null
                                                    }
                                                </div>
                                                <div className={classesPage.divider}/>
                                                <CardContent>
                                                    <div className={classesPage.row} style={{alignItems: 'flex-start'}}>
                                                        <div className={classesOrder.title}>
                                                            {name}
                                                        </div>
                                                        <div className={classesOrder.rowSee}>
                                                            <VisibilityIcon className={classesOrder.iconSee}/>&nbsp;{data.object.views.length}
                                                        </div>
                                                    </div>
                                                    {
                                                        urgency?
                                                            <div className={classesOrder.status}>Срочно</div>
                                                            :
                                                            null
                                                    }
                                                    <br/>
                                                    {
                                                        info?
                                                            <div className={classesPage.info}>
                                                                {info}
                                                            </div>
                                                            :
                                                            null
                                                    }
                                                    {
                                                        images.length?
                                                            <>
                                                            <div className={classesPage.row}>
                                                                {images.map((element, idx)=>
                                                                    <img
                                                                        onClick={() => {
                                                                            setShowLightbox(true)
                                                                            setImagesLightbox(images)
                                                                            setIndexLightbox(idx)
                                                                        }}
                                                                        className={classesOrder.media}
                                                                        src={element}
                                                                        alt={'Добавить'}
                                                                    />
                                                                )}
                                                            </div>
                                                            <br/>
                                                            </>
                                                            :
                                                            null
                                                    }
                                                    <div className={classesOrder.price}>{price}</div>
                                                </CardContent>
                                            </Card>
                                            <Card className={classesOrder.card}>
                                                <CardContent>
                                                    <Link href='/user/[id]' as={`/user/${data.object.customer._id}`}>
                                                        <a>
                                                            <div className={classesPage.row}>
                                                                <div className={classesPage.nameField}>
                                                                    Заказчик:&nbsp;
                                                                </div>
                                                                <div className={classesPage.value}>
                                                                    {data.object.customer.name}
                                                                </div>
                                                            </div>
                                                        </a>
                                                    </Link>
                                                    {
                                                        data.object.executor?
                                                            <Link href='/user/[id]' as={`/user/${data.object.executor._id}`}>
                                                                <a>
                                                                    <div className={classesPage.row}>
                                                                        <div className={classesPage.nameField}>
                                                                            Исполнитель:&nbsp;
                                                                        </div>
                                                                        <div className={classesPage.value}>
                                                                            {data.object.executor.name}
                                                                        </div>
                                                                    </div>
                                                                </a>
                                                            </Link>
                                                            :
                                                            null
                                                    }
                                                    <div className={classesPage.row}>
                                                        <div className={classesPage.nameField}>
                                                            Категория:&nbsp;
                                                        </div>
                                                        <div className={classesPage.value}>
                                                            {
                                                                data.object.category.name
                                                            }
                                                        </div>
                                                    </div>
                                                    <div className={classesPage.row}>
                                                        <div className={classesPage.nameField}>
                                                            Подкатегория:&nbsp;
                                                        </div>
                                                        <div className={classesPage.value}>
                                                            {
                                                                data.object.subcategory.name
                                                            }
                                                        </div>
                                                    </div>
                                                    {
                                                        address?
                                                            <div className={classesPage.row}>
                                                                <div className={classesPage.nameField}>
                                                                    Адрес:&nbsp;
                                                                </div>
                                                                <div className={classesPage.value}>
                                                                    {address}
                                                                </div>
                                                            </div>
                                                            :
                                                            null
                                                    }
                                                    {
                                                        apartment?
                                                            <div className={classesPage.row}>
                                                                <div className={classesPage.nameField}>
                                                                    Квартира:&nbsp;
                                                                </div>
                                                                <div className={classesPage.value}>
                                                                    {apartment}
                                                                </div>
                                                            </div>
                                                            :
                                                            null
                                                    }
                                                    {
                                                        geo[0]===42.8700000&&geo[1]===74.5900000?
                                                            null
                                                            :
                                                            <div className={classesPage.geo} onClick={()=>{
                                                                setFullDialog('Геолокация', <Geo geo={geo}/>)
                                                                showFullDialog(true)
                                                            }}>
                                                                Посмотреть геолокацию
                                                            </div>
                                                    }
                                                    {
                                                        dateStart?
                                                            <div className={classesPage.row}>
                                                                <div className={classesPage.nameField}>Начать:&nbsp;</div>
                                                                <div className={classesPage.value}>{pdDDMMYYHHMM(dateStart)}</div>
                                                            </div>
                                                            :
                                                            null
                                                    }
                                                    {
                                                        dateEnd?
                                                            <div className={classesPage.row}>
                                                                <div className={classesPage.nameField}>Закончить:&nbsp;</div>
                                                                <div className={classesPage.value}>{pdDDMMYYHHMM(dateEnd)}</div>
                                                            </div>
                                                            :
                                                            null
                                                    }
                                                    <div className={classesPage.row}>
                                                        <div className={classesPage.nameField}>Создан:&nbsp;</div>
                                                        <div className={classesPage.value}>{pdDDMMYYHHMM(data.object.createdAt)}</div>
                                                    </div>
                                                    <div className={classesPage.row}>
                                                        <div className={classesPage.nameField}>Статус:&nbsp;</div>
                                                        <div className={classesPage.value} style={{color: statusColor[data.object.status], fontWeight: 600}}>
                                                            {
                                                                data.object.cancelExecutor?
                                                                    'Заказ отменен исполнителем'
                                                                    :
                                                                    data.object.cancelCustomer?
                                                                        'Заказ отменен заказчиком'
                                                                        :
                                                                        data.object.status
                                                            }
                                                        </div>
                                                    </div>
                                                    {
                                                        data.object.cancelExecutor&&data.object.cancelExecutor!=='Заказ отменен исполнителем'||data.object.cancelCustomer&&data.object.cancelCustomer!=='Заказ отменен заказчиком'?
                                                                <div className={classesPage.row}>
                                                                    <div className={classesPage.nameField}>Причина отмены:&nbsp;</div>
                                                                    <div className={classesPage.value}>{data.object.cancelExecutor?data.object.cancelExecutor:data.object.cancelCustomer}</div>
                                                                </div>
                                                            :
                                                            null
                                                    }
                                                </CardContent>
                                            </Card>
                                            {
                                                showResponseOrder?
                                                    <Button
                                                        variant='contained'
                                                        color='primary'
                                                        className={classesCategory.cardAO}
                                                        onClick={async ()=>{
                                                            if(data.object.executor&&data.object.status==='активный') {
                                                                await approveExecutor({
                                                                    _id: data.object._id
                                                                })
                                                                Router.reload()
                                                            }
                                                            else {
                                                                if(!authenticated) {
                                                                    setMiniDialog('', <Sign/>)
                                                                    showMiniDialog(true)
                                                                }
                                                                else {
                                                                    if(data.allowResponseOrder) {
                                                                        if (!profile.name) {
                                                                            Router.push(`/user/${profile._id}`)
                                                                        }
                                                                        else {
                                                                            setMiniDialog('Взять заказ', <ResponseOrder
                                                                                _id={router.query.id}
                                                                                setShowResponseOrder={setShowResponseOrder}/>)
                                                                            showMiniDialog(true)
                                                                        }
                                                                    }
                                                                    else {
                                                                        Router.push(
                                                                            `/application/new?categoryId=${data.object.category._id}&categoryName=${data.object.category.name}&subcategoryId=${data.object.subcategory._id}&subcategoryName=${data.object.subcategory.name}`
                                                                        )
                                                                    }
                                                                }
                                                            }
                                                        }}
                                                    >
                                                        Взять заказ
                                                    </Button>
                                                    :
                                                    null
                                            }
                                            </>
                                        :
                                        list?list.map((element)=> {
                                            if(element&&element.whom)
                                                return (<LazyLoad scrollContainer={'.App-body'} key={element._id} height={height}
                                                          offset={[height, 0]} debounce={0} once={true}
                                                          placeholder={<CardPlaceholder height={height}/>}>
                                                    <CardNotification list={list} setList={setList} element={element} key={element._id}/>
                                                </LazyLoad>)
                                            }
                                        ):null
                                }
                    </div>
                    {
                        router.query.id==='new'?
                            <Button
                                variant='contained'
                                color='primary'
                                className={classesCategory.cardAO}
                                onClick={async ()=>{
                                    if(!profile.name){
                                        Router.push(`/user/${profile._id}`)
                                    }
                                    else {
                                        if ((router.query.executor&&subcategory||(router.query.category||category)&&(router.query.subcategory||subcategory))&&name&&price) {
                                            const action = async() => {
                                                await addOrder({
                                                    name,
                                                    info,
                                                    geo,
                                                    dateStart: !dateStart?null:dateStart,
                                                    dateEnd: !dateEnd?null:dateEnd,
                                                    price: `${price}${price==='Договорная цена'||price.includes('сом')?'':' сом'}`,
                                                    urgency,
                                                    uploads,
                                                    address,
                                                    apartment,
                                                    ...router.query.executor?{
                                                        executor: router.query.executor,
                                                        category: subcategory.category._id,
                                                        subcategory: subcategory._id,
                                                    }:{
                                                        category: router.query.category?router.query.category:category._id,
                                                        subcategory: router.query.subcategory?router.query.subcategory:subcategory._id,
                                                    }
                                                })
                                                setFilter('')
                                                Router.push('/orders?page=0')
                                            }
                                            setMiniDialog('Создать заказ?', <Confirmation action={action}/>)
                                            showMiniDialog(true)
                                        } else {
                                            showSnackBar('Заполните все красные поля')
                                        }
                                    }
                                }}
                            >
                                Создать
                            </Button>
                            :
                            null
                    }
                    {
                        router.query.id!=='new'&&alowEdit||data.object.status==='принят'||['отмена', 'выполнен'].includes(data.object.status)&&data.object.customer._id==profile._id?
                            <div className={isMobileApp?isApple?classesPage.bottomDivMA:classesPage.bottomDivM:classesPage.bottomDivD}>
                                {
                                    alowEdit?
                                        <>
                                        <Button onClick={async()=>{
                                            edit = !edit
                                            if(edit)
                                                setPage(0)
                                            setEdit(edit)
                                        }} color='primary'>
                                            {!edit?'Pедактировать':'Просмотр'}
                                        </Button>
                                        {
                                            edit?
                                                <Button onClick={async()=>{
                                                    let editElement = {_id: router.query.id}
                                                    if(uploads.length)editElement.uploads = uploads
                                                    if(JSON.stringify(images)!==JSON.stringify(data.object.images))editElement.images = images
                                                    if(JSON.stringify(geo)!==JSON.stringify(data.object.geo))editElement.geo = geo
                                                    if(info!==data.object.info)editElement.info = info
                                                    if(name!==data.object.name)editElement.name = name
                                                    if(address!==data.object.address)editElement.address = address
                                                    if(apartment!==data.object.apartment)editElement.apartment = apartment
                                                    if(urgency!==data.object.urgency)editElement.urgency = urgency
                                                    if(dateStart!==data.object.dateStart)editElement.dateStart = dateStart
                                                    if(dateEnd!=data.object.dateEnd)editElement.dateEnd = !dateEnd?null:dateEnd
                                                    if(dateStart!=data.object.dateStart)editElement.dateStart = !dateStart?null:dateStart
                                                    if(price!=data.object.price)editElement.price = `${price}${price==='Договорная цена'||price.includes('сом')?'':' сом'}`
                                                    const action = async() => {
                                                        await setOrder(editElement)
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
                                        <Button onClick={async()=>{
                                            const action = async() => {
                                                await deleteOrder(router.query.id)
                                                setFilter('')
                                                sessionStorage.scrollPostionStore = undefined
                                                sessionStorage.scrollPostionName = undefined
                                                sessionStorage.scrollPostionLimit = undefined
                                                Router.push('/orders?page=0')
                                            }
                                            setMiniDialog('Вы уверены?', <Confirmation action={action}/>)
                                            showMiniDialog(true)
                                        }} color='secondary' className={isMobileApp?classesPage.quickButtonM:classesPage.quickButtonD}>
                                            Удалить
                                        </Button>
                                        </>
                                        :
                                        data.object.status==='принят'?
                                            <>
                                            {
                                                data.object.executor._id==profile._id?
                                                    <Button onClick={async()=>{
                                                        const action = async() => {
                                                            await confirmOrder(router.query.id)
                                                            Router.reload()
                                                        }
                                                        setMiniDialog('Вы уверены?', <Confirmation action={action}/>)
                                                        showMiniDialog(true)
                                                    }} color='primary'>
                                                        Выполнен
                                                    </Button>
                                                    :
                                                    null
                                            }
                                            <Button onClick={async()=>{
                                                setMiniDialog('Отмена заказа', <CancelOrder _id={router.query.id}/>)
                                                showMiniDialog(true)
                                            }} color='secondary' className={isMobileApp?classesPage.quickButtonM:classesPage.quickButtonD}>
                                                Отменить
                                            </Button>
                                            </>
                                            :
                                            <>
                                            {data.object.status==='выполнен'&&!data.object.review?
                                                <Button onClick={async()=> {
                                                    setMiniDialog('Отзыв', <AddReview whom={data.object.executor._id}/>)
                                                    showMiniDialog(true)
                                                }} color='primary'>
                                                    Оставить отзыв
                                                </Button>
                                                :
                                                null
                                            }
                                            <Button onClick={async()=>{
                                                const action = async() => {
                                                    await cloneOrder(router.query.id)
                                                    setFilter('')
                                                    sessionStorage.scrollPostionStore = undefined
                                                    sessionStorage.scrollPostionName = undefined
                                                    sessionStorage.scrollPostionLimit = undefined
                                                    Router.push('/orders?page=0')
                                                }
                                                setMiniDialog('Вы уверены?', <Confirmation action={action}/>)
                                                showMiniDialog(true)
                                            }} color='primary' className={isMobileApp?classesPage.quickButtonM:classesPage.quickButtonD}>
                                                Подать заново
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
                ref={imageRef}
                type='file'
                onChange={handleChangeDocuments}
            />
        </App>
    )
})

Order.getInitialProps = async function(ctx) {
    await initialApp(ctx)
    if(('admin'===ctx.store.getState().user.profile.role||!ctx.store.getState().user.profile.role)&&ctx.query.id==='new')
        if(ctx.res) {
            ctx.res.writeHead(302, {
                Location: '/'
            })
            ctx.res.end()
        } else
            Router.push('/')
    let page = checkInt(ctx.query.page)
    let object = ctx.query.id==='new'? {
        name: '',
        info: '',
        address: '',
        apartment: '',
        geo: [42.8700000, 74.5900000],
        dateStart: null,
        dateEnd: null,
        price: '',
        urgency: false,
        images: []
    }:await getOrder({_id: ctx.query.id}, ctx.req?await getClientGqlSsr(ctx.req):undefined)
    let profile = ctx.store.getState().user.profile
    let allowResponseOrder = false
    let showResponseOrder = ctx.query.id!=='new'&&
        object&&
        object.customer._id!==profile._id&&
        'admin'!==profile.role&&
        object.status==='активный'&&
        !object.responsedUsers.includes(profile._id)&&
        (!object.executor||object.executor._id===profile._id)
    if(ctx.query.id!=='new'&&profile.specializations&&profile.specializations.length&&object) {
        for(let i=0; i<profile.specializations.length; i++) {
            allowResponseOrder = profile.specializations[i].subcategory===object.subcategory._id
            if(allowResponseOrder) {
                if(profile.specializations[i].end<new Date()||profile.specializations[i].enable) {
                    showResponseOrder = false
                }
                break
            }
        }
    }
    let quickTitles = []
    if(ctx.query.subcategory) {
        let subcategory = await getSubcategory({_id: ctx.query.subcategory}, ctx.req?await getClientGqlSsr(ctx.req):undefined)
        if(subcategory&&subcategory.searchWords&&subcategory.searchWords.length)
            quickTitles = subcategory.searchWords.split(', ')
    }
    return {
        data: {
            allowResponseOrder,
            showResponseOrder,
            page,
            object,
            quickTitles,
            categories: ctx.query.id==='new'&&!ctx.query.executor?await getCategories({}, ctx.req?await getClientGqlSsr(ctx.req):undefined):[],
            list: page?await getNotifications({skip: 0, order: ctx.query.id}, ctx.req?await getClientGqlSsr(ctx.req):undefined):[],
            subcategories:
                ctx.query.id==='new'&&ctx.query.executor?
                    await getSubcategoriesBySpecialist(ctx.query.executor, ctx.req?await getClientGqlSsr(ctx.req):undefined)
                :
                ctx.query.id==='new'&&ctx.query.category?
                    await getSubcategories({category: ctx.query.category}, ctx.req?await getClientGqlSsr(ctx.req):undefined)
                    :
                    []

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

export default connect(mapStateToProps, mapDispatchToProps)(Order);