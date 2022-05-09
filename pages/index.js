import Head from 'next/head';
import React, {useState, useEffect} from 'react';
import App from '../layouts/App';
import { connect } from 'react-redux'
import stylePageList from '../src/styleMUI/list'
import styleCategory from '../src/styleMUI/other/category'
import styleIndex from '../src/styleMUI/other/index'
import { urlMain } from '../redux/constants/other'
import initialApp from '../src/initialApp'
import CardSubcategory from '../components/CardSubcategory'
import CardMainsubcategory from '../components/CardMainsubcategory'
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import Card from '@material-ui/core/Card';
import Link from 'next/link';
import { getSubcategories } from '../src/gql/subcategory'
import { getMainSubcategory, setMainSubcategory } from '../src/gql/mainSubcategory'
import { getClientGqlSsr } from '../src/getClientGQL'
import * as mini_dialogActions from '../redux/actions/mini_dialog'
import { bindActionCreators } from 'redux'
import Sign from '../components/dialog/Sign'
import Confirmation from '../components/dialog/Confirmation'
import { useRouter } from 'next/router';
import { Alert } from '@material-ui/lab';
import Snackbar from '@material-ui/core/Snackbar';
import Router from 'next/router'
import Extra1Icon from '@material-ui/icons/Search';
import Extra2Icon from '@material-ui/icons/Help';
import Extra3Icon from '@material-ui/icons/Whatshot';

const Index = React.memo((props) => {
    const classesPageList = stylePageList();
    const classesIndex = styleIndex();
    const classesCategory = styleCategory();
    const { data } = props;
    let [mainSubcategory, setMainsubcategory] = useState({...data.mainSubcategory});
    const { profile, authenticated } = props.user;
    const { setMiniDialog, showMiniDialog } = props.mini_dialogActions;
    const router = useRouter();
    const [alert, setAlert] = useState(router.query.alert);
    const closeAlert = () => setAlert(false)
    useEffect(()=>{
        if(router.query.code)
            sessionStorage.code = router.query.code
    },[])
    return (
        <App pageName='Главная'>
            <Head>
                <title>Главная</title>
                <meta name='description' content='Помощник, который всегда рядом! Возникла задача и вы не знаете как ее решить? Перестал работать холодильник? Нужно 2 недели получать инъекции? Сломалась машина в дороге? Или просто нету времени для ее решения.  Мы поможем найти человека для решения Ваших любых задач. Опишите задачу, выбирайте подходящего Вам исполнителя и решайте задачу. Экономьте свое время и позвольте решить задачу людям, которые имеют определенные навыки и знания в этой сфере.' />
                <meta property='og:title' content='Главная' />
                <meta property='og:description' content='Помощник, который всегда рядом! Возникла задача и вы не знаете как ее решить? Перестал работать холодильник? Нужно 2 недели получать инъекции? Сломалась машина в дороге? Или просто нету времени для ее решения.  Мы поможем найти человека для решения Ваших любых задач. Опишите задачу, выбирайте подходящего Вам исполнителя и решайте задачу. Экономьте свое время и позвольте решить задачу людям, которые имеют определенные навыки и знания в этой сфере.' />
                <meta property='og:type' content='website' />
                <meta property='og:image' content={`${urlMain}/static/512x512.png`} />
                <meta property='og:url' content={`${urlMain}/`} />
                <link rel='canonical' href={`${urlMain}/`}/>
            </Head>
                {
                    profile.role==='admin'?
                        <div className={classesPageList.page}>
                            <Link href={'/categories'}>
                                <Card className={classesCategory.cardAC}>
                                    <img
                                        className={classesCategory.mediaAC}
                                        src={'/static/7cf5ce65af5184a23756f07517d716eb.png'}
                                        alt='Все категории'
                                    />
                                    <div className={classesCategory.titleAC}>
                                        Все категории
                                    </div>
                                </Card>
                            </Link>
                            <div className={classesPageList.row} style={{gap: '10px', flexWrap: 'wrap', justifyContent: 'center'}}>
                                <CardMainsubcategory mainSubcategory={mainSubcategory} field='sc1' setMainsubcategory={setMainsubcategory} subcategories={data.subcategories}/>
                                <CardMainsubcategory mainSubcategory={mainSubcategory} field='sc2' setMainsubcategory={setMainsubcategory} subcategories={data.subcategories}/>
                                <CardMainsubcategory mainSubcategory={mainSubcategory} field='sc3' setMainsubcategory={setMainsubcategory} subcategories={data.subcategories}/>
                                <CardMainsubcategory mainSubcategory={mainSubcategory} field='sc4' setMainsubcategory={setMainsubcategory} subcategories={data.subcategories}/>
                                <CardMainsubcategory mainSubcategory={mainSubcategory} field='sc5' setMainsubcategory={setMainsubcategory} subcategories={data.subcategories}/>
                                <CardMainsubcategory mainSubcategory={mainSubcategory} field='sc6' setMainsubcategory={setMainsubcategory} subcategories={data.subcategories}/>
                            </div>
                            <Button
                                variant='contained'
                                color='primary'
                                className={classesCategory.buttonAddCategory}
                                onClick={()=>{
                                    const action = async() => {
                                        await setMainSubcategory({
                                            sc1: mainSubcategory.sc1?mainSubcategory.sc1._id:null,
                                            sc2: mainSubcategory.sc2?mainSubcategory.sc2._id:null,
                                            sc3: mainSubcategory.sc3?mainSubcategory.sc3._id:null,
                                            sc4: mainSubcategory.sc4?mainSubcategory.sc4._id:null,
                                            sc5: mainSubcategory.sc5?mainSubcategory.sc5._id:null,
                                            sc6: mainSubcategory.sc6?mainSubcategory.sc6._id:null
                                        })
                                    }
                                    setMiniDialog('Вы уверены?', <Confirmation action={action}/>)
                                    showMiniDialog(true)
                                }}
                            >
                                Сохранить
                            </Button>
                        </div>
                        :
                        !profile.role||profile.role==='client'?
                            <>
                            <div className={classesCategory.divMainCategory}>
                                {
                                    authenticated?
                                        <div className={classesPageList.rowCenter} style={{gap: '5px'}}>
                                            <Link href={'/faq'}>
                                                <div className={classesIndex.divMainExtra}>
                                                    <div className={classesIndex.divImgExtra}>
                                                        <Extra2Icon color='primary' className={classesIndex.imgExtra}/>
                                                    </div>
                                                    <div style={{width: 100, textAlign: 'center'}}>
                                                        Как пользоваться
                                                    </div>
                                                </div>
                                            </Link>
                                            <Link  href='/application/[id]' as={'/application/new'}>
                                                <div className={classesIndex.divMainExtra}>
                                                    <div className={classesIndex.divImgExtra}>
                                                        <Extra1Icon className={classesIndex.imgExtra}/>
                                                    </div>
                                                    <div style={{width: 80, textAlign: 'center'}}>
                                                        Найти работу
                                                    </div>
                                                </div>
                                            </Link>
                                            <Link href={'/bonus'}>
                                                <div className={classesIndex.divMainExtra}>
                                                    <div className={classesIndex.divImgExtra}>
                                                        <Extra3Icon color='primary' className={classesIndex.imgExtra}/>
                                                    </div>
                                                    <div style={{width: 60, textAlign: 'center'}}>
                                                        Мои бонусы
                                                    </div>
                                                </div>
                                            </Link>
                                        </div>
                                        :
                                        null
                                }
                                {
                                    mainSubcategory.sc1||mainSubcategory.sc2||mainSubcategory.sc3?
                                        <div className={classesPageList.rowCenter} style={{gap: '5px'}}>
                                            {mainSubcategory.sc1?<CardSubcategory order element={mainSubcategory.sc1}/>:null}
                                            {mainSubcategory.sc2?<CardSubcategory order element={mainSubcategory.sc2}/>:null}
                                            {mainSubcategory.sc3?<CardSubcategory order element={mainSubcategory.sc3}/>:null}
                                        </div>
                                        :
                                        null
                                }
                                {
                                    mainSubcategory.sc4||mainSubcategory.sc5||mainSubcategory.sc6?
                                        <div className={classesPageList.rowCenter} style={{gap: '5px'}}>
                                            {mainSubcategory.sc4?<CardSubcategory order element={mainSubcategory.sc4}/>:null}
                                            {mainSubcategory.sc5?<CardSubcategory order element={mainSubcategory.sc5}/>:null}
                                            {mainSubcategory.sc6?<CardSubcategory order element={mainSubcategory.sc6}/>:null}
                                        </div>
                                        :
                                        null
                                }
                                <Link href={'/categories'}>
                                    <Card className={classesCategory.cardAC}>
                                        <img
                                            className={classesCategory.mediaAC}
                                            src={'/static/7cf5ce65af5184a23756f07517d716eb.png'}
                                            alt='Все категории'
                                        />
                                        <div className={classesCategory.titleAC}>
                                            Все категории
                                        </div>
                                    </Card>
                                </Link>
                                {
                                    authenticated?
                                        <div className={classesIndex.divMainExtra}/>
                                        :
                                        null
                                }
                            </div>
                            {
                                authenticated?
                                    <Link href={'/order/[id]'} as={'/order/new'}>
                                        <Button
                                            variant='contained'
                                            color='primary'
                                            className={classesCategory.cardAOW}
                                            startIcon={<AddIcon />}
                                        >
                                            Создать заказ
                                        </Button>
                                    </Link>
                                    :
                                    <Button
                                        variant='contained'
                                        color='primary'
                                        className={classesCategory.cardAOW}
                                        startIcon={<AddIcon />}
                                        onClick={()=>{
                                            setMiniDialog('', <Sign/>)
                                            showMiniDialog(true)
                                        }}
                                    >
                                        Создать заказ
                                    </Button>
                            }
                            <Snackbar
                                anchorOrigin={{
                                    vertical: 'top',
                                    horizontal: 'center',
                                }}
                                open={alert}
                                autoHideDuration={5000}
                                onClick={()=>{
                                    Router.push('/notifications')
                                }}
                                onClose={closeAlert}>
                                <Alert severity='success'>
                                    ПОЗДРАВЛЯЕМ, ВЫ УСПЕШНО ПРОШЛИ РЕГИСТРАЦИЮ!
                                </Alert>
                            </Snackbar>
                            </>
                            :
                            null
                }
        </App>
    )
})

Index.getInitialProps = async function(ctx) {
    await initialApp(ctx)
    return {
        data: {
            ...'admin'===ctx.store.getState().user.profile.role?{subcategories: await getSubcategories({}, ctx.req?await getClientGqlSsr(ctx.req):undefined)}:{},
            ...await getMainSubcategory(ctx.req?await getClientGqlSsr(ctx.req):undefined)
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
        mini_dialogActions: bindActionCreators(mini_dialogActions, dispatch),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Index);