import React, {useState, useEffect} from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import cardStyle from '../src/styleMUI/card'
import { connect } from 'react-redux'
import { pdDDMMYYHHMM } from '../src/lib'
import { bindActionCreators } from 'redux'
import * as mini_dialogActions from '../redux/actions/mini_dialog'
import CardActionArea from '@material-ui/core/CardActionArea';
import Link from 'next/link';
import NotificationsActive from '@material-ui/icons/NotificationsActive';
import NotificationsOff from '@material-ui/icons/NotificationsOff';
import Button from '@material-ui/core/Button';
import CardActions from '@material-ui/core/CardActions';
import Confirmation from './dialog/Confirmation'
import { setUser } from '../src/gql/user'
import UserStyle from '../src/styleMUI/other/user'
import { checkFloat, getGeoDistance} from '../src/lib'

const CardUser = React.memo((props) => {
    const classes = cardStyle();
    const classesUser = UserStyle();
    let { element, subcategoriesById, geo, list, employment, category } = props;
    const { isMobileApp, search } = props.app;
    const { showMiniDialog, setMiniDialog } = props.mini_dialogActions;
    const [near, setNear] = useState(false);
    let [status, setStatus] = useState(element.status);
    let [reiting, setReiting] = useState(0);
    useEffect(()=>{
        if(element.reiting&&element.reiting.length) {
            reiting = 0
            for (let i = 0; i < element.reiting.length; i++) {
                reiting += element.reiting[i]
            }
            setReiting(checkFloat(reiting/element.reiting.length))
        }
        else
            setReiting(0)
    },[])
    useEffect(() => {
        if(geo&&element.online&&element.geo)
            setNear(getGeoDistance(...geo, ...element.geo)<1500)
    }, [geo]);
    return (
        <Card className={isMobileApp?classes.cardM:classes.cardD}>
            {
                element.notification?
                    <NotificationsActive color='primary' className={classes.notification}/>
                    :
                    <NotificationsOff color='secondary' className={classes.notification}/>
            }
            <Link href={`/${employment?'employment':'user'}/[id]`} as={`/${employment?'employment':'user'}/${element._id}`}>
                <CardContent onClick={()=>{
                    if(!search&&!category) {
                        let appBody = (document.getElementsByClassName('App-body'))[0]
                        sessionStorage.scrollPostionStore = appBody.scrollTop
                        sessionStorage.scrollPostionName = employment?'employment':'user'
                        sessionStorage.scrollPostionLimit = list.length
                    }
                }}>
                    <CardActionArea>
                        <h3>
                            {element.name}
                            {
                                element.online||near?
                                    <div className={classes.row}>
                                        {element.online?<div className={classesUser.online}>online</div>:null}
                                        &nbsp;
                                        {near?<div className={classesUser.near}>близко</div>:null}
                                    </div>
                                    :
                                    null
                            }
                        </h3>
                        <br/>
                        {
                            element.specializations.length?
                                <>
                                <div className={classes.row}>
                                    <div className={classes.nameField}>
                                        Специализации:&nbsp;
                                    </div>
                                    <div className={classes.value}>
                                        {element.specializations.map((element1, idx)=> {
                                            idx += 1
                                            return `${subcategoriesById[element1.subcategory]}${idx!==element.specializations.length?', ':''}`
                                        })}
                                    </div>
                                </div>
                                <div className={classes.row}>
                                    <div className={classes.nameField}>
                                        Рейтинг:&nbsp;
                                    </div>
                                    <div className={classes.value}>
                                        {reiting}
                                    </div>
                                </div>
                                </>
                                :
                                null
                        }
                        {
                            element.phone?
                                <div className={classes.row}>
                                    <div className={classes.nameField}>
                                        Телефон:&nbsp;
                                    </div>
                                    <div className={classes.value}>
                                        {element.phone}
                                    </div>
                                </div>
                                :
                                null
                        }
                        {
                            element.email?
                                <div className={classes.row}>
                                    <div className={classes.nameField}>
                                        E-mail:&nbsp;
                                    </div>
                                    <div className={classes.value}>
                                        {element.email}
                                    </div>
                                </div>
                                :
                                null
                        }
                        <div className={classes.row}>
                            <div className={classes.nameField}>
                                Регистрация:&nbsp;
                            </div>
                            <div className={classes.value}>
                                {pdDDMMYYHHMM(element.createdAt)}
                            </div>
                        </div>
                        {element.updatedAt?
                            <div className={classes.row}>
                                <div className={classes.nameField}>
                                    Изменен:&nbsp;
                                </div>
                                <div className={classes.value}>
                                    {pdDDMMYYHHMM(element.updatedAt)}
                                </div>
                            </div>
                            :
                            null
                        }
                        {
                            element.lastActive?
                                <div className={classes.row}>
                                    <div className={classes.nameField}>
                                        Активность:&nbsp;
                                    </div>
                                    <div className={classes.value}>
                                        {pdDDMMYYHHMM(element.lastActive)}
                                    </div>
                                </div>
                                :
                                null
                        }
                        {
                            element.device?
                                <div className={classes.row}>
                                    <div className={classes.value}>
                                        {element.device}
                                    </div>
                                </div>
                                :
                                null
                        }
                    </CardActionArea>
                </CardContent>
            </Link>
            <CardActions>
                <div className={classes.row}>
                    <Button color={status==='active'?'primary':'secondary'} onClick={()=>{
                        const action = async() => {
                            status = status==='active'?'deactive':'active'
                            await setUser({_id: element._id, status})
                            setStatus(status)
                        }
                        setMiniDialog('Вы уверены?', <Confirmation action={action}/>)
                        showMiniDialog(true)
                    }}>
                        {status==='active'?'Отключить':'Включить'}
                    </Button>
                </div>
            </CardActions>
        </Card>
    );
})

function mapStateToProps (state) {
    return {
        app: state.app
    }
}

function mapDispatchToProps(dispatch) {
    return {
        mini_dialogActions: bindActionCreators(mini_dialogActions, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CardUser)