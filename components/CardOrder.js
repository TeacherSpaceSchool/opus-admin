import React from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import cardStyle from '../src/styleMUI/card'
import orderStyle from '../src/styleMUI/other/order'
import { connect } from 'react-redux'
import CardActionArea from '@material-ui/core/CardActionArea';
import Link from 'next/link';
const statusColor = {
    'активный': 'orange',
    'принят': 'blue',
    'выполнен': 'green',
    'отмена': 'red'
}

const CardOrder = React.memo((props) => {
    const classesCard = cardStyle();
    const classesOrder = orderStyle();
    const { element, list, my } = props;
    const { isMobileApp } = props.app;
    const { profile } = props.user;
    return (
        <Link href='/order/[id]' as={`/order/${element._id}`}>
            <Card className={isMobileApp?classesCard.cardM:classesCard.cardD} onClick={()=>{
                let appBody = (document.getElementsByClassName('App-body'))[0]
                    sessionStorage.scrollPostionStore = appBody.scrollTop
                    sessionStorage.scrollPostionName = 'order'
                    sessionStorage.scrollPostionLimit = list.length
            }}>
                <CardContent>
                    <CardActionArea>
                        {
                            element.urgency?
                                <>
                                <div className={classesCard.status} style={{background: 'red'}}>Срочно</div>
                                {
                                    my?
                                        <div className={classesCard.status1} style={{background: statusColor[element.status]}}>{element.status}</div>
                                        :
                                        null
                                }
                                </>
                                :
                                my?
                                    <div className={classesCard.status} style={{background: statusColor[element.status]}}>{element.status}</div>
                                    :
                                    null
                        }
                        <div className={classesCard.title}>
                            {element.name}
                        </div>
                        <br/>
                        <div className={classesCard.row} style={element.urgency&&my?{width: 'calc(100% - 80px)'}:{}}>
                            <div className={classesCard.nameField}>Категория:&nbsp;</div>
                            <div className={classesCard.value}>{element.subcategory.name}</div>
                        </div>
                        {
                            element.address?
                                <div className={classesCard.row}>
                                    <div className={classesCard.nameField}>Адрес:&nbsp;</div>
                                    <div className={classesCard.value}>{element.address}</div>
                                </div>
                                :
                                null
                        }
                        <div className={classesOrder.price}>{element.price}</div>
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

export default connect(mapStateToProps)(CardOrder)