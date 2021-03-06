import Head from 'next/head';
import React, { useState } from 'react';
import App from '../layouts/App';
import { connect } from 'react-redux'
import { getContact, setContact } from '../src/gql/contact'
import contactStyle from '../src/styleMUI/contact'
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Input from '@material-ui/core/Input';
import Button from '@material-ui/core/Button';
import { bindActionCreators } from 'redux'
import * as mini_dialogActions from '../redux/actions/mini_dialog'
import * as snackbarActions from '../redux/actions/snackbar'
import IconButton from '@material-ui/core/IconButton';
import Remove from '@material-ui/icons/Remove';
import InputAdornment from '@material-ui/core/InputAdornment';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import TextField from '@material-ui/core/TextField';
import Confirmation from '../components/dialog/Confirmation'
import AddSocial from '../components/dialog/AddSocial'
import Autocomplect2gis from '../components/app/Autocomplect2gis'
import { urlMain } from '../redux/constants/other'
import { getClientGqlSsr } from '../src/getClientGQL'
import initialApp from '../src/initialApp'
import { validPhoneLogin, validEmail } from '../src/lib'
import Router from 'next/router'
import dynamic from 'next/dynamic'
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import Link from 'next/link';
const Geo = dynamic(import('../components/dialog/Geo'), { ssr: false });

const Contact = React.memo((props) => {
    const classes = contactStyle();
    const { data } = props;
    const { isMobileApp, isApple } = props.app;
    const { showSnackBar } = props.snackbarActions;
    let [name, setName] = useState(data.contact.name);
    let [addresses, setAddresses] = useState(data.contact.addresses?data.contact.addresses.map(e=>{return {address: e.address, geo: e.geo}}):[]);
    let addAddress = ()=>{
        addresses = [...addresses, {address: '', geo: [42.8700000, 74.5900000]}]
        setAddresses(addresses)
    };
    let deleteAddress = (idx)=>{
        addresses.splice(idx, 1);
        setAddresses([...addresses])
    };
    let [email, setEmail] = useState([...data.contact.email]);
    let [newEmail, setNewEmail] = useState('');
    let addEmail = ()=>{
        email = [...email, newEmail]
        setEmail(email)
        setNewEmail('')
    };
    let editEmail = (event, idx)=>{
        email[idx] = event.target.value
        setEmail([...email])
    };
    let deleteEmail = (idx)=>{
        email.splice(idx, 1);
        setEmail([...email])
    };
    let [phone, setPhone] = useState([...data.contact.phone]);
    let [newPhone, setNewPhone] = useState('');
    let addPhone = ()=>{
        phone = [...phone, newPhone]
        setPhone(phone)
        setNewPhone('')
    };
    let editPhone = (event, idx)=>{
        phone[idx] = event.target.value
        setPhone([...phone])
    };
    let deletePhone = (idx)=>{
        phone.splice(idx, 1);
        setPhone([...phone])
    };
    let [social, setSocial] = useState([...data.contact.social]);
    let addSocial = (value, idx)=>{
        social[idx] = value
        setSocial([...social])
    };
    let [info, setInfo] = useState(data.contact.info);
    let [preview, setPreview] = useState(data.contact.image===''?'/static/add.png':data.contact.image);
    let [image, setImage] = useState(undefined);
    let handleChangeImage = ((event) => {
        if(event.target.files[0]&&event.target.files[0].size/1024/1024<50){
            setImage(event.target.files[0])
            setPreview(URL.createObjectURL(event.target.files[0]))
        } else {
            showSnackBar('???????? ?????????????? ??????????????')
        }
    })
    const { profile } = props.user;
    const { setMiniDialog, showMiniDialog, setFullDialog, showFullDialog } = props.mini_dialogActions;
    return (
        <App pageName='????????????????'>
            <Head>
                <title>????????????????</title>
                <meta name='description' content={info} />
                <meta property='og:title' content='OPUS.KG' />
                <meta property='og:description' content={info} />
                <meta property='og:type' content='website' />
                <meta property='og:image' content={`${urlMain}/static/512x512.png`} />
                <meta property='og:url' content={`${urlMain}/contact`} />
                <link rel='canonical' href={`${urlMain}/contact`}/>
            </Head>
            <Card className={classes.page} style={{marginBottom: 60}}>
                <IconButton className={classes.backArrow} onClick={()=>Router.back()}>
                    <ArrowBackIcon/>
                </IconButton>
                <CardContent className={isMobileApp?classes.column:classes.row} style={{marginTop: 30}}>
                    {
                        'admin'===profile.role?
                            <>
                            <div className={classes.column}>
                                <label htmlFor='contained-button-file'>
                                    <img
                                        className={isMobileApp?classes.mediaM:classes.mediaD}
                                        src={preview}
                                        alt={'????????????????'}
                                    />
                                </label>
                                <br/>
                                ???????? ????????????????
                                <div className={classes.row}>
                                    <img src='/static/instagram.svg' onClick={()=>{
                                        setMiniDialog('Instagram', <AddSocial social={social[0]} action={addSocial} idx={0}/>)
                                        showMiniDialog(true)
                                    }} className={classes.mediaSocial}/>
                                    <img src='/static/facebook.svg' onClick={()=>{
                                        setMiniDialog('Facebook', <AddSocial social={social[1]} action={addSocial} idx={1}/>)
                                        showMiniDialog(true)
                                    }} className={classes.mediaSocial}/>
                                    <img src='/static/twitter.svg' onClick={()=>{
                                        setMiniDialog('Twitter', <AddSocial social={social[2]} action={addSocial} idx={2}/>)
                                        showMiniDialog(true)
                                    }} className={classes.mediaSocial}/>
                                    <img src='/static/telegram.svg' onClick={()=>{
                                        setMiniDialog('Telegram', <AddSocial social={social[3]} action={addSocial} idx={3}/>)
                                        showMiniDialog(true)
                                    }} className={classes.mediaSocial}/>
                                </div>
                            </div>
                            <div>
                                <TextField
                                    label='????????????????'
                                    value={name}
                                    className={classes.input}
                                    onChange={(event)=>{setName(event.target.value)}}
                                    inputProps={{
                                        'aria-label': 'description',
                                    }}
                                />
                                {addresses.map((element, idx)=>
                                    <div key={`address${idx}`} className={classes.column}>
                                        <div className={classes.row}>
                                            <Autocomplect2gis
                                                setAddress={(address)=>{addresses[idx].address = address; setAddresses([...addresses])}}
                                                _inputValue={element.address}
                                                setGeo={(geo)=>{addresses[idx].geo = geo;setAddresses([...addresses])}}
                                                defaultValue={element.address}
                                                label={`?????????? ${idx+1}`}
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
                                        <div className={classes.geo} style={element.geo[0]===42.8700000&&element.geo[1]===74.5900000?{color: 'red'}:{}} onClick={()=>{
                                            setFullDialog('????????????????????', <Geo change={true} geo={element.geo}
                                                                             setAddressGeo={newGeo=>{
                                                                                 addresses[idx].geo = newGeo
                                                                                 setAddresses([...addresses])
                                                                             }}
                                                                             setAddressName={address=>{
                                                                                 addresses[idx].address = address
                                                                                 setAddresses([...addresses])
                                                                             }}
                                            />)
                                            showFullDialog(true)
                                        }}>
                                            {
                                                element.geo[0]===42.8700000&&element.geo[1]===74.5900000?
                                                    '?????????????? ????????????????????'
                                                    :
                                                    '???????????????? ????????????????????'
                                            }
                                        </div>
                                    </div>
                                )}
                                <Button onClick={async()=>{
                                    addAddress()
                                }} color='primary'>
                                    ???????????????? ??????????
                                </Button>
                                <br/>
                                <br/>
                                {email.map((element, idx)=>
                                    <FormControl  key={`email${idx}`} className={classes.input}>
                                        <InputLabel error={!validEmail(element)}>Email</InputLabel>
                                        <Input
                                            error={!validEmail(element)}
                                            value={element}
                                            onChange={(event)=>{editEmail(event, idx)}}
                                            inputProps={{
                                                'aria-label': 'description',
                                            }}
                                            endAdornment={
                                                <InputAdornment position="end">
                                                    <IconButton
                                                        onClick={()=>{
                                                            deleteEmail(idx)
                                                        }}
                                                        aria-label='toggle password visibility'
                                                    >
                                                        <Remove/>
                                                    </IconButton>
                                                </InputAdornment>
                                            }
                                        />
                                    </FormControl>
                                )}
                                <Button onClick={async()=>{
                                    addEmail()
                                }} color='primary'>
                                    ???????????????? email
                                </Button>
                                <br/>
                                <br/>
                                {phone.map((element, idx)=>
                                    <FormControl key={`phone${idx}`} className={classes.input}>
                                        <InputLabel error={!validPhoneLogin(element)}>??????????????. ????????????: +996559871952</InputLabel>
                                        <Input
                                            error={!validPhoneLogin(element)}
                                            value={element}
                                            onChange={(event)=>{editPhone(event, idx)}}
                                            inputProps={{
                                                'aria-label': 'description',
                                            }}
                                            startAdornment={<InputAdornment position='start'>+996</InputAdornment>}
                                            endAdornment={
                                                <InputAdornment position="end">
                                                    <IconButton
                                                        onClick={()=>{
                                                            deletePhone(idx)
                                                        }}
                                                        aria-label='toggle password visibility'
                                                    >
                                                        <Remove/>
                                                    </IconButton>
                                                </InputAdornment>
                                            }
                                        />
                                    </FormControl>
                                )}
                                <Button onClick={async()=>{
                                    addPhone()
                                }} color='primary'>
                                    ???????????????? ??????????????
                                </Button>
                                <br/>
                                <br/>
                                <TextField
                                    multiline={true}
                                    label='????????????????????'
                                    value={info}
                                    className={classes.input}
                                    onChange={(event)=>{setInfo(event.target.value)}}
                                    inputProps={{
                                        'aria-label': 'description',
                                    }}
                                />
                                <div className={isMobileApp?isApple?classes.bottomDivMA:classes.bottomDivM:classes.bottomDivD}>
                                    <Button onClick={async()=>{
                                        let checkPhone = true
                                        if(phone.length)
                                            for(let i=0; i<phone.length; i++)
                                                checkPhone = validPhoneLogin(phone[i])
                                        let checkEmail = true
                                        if(email.length)
                                            for(let i=0; i<email.length; i++)
                                                checkEmail = validEmail(email[i])
                                        if (name&&info&&checkPhone&&checkEmail) {
                                            let editElement = {
                                                name,
                                                addresses,
                                                email,
                                                phone,
                                                social,
                                                info
                                            }
                                            if(image!==undefined)editElement.image = image
                                            const action = async() => {
                                                await setContact(editElement)
                                                Router.reload()
                                            }
                                            setMiniDialog('???? ???????????????', <Confirmation action={action}/>)
                                            showMiniDialog(true)
                                        } else {
                                            showSnackBar('?????????????????? ?????? ????????')
                                        }
                                    }} color='primary'>
                                        ??????????????????
                                    </Button>
                                </div>
                            </div>
                            </>
                            :
                            <>
                            <div className={classes.column}>
                                <img
                                    className={isMobileApp?classes.mediaM:classes.mediaD}
                                    src={preview}
                                    alt={name}
                                />
                                {
                                    social[0].length>0||social[1].length>0||social[2].length>0||social[3].length>0?
                                        <>
                                        ???????? ????????????????
                                        <div className={classes.row}>
                                            {
                                                social[0].length>0?
                                                    <a href={social[0]}>
                                                        <img src='/static/instagram.svg' className={classes.mediaSocial}/>
                                                    </a>
                                                    :
                                                    null
                                            }
                                            {
                                                social[1].length>0?
                                                    <a href={social[1]}>
                                                        <img src='/static/facebook.svg' className={classes.mediaSocial}/>
                                                    </a>
                                                    :
                                                    null
                                            }
                                            {
                                                social[2].length>0?
                                                    <a href={social[2]}>
                                                        <img src='/static/twitter.svg' className={classes.mediaSocial}/>
                                                    </a>
                                                    :
                                                    null
                                            }
                                            {
                                                social[3].length>0?
                                                    <a href={social[3]}>
                                                        <img src='/static/telegram.svg' className={classes.mediaSocial}/>
                                                    </a>
                                                    :
                                                    null

                                            }
                                        </div>
                                        </>
                                        :
                                        null
                                }
                            </div>
                            <div>
                                {
                                    name?
                                        <div className={classes.name}>
                                            {name}
                                        </div>
                                        :
                                        null
                                }
                                {
                                    addresses.length?

                                        <div className={classes.row}>
                                            <div className={classes.nameField}>
                                                ??????????:&nbsp;
                                            </div>
                                            <div className={classes.column}>
                                                {addresses.map((element, idx)=>
                                                    <div key={`address${idx}`} className={classes.column}>
                                                        <div className={classes.value} style={element.geo[0]!==42.8700000&&element.geo[1]!==74.5900000?{marginBottom: 0}:{}}>
                                                            {element.address}
                                                        </div>
                                                        {
                                                            element.geo[0]!==42.8700000&&element.geo[1]!==74.5900000?
                                                                <div className={classes.geo} onClick={()=>{
                                                                    setFullDialog('????????????????????', <Geo geo={element.geo}/>)
                                                                    showFullDialog(true)
                                                                }}>
                                                                    ?????????????????????? ????????????????????
                                                                </div>
                                                                :
                                                                null
                                                        }
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        :
                                        null
                                }
                                {
                                    phone.length?
                                        <div className={classes.row}>
                                            <div className={classes.nameField}>
                                                ??????????????:&nbsp;
                                            </div>
                                            <div className={classes.column}>
                                                {phone.map((element, idx)=>
                                                    <div className={classes.row} key={`phone${idx}`}>
                                                        <a href={`tel:${element}`} className={classes.value}>
                                                            +996{element}
                                                        </a>
                                                        {
                                                            isMobileApp?
                                                                <>
                                                                &nbsp;
                                                                <a href={`https://wa.me/+996${element.substring(1)}`} className={classes.value} style={{color: '#128C7E'}}>
                                                                    (WhatsApp)
                                                                </a>
                                                                </>
                                                                :
                                                                null
                                                        }
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        :
                                        null
                                }
                                {
                                    email.length?
                                        <div className={classes.row}>
                                            <div className={classes.nameField}>
                                                E-mail:&nbsp;
                                            </div>
                                            <div className={classes.column}>
                                                {email.map((element, idx)=>
                                                    <a href={`mailto:${element}`} key={`email${idx}`} className={classes.value}>
                                                        {element}
                                                    </a>
                                                )}
                                            </div>
                                        </div>
                                        :
                                        null
                                }
                                <div className={classes.row}>
                                    <div className={classes.nameField} style={{width: 100}}>
                                        ??????????????????:&nbsp;
                                    </div>
                                    <Link href='/privacy'>
                                        <a>
                                            <div className={classes.value}>
                                                ???????????????????? ???? ?????????????????????????? ????????????????-?????????????? Opus.kg
                                            </div>
                                        </a>
                                    </Link>
                                </div>
                                <br/>
                                {
                                    info?
                                        <div className={classes.info}>
                                            {info}
                                        </div>
                                        :
                                        null
                                }
                            </div>
                            </>
                    }
                </CardContent>
            </Card>
            <input
                accept='image/*'
                style={{ display: 'none' }}
                id='contained-button-file'
                type='file'
                onChange={handleChangeImage}
            />
        </App>
    )
})

Contact.getInitialProps = async function(ctx) {
    await initialApp(ctx)
    return {
        data: {
            contact: await getContact(ctx.req?await getClientGqlSsr(ctx.req):undefined)
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
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Contact);