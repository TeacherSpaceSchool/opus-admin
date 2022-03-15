import React, {useState, useEffect} from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActionArea from '@material-ui/core/CardActionArea';
import cardStyle from '../src/styleMUI/card'
import UserStyle from '../src/styleMUI/other/user'
import { connect } from 'react-redux'
import Link from 'next/link';
import { checkFloat, getGeoDistance} from '../src/lib'

const CardSpecialist = React.memo((props) => {
    const classesCard = cardStyle();
    const classesUser = UserStyle();
    const { element, subcategoriesById, geo, list } = props;
    const { isMobileApp, search } = props.app;
    const [near, setNear] = useState(false);
    let [reiting, setReiting] = useState(0);
    let [specializations, setSpecializations] = useState('');
    useEffect(()=>{

        let subcategories = []
        for (let i = 0; i < element.specializations.length; i++) {
            if(subcategoriesById[element.specializations[i].subcategory]&&element.specializations[i].end>new Date()&&element.specializations[i].enable)
                subcategories.push(subcategoriesById[element.specializations[i].subcategory])
        }

        let length = subcategories.length-1
        for (let i = 0; i < subcategories.length; i++) {
            specializations += `${subcategories[i]}${i!==length?', ':''}`
        }
        setSpecializations(specializations)

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
        <Link href='/user/[id]' as={`/user/${element._id}`}>
            <Card className={isMobileApp?classesCard.cardM:classesCard.cardD} onClick={()=>{
                if(!search&&list) {
                    let appBody = (document.getElementsByClassName('App-body'))[0]
                    sessionStorage.scrollPostionStore = appBody.scrollTop
                    sessionStorage.scrollPostionName = 'user'
                    sessionStorage.scrollPostionLimit = list.length
                }
            }}>
                <CardContent>
                    <CardActionArea>
                        <div className={classesUser.rowProfile}>
                            <img
                                className={classesCard.avatar}
                                src={element.avatar?element.avatar:'/static/add.png'}
                                alt={element.name}
                            />
                            &nbsp;&nbsp;
                            <div className={classesCard.column}>
                                <div className={classesUser.name}>
                                    {element.name}
                                    {
                                        element.online||near?
                                        <div className={classesCard.row}>
                                            {element.online?<div className={classesUser.online}>online</div>:null}
                                            &nbsp;
                                            {near?<div className={classesUser.near}>близко</div>:null}
                                        </div>
                                        :
                                        null
                                    }
                                </div>
                                <div className={classesUser.rowSpecialist}>
                                    ⭐&nbsp;
                                    <div className={classesUser.field}>
                                        Рейтинг:&nbsp;<b>{reiting}</b>
                                    </div>
                                </div>
                                <div className={classesUser.rowSpecialist}>
                                    ✔️&nbsp;
                                    <div className={classesUser.field}>
                                        Работ выполнено:&nbsp;<b>{element.completedWorks}</b>
                                    </div>
                                </div>
                                {
                                    specializations?
                                        <div className={classesUser.rowSpecialist}>
                                            🔧&nbsp;
                                            <div className={classesUser.field}>
                                                {specializations}
                                            </div>
                                        </div>
                                        :
                                        null
                                }
                            </div>
                        </div>
                    </CardActionArea>
                </CardContent>
            </Card>
        </Link>
    );
})

function mapStateToProps (state) {
    return {
        app: state.app
    }
}

export default connect(mapStateToProps)(CardSpecialist)