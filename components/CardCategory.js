import React, {useState} from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import cardStyle from '../src/styleMUI/card'
import cardCategoryStyle from '../src/styleMUI/other/category'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import TextField from '@material-ui/core/TextField';
import * as snackbarActions from '../redux/actions/snackbar'
import Confirmation from './dialog/Confirmation'
import * as mini_dialogActions from '../redux/actions/mini_dialog'
import Button from '@material-ui/core/Button';
import { addCategory, setCategory, deleteCategory } from '../src/gql/category'
import Link from 'next/link';
import { checkInt, inputInt } from '../src/lib'

const CardCategory = React.memo((props) => {
    const classesCard = cardStyle();
    const classesCategory = cardCategoryStyle();
    const { element, list, setList, idx } = props;
    const { setMiniDialog, showMiniDialog } = props.mini_dialogActions;
    const { showSnackBar } = props.snackbarActions;
    const { profile } = props.user;
    const { isMobileApp } = props.app;
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
    let [priority, setPriority] = useState(element&&element.priority?element.priority:0);
    let handlePriority =  (event) => {
        setPriority(inputInt(event.target.value))
    };
    let [searchWords, setSearchWords] = useState(element?element.searchWords:'');
    let handleSearchWords =  (event) => {
        if(!event.target.value.includes('\n'))
            setSearchWords(event.target.value)
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
                            <TextField
                                label='Ключевые слова'
                                multiline
                                value={searchWords}
                                className={classesCard.input}
                                onChange={handleSearchWords}
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
                                        setSearchWords('')
                                        setPriority(0)
                                        setPreview('/static/add.png')
                                        const action = async() => {
                                            let res = await addCategory({name, priority: checkInt(priority), image, searchWords})
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
                                <Link href={'/subcategories/[id]'} as={`/subcategories/${element._id}`}>
                                    <Button color='primary'>
                                        Перейти
                                    </Button>
                                </Link>
                                <Button onClick={async()=> {
                                    let editElement = {_id: element._id}
                                    if(priority!=element.priority)editElement.priority = checkInt(priority)
                                    if(name&&name!==element.name)editElement.name = name
                                    if(searchWords&&searchWords!==element.searchWords)editElement.searchWords = searchWords
                                    if(image)editElement.image = image
                                    const action = async() => {
                                        if(await setCategory(editElement)!=='OK')
                                            showSnackBar('Ошибка', 'error')
                                    }
                                    setMiniDialog('Вы уверены?', <Confirmation action={action}/>)
                                    showMiniDialog(true)
                                }} color='primary'>
                                    Сохранить
                                </Button>
                                <Button onClick={async()=> {
                                    const action = async() => {
                                        if(await deleteCategory(element._id)==='OK') {
                                            let _list = [...list]
                                            _list.splice(idx, 1)
                                            setList(_list)
                                        }
                                        else
                                            showSnackBar('Удалите подкатегории')
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
            <Link href={'/subcategories/[id]'} as={`/subcategories/${element._id}`}>
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

export default connect(mapStateToProps, mapDispatchToProps)(CardCategory)