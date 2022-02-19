import React from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import cardStyle from '../src/styleMUI/card'
import { connect } from 'react-redux'
import {pdDDMMYYHHMM} from '../src/lib'
import Link from 'next/link';

const CardApplication = React.memo((props) => {
    const classesCard = cardStyle();
    const { element, list } = props;
    const { isMobileApp, search } = props.app;
    const { profile } = props.user;
    return (
        <Link href='/application/[id]' as={`/application/${element._id}`}>
            <Card className={isMobileApp?classesCard.cardM:classesCard.cardD} onClick={()=>{
                if(!search) {
                    let appBody = (document.getElementsByClassName('App-body'))[0]
                    sessionStorage.scrollPostionStore = appBody.scrollTop
                    sessionStorage.scrollPostionName = 'application'
                    sessionStorage.scrollPostionLimit = list.length
                }
            }}>
                <CardContent>
                    <div className={classesCard.status} style={{background: element.status==='принят'?'green':'orange'}}>{element.status}</div>
                    {
                        element.unread&&profile.role==='client'&&element.comments&&element.comments.length?
                            <div className={classesCard.status1} style={{background: 'red'}}>Комментарий</div>
                            :
                            null
                    }
                    <div className={classesCard.row}>
                        <div className={classesCard.nameField}>Создан:&nbsp;</div>
                        <div className={classesCard.value}>{pdDDMMYYHHMM(element.createdAt)}</div>
                    </div>
                    <div className={classesCard.row}>
                        <div className={classesCard.nameField}>Категория:&nbsp;</div>
                        <div className={classesCard.value}>{element.category.name}</div>
                    </div>
                    <div className={classesCard.row}>
                        <div className={classesCard.nameField}>Подкатегория:&nbsp;</div>
                        <div className={classesCard.value}>{element.subcategory.name}</div>
                    </div>
                    <div className={classesCard.row}>
                        <div className={classesCard.nameField}>Заявитель:&nbsp;</div>
                        <div className={classesCard.value}>{element.user.name}</div>
                    </div>
                    {
                        element.approvedUser&&profile.role==='admin'?
                            <div className={classesCard.row}>
                                <div className={classesCard.nameField}>Принял:&nbsp;</div>
                                <div className={classesCard.value}>{`${element.approvedUser.role} ${element.approvedUser.name?` ${element.approvedUser.name}`:''}`}</div>
                            </div>
                            :
                            null
                    }
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

export default connect(mapStateToProps)(CardApplication)