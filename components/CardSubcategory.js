import React, {useState} from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import cardStyle from '../src/styleMUI/card'
import cardCategoryStyle from '../src/styleMUI/other/category'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import TextField from '@material-ui/core/TextField';
import * as snackbarActions from '../redux/actions/snackbar'
import Sign from './dialog/Sign'
import Confirmation from './dialog/Confirmation'
import * as mini_dialogActions from '../redux/actions/mini_dialog'
import Button from '@material-ui/core/Button';
import { addSubcategory, setSubcategory, deleteSubcategory } from '../src/gql/subcategory'
import { checkInt, inputInt } from '../src/lib'
import Link from 'next/link';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';

const CardSubcategory = React.memo((props) => {
    const classesCard = cardStyle();
    const classesCategory = cardCategoryStyle();
    const { element, list, setList, idx, category, order } = props;
    const { setMiniDialog, showMiniDialog } = props.mini_dialogActions;
    const { showSnackBar } = props.snackbarActions;
    const { isMobileApp } = props.app;
    const { profile, authenticated } = props.user;
    let [priority, setPriority] = useState(element&&element.priority?element.priority:0);
    let handlePriority =  (event) => {
        setPriority(inputInt(event.target.value))
    };
    let [autoApplication, setAutoApplication] = useState(element?element.autoApplication:false);
    let [preview, setPreview] = useState(element?element.image:'/static/add.png');
    let [image, setImage] = useState(undefined);
    let handleChangeImage = ((event) => {
        if(event.target.files[0]&&event.target.files[0].size/1024/1024<50){
            setImage(event.target.files[0])
            setPreview(URL.createObjectURL(event.target.files[0]))
        } else {
            showSnackBar('Файл слишком большой')
        }
    })
    let [name, setName] = useState(element?element.name:'');
    let handleName =  (event) => {
        setName(event.target.value)
    };
    let [searchWords, setSearchWords] = useState(element?element.searchWords:'');
    let handleSearchWords =  (event) => {
        if(!event.target.value.includes('\n'))
            setSearchWords(event.target.value)
    };
    let [quickTitles, setQuickTitles] = useState(element?element.quickTitles:'');
    let handleQuickTitles =  (event) => {
        if(!event.target.value.includes('\n'))
            setQuickTitles(event.target.value)
    };
    return (
        profile.role==='admin'?
            <Card className={isMobileApp?classesCard.cardM:classesCard.cardD}>
            <CardContent>
                <div className={classesCard.row}>
                    <label htmlFor={element?element._id:'add'}>
                        <img
                            className={classesCategory.media}
                            src={preview}
                            alt={'Изменить'}
                        />
                    </label>
                    &nbsp;&nbsp;&nbsp;
                    <div className={classesCard.column} style={{width: '100%'}}>
                        <TextField
                            label='Название'
                            value={name}
                            className={classesCard.input}
                            onChange={handleName}
                            inputProps={{
                                'aria-label': 'description',
                            }}
                        />
                        <FormControlLabel
                            className={classesCard.input}
                            control={
                                <Checkbox
                                    checked={autoApplication}
                                    onChange={()=>setAutoApplication(!autoApplication)}
                                    color='primary'
                                />
                            }
                            label='Автоприем'
                        />
                        <TextField
                            multiline
                            label='Ключевые слова'
                            value={searchWords}
                            className={classesCard.input}
                            onChange={handleSearchWords}
                            inputProps={{
                                'aria-label': 'description',
                            }}
                        />
                        <TextField
                            multiline
                            label='Быстрые задачи'
                            value={quickTitles}
                            className={classesCard.input}
                            onChange={handleQuickTitles}
                            inputProps={{
                                'aria-label': 'description',
                            }}
                        />
                        <TextField
                            label='Приоритет'
                            value={priority}
                            className={classesCard.input}
                            onChange={handlePriority}
                            inputProps={{
                                'aria-label': 'description',
                            }}
                            type={'number' }
                        />
                    </div>
                </div>
                <div className={classesCard.row}>
                    {
                        !element?
                            <Button onClick={async()=> {
                                if (image&&name&&searchWords) {
                                    setName('')
                                    setAutoApplication(false)
                                    setSearchWords('')
                                    setQuickTitles('')
                                    setPreview('/static/add.png')
                                    setPriority(0)
                                    const action = async() => {
                                        let res = await addSubcategory({name, priority: checkInt(priority), image, category, searchWords, quickTitles, autoApplication})
                                        setList([res, ...list])
                                    }
                                    setMiniDialog('Вы уверены?', <Confirmation action={action}/>)
                                    showMiniDialog(true)
                                } else {
                                    showSnackBar('Заполните все поля')
                                }
                            }
                            } color='primary'>
                                Добавить
                            </Button>
                            :
                            <>
                            <Link href={'/specialists/[id]'} as={`/specialists/${element._id}`}>
                                <Button color='primary'>
                                    Перейти
                                </Button>
                            </Link>
                            <Button onClick={async()=> {
                                let editElement = {_id: element._id}
                                if(name&&name!==element.name)editElement.name = name
                                if(autoApplication!==element.autoApplication)editElement.autoApplication = autoApplication
                                if(image)editElement.image = image
                                if(priority!=element.priority)editElement.priority = checkInt(priority)
                                if(searchWords&&searchWords!==element.searchWords)editElement.searchWords = searchWords
                                if(quickTitles&&quickTitles!==element.quickTitles)editElement.quickTitles = quickTitles
                                const action = async() => {
                                    if(await setSubcategory(editElement)!=='OK')
                                        showSnackBar('Ошибка', 'error')
                                }
                                setMiniDialog('Вы уверены?', <Confirmation action={action}/>)
                                showMiniDialog(true)
                            }
                            } color='primary'>
                                Сохранить
                            </Button>
                            <Button onClick={async()=> {
                                const action = async() => {
                                    if(await deleteSubcategory(element._id)==='OK') {
                                        let _list = [...list]
                                        _list.splice(idx, 1)
                                        setList(_list)
                                    }
                                    else
                                        showSnackBar('Удалите исполнителей')
                                }
                                setMiniDialog('Вы уверены?', <Confirmation action={action}/>)
                                showMiniDialog(true)
                            }
                            } color='secondary'>
                                Удалить
                            </Button>
                            </>
                    }
                </div>
            </CardContent>
            <input
                accept='image/*'
                style={{ display: 'none' }}
                id={element?element._id:'add'}
                type='file'
                onChange={handleChangeImage}
            />
        </Card>
            :
            !authenticated&&order?
                <Card className={classesCategory.card} onClick={()=>{
                    setMiniDialog('Вход', <Sign/>)
                    showMiniDialog(true)
                }}>
                    <img
                        className={classesCategory.media}
                        src={preview}
                        alt={name}
                    />
                    <div className={classesCategory.title}>
                        {name}
                    </div>
                </Card>
                :
                <Link
                    href={
                        order?
                            {
                                pathname: '/order/[id]',
                                query: {category: element.category._id, subcategory: element._id}
                            }
                            :
                            '/specialists/[id]'
                    }
                    as={
                        order?
                            `/order/new?category=${element.category._id}&subcategory=${element._id}`
                            :
                            `/specialists/${element._id}`
                    }>
                    <Card className={classesCategory.card}>
                        <img
                            className={classesCategory.media}
                            src={preview}
                            alt={name}
                        />
                        <div className={classesCategory.title}>
                            {name}
                        </div>
                    </Card>
                </Link>
    );
})

function mapStateToProps (state) {
    return {
        app: state.app,
        user: state.user,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        snackbarActions: bindActionCreators(snackbarActions, dispatch),
        mini_dialogActions: bindActionCreators(mini_dialogActions, dispatch),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CardSubcategory)