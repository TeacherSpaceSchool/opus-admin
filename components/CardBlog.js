import React, {useState} from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import blogStyle from '../src/styleMUI/other/blog'
import cardStyle from '../src/styleMUI/card'
import { connect } from 'react-redux'
import Button from '@material-ui/core/Button';
import CardActions from '@material-ui/core/CardActions';
import { deleteBlog, addBlog } from '../src/gql/blog'
import TextField from '@material-ui/core/TextField';
import { bindActionCreators } from 'redux'
import * as mini_dialogActions from '../redux/actions/mini_dialog'
import * as appActions from '../redux/actions/app'
import * as snackbarActions from '../redux/actions/snackbar'
import Confirmation from './dialog/Confirmation'

const CardBlog = React.memo((props) => {
    const classesBlog = blogStyle();
    const classesCard = cardStyle();
    const { element, setList, list, idx, edit} = props;
    const { setMiniDialog, showMiniDialog } = props.mini_dialogActions;
    const { setShowLightbox, setImagesLightbox, setIndexLightbox } = props.appActions;
    const { showSnackBar } = props.snackbarActions;
    let [all, setAll] = useState(false);
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
    let [text, setText] = useState(element?element.text:'');
    return (
        <Card className={classesBlog.card}>
            {
                element?
                    <>
                    <img
                        className={classesBlog.media}
                        src={element.image}
                        alt={element.text}
                        onClick={()=>{
                            setShowLightbox(true)
                            setImagesLightbox([element.image])
                            setIndexLightbox(0)
                        }}
                    />
                    <div className={classesBlog.text} style={all?{}:{overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis'}} onClick={async()=> {
                        if(element)
                            setAll(!all)
                    }}>
                        {element.text}
                    </div>
                    {
                        edit ?
                            <CardActions>
                                <Button onClick={async()=> {
                                    const action = async() => {
                                        if(await deleteBlog(element._id)==='OK') {
                                            let _list = [...list]
                                            _list.splice(idx, 1)
                                            setList(_list)
                                        }
                                        else
                                            showSnackBar('Ошибка', 'error')
                                    }
                                    setMiniDialog('Вы уверены?', <Confirmation action={action}/>)
                                    showMiniDialog(true)
                                }
                                } color='secondary'>
                                    Удалить
                                </Button>
                            </CardActions>
                            :
                            null
                    }
                    </>
                    :
                    <>
                    <label htmlFor={element?element._id:'add'}>
                        <img
                            className={classesBlog.media}
                            src={preview}
                            alt={'Изменить'}
                        />
                    </label>
                    <CardContent style={{width: '100%'}}>
                        <TextField
                            multiline={true}
                            label='Текст'
                            value={text}
                            className={classesCard.input}
                            onChange={(event)=>{setText(event.target.value)}}
                            inputProps={{
                                'aria-label': 'description',
                            }}
                        />
                        <CardActions>
                            <Button onClick={async()=> {
                                if (image&&text) {
                                    setText('')
                                    setPreview('/static/add.png')
                                    const action = async() => {
                                        let res = await addBlog({text, image})
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
                        </CardActions>
                    </CardContent>
                    <input
                        accept='image/*'
                        style={{ display: 'none' }}
                        id={element?element._id:'add'}
                        type='file'
                        onChange={handleChangeImage}
                    />
                    </>
            }
        </Card>
    );
})

function mapStateToProps () {
    return {}
}

function mapDispatchToProps(dispatch) {
    return {
        mini_dialogActions: bindActionCreators(mini_dialogActions, dispatch),
        snackbarActions: bindActionCreators(snackbarActions, dispatch),
        appActions: bindActionCreators(appActions, dispatch),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CardBlog)