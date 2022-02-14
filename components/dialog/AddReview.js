import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as mini_dialogActions from '../../redux/actions/mini_dialog'
import * as snackbarActions from '../../redux/actions/snackbar'
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import dialogContentStyle from '../../src/styleMUI/dialogContent'
import Rating from '@material-ui/lab/Rating';
import stylePage from '../../src/styleMUI/list'
import { addReview} from '../../src/gql/review'
import Router from 'next/router'

const AddReview =  React.memo(
    (props) =>{
        const { classes, whom } = props;
        const classesPage = stylePage();
        const { isMobileApp } = props.app;
        const { showMiniDialog } = props.mini_dialogActions;
        const { showSnackBar } = props.snackbarActions;
        let [rating, setRating] = useState(0);
        let [text, setText] = useState('');
        let handleText =  (event) => {
            setText(event.target.value)
        };
        let documentRef = useRef(null);
        let [images, setImages] = useState([]);
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
        const width = isMobileApp? (window.innerWidth-112) : 500
        return (
            <div className={classes.main}>
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
                    style={{width}}
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
                            <img className={classesPage.noteImage} src={element}/>
                            <div className={classesPage.noteImageButton} style={{background: 'red'}} onClick={()=>{
                                images.splice(idx, 1)
                                setImages([...images])
                            }}>X</div>
                        </div>)}
                    </div>
                </div>
                <br/>
                <div>
                    <Button variant='contained' color='primary' onClick={async()=>{
                        if(rating) {
                            await addReview({reiting: rating, uploads, info: text, whom})
                            showMiniDialog(false)
                            Router.reload()
                        }
                        else
                            showSnackBar('Поставьте оценку')
                    }} className={classes.button}>
                        Сохранить
                    </Button>
                    <Button variant='contained' color='secondary' onClick={()=>{showMiniDialog(false);}} className={classes.button}>
                        Закрыть
                    </Button>
                </div>
                <input
                    accept='image/*'
                    style={{ display: 'none' }}
                    ref={documentRef}
                    type='file'
                    onChange={handleChangeImages}
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

AddReview.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(dialogContentStyle)(AddReview));