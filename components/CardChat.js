import React, { useState } from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActionArea from '@material-ui/core/CardActionArea';
import cardStyle from '../src/styleMUI/card'
import chatStyle from '../src/styleMUI/other/chat'
import { connect } from 'react-redux'
import Link from 'next/link';
import { pdDDMMYYHHMM, pdHHMM } from '../src/lib'
const date = new Date()

const CardChat = React.memo((props) => {
    const classesCard = cardStyle();
    const classesChat = chatStyle();
    const { element, _user, list } = props;
    const { isMobileApp } = props.app;
    const { profile } = props.user;
    let [who] = useState(_user?_user===element.part1._id?element.part2:element.part1:profile._id===element.part1._id?element.part2:element.part1);
    let [updatedAt] = useState(new Date(element.updatedAt))
    let [today] = useState(updatedAt.getDate()===date.getDate()&&updatedAt.getFullYear()===date.getFullYear()&&updatedAt.getMonth()===date.getMonth());
    let unread = profile._id===element.part1._id?element.part1Unread:element.part2Unread
    if(!who)
        console.log(element)
    return (
        <Link
            href={{pathname: '/chat/[id]', query: _user?{user: _user}:{}}}
            as={`/chat/${element._id}${_user?`?user=${_user}`:''}`}
        >
            <Card className={isMobileApp?classesCard.cardM:classesCard.cardD}
                  onClick={()=>{
                      let appBody = (document.getElementsByClassName('App-body'))[0]
                      sessionStorage.scrollPostionStore = appBody.scrollTop
                      sessionStorage.scrollPostionName = 'notification'
                      sessionStorage.scrollPostionLimit = list.length
                  }}>
                <CardContent>
                    <CardActionArea>
                        <div className={classesChat.rowChat}>
                            <img
                                className={classesCard.avatar}
                                src={who.avatar?who.avatar:'/static/add.png'}
                                alt={who.name}
                            />
                            &nbsp;&nbsp;
                            <div className={classesChat.columnChat}>
                                <div className={classesChat.nameChat}>
                                    {who.name}
                                </div>
                                <div className={classesChat.textChat} style={{ display: '-webkit-box', WebkitLineClamp: '5', overflow: 'hidden', WebkitBoxOrient: 'vertical'  }}>
                                    {element.lastMessage?element.lastMessage.type==='text'?element.lastMessage.text:element.lastMessage.type==='image'?'Изображение':'Новый чат':'Новый чат'}
                                </div>
                            </div>
                            {
                                unread?
                                    <>
                                    &nbsp;&nbsp;
                                    <div className={classesCard.column}>
                                        <div className={classesChat.unreadChat}/>
                                    </div>
                                    </>
                                    :
                                    null
                            }
                        </div>
                        <div className={classesChat.timeChat}>
                            {today?pdHHMM(element.updatedAt):pdDDMMYYHHMM(element.updatedAt)}
                        </div>
                    </CardActionArea>
                </CardContent>
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

export default connect(mapStateToProps)(CardChat)