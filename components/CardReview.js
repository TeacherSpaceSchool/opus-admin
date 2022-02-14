import React, {useState, useRef} from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import cardStyle from '../src/styleMUI/card'
import userStyle from '../src/styleMUI/other/user'
import stylePage from '../src/styleMUI/list'
import { connect } from 'react-redux'
import Button from '@material-ui/core/Button';
import CardActions from '@material-ui/core/CardActions';
import { addReview, deleteReview} from '../src/gql/review'
import { bindActionCreators } from 'redux'
import * as mini_dialogActions from '../redux/actions/mini_dialog'
import TextField from '@material-ui/core/TextField';
import Confirmation from './dialog/Confirmation';
import Rating from '@material-ui/lab/Rating';
import * as snackbarActions from '../redux/actions/snackbar'
import * as appActions from '../redux/actions/app'

const CardReview = React.memo((props) => {
    const { profile } = props.user;
    const classes = cardStyle();
    const classesPage = stylePage();
    const classesUser = userStyle();
    const { element, setList, list, idx, whom, _setCanReview } = props;
    const { isMobileApp } = props.app;
    const { showSnackBar } = props.snackbarActions;
    const { setShowLightbox, setImagesLightbox, setIndexLightbox } = props.appActions;
    let [text, setText] = useState(element?element.info:'');
    let handleText =  (event) => {
        setText(event.target.value)
    };
    let [rating, setRating] = useState(element?element.reiting:0);
    const { setMiniDialog, showMiniDialog } = props.mini_dialogActions;
    let documentRef = useRef(null);
    let [images, setImages] = useState(element?element.images:[]);
    let [uploads, setUploads] = useState([]);
    let handleChangeImages = (async (event) => {
        if(images.length<5) {
            if(event.target.files[0]&&event.target.files[0].size / 1024 / 1024 < 50) {
                setUploads([event.target.files[0], ...uploads])
                setImages([URL.createObjectURL(event.target.files[0]), ...images])
            } else {
                showSnackBar('Файл слишком большой')
            }
        } else {
            showSnackBar('Cлишком много изображений')
        }
    })
    return (
        <Card className={isMobileApp?classes.cardM:classes.cardD}>
            <CardContent>
                {
                    element?
                        <div className={classesPage.row}>
                            <img
                                className={classes.avatar}
                                src={element.who.avatar?element.who.avatar:'/static/add.png'}
                                alt={element.info}
                            />
                            &nbsp;&nbsp;
                            <div>
                                <div className={classesUser.name}>
                                    {element.who.name}
                                </div>
                                <Rating
                                    readOnly
                                    value={rating}
                                    onChange={(event, newValue) => {
                                        setRating(newValue);
                                    }}
                                />
                                {
                                    text.length?
                                        <div className={classes.value}>
                                            {text}
                                        </div>
                                        :
                                        null
                                }
                                {
                                    images.length?
                                        <div className={classesPage.row}>
                                            <div className={classesPage.noteImageList}>
                                                {images.map((element, idx)=> <div key={`noteImageDiv${idx}`} className={classesPage.noteImageDiv}>
                                                    <img className={classesPage.noteImage} src={element} onClick={()=>{
                                                        setShowLightbox(true)
                                                        setImagesLightbox(images)
                                                        setIndexLightbox(idx)
                                                    }}/>
                                                </div>)}
                                            </div>
                                        </div>
                                        :
                                        null
                                }
                            </div>
                        </div>
                        :
                        <>
                        <div className={classes.row}>
                            <div className={classes.nameField} style={{marginBottom: 0}}>Оценка:&nbsp;</div>
                            <Rating
                                value={rating}
                                onChange={(event, newValue) => {
                                    setRating(newValue);
                                }}
                            />
                        </div>
                        <br/>
                        <TextField
                            multiline={true}
                            style={{width: '100%'}}
                            label='Отзыв'
                            value={text}
                            className={classes.input}
                            onChange={handleText}
                            inputProps={{
                                'aria-label': 'description',
                            }}
                        />
                        <div className={classesPage.row}>
                            <div className={classesPage.noteImageList}>
                                <img className={classesPage.noteImage} src='/static/add.png' onClick={()=>{documentRef.current.click()}} />
                                {images.map((element, idx)=> <div key={`noteImageDiv${idx}`} className={classesPage.noteImageDiv}>
                                    <img className={classesPage.noteImage} src={element} onClick={()=>{
                                        setShowLightbox(true)
                                        setImagesLightbox(images)
                                        setIndexLightbox(idx)
                                    }}/>
                                    <div className={classesPage.noteImageButton} style={{background: 'red'}} onClick={()=>{
                                        images.splice(idx, 1)
                                        setImages([...images])
                                    }}>X</div>
                                </div>)}
                            </div>
                        </div>
                        </>
                }
            </CardContent>
            {
                !element||element&&('admin'===profile.role||profile._id===element.who._id)?
                    <CardActions>
                        {
                            !element?
                                <Button onClick={async()=> {
                                    if(rating) {
                                        const action = async() => {
                                            let res = await addReview({reiting: rating, uploads, info: text, whom})
                                            res.who = {_id: profile._id, name: profile.name}
                                            setList([res, ...list])
                                            _setCanReview(false)
                                        }
                                        setMiniDialog('Вы уверены?', <Confirmation action={action}/>)
                                        showMiniDialog(true)
                                    }
                                    else
                                        showSnackBar('Поставьте оценку')
                                }} color='primary'>
                                    Отправить
                                </Button>
                                :
                                <Button onClick={async()=> {
                                    const action = async() => {
                                        await deleteReview({reiting: rating, uploads, info: text, whom})
                                        list.splice(idx, 1);
                                        setList([...list])
                                    }
                                    setMiniDialog('Вы уверены?', <Confirmation action={action}/>)
                                    showMiniDialog(true)
                                }} color='primary'>
                                    Удалить
                                </Button>
                        }
                    </CardActions>
                    :
                    null
            }
            <input
                accept='image/*'
                style={{ display: 'none' }}
                ref={documentRef}
                type='file'
                onChange={handleChangeImages}
            />
        </Card>
    );
})

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

export default connect(mapStateToProps, mapDispatchToProps)(CardReview)