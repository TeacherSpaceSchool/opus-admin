import Head from 'next/head';
import React, {useState, useRef, useEffect} from 'react';
import App from '../../layouts/App';
import { connect } from 'react-redux'
import stylePageList from '../../src/styleMUI/list'
import styleUser from '../../src/styleMUI/other/user'
import styleBlog from '../../src/styleMUI/other/blog'
import { urlMain } from '../../redux/constants/other'
import initialApp from '../../src/initialApp'
import CardBlog from '../../components/CardBlog'
import CardReview from '../../components/CardReview'
import styleCategory from '../../src/styleMUI/other/category'
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Link from 'next/link';
import FavoriteIcon from '@material-ui/icons/Favorite';
import ShareIcon from '@material-ui/icons/Share';
import { getUser, setUser, favoriteUser } from '../../src/gql/user'
import { getReviews, canReview } from '../../src/gql/review'
import { getSubcategories } from '../../src/gql/subcategory'
import { getBlogs } from '../../src/gql/blog'
import {validPhoneLogin, validEmail, cities, inputInt, pdDDMMYYYY} from '../../src/lib'
import { getClientGqlSsr } from '../../src/getClientGQL'
import { useRouter } from 'next/router';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import Sign from '../../components/dialog/Sign'
import AddIcon from '@material-ui/icons/Add';
import Input from '@material-ui/core/Input';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import { bindActionCreators } from 'redux'
import * as snackbarActions from '../../redux/actions/snackbar'
import * as mini_dialogActions from '../../redux/actions/mini_dialog'
import Confirmation from '../../components/dialog/Confirmation'
import SetAchievements from '../../components/dialog/SetAchievements'
import SetPrices from '../../components/dialog/SetPrices'
import SetSpecializations from '../../components/dialog/SetSpecializations'
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import { checkInt, pdtDatePicker, checkFloat } from '../../src/lib'
import LazyLoad from 'react-lazyload';
import CardPlaceholder from '../../components/CardPlaceholder'
import { forceCheck } from 'react-lazyload';
import {getGeoDistance} from '../../src/lib'
import Router from 'next/router'
import IconButton from '@material-ui/core/IconButton';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import Menu from '@material-ui/core/Menu';
import {useSwipeable} from 'react-swipeable';
import Remove from '@material-ui/icons/Remove';
import Rating from '@material-ui/lab/Rating';
import dynamic from 'next/dynamic'
const Geo = dynamic(import('../../components/dialog/Geo'), { ssr: false });
import certificateStyle from '../../src/styleMUI/other/certificate'
import * as appActions from '../../redux/actions/app'
import Switch from '@material-ui/core/Switch';
import Autocomplect2gis from '../../components/app/Autocomplect2gis'
const height = 100

const User = React.memo((props) => {
    const classesPageList = stylePageList();
    const classesUser = styleUser();
    const classesBlog = styleBlog();
    const classesCertificate = certificateStyle();
    const classesCategory = styleCategory();
    const inputRef = useRef(null);
    const switchRef = useRef(true);
    const initialRender = useRef(true);
    const change = useRef(false);
    const { showSnackBar } = props.snackbarActions;
    const { setShowLightbox, setImagesLightbox, setIndexLightbox } = props.appActions;
    const { showMiniDialog, setMiniDialog, setFullDialog, showFullDialog } = props.mini_dialogActions;
    const { data } = props;
    const { isMobileApp, isApple } = props.app;
    const { profile, authenticated  } = props.user;
    const router = useRouter();
    const [page, setPage] = useState(router.query.page?checkInt(router.query.page):0);
    const [list, setList] = useState([]);
    const [_canReview, _setCanReview] = useState(false);
    const getList = async()=>{
        if([1, 2].includes(page)) {
            setList(page === 1 ? await getBlogs({
                user: router.query.id,
                skip: 0
            }) : await getReviews({whom: router.query.id, skip: 0}))
            if(page===2)
                _setCanReview(await canReview(router.query.id))
            paginationWork.current = true;
            forceCheck()
        }
        else {
            setList([])
            paginationWork.current = false
        }
    }
    const handlePage = async (event, newPage) => {
        setPage(newPage);
        (document.getElementsByClassName('App-body'))[0].scroll({top: 0, left: 0, behavior: 'instant' });
    };
    let [hide, setHide] = useState('password');
    let handleHide =  () => {
        setHide(!hide)
    };

    const [edit] = useState(profile.role==='admin'||profile._id===router.query.id);
    let [addresses, setAddresses] = useState(data.user&&data.user.addresses?data.user.addresses.map(e=>{return {address: e.address, geo: e.geo, apartment: e.apartment}}):[]);
    let addAddress = ()=>{
        addresses = [...addresses, {address: '', geo: [42.8700000, 74.5900000]}]
        setAddresses(addresses)
    };
    let deleteAddress = (idx)=>{
        addresses.splice(idx, 1);
        setAddresses([...addresses])
    };
    const [achievements, setAchievements] = useState(data.user&&data.user.achievements?[...data.user.achievements]:[]);
    const [favorite, setFavorite] = useState(data.user&&data.user.favorites&&data.user.favorites.includes(profile._id));
    const [prices, setPrices] = useState(data.user&&data.user.prices?data.user.prices.map(element=>{return {name: element.name, price: element.price}}):[]);
    const [specializations, setSpecializations] = useState(data.user&&data.user.specializations?data.user.specializations.map(element=>{return {category: element.category, enable: element.enable, subcategory: element.subcategory, end: element.end, discount: element.discount}}):[]);
    const [name, setName] = useState(data.user&&data.user.name?data.user.name:'');
    const [certificates, setCertificates] = useState(data.user&&data.user.certificates?[...data.user.certificates]:[]);
    let [uploadCertificates, setUploadsCertificate] = useState([]);
    let handleChangeCertificates = (async (event) => {
        if(event.target.files[0]&&event.target.files[0].size / 1024 / 1024 < 50) {
            setUploadsCertificate([event.target.files[0], ...uploadCertificates])
            setCertificates([URL.createObjectURL(event.target.files[0]), ...certificates])
        } else {
            showSnackBar('Файл слишком большой')
        }
    })
    let certificateRef = useRef(null);
    const [login, setLogin] = useState(data.user&&data.user.login?data.user.login:'');
    const [password, setPassword] = useState(data.user&&data.user.password?data.user.password:'');
    const [city, setCity] = useState(data.user&&data.user.city?data.user.city:'Бишкек');
    let handleCity = event => setCity(event.target.value)
    const [email, setEmail] = useState(data.user&&data.user.email?data.user.email:'');
    const [info, setInfo] = useState(data.user&&data.user.info?data.user.info:'');
     let [preview, setPreview] = useState(data.user&&data.user.avatar?data.user.avatar:'/static/add.png');
    let [avatar, setAvatar] = useState(undefined);
    let handleChangeAvatar = ((event) => {
        if(event.target.files[0]&&event.target.files[0].size/1024/1024<50){
            setAvatar(event.target.files[0])
            setPreview(URL.createObjectURL(event.target.files[0]))
        } else {
            showSnackBar('Файл слишком большой')
        }
    })
    let paginationWork = useRef(false);
    const checkPagination = async()=>{
        if(paginationWork.current){
            let addedList = page===1?await getBlogs({user: router.query.id, skip: list.length}):[]
            if(addedList.length>0)
                setList([...list, ...addedList])
            else
                paginationWork.current = false
        }
    }
    useEffect(() => {
        if(!name)
            showSnackBar('Пожалуйста, укажите ваше имя')
    }, []);
    const [near, setNear] = useState(false);
    const [geo, setGeo] = useState();
    useEffect(() => {
        if(data.user&&geo&&data.user.geo&&profile._id!==router.query.id&&data.user.online)
            setNear(getGeoDistance(...geo, ...data.user.geo)<1500)
    }, [geo]);
    useEffect(()=>{
        (async()=>{
            if(page)
                getList()
        })()
    },[page])
    const [anchorElQuick, setAnchorElQuick] = useState(null);
    const openQuick = Boolean(anchorElQuick);
    let handleMenuQuick = (event) => {
        setAnchorElQuick(event.currentTarget);
    }
    let handleCloseQuick = () => {
        setAnchorElQuick(null);
    }
    const handlerSwipe = useSwipeable({
        onSwipedLeft: (eventData) => {
            if(data.user.specializations.length&&!eventData.event.target.className.includes('noteImage')) {
                if (page === 0)
                    handlePage({}, 1)
                else if (page === 1)
                    handlePage({}, 2)
            }
        },
        onSwipedRight: () => {
            if(data.user.specializations.length) {
                if (page === 2)
                    handlePage({}, 1)
                else if (page === 1)
                    handlePage({}, 0)
            }
        },
        delta: 80
    });
    useEffect(() => {
        if(edit&&!initialRender.current) {
            if(!change.current) {
                router.replace(`${router.pathname}?change=true`, `/user/${router.query.id}?change=true`, {shallow: true})
                change.current = true
            }
            router.beforePopState(() => {
                if(!change.current)
                    return true
                history.go(1)
                const action = async() => {
                    await save()
                    await Router.back()
                }
                const actionCancel = async() => {
                    change.current = false
                    Router.back()
                }
                setMiniDialog('Сохранить изменения?', <Confirmation action={action} actionCancel={actionCancel}/>)
                showMiniDialog(true)
                return false
            })
            return () => {
                router.beforePopState(() => {
                    return true
                })
            }
        }
        else if(initialRender.current)
            initialRender.current = false
    }, [login, certificates, uploadCertificates, addresses, password, name, city, email, info, avatar, specializations, achievements, prices]);
    const save = async()=>{
        if (name&&validPhoneLogin(login)&&(!email||validEmail(email))) {
            let editElement = {_id: router.query.id}

            if(!data.user.achievements||JSON.stringify(achievements)!==JSON.stringify(data.user.achievements))editElement.achievements = achievements
            if(!data.user.addresses||JSON.stringify(addresses)!==JSON.stringify(data.user.addresses.map(e=>{return {address: e.address, geo: e.geo, apartment: e.apartment}})))editElement.addresses = addresses
            if(!data.user.prices||JSON.stringify(prices)!==JSON.stringify(data.user.prices.map(e=>{return {name: e.name, price: e.price}})))editElement.prices = prices

            if(!data.user.specializations||JSON.stringify(specializations)!==JSON.stringify(data.user.specializations)) {
                let _specializations = [...specializations]
                for(let i=0; i<_specializations.length; i++) {
                    _specializations[i].discount = checkInt(_specializations[i].discount)
                    _specializations[i].subcategory = _specializations[i].subcategory._id
                }
                editElement.specializations = _specializations
            }

            if(uploadCertificates.length)editElement.uploadCertificates = uploadCertificates
            if(JSON.stringify(certificates)!==JSON.stringify(data.user.certificates))editElement.certificates = certificates

            if(city&&city!==data.user.city)editElement.city = city
            if(name&&name!==data.user.name)editElement.name = name

            if(password&&password.length>7)editElement.password = password
            if(login&&login!==data.user.login)editElement.login = login
            if(email&&email!==data.user.email)editElement.email = email
            if(info&&info!==data.user.info)editElement.info = info
            if(avatar)editElement.avatar = avatar
            await setUser(editElement)
            await router.replace(`${router.pathname}?change=false`, `/user/${router.query.id}?change=false`)
            change.current = false
        }
        else {
            showSnackBar('Заполните все красные поля')
        }
    }
    return (
        <App handlerSwipe={handlerSwipe} save={save} pageName={data.user?data.user.name:'Ничего не найдено'} paginationWork={paginationWork} checkPagination={checkPagination} setGeo={data.user&&profile._id!==router.query.id&&data.user.online?setGeo:null}>
            <Head>
                <title>{data.user?data.user.name:'Ничего не найдено'}</title>
                <meta name='description' content={info} />
                <meta property='og:title' content={data.user?data.user.name:'Ничего не найдено'} />
                <meta property='og:description' content={info} />
                <meta property='og:type' content='website' />
                <meta property='og:avatar' content={data.user?data.user.avatar:`${urlMain}/static/512x512.png`} />
                <meta property='og:url' content={`${urlMain}/user/${router.query.id}`} />
                <link rel='canonical' href={`${urlMain}/user/${router.query.id}`}/>
            </Head>
            {
                data.user?
                    <div className={classesPageList.page} style={{alignItems: 'baseline', gap: data.user.specializations.length?0:10, paddingTop: 0}}>
                        <div className={classesUser.divProfile}>
                            {
                                data.user.specializations.length?
                                    <div className={classesUser.pinProfile}>
                                        {
                                            !edit && profile.role ?
                                                <FavoriteIcon
                                                    onClick={async () => {
                                                        if (await favoriteUser(router.query.id) === 'OK')
                                                            setFavorite(!favorite)
                                                    }}
                                                    className={classesUser.iconButtonProfile}
                                                    style={{color: favorite ? 'red' : 'rgba(0, 0, 0, 0.54)'}}
                                                />
                                                :
                                                null
                                        }
                                        {
                                            isMobileApp?
                                                <ShareIcon onClick={()=>navigator.share({url: `${urlMain}/user/${router.query.id}`})} className={classesUser.iconButtonProfile}/>
                                                :
                                                null
                                        }
                                    </div>
                                    :
                                    null
                            }
                            <div className={isMobileApp||!data.user.specializations.length?classesUser.columnProfile:classesUser.rowCenterProfile}>
                                <div className={isMobileApp||!data.user.specializations.length?classesUser.divAvatarProfileM:classesUser.divAvatarProfileD}>
                                    <img
                                        className={classesUser.avatarProfile}
                                        src={preview}
                                        alt={name}
                                        onClick={async()=> {
                                            if(edit)
                                                inputRef.current.click()
                                        }}
                                    />
                                </div>
                                <div className={classesUser.columnDataProfile}>
                                    <div className={isMobileApp||!data.user.specializations.length?classesPageList.rowCenter:classesUser.rowProfile}>
                                        <div style={!isMobileApp&&!data.user.specializations.length?{textAlign: 'center'}:{}} className={isMobileApp?classesUser.nameProfileM:classesUser.nameProfileD}>
                                            {name}
                                            {
                                                data.user.specializations.length&&(profile._id!==router.query.id&&data.user.online)?
                                                    <div className={isMobileApp?classesPageList.rowCenter:classesPageList.row}>
                                                        {profile._id!==router.query.id&&data.user.online?<div className={classesUser.online}>online</div>:null}
                                                        &nbsp;
                                                        {profile._id!==router.query.id&&near?<div className={classesUser.near}>близко</div>:null}
                                                    </div>
                                                    :
                                                    null
                                            }
                                        </div>
                                    </div>
                                    {
                                        data.user.specializations.length?
                                            <>
                                            <div className={classesUser.dividerProfile}/>
                                            <div style={isMobileApp?{justifyContent: 'center'}:{}} className={classesUser.rowRatinig}>
                                                <div className={classesUser.valueRatinig}>{data.user.reiting}</div>
                                                <Rating defaultValue={data.user.reiting} precision={0.1} readOnly />
                                            </div>
                                            {
                                                achievements.length?
                                                    <>
                                                    <div className={classesUser.dividerProfile}/>
                                                    {achievements.map((element, idx)=>
                                                        <div className={classesUser.rowProfile} key={`achievements${idx}`} onClick={async()=>{
                                                            if(profile.role==='admin'&&page===0) {
                                                                setMiniDialog('Достижения', <SetAchievements
                                                                    setAchievements={setAchievements}
                                                                    achievements={achievements}/>)
                                                                showMiniDialog(true)
                                                            }
                                                        }}>
                                                            <div className={classesUser.textProfile}>
                                                                {element}
                                                            </div>
                                                        </div>
                                                    )}
                                                    </>
                                                    :
                                                    null
                                            }
                                            <div className={classesUser.dividerProfile}/>
                                            <div className={classesUser.rowProfile}>
                                                ✔️&nbsp;
                                                <div className={classesUser.textProfile}>
                                                    Работ выполнено:&nbsp;<b>{data.user.completedWorks}</b>
                                                </div>
                                            </div>
                                            <div className={classesUser.rowProfile} onClick={async()=>{
                                                /*if(profile.role==='admin'&&page===0) {
                                                    let _specializations = [...specializations]
                                                    for (let i = 0; i < _specializations.length; i++) {
                                                        _specializations[i].end = pdtDatePicker(_specializations[i].end)
                                                    }
                                                    setMiniDialog('Специализации', <SetSpecializations
                                                        subcategories={data.subcategories}
                                                        setSpecializations={setSpecializations}
                                                        specializations={_specializations}
                                                    />)
                                                    showMiniDialog(true)
                                                }*/
                                            }}>
                                                🔧&nbsp;
                                                <div className={edit?classesUser.column:classesUser.textProfile}>
                                                    {
                                                        specializations.map((element, idx)=> {
                                                            if(edit) {
                                                                return <div className={classesPageList.row} key={`specializations${idx}`}>
                                                                    <Switch
                                                                        checked={specializations[idx].enable}
                                                                        onChange={async ()=>{
                                                                            if(switchRef.current) {
                                                                                switchRef.current = false
                                                                                specializations[idx].enable = !specializations[idx].enable
                                                                                setSpecializations([...specializations])

                                                                                let editElement = {_id: router.query.id}
                                                                                editElement.specializations = specializations.map(element=>{
                                                                                    return {
                                                                                        category: element.category,
                                                                                        enable: element.enable,
                                                                                        subcategory: element.subcategory._id,
                                                                                        end: element.end,
                                                                                        discount: checkInt(element.discount)
                                                                                    }
                                                                                })
                                                                                await setUser(editElement)

                                                                                switchRef.current = true
                                                                            }
                                                                        }}
                                                                        color='primary'
                                                                        size='small'
                                                                    />
                                                                    <div className={classesUser.textProfile} style={idx+1!==specializations.length?{marginBottom: 15}:{}}>
                                                                        {element.subcategory.name}
                                                                        <span style={element.end < new Date()?{color: 'red'}:{}}>
                                                                            &nbsp;({pdDDMMYYYY(element.end)})
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            }
                                                            else {
                                                                idx += 1
                                                                return `${element.subcategory.name}${idx!==specializations.length?', ':''}`
                                                            }
                                                        })
                                                    }
                                                </div>
                                            </div>
                                            {
                                                edit&&page===0||prices.length?
                                                    <>
                                                    <div className={classesUser.dividerProfile}/>
                                                    <div className={classesUser.priceListProfile} onClick={async()=>{
                                                        setMiniDialog('', <SetPrices
                                                            edit={edit&&page===0}
                                                            setPrices={setPrices}
                                                            prices={prices}
                                                        />)
                                                        showMiniDialog(true)
                                                    }}>
                                                        Цены на услуги
                                                    </div>
                                                    </>
                                                    :
                                                    <div className={classesUser.br}/>
                                            }
                                            </>
                                            :
                                            null
                                    }
                                </div>
                            </div>
                        </div>
                        {
                            data.user.specializations.length?
                                <div className={classesPageList.stickyTab}>
                                    <Tabs
                                        value={page}
                                        onChange={handlePage}
                                        indicatorColor='primary'
                                        textColor='primary'
                                        centered
                                    >
                                        <Tab label='Анкета' />
                                        <Tab label='Мои работы' />
                                        <Tab label='Отзывы' />
                                    </Tabs>
                                </div>
                                :
                                null
                        }
                        {
                            page===0?
                                <Card className={classesUser.divForm}>
                                    <CardContent>
                                        {
                                            edit?
                                                <>
                                                <Input
                                                    error={!!(password.length&&password.length<8)}
                                                    value={password}
                                                    onChange={(event)=>{setPassword(event.target.value)}}
                                                    placeholder='Новый пароль'
                                                    autoComplete='new-password'
                                                    type={hide ? 'password' : 'text' }
                                                    className={classesPageList.input}
                                                    endAdornment={
                                                        <InputAdornment position='end'>
                                                            <IconButton aria-label='Toggle password visibility' onClick={handleHide}>
                                                                {hide ? <VisibilityOff />:<Visibility />  }
                                                            </IconButton>
                                                        </InputAdornment>
                                                    }
                                                />
                                                <TextField
                                                    error={edit&&!name.length}
                                                    label='Имя*'
                                                    value={name}
                                                    onChange={(event)=>{if(edit)setName(event.target.value)}}
                                                    className={classesPageList.input}
                                                    inputProps={{
                                                        'aria-label': 'description',
                                                        readOnly: !edit,
                                                    }}
                                                />
                                                </>
                                                :
                                                null
                                        }
                                        {
                                            edit ?
                                                <>
                                                <TextField
                                                    value={login}
                                                    onChange={(event)=>{if(edit)setLogin(inputInt(event.target.value))}}
                                                    error={!validPhoneLogin(login)}
                                                    label='Телефон*. Формат: +996559871952'
                                                    type='login'
                                                    className={classesPageList.input}
                                                    margin='normal'
                                                    InputProps={{
                                                        startAdornment: <InputAdornment position='start'>+996</InputAdornment>,
                                                    }}
                                                />
                                                </>
                                                :
                                                null
                                        }
                                        {
                                            edit?
                                                <>
                                                <TextField
                                                    type='email'
                                                    label='Email'
                                                    className={classesPageList.input}
                                                    error={email.length&&!validEmail(email)}
                                                    value={email}
                                                    onChange={(event)=>{if(edit)setEmail(event.target.value)}}
                                                />
                                                {addresses.map((element, idx)=>
                                                    <div key={`address${idx}`} className={classesPageList.column}>
                                                        {
                                                            isMobileApp?
                                                                <>
                                                                <div className={classesPageList.row}>
                                                                    <TextField
                                                                        label='Квартира'
                                                                        className={classesPageList.input}
                                                                        value={element.apartment}
                                                                        onChange={(event)=>{addresses[idx].apartment = event.target.value; setAddresses([...addresses])}}
                                                                    />
                                                                    <IconButton
                                                                        onClick={()=>{
                                                                            deleteAddress(idx)
                                                                        }}
                                                                        aria-label='toggle password visibility'
                                                                    >
                                                                        <Remove/>
                                                                    </IconButton>
                                                                </div>
                                                                <Autocomplect2gis
                                                                    setAddress={(address)=>{addresses[idx].address = address; setAddresses([...addresses])}}
                                                                    setGeo={(geo)=>{addresses[idx].geo = geo;setAddresses([...addresses])}}
                                                                    defaultValue={element.address}
                                                                    _inputValue={element.address}
                                                                    label={`Адрес ${idx+1}`}
                                                                />
                                                                </>
                                                                :
                                                                <div className={classesPageList.row}>
                                                                    <Autocomplect2gis
                                                                        setAddress={(address)=>{addresses[idx].address = address; setAddresses([...addresses])}}
                                                                        setGeo={(geo)=>{addresses[idx].geo = geo;setAddresses([...addresses])}}
                                                                        defaultValue={element.address}
                                                                        _inputValue={element.address}
                                                                        label={`Адрес ${idx+1}`}
                                                                    />
                                                                    <TextField
                                                                        label='Квартира'
                                                                        className={classesPageList.input}
                                                                        value={element.apartment}
                                                                        onChange={(event)=>{addresses[idx].apartment = event.target.value; setAddresses([...addresses])}}
                                                                    />
                                                                    <IconButton
                                                                        onClick={()=>{
                                                                            deleteAddress(idx)
                                                                        }}
                                                                        aria-label='toggle password visibility'
                                                                    >
                                                                        <Remove/>
                                                                    </IconButton>
                                                                </div>
                                                        }
                                                        <div className={classesPageList.geo} style={element.geo[0]===42.8700000&&element.geo[1]===74.5900000?{color: 'red'}:{}} onClick={()=>{
                                                            setFullDialog('Геолокация', <Geo change={true} geo={element.geo} setAddressGeo={newGeo=>{
                                                                addresses[idx].geo = newGeo
                                                                setAddresses([...addresses])
                                                            }}
                                                                                             setAddressName={addressName=>{
                                                                                                 addresses[idx].address = addressName
                                                                                                 setAddresses([...addresses])
                                                                                             }}
                                                            />)
                                                            showFullDialog(true)
                                                        }}>
                                                            {
                                                                element.geo[0]===42.8700000&&element.geo[1]===74.5900000?
                                                                    'Задайте геолокацию'
                                                                    :
                                                                    'Изменить геолокацию'
                                                            }
                                                        </div>
                                                    </div>
                                                )}
                                                <Button onClick={async()=>{
                                                    addAddress()
                                                }} color='primary'>
                                                    Добавить адрес
                                                </Button>
                                                <br/>
                                                </>
                                                :
                                                null
                                        }
                                        <FormControl className={classesPageList.input}>
                                            <InputLabel>Город</InputLabel>
                                            <Select value={city} onChange={handleCity}
                                                    inputProps={{
                                                        'aria-label': 'description',
                                                        readOnly: !edit,
                                                    }}>
                                                {cities.map((element)=>
                                                    <MenuItem key={element} value={element} ola={element}>{element}</MenuItem>
                                                )}
                                            </Select>
                                        </FormControl>
                                        {
                                            data.user.specializations.length&&(edit||data.user.certificates.length)?
                                                <>
                                                <div className={classesCertificate.nameField}>Сертификаты, дипломы и тд.</div>
                                                <div className={classesCertificate.noteImageList}>
                                                    {
                                                        edit?
                                                            <img className={classesCertificate.noteImage} src='/static/add.png' onClick={()=>{certificateRef.current.click()}} />
                                                            :
                                                            null
                                                    }
                                                    {certificates.map((element, idx)=> <div key={`noteImageDiv${idx}`} className={classesCertificate.noteImageDiv}>
                                                        <img className={classesCertificate.noteImage} src={element} onClick={()=>{
                                                            setShowLightbox(true)
                                                            setImagesLightbox(certificates)
                                                            setIndexLightbox(idx)
                                                        }}/>
                                                        {
                                                            edit?
                                                                <div className={classesPageList.noteImageButton} style={{background: 'red'}} onClick={()=>{
                                                                    certificates.splice(idx, 1)
                                                                    setCertificates([...certificates])
                                                                }}>X</div>
                                                                :
                                                                null
                                                        }
                                                    </div>)}
                                                </div>
                                                </>
                                                :
                                                null
                                        }
                                        {
                                            data.user.specializations.length?
                                                <TextField
                                                    multiline={true}
                                                    label='О себе'
                                                    value={info}
                                                    onChange={(event)=>{if(edit)setInfo(event.target.value)}}
                                                    className={classesPageList.input}
                                                    inputProps={{
                                                        'aria-label': 'description',
                                                        readOnly: !edit,
                                                    }}
                                                />
                                                :
                                                null
                                        }
                                    </CardContent>
                                </Card>
                                :
                                page===1?
                                    <div className={classesBlog.row}>
                                        {
                                            edit&&profile.role!=='admin'?
                                                <CardBlog setList={setList} list={list}/>
                                                :
                                                null
                                        }
                                        {
                                            list.map((element, idx)=> {
                                                if(element)
                                                    return <LazyLoad scrollContainer={'.App-body'} key={element._id}
                                                              height={height} offset={[height, 0]} debounce={0} once={true}
                                                              placeholder={<CardPlaceholder height={height}/>}>
                                                        <CardBlog element={element} setList={setList} list={list} idx={idx}
                                                                  edit={edit}/>
                                                    </LazyLoad>
                                                }
                                            )
                                        }
                                    </div>
                                    :
                                    page===2?
                                        <div className={classesBlog.row}>
                                            {
                                                _canReview?
                                                    <CardReview _setCanReview={_setCanReview} setList={setList} list={list} whom={router.query.id}/>
                                                    :
                                                    null
                                            }
                                            {
                                                list.map((element)=> {
                                                        if(element&&element.who)
                                                            return (<LazyLoad scrollContainer={'.App-body'} key={element._id}
                                                                              height={height} offset={[height, 0]} debounce={0}
                                                                              once={true}
                                                                              placeholder={<CardPlaceholder height={height}/>}>
                                                                <CardReview element={element} setList={setList} list={list}
                                                                            whom={router.query.id}/>
                                                            </LazyLoad>)
                                                    }
                                                )
                                            }
                                        </div>
                                        :
                                        null
                        }
                        <IconButton className={classesPageList.backArrow}
                                    onClick={()=>Router.back()}>
                            <ArrowBackIcon/>
                        </IconButton>
                    </div>
                    :
                    null
            }
            <input
                ref={inputRef}
                accept='image/*'
                style={{ display: 'none' }}
                id='contained-button-file'
                type='file'
                onChange={handleChangeAvatar}
            />
            <input
                ref={certificateRef}
                accept='image/*'
                style={{ display: 'none' }}
                id={'addCertificate'}
                type='file'
                onChange={handleChangeCertificates}
            />
            {
                !edit&&specializations.length?
                    authenticated?
                        <Link
                            href={{pathname: '/order/[id]', query: {executor: router.query.id}}}
                            as={`/order/new?executor=${router.query.id}`}
                        >
                            <Button
                                variant='contained'
                                color='primary'
                                className={classesCategory.cardAO}
                                startIcon={<AddIcon />}
                            >
                                Заказ исполнителю
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
                            Заказ исполнителю
                        </Button>
                    :
                    null
            }
            {
                edit&&page===0?
                    <div className={isMobileApp?isApple?classesPageList.bottomDivMA:classesPageList.bottomDivM:classesPageList.bottomDivD}>
                        <Button onClick={async()=>{
                            if (!(name&&validPhoneLogin(login)&&(!email||validEmail(email)))) {
                                showSnackBar('Заполните все красные поля')
                            }
                            const action = async() => {
                                await save()
                                await Router.reload()
                            }
                            setMiniDialog('Вы уверены?', <Confirmation action={action}/>)
                            showMiniDialog(true)
                        }} color='primary'>
                            Сохранить
                        </Button>
                        {
                            profile.role==='admin'?
                                <>
                                {
                                    router.query.id!=='new'?
                                        <>
                                        <Menu
                                            key='Quick'
                                            id='menu-appbar'
                                            anchorEl={anchorElQuick}
                                            anchorOrigin={{
                                                vertical: 'bottom',
                                                horizontal: 'right',
                                            }}
                                            transformOrigin={{
                                                vertical: 'bottom',
                                                horizontal: 'right',
                                            }}
                                            open={openQuick}
                                            onClose={handleCloseQuick}
                                        >
                                            <MenuItem onClick={async()=>{
                                                let _specializations = [...specializations]
                                                for (let i = 0; i < _specializations.length; i++) {
                                                    _specializations[i].end = pdtDatePicker(_specializations[i].end)
                                                }
                                                setMiniDialog('Специализации', <SetSpecializations
                                                    subcategories={data.subcategories}
                                                    setSpecializations={setSpecializations}
                                                    specializations={_specializations}
                                                />)
                                                showMiniDialog(true)
                                                handleCloseQuick()
                                            }}>
                                                Специализации
                                            </MenuItem>
                                            {
                                                specializations.length?
                                                    <>
                                                    <MenuItem onClick={async()=>{
                                                        setMiniDialog('Достижения', <SetAchievements
                                                            setAchievements={setAchievements}
                                                            achievements={achievements}/>)
                                                        showMiniDialog(true)
                                                        handleCloseQuick()
                                                    }}>
                                                        Достижения
                                                    </MenuItem>
                                                    <MenuItem onClick={async()=>{
                                                        setMiniDialog('Цены на услуги', <SetPrices
                                                            edit={edit}
                                                            setPrices={setPrices}
                                                            prices={prices}
                                                        />)
                                                        showMiniDialog(true)
                                                        handleCloseQuick()
                                                    }}>
                                                        Цены
                                                    </MenuItem>
                                                    </>
                                                    :
                                                    null
                                            }
                                            <Link
                                                href={{pathname: '/orders', query: {user: router.query.id}}}
                                                as={`/orders?user=${router.query.id}`}
                                            >
                                                <MenuItem>
                                                    Заказы
                                                </MenuItem>
                                            </Link>
                                            <Link
                                                href={{pathname: '/notifications', query: {user: router.query.id}}}
                                                as={`/notifications?user=${router.query.id}`}
                                            >
                                                <MenuItem>
                                                    Уведомления
                                                </MenuItem>
                                            </Link>
                                        </Menu>
                                        <Button
                                            size='large'
                                            onClick={handleMenuQuick}
                                            className={isMobileApp?classesPageList.quickButtonM:classesPageList.quickButtonD}
                                            color='primary'
                                        >
                                            Инструменты
                                        </Button>
                                        </>
                                        :
                                        null
                                }
                                </>
                                :
                                <Link  href='/application/[id]' as={'/application/new'}>
                                    <Button
                                        className={isMobileApp?classesPageList.quickButtonM:classesPageList.quickButtonD}
                                        color='primary'
                                    >
                                        Стать исполнителем
                                    </Button>
                                </Link>
                        }
                    </div>
                    :
                    null
            }
        </App>
    )
})

User.getInitialProps = async function(ctx) {
    await initialApp(ctx)
    let user = await getUser({_id: ctx.query.id}, ctx.req?await getClientGqlSsr(ctx.req):undefined)
    let subcategories = await getSubcategories({}, ctx.req?await getClientGqlSsr(ctx.req):undefined)
    if(user) {
        if(user.reiting&&user.reiting.length) {
            let reiting = 0
            for (let i = 0; i < user.reiting.length; i++) {
                reiting += user.reiting[i]
            }
            user.reiting = checkFloat(reiting/user.reiting.length)
        }
        else
            user.reiting = 0
        if(user.specializations.length) {
            let _specializations = [...user.specializations], specializations = []
            for (let i = 0; i < _specializations.length; i++) {
                for (let i1 = 0; i1 < subcategories.length; i1++) {
                    if (subcategories[i1]._id === _specializations[i].subcategory) {
                        _specializations[i].subcategory = subcategories[i1]
                        break
                    }
                }
                if(
                    _specializations[i].subcategory&&(
                        _specializations[i].end>new Date()&&_specializations[i].enable
                        ||
                        'admin'===ctx.store.getState().user.profile.role
                        ||
                        ctx.store.getState().user.profile._id===ctx.query.id
                    )
                )
                    specializations.push({
                        category: _specializations[i].category,
                        subcategory: _specializations[i].subcategory,
                        end: _specializations[i].end,
                        discount: _specializations[i].discount,
                        enable: _specializations[i].enable
                    })
            }
            user.specializations = [...specializations]
        }
    }
    return {
        data: {
            user,
            subcategories
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
        snackbarActions: bindActionCreators(snackbarActions, dispatch),
        mini_dialogActions: bindActionCreators(mini_dialogActions, dispatch),
        appActions: bindActionCreators(appActions, dispatch),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(User);