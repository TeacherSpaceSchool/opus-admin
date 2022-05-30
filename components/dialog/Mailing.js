import React, {useState, useEffect, useRef} from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as mini_dialogActions from '../../redux/actions/mini_dialog'
import * as snackbarActions from '../../redux/actions/snackbar'
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import dialogContentStyle from '../../src/styleMUI/dialogContent'
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import {mailingMessage, mailingMessageCount} from '../../src/gql/chat'
import Autocomplete from '@material-ui/lab/Autocomplete';
import { getSubcategories } from '../../src/gql/subcategory'
import Router from 'next/router'
const typeMailings = ['Все', 'Заказчики', 'Исполнители', 'Категории', 'Подкатегории']

const Mailing =  React.memo(
    (props) =>{
        const { classes, categories } = props;
        let [message, setMessage] = useState('');
        const { isMobileApp } = props.app;
        const { showSnackBar } = props.snackbarActions;
        const { showMiniDialog } = props.mini_dialogActions;
        const width = isMobileApp? (window.innerWidth-112) : 500
        const [typeMailing, setTypeMailing] = useState('Все');
        let [category, setCategory] = useState(null);
        let [subcategory, setSubcategory] = useState(null);
        let handleTypeMailing = event => setTypeMailing(event.target.value)
        let imageRef = useRef(null);
        let [subcategories, setSubcategories] = useState([]);
        let [count, setCount] = useState(0);
        useEffect(() => {
            (async()=>{
                if(category) {
                    setSubcategories(await getSubcategories({compressed: true, category: category._id}))
                }
                else
                    setSubcategories([])
                setSubcategory(null)
            })()
        }, [category]);
        useEffect(() => {
            setCategory(null)
        }, [typeMailing]);
        useEffect(() => {
            (async()=>{
                setCount(await mailingMessageCount({
                    id: subcategory?subcategory._id:category?category._id:null,
                    typeMailing
                }))
            })()
        }, [typeMailing, category, subcategory]);
        let handleChangeImage = (async (event) => {
            if(event.target.files[0]&&event.target.files[0].size / 1024 / 1024 < 50) {
                let res = await mailingMessage({
                    type: 'image',
                    file: event.target.files[0],
                    id: typeMailing==='Подкатегории'?subcategory._id:category?category._id:null,
                    typeMailing
                })
                if(res==='OK')
                    Router.reload()
                showMiniDialog(false);

            } else {
                showSnackBar('Файл слишком большой')
            }
        })
        return (
            <div className={classes.main}>
                <div className={classes.row}>
                    <div className={classes.nameField}>
                        Получатели в чатах:&nbsp;
                    </div>
                    <div className={classes.value}>
                        {count[0]}
                    </div>
                </div>
                <div className={classes.row}>
                    <div className={classes.nameField}>
                        Получатели в СМС:&nbsp;
                    </div>
                    <div className={classes.value}>
                        {count[1]}
                    </div>
                </div>
                <FormControl className={classes.textField} style={{width: width}}>
                    <InputLabel>Тип</InputLabel>
                    <Select value={typeMailing} onChange={handleTypeMailing}
                            inputProps={{
                                'aria-label': 'description'
                            }}>
                        {typeMailings.map((element)=>
                            <MenuItem key={element} value={element} ola={element}>{element}</MenuItem>
                        )}
                    </Select>
                </FormControl>
                {
                    categories&&['Категории', 'Подкатегории'].includes(typeMailing)?
                        <>
                        <br/>
                        <Autocomplete
                            error={!category}
                            options={categories}
                            value={category}
                            onChange={(event, newValue) => {
                                setCategory(newValue);
                            }}
                            style={{width: width}}
                            className={classes.textField}
                            getOptionLabel={(option) => option.name}
                            renderInput={(params) => <TextField error={!category} {...params} label='Выберите категорию' />}
                        />
                        </>
                        :
                        null
                }
                {
                    subcategories&&typeMailing==='Подкатегории'?
                        <>
                        <br/>
                        <Autocomplete
                            error={!subcategory}
                            options={subcategories}
                            value={subcategory}
                            onChange={(event, newValue) => {
                                setSubcategory(newValue);
                            }}
                            style={{width: width}}
                            className={classes.textField}
                            getOptionLabel={(option) => option.name}
                            renderInput={(params) => <TextField error={!subcategory} {...params} label='Выберите подкатегорию' />}
                        />
                        </>
                        :
                        null
                }
                <TextField
                    multiline={true}
                    style={{width: width}}
                    className={classes.textField}
                    label='Текст'
                    type='login'
                    margin='normal'
                    value={message}
                    onChange={(event)=>{setMessage(event.target.value)}}
                />
                <br/>
                <div>
                    <Button variant="contained" color="primary" onClick={async()=>{
                        if(message&&(!['Категории', 'Подкатегории'].includes(typeMailing)||subcategory&&typeMailing==='Подкатегории'||category&&typeMailing==='Категории')) {
                            let res = await mailingMessage({
                                type: 'sms',
                                text: message,
                                id: typeMailing==='Подкатегории'?subcategory._id:category?category._id:null,
                                typeMailing
                            })
                            if(res==='OK')
                                showSnackBar('СМС отправлено', 'success')
                            showMiniDialog(false);
                        }
                        else
                            showSnackBar('Заполните все поля')
                    }} className={classes.button}>
                        СМС
                    </Button>
                    <Button variant="contained" color="primary" onClick={async()=>{
                        if(message&&(!['Категории', 'Подкатегории'].includes(typeMailing)||subcategory&&typeMailing==='Подкатегории'||category&&typeMailing==='Категории')) {
                            let res = await mailingMessage({
                                type: 'text',
                                text: message,
                                id: typeMailing==='Подкатегории'?subcategory._id:category?category._id:null,
                                typeMailing
                            })
                            if(res==='OK')
                                Router.reload()
                            showMiniDialog(false);
                        }
                        else
                            showSnackBar('Заполните все поля')
                    }} className={classes.button}>
                        Чат
                    </Button>
                    <Button variant="contained" color="primary" onClick={async()=>{
                        if(!['Категории', 'Подкатегории'].includes(typeMailing)||subcategory&&typeMailing==='Подкатегории'||category&&typeMailing==='Категории') {
                            imageRef.current.click()
                        }
                        else
                            showSnackBar('Заполните все поля')
                    }} className={classes.button}>
                        Изображение
                    </Button>
                    <Button variant="contained" color="secondary" onClick={()=>{showMiniDialog(false);}} className={classes.button}>
                        Закрыть
                    </Button>
                </div>
                <input
                    accept='image/*'
                    style={{ display: 'none' }}
                    ref={imageRef}
                    type='file'
                    onChange={handleChangeImage}
                />
            </div>
        );
    }
)

function mapStateToProps (state) {
    return {
        app: state.app
    }
}

function mapDispatchToProps(dispatch) {
    return {
        mini_dialogActions: bindActionCreators(mini_dialogActions, dispatch),
        snackbarActions: bindActionCreators(snackbarActions, dispatch),
    }
}

Mailing.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(dialogContentStyle)(Mailing));