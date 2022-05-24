import Head from 'next/head';
import React, {useState} from 'react';
import App from '../layouts/App';
import { connect } from 'react-redux'
import stylePageList from '../src/styleMUI/list'
import styleOther from '../src/styleMUI/other/other'
import { urlMain } from '../redux/constants/other'
import { getCity } from '../src/lib'
import initialApp from '../src/initialApp'
import Card from '@material-ui/core/Card';
import Link from 'next/link';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import LocationCityIcon from '@material-ui/icons/LocationCity';
import StoreIcon from '@material-ui/icons/Store';
import WhatshotIcon from '@material-ui/icons/Whatshot';
import BuildIcon from '@material-ui/icons/Build';
import ChatBubbleIcon from '@material-ui/icons/Announcement';
import InfoIcon from '@material-ui/icons/Info';
import FavoriteIcon from '@material-ui/icons/Favorite';
import ReportIcon from '@material-ui/icons/BugReport';
import TimelineIcon from '@material-ui/icons/Timeline';
import HelpIcon from '@material-ui/icons/Help';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import { bindActionCreators } from 'redux'
import * as mini_dialogActions from '../redux/actions/mini_dialog'
import * as userActions from '../redux/actions/user'
import Sign from '../components/dialog/Sign'
import SetCity from '../components/dialog/SetCity'
import Confirmation from '../components/dialog/Confirmation'

const Subcategories = React.memo((props) => {
    const classesPageList = stylePageList();
    const classesOther = styleOther();
    const { logout } = props.userActions;
    const { profile, authenticated } = props.user;
    let [city, setCity] = useState();
    const { showMiniDialog, setMiniDialog } = props.mini_dialogActions;
    return (
        <App pageName='Меню'>
            <Head>
                <title>Меню</title>
                <meta name='description' content='OPUS.KG' />
                <meta property='og:title' content='Меню' />
                <meta property='og:description' content='OPUS.KG' />
                <meta property='og:type' content='website' />
                <meta property='og:image' content={`${urlMain}/static/512x512.png`} />
                <meta property='og:url' content={`${urlMain}/other`} />
                <link rel='canonical' href={`${urlMain}/other`}/>
            </Head>
            <div className={classesPageList.page}>
                {
                    profile.role==='admin'?
                        <Card className={classesOther.card} style={{cursor: 'pointer'}} onClick={()=>{
                            setMiniDialog('Укажите город', <SetCity setCityProps={setCity}/>)
                            showMiniDialog(true)
                        }}>
                            <div className={classesOther.row}>
                                <LocationCityIcon className={classesOther.icon}/>
                                <div className={classesOther.title}>
                                    {city?city:process.browser?decodeURI(getCity(document.cookie)):''}
                                </div>
                            </div>
                        </Card>
                        :
                        null
                }
                {
                    !profile.role?
                        <Card className={classesOther.card} style={{cursor: 'pointer'}} onClick={()=>{
                            setMiniDialog('Вход', <Sign/>)
                            showMiniDialog(true)
                        }}>
                            <div className={classesOther.row}>
                                <ExitToAppIcon className={classesOther.icon}/>
                                <div className={classesOther.title}>
                                    Войти в приложение
                                </div>
                            </div>
                        </Card>
                        :
                        profile.role==='client'?
                            <Link href='/user/[id]' as={`/user/${profile._id}`}>
                                <Card className={classesOther.card} style={{cursor: 'pointer'}}>
                                    <div className={classesOther.row}>
                                        <AccountCircleIcon className={classesOther.icon}/>
                                        <div className={classesOther.title}>
                                            Личный кабинет
                                        </div>
                                    </div>
                                </Card>
                            </Link>
                            :
                            profile.role==='admin'?
                                <>
                                <Link href={'/users'}>
                                    <Card className={classesOther.card} style={{cursor: 'pointer'}}>
                                        <div className={classesOther.row}>
                                            <AccountCircleIcon className={classesOther.icon}/>
                                            <div className={classesOther.title}>
                                                Пользователи
                                            </div>
                                        </div>
                                    </Card>
                                </Link>
                                <Link href={'/employments'}>
                                    <Card className={classesOther.card} style={{cursor: 'pointer'}}>
                                        <div className={classesOther.row}>
                                            <AccountCircleIcon className={classesOther.icon}/>
                                            <div className={classesOther.title}>
                                                Сотрудники
                                            </div>
                                        </div>
                                    </Card>
                                </Link>
                                </>
                                :
                                null
                }
                {
                    profile.role==='client'?
                        <Link href={'/favorites'}>
                            <Card className={classesOther.card} style={{cursor: 'pointer'}}>
                                <div className={classesOther.row}>
                                    <FavoriteIcon className={classesOther.icon}/>
                                    <div className={classesOther.title}>
                                        Избранные исполнители
                                    </div>
                                </div>
                            </Card>
                        </Link>
                        :
                        null
                }
                {
                    !authenticated?
                        <Card className={classesOther.card} onClick={()=>{
                            setMiniDialog('Вход', <Sign/>)
                            showMiniDialog(true)
                        }} style={{cursor: 'pointer'}}>
                            <div className={classesOther.row}>
                                <BuildIcon className={classesOther.icon}/>
                                <div className={classesOther.title}>
                                    Стать исполнителем
                                </div>
                            </div>
                        </Card>
                        :
                        ['manager', 'admin'].includes(profile.role)?
                            <Link href={'/applications'}>
                                <Card className={classesOther.card} style={{cursor: 'pointer'}}>
                                    <div className={classesOther.row}>
                                        <BuildIcon className={classesOther.icon}/>
                                        <div className={classesOther.title}>
                                            Заявки на исполнителя
                                        </div>
                                    </div>
                                </Card>
                            </Link>
                            :
                            <Link href={'/applications'}>
                                <Card className={classesOther.card} style={{cursor: 'pointer'}}>
                                    <div className={classesOther.row}>
                                        <BuildIcon className={classesOther.icon}/>
                                        <div className={classesOther.title}>
                                            Стать исполнителем
                                        </div>
                                    </div>
                                </Card>
                            </Link>
                }
                {
                    profile.specializations&&profile.specializations.length?
                        <Link href={'/categories'}>
                            <Card className={classesOther.card} style={{cursor: 'pointer'}}>
                                <div className={classesOther.row}>
                                    <StoreIcon className={classesOther.icon}/>
                                    <div className={classesOther.title}>
                                        Магазин
                                    </div>
                                </div>
                            </Card>
                        </Link>
                        :
                        null
                }
                {
                    profile.role==='client'?
                        <Link href={'/bonus'}>
                            <Card className={classesOther.card} style={{cursor: 'pointer'}}>
                                <div className={classesOther.row}>
                                    <WhatshotIcon className={classesOther.icon}/>
                                    <div className={classesOther.title}>
                                        Бонусы
                                    </div>
                                </div>
                            </Card>
                        </Link>
                        :
                        null
                }
                <Link href={'/complaints'}>
                    <Card className={classesOther.card} style={{cursor: 'pointer'}}>
                        <div className={classesOther.row}>
                            <ChatBubbleIcon className={classesOther.icon}/>
                            <div className={classesOther.title}>
                                Жалобы и предложения
                            </div>
                        </div>
                    </Card>
                </Link>
                <Link href={'/faq'}>
                    <Card className={classesOther.card} style={{cursor: 'pointer'}}>
                        <div className={classesOther.row}>
                            <HelpIcon className={classesOther.icon}/>
                            <div className={classesOther.title}>
                                Инструкции
                            </div>
                        </div>
                    </Card>
                </Link>
                <Link href={'/contact'}>
                    <Card className={classesOther.card} style={{cursor: 'pointer'}}>
                        <div className={classesOther.row}>
                            <InfoIcon className={classesOther.icon}/>
                            <div className={classesOther.title}>
                                Контакты
                            </div>
                        </div>
                    </Card>
                </Link>
                {
                    profile.role==='admin'?
                        <Link href={'/statistic'}>
                            <Card className={classesOther.card} style={{cursor: 'pointer'}}>
                                <div className={classesOther.row}>
                                    <TimelineIcon className={classesOther.icon}/>
                                    <div className={classesOther.title}>
                                        Статистика
                                    </div>
                                </div>
                            </Card>
                        </Link>
                        :
                        null
                }
                {
                    profile.role==='admin'?
                        <Link href={'/errors'}>
                            <Card className={classesOther.card} style={{cursor: 'pointer'}}>
                                <div className={classesOther.row}>
                                    <ReportIcon className={classesOther.icon}/>
                                    <div className={classesOther.title}>
                                        Сбои
                                    </div>
                                </div>
                            </Card>
                        </Link>
                        :
                        null
                }
                {
                    authenticated?
                        <Card className={classesOther.card} style={{cursor: 'pointer'}} onClick={()=>{
                            const action = async() => {
                                logout(true)
                            }
                            setMiniDialog('Выйти?', <Confirmation action={action}/>)
                            showMiniDialog(true)
                        }}>
                            <div className={classesOther.row}>
                                <ExitToAppIcon className={classesOther.icon} style={{color: 'red'}}/>
                                <div className={classesOther.title}>
                                    Выйти из приложения
                                </div>
                            </div>
                        </Card>
                        :
                        null
                }
            </div>
        </App>
    )
})

Subcategories.getInitialProps = async function(ctx) {
    await initialApp(ctx)
    return {
        data: {}
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
        mini_dialogActions: bindActionCreators(mini_dialogActions, dispatch),
        userActions: bindActionCreators(userActions, dispatch),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Subcategories);