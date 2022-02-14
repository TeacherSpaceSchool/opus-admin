import React from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import cardStyle from '../src/styleMUI/card'
import orderStyle from '../src/styleMUI/other/order'
import { connect } from 'react-redux'
import {pdDDMMYYHHMM} from '../src/lib'
import CardActionArea from '@material-ui/core/CardActionArea';
import Link from 'next/link';

const CardBonus = React.memo((props) => {
    const classesCard = cardStyle();
    const { element } = props;
    const { isMobileApp } = props.app;
    const { profile } = props.user;
    return (
        <Card className={isMobileApp?classesCard.cardM:classesCard.cardD}>
            <CardContent>
                <div className={classesCard.title}>
                    {element.what}
                </div>
                <br/>
                <div className={classesCard.row}>
                    <div className={classesCard.nameField}>Время:&nbsp;</div>
                    <div className={classesCard.value}>{pdDDMMYYHHMM(element.createdAt)}</div>
                </div>
                <div className={classesCard.row}>
                    <div className={classesCard.nameField}>Бонусов:&nbsp;</div>
                    <div className={classesCard.value}>{element.count}</div>
                </div>
                {
                    element.invited&&profile.role==='admin'?
                        <Link href='/user/[id]' as={`/user/${element.invited._id}`}>
                            <a>
                                <div className={classesCard.row}>
                                    <div className={classesCard.nameField}>Приглашеный:&nbsp;</div>
                                    <div className={classesCard.value}>{element.invited.name}</div>
                                </div>
                            </a>
                        </Link>
                        :
                        null
                }
            </CardContent>
        </Card>
    );
})

function mapStateToProps (state) {
    return {
        app: state.app,
        user: state.user,
    }
}

export default connect(mapStateToProps)(CardBonus)