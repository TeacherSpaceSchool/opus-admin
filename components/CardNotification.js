import React, {useState, useEffect} from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActionArea from '@material-ui/core/CardActionArea';
import cardStyle from '../src/styleMUI/card'
import chatStyle from '../src/styleMUI/other/chat'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as mini_dialogActions from '../redux/actions/mini_dialog'
import { pdDDMMYYHHMM, pdHHMM, checkFloat } from '../src/lib'
import Button from '@material-ui/core/Button';
import Confirmation from '../components/dialog/Confirmation'
import AddReview from '../components/dialog/AddReview'
import { approveExecutor } from '../src/gql/order'
import Link from 'next/link';
import styleUser from '../src/styleMUI/other/user'
import PhoneIcon from '@material-ui/icons/Phone';
import QuestionAnswerIcon from '@material-ui/icons/QuestionAnswer';
const date = new Date()

const CardNotification = React.memo((props) => {
    const classesCard = cardStyle();
    const classesChat = chatStyle();
    let { element, list, setList } = props;
    const classesUser = styleUser();
    const { profile } = props.user;
    const { isMobileApp } = props.app;
    const { showMiniDialog, setMiniDialog } = props.mini_dialogActions;
    let [createdAt] = useState(new Date(element.createdAt))
    let [reiting, setReiting] = useState(0)
    let [today] = useState(createdAt.getDate()===date.getDate()&&createdAt.getFullYear()===date.getFullYear()&&createdAt.getMonth()===date.getMonth());
    useEffect(()=>{
        if(element.type===1) {
            if(element.who.reiting&&element.who.reiting.length) {
                for (let i = 0; i < element.who.reiting.length; i++) {
                    reiting += element.who.reiting[i]
                }
                setReiting(checkFloat(reiting/element.who.reiting.length))
            }
        }
    },[])
    return (
        [1, 2, 3, 4, 5].includes(element.type)?
            <Card className={isMobileApp?classesCard.cardM:classesCard.cardD}>
                <CardContent>
                    <CardActionArea>
                        <div className={classesChat.rowChat}>
                            <Link
                                href={`/${element.type===1?'user':'order'}/[id]`}
                                as={element.type===1?`/user/${element.who._id}`:`/order/${element.order._id}`}
                            >
                                <img
                                    className={classesCard.avatar}
                                    src={element.who.avatar?element.who.avatar:'/static/add.png'}
                                    alt={element.title}
                                    onClick={()=>{
                                        let appBody = (document.getElementsByClassName('App-body'))[0]
                                        sessionStorage.scrollPostionStore = appBody.scrollTop
                                        sessionStorage.scrollPostionName = 'notification'
                                        sessionStorage.scrollPostionLimit = list.length
                                    }}
                                />
                            </Link>
                            &nbsp;&nbsp;
                            <div>
                                <Link
                                    href={`/${element.type===1?'user':'order'}/[id]`}
                                    as={element.type===1?`/user/${element.who._id}`:`/order/${element.order._id}`}
                                >
                                    <div className={classesChat.nameNotify} style={{width: today?isMobileApp?200:230:isMobileApp?145:175}}
                                         onClick={()=>{
                                             let appBody = (document.getElementsByClassName('App-body'))[0]
                                             sessionStorage.scrollPostionStore = appBody.scrollTop
                                             sessionStorage.scrollPostionName = 'notification'
                                             sessionStorage.scrollPostionLimit = list.length
                                         }}>
                                        {element.title}
                                    </div>
                                </Link>
                                <Link
                                    href={`/${element.type===1?'user':'order'}/[id]`}
                                    as={element.type===1?`/user/${element.who._id}`:`/order/${element.order._id}`}
                                >
                                    <div>
                                        <div className={classesChat.textChat}
                                             onClick={()=>{
                                                 let appBody = (document.getElementsByClassName('App-body'))[0]
                                                 sessionStorage.scrollPostionStore = appBody.scrollTop
                                                 sessionStorage.scrollPostionName = 'notification'
                                                 sessionStorage.scrollPostionLimit = list.length
                                             }}>
                                            <b>{element.who.name}:</b>&nbsp;{element.message}
                                        </div>
                                        {
                                            element.type===1?
                                                <>
                                                <div className={classesUser.textProfile}/>
                                                <div className={classesUser.rowProfile}>
                                                    ⭐️&nbsp;
                                                    <div className={classesUser.textProfile}>
                                                        Рейтинг:&nbsp;<b>{reiting}</b>
                                                    </div>
                                                </div>
                                                <div className={classesUser.rowProfile}>
                                                    ✔️&nbsp;
                                                    <div className={classesUser.textProfile}>
                                                        Работ выполнено:&nbsp;<b>{element.who.completedWorks}</b>
                                                    </div>
                                                </div>
                                                </>
                                                :
                                                null
                                        }
                                    </div>
                                </Link>
                                {
                                    [1, 3].includes(element.type)&&element.order.status==='активный'&&profile._id===element.whom._id?
                                        <>
                                        <br/>
                                        <Button onClick={async()=> {
                                            const action = async() => {
                                                let res = await approveExecutor({_id: element.order._id, executor: element.type===1?element.who._id:null})
                                                if(res==='OK') {
                                                    for(let i=0; i<list.length; i++) {
                                                        if(list[i].order&&list[i].order._id===element.order._id)
                                                            list[i].order.status = 'принят'
                                                    }
                                                    setList([...list])
                                                }
                                            }
                                            setMiniDialog(`Принять${element.type===1?' исполнителя':''}?`, <Confirmation action={action}/>)
                                            showMiniDialog(true)
                                        }} color='primary'>
                                            Принять
                                        </Button>
                                        </>
                                        :
                                        4===element.type&&!element.order.review&&profile._id===element.whom._id?
                                            <>
                                            <br/>
                                            <Button onClick={async()=> {
                                                setMiniDialog('Отзыв', <AddReview whom={element.who._id}/>)
                                                showMiniDialog(true)
                                            }} color='primary'>
                                                Оставить отзыв
                                            </Button>
                                            </>
                                            :
                                            null
                                }
                            </div>
                        </div>
                        {

                            2===element.type&&element.chat&&element.order.status==='принят'?
                                <div className={classesCard.row} style={{gap: '10px', justifyContent: isMobileApp?'right': 'center'}}>
                                    <Link
                                        href={{pathname: '/chat/[id]'}}
                                        as={`/chat/${element.chat._id}`}
                                    >
                                        <Button
                                            variant={isMobileApp?'outlined':'text'}
                                            color='primary'
                                            onClick={()=>{
                                                let appBody = (document.getElementsByClassName('App-body'))[0]
                                                sessionStorage.scrollPostionStore = appBody.scrollTop
                                                sessionStorage.scrollPostionName = 'notification'
                                                sessionStorage.scrollPostionLimit = list.length
                                            }}
                                            startIcon={isMobileApp?<QuestionAnswerIcon/>:null}
                                        >
                                            {isMobileApp?'Написать':'Написать сообщение'}
                                        </Button>
                                    </Link>
                                    {
                                        isMobileApp?
                                            <a href={`tel:+996${element.who._id!==profile._id?element.who.login:element.whom.login}`}>
                                                <Button
                                                    color='primary'
                                                    variant='outlined'
                                                    startIcon={<PhoneIcon/>}
                                                >
                                                    Позвонить
                                                </Button>
                                            </a>
                                            :
                                            null
                                    }
                                </div>
                                :
                                null
                        }
                        <div className={classesChat.timeChat}>
                            {today?pdHHMM(element.createdAt):pdDDMMYYHHMM(element.createdAt)}
                        </div>
                    </CardActionArea>
                </CardContent>
            </Card>
            :
            0===element.type?
                <Link href='/application/[id]' as={element.url}>
                    <Card className={isMobileApp?classesCard.cardM:classesCard.cardD} onClick={()=>{
                        let appBody = (document.getElementsByClassName('App-body'))[0]
                        sessionStorage.scrollPostionStore = appBody.scrollTop
                        sessionStorage.scrollPostionName = 'notification'
                        sessionStorage.scrollPostionLimit = list.length
                    }}>
                        <CardContent>
                            <CardActionArea>
                                <div>
                                    <div className={classesChat.nameNotify} style={{width: today?isMobileApp?260:290:isMobileApp?205:235}}>
                                        {element.title}
                                    </div>
                                    <div className={classesChat.textChat}>
                                        {element.message}
                                    </div>
                                </div>
                                <div className={classesChat.timeChat}>
                                    {today?pdHHMM(element.createdAt):pdDDMMYYHHMM(element.createdAt)}
                                </div>
                            </CardActionArea>
                        </CardContent>
                    </Card>
                </Link>
                :
                6===element.type&&element.who._id!==profile._id?
                    <Card className={isMobileApp?classesCard.cardM:classesCard.cardD}>
                       <CardContent>
                            <Link
                                href={'/order/[id]'}
                                as={`/order/${element.order._id}`}
                            >
                            <CardActionArea onClick={()=>{
                                let appBody = (document.getElementsByClassName('App-body'))[0]
                                sessionStorage.scrollPostionStore = appBody.scrollTop
                                sessionStorage.scrollPostionName = 'notification'
                                sessionStorage.scrollPostionLimit = list.length
                            }}>
                                <div className={classesChat.rowChat}>
                                         <img
                                            className={classesCard.avatar}
                                            src={element.who.avatar?element.who.avatar:'/static/add.png'}
                                            alt={element.title}

                                        />
                                    &nbsp;&nbsp;
                                    <div>
                                        <div className={classesChat.nameNotify} style={{width: today?isMobileApp?200:230:isMobileApp?145:175}}>
                                            {element.title}
                                        </div>
                                        <div className={classesChat.textChat}>
                                            <b>{element.who.name}:</b>&nbsp;{element.message}
                                        </div>
                                    </div>
                                </div>
                                <div className={classesChat.timeChat}>
                                    {today?pdHHMM(element.createdAt):pdDDMMYYHHMM(element.createdAt)}
                                </div>
                            </CardActionArea>
                            </Link>
                        </CardContent>
                    </Card>
                    :
            null
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
        mini_dialogActions: bindActionCreators(mini_dialogActions, dispatch),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CardNotification)