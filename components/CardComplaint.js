import React, {useState} from 'react';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import cardStyle from '../src/styleMUI/card'
import { connect } from 'react-redux'
import Button from '@material-ui/core/Button';
import CardActions from '@material-ui/core/CardActions';
import { addComplaint, acceptComplaint, deleteComplaint} from '../src/gql/complaint'
import { bindActionCreators } from 'redux'
import * as mini_dialogActions from '../redux/actions/mini_dialog'
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import TextField from '@material-ui/core/TextField';
import Confirmation from './dialog/Confirmation';
import { pdDDMMYYHHMM } from '../src/lib'
import Link from 'next/link';

const CardComplaint = React.memo((props) => {
    const { profile } = props.user;
    const classes = cardStyle();
    const { element, setList, list, idx } = props;
    const { isMobileApp } = props.app;
    let [text, setText] = useState(element?element.text:'');
    let handleText =  (event) => {
        setText(event.target.value)
    };
    const { setMiniDialog, showMiniDialog } = props.mini_dialogActions;
    return (
        <div>
            <Card className={isMobileApp?classes.cardM:classes.cardD}>
                {
                    element?
                        <CardActionArea>
                            <CardContent>
                                <div className={classes.row}>
                                    <div className={classes.nameField}>Время отзыва:&nbsp;</div>
                                    <div className={classes.value}>{pdDDMMYYHHMM(element.createdAt)}</div>
                                    <div className={classes.status} style={{background: element.taken?'green':'orange'}}>{element.taken?'принят':'активный'}</div>
                                </div>
                                {
                                    'admin'===profile.role&&element.user?
                                        <Link href='/user/[id]' as={`/user/${element.user._id}`}>
                                            <a>
                                                <div className={classes.row}>
                                                    <div className={classes.nameField}>
                                                        Подал:&nbsp;
                                                    </div>
                                                    <div className={classes.value}>
                                                        {element.user.name}
                                                    </div>
                                                </div>
                                            </a>
                                        </Link>
                                        :
                                        null
                                }
                                <div className={classes.row}>
                                    <div className={classes.nameField}>Отзыв:&nbsp;</div>
                                    <div className={classes.value}>{element.text}</div>
                                </div>
                                {
                                    element.who&&'admin'===profile.role?
                                        <div className={classes.row}>
                                            <div className={classes.nameField}>
                                                Принял:&nbsp;
                                            </div>
                                            <div className={classes.value}>
                                                {element.who.role} {element.who.name}
                                            </div>
                                        </div>
                                        :
                                        null
                                }
                            </CardContent>
                        </CardActionArea>
                        :
                        <CardActionArea>
                            <CardContent>
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
                            </CardContent>
                        </CardActionArea>
                }
                    {
                        element&&'admin'===profile.role&&!element.taken?
                            <CardActions>
                                <Button onClick={async()=>{
                                    const action = async() => {
                                        await acceptComplaint({_id: element._id})
                                        let _list = [...list]
                                        _list[idx].taken = true
                                        setList(_list)
                                    }
                                    setMiniDialog('Вы уверены?', <Confirmation action={action}/>)
                                    showMiniDialog(true)
                                }} color='primary'>
                                    Принять
                                </Button>
                                {
                                    'admin'===profile.role?
                                        <Button onClick={async()=>{
                                            const action = async() => {
                                                await deleteComplaint(element._id)
                                                let _list = [...list]
                                                _list.splice(_list.indexOf(element), 1)
                                                setList(_list)
                                            }
                                            setMiniDialog('Вы уверены?', <Confirmation action={action}/>)
                                            showMiniDialog(true)
                                        }} color='secondary'>
                                            Удалить
                                        </Button>
                                        :
                                        null
                                }
                            </CardActions>
                            :
                            !element&&'admin'!==profile.role?
                                <CardActions>
                                    <Button onClick={async()=> {
                                    if(text.length>0) {
                                        let element = {text}
                                        let res = await addComplaint(element)
                                        if (res)
                                            setList([res, ...list])
                                        setText('')
                                    }
                                }} color='primary'>
                                        Добавить
                                    </Button>
                                </CardActions>
                                :
                                null
                    }
                    </Card>
        </div>
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
        mini_dialogActions: bindActionCreators(mini_dialogActions, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CardComplaint)