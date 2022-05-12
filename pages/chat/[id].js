import Head from 'next/head';
import React, { useState, useRef, useEffect } from 'react';
import App from '../../layouts/App';
import { connect } from 'react-redux'
import {getMessages, getChat, sendMessage} from '../../src/gql/chat'
import { bindActionCreators } from 'redux'
import * as snackbarActions from '../../redux/actions/snackbar'
import * as appActions from '../../redux/actions/app'
import { urlMain } from '../../redux/constants/other'
import { getClientGqlSsr } from '../../src/getClientGQL'
import initialApp from '../../src/initialApp'
import Router from 'next/router'
import { useRouter } from 'next/router';
import styleChat from '../../src/styleMUI/other/chat'
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import AttachFileIcon from '@material-ui/icons/AttachFile';
import SendIcon from '@material-ui/icons/Send';
import IconButton from '@material-ui/core/IconButton';
import Input from '@material-ui/core/Input';
import { pdDDMMYYHHMM, pdHHMM } from '../../src/lib'
import PhoneIcon from '@material-ui/icons/Phone';

const Chat = React.memo((props) => {
    const classesChat = styleChat();
    const {  isApple, isMobileApp } = props.app;
    const { setShowLightbox, setImagesLightbox, setIndexLightbox, showLoad } = props.appActions;
    const { showSnackBar } = props.snackbarActions;
    const { data } = props;
    const { profile } = props.user;
    const router = useRouter();
    let [who] = useState(data.chat?router.query.user?router.query.user===data.chat.part1._id?data.chat.part2:data.chat.part1:profile._id===data.chat.part1._id?data.chat.part2:data.chat.part1:{});
    let [message, setMessage] = useState('');
    let [list, setList] = useState(data.list);
    let listLength = useRef(list?list.length:0);
    let paginationWork = useRef(true)
    let tick = useRef(true);
    const sendTextMessage = async()=>{
        if(message.length) {
            let sendedMessage = await sendMessage({type: 'text', text: message, chat: router.query.id})
            if (sendedMessage) {
                setList([sendedMessage, ...list])
                setMessage('')
                setBottomChatHeight(bottomChatRef.current.offsetHeight);
                listMessageChatRef.current.scroll({top: 0, left: 0, behavior: 'instant'});
            }
        }
    }
    let imageRef = useRef(null);
    let listMessageChatRef = useRef(null);
    let bottomChatRef = useRef(null);
    let [bottomChatHeight, setBottomChatHeight] = useState(69);
    let handleChangeImage = (async (event) => {
        if(event.target.files[0]&&event.target.files[0].size / 1024 / 1024 < 50) {
            let sendedMessage = await sendMessage({type: 'image', file: event.target.files[0], chat: router.query.id})
            if(sendedMessage) {
                setList([sendedMessage, ...list])
                setMessage('')
                setBottomChatHeight(bottomChatRef.current.offsetHeight);
                listMessageChatRef.current.scroll({top: 0, left: 0, behavior: 'instant'});
            }
        } else {
            showSnackBar('Файл слишком большой')
        }
    })
    useEffect(() => {
        if(listMessageChatRef.current) {
            const onScroll = async () => {
                if(tick.current&&paginationWork.current) {
                    tick.current = false
                    let scrolledTop = listMessageChatRef.current.scrollHeight - (listMessageChatRef.current.clientHeight - listMessageChatRef.current.scrollTop)
                    if (scrolledTop<=1) {
                        await showLoad(true)
                        let addedList = await getMessages({skip: listLength.current, chat: router.query.id})
                        if (addedList.length > 0) {
                            setList([...list, ...addedList])
                            listLength.current += addedList.length
                        }
                        else
                            paginationWork.current = false
                        await showLoad(false)
                    }
                    tick.current = true
                }
            };
            listMessageChatRef.current.addEventListener('scroll', onScroll);
            return () => listMessageChatRef.current.removeEventListener('scroll', onScroll);
        }
    }, [process.browser]);
    return (
        <App pageName={data.chat?who.name:'Ничего не найдено'} list={list} setList={setList}>
            <Head>
                <title>{data.chat?who.name:'Ничего не найдено'}</title>
                <meta property='og:title' content={data.chat?who.name:'Ничего не найдено'} />
                <meta property='og:type' content='website' />
                <meta property='og:image' content={`${urlMain}/static/512x512.png`} />
                <meta property='og:url' content={`${urlMain}/chat/${router.query.id}`} />
                <link rel='canonical' href={`${urlMain}/chat/${router.query.id}`}/>
            </Head>
            {
                data.chat?
                    <>
                    <div className={classesChat.shapkaChat}>
                        <IconButton onClick={()=>Router.back()}>
                            <ArrowBackIcon/>
                        </IconButton>
                        <div className={classesChat.titleShapkaChat}>
                            {who.name}
                        </div>
                        {
                            isMobileApp?
                                <a href={`tel:+996${who.login}`}>
                                    <IconButton>
                                        <PhoneIcon/>
                                    </IconButton>
                                </a>
                                :
                                null
                        }
                    </div>
                    <div
                        className={classesChat.listMessageChat}
                        ref={listMessageChatRef}
                        style={isApple?{height: `calc(100vh - ${56+50+14+bottomChatHeight}px)`}:{height: `calc(100vh - ${56+50+bottomChatHeight}px)`}}
                    >
                        {
                            list?list.map((element)=> {
                                let createdAt = new Date(element.createdAt)
                                let date = new Date()
                                let today = createdAt.getDate()===date.getDate()&&createdAt.getFullYear()===date.getFullYear()&&createdAt.getMonth()===date.getMonth()
                                return(
                                    router.query.user&&router.query.user===element.who._id||profile._id===element.who._id?
                                        <div className={classesChat.divRightBubleChat} key={element._id}>
                                            <div className={classesChat.rightBubleChat}>
                                                {
                                                    element.type==='text'?
                                                        element.text
                                                        :
                                                        element.type==='image'?
                                                            <img
                                                                onClick={()=>{
                                                                    setShowLightbox(true)
                                                                    setImagesLightbox([element.file])
                                                                    setIndexLightbox(0)
                                                                }}
                                                                className={classesChat.imageBubleChat}
                                                                src={element.file}
                                                                alt={who.name}
                                                            />
                                                            :
                                                            element.type==='link'?
                                                                <a href={element.text}>{element.text}</a>
                                                                :
                                                                null
                                                }
                                                <div className={classesChat.timeRightBubleChat}>
                                                    {today?pdHHMM(element.createdAt):pdDDMMYYHHMM(element.createdAt)}
                                                </div>
                                            </div>
                                        </div>
                                        :
                                        <div className={classesChat.divLeftBubleChat} key={element._id}>
                                            <div className={classesChat.leftBubleChat}>
                                                {
                                                    element.type==='text'?
                                                        element.text
                                                        :
                                                        element.type==='image'?
                                                            <img
                                                                onClick={()=>{
                                                                    setShowLightbox(true)
                                                                    setImagesLightbox([element.file])
                                                                    setIndexLightbox(0)
                                                                }}
                                                                className={classesChat.imageBubleChat}
                                                                src={element.file}
                                                                alt={who.name}
                                                            />
                                                            :
                                                            element.type==='link'?
                                                                <a href={element.text}>{element.text}</a>
                                                                :
                                                                null
                                                }
                                                <div className={classesChat.timeLeftBubleChat}>
                                                    {today?pdHHMM(element.createdAt):pdDDMMYYHHMM(element.createdAt)}
                                                </div>
                                            </div>
                                        </div>
                                )}
                            ):null
                        }
                    </div>
                    {
                        !router.query.user?
                            <div className={classesChat.bottomChat} ref={bottomChatRef}>
                                <IconButton onClick={()=>{imageRef.current.click()}}>
                                    <AttachFileIcon/>
                                </IconButton>
                                <Input
                                    value={message}
                                    onChange={(event)=>{
                                        setMessage(event.target.value)
                                        setBottomChatHeight(bottomChatRef.current.offsetHeight)
                                    }}
                                    placeholder='Написать сообщение...'
                                    className={classesChat.inputBottomChat}
                                    multiline={true}
                                    rowsMax='4'
                                    onKeyUp={event => {
                                        if (['Backspace', 'Enter'].includes(event.key)) {
                                            setBottomChatHeight(bottomChatRef.current.offsetHeight)
                                        }
                                    }}
                                />
                                <IconButton onClick={sendTextMessage}>
                                    <SendIcon/>
                                </IconButton>
                            </div>
                            :
                            null
                    }
                    </>
                    :
                    null
            }
            <input
                accept='image/*'
                style={{ display: 'none' }}
                ref={imageRef}
                type='file'
                onChange={handleChangeImage}
            />
        </App>
    )
})

Chat.getInitialProps = async function(ctx) {
    await initialApp(ctx)
    if(!ctx.store.getState().user.profile.role)
        if(ctx.res) {
            ctx.res.writeHead(302, {
                Location: '/'
            })
            ctx.res.end()
        } else
            Router.push('/')
    return {
        data: {
            list: await getMessages({chat: ctx.query.id, skip: 0}, ctx.req?await getClientGqlSsr(ctx.req):undefined),
            chat: await getChat(ctx.query.id, ctx.req?await getClientGqlSsr(ctx.req):undefined)
        }
    };
};

function mapStateToProps (state) {
    return {
        user: state.user,
        app: state.app,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        snackbarActions: bindActionCreators(snackbarActions, dispatch),
        appActions: bindActionCreators(appActions, dispatch),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Chat);