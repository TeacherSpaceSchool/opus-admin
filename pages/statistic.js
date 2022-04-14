import Head from 'next/head';
import React, { useState, useEffect, useRef } from 'react';
import App from '../layouts/App';
import { connect } from 'react-redux'
import statisticStyle from '../src/styleMUI/list'
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Router from 'next/router'
import { urlMain } from '../redux/constants/other'
import initialApp from '../src/initialApp'
import Table from '../components/app/Table'
import { getClientGqlSsr } from '../src/getClientGQL'
import { pdDatePicker } from '../src/lib'
import { getStatistic } from '../src/gql/statistic'
import TextField from '@material-ui/core/TextField';
import { bindActionCreators } from 'redux'
import * as appActions from '../redux/actions/app'
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import {cities} from '../src/lib'
import Autocomplete from '@material-ui/lab/Autocomplete';

const Statistic = React.memo((props) => {
    const classes = statisticStyle();
    const { data } = props;
    const { isMobileApp } = props.app;
    const initialRender = useRef(true);
    let [city, setCity] = useState(undefined);
    let [dateStart, setDateStart] = useState(data.dateStart);
    let [dateType, setDateType] = useState({name:'День', value: 'day'});
    const dateTypes = [{name:'Часы', value: 'time'}, {name:'День', value: 'day'}, {name:'Месяц', value: 'month'}, {name:'Год', value: 'year'}]
    let handleDateType =  (event) => {
        setDateType({value: event.target.value, name: event.target.name})
    };
    let [type, setType] = useState({name:'Категории', value: 'category'});
    const types = [{name:'Категории', value: 'category'}, {name:'Подкатегории', value: 'subcategory'}, {name:'Исполнители', value: 'specialist'}]
    let handleType =  (event) => {
        setType({value: event.target.value, name: event.target.name})
    };
    let [statistic, setStatistic] = useState(data.statistic);
    const { showLoad } = props.appActions;
    useEffect(()=>{
        if(process.browser){
            let appBody = document.getElementsByClassName('App-body')
            appBody[0].style.paddingBottom = '0px'
        }
    },[process.browser])
    useEffect(()=>{
        (async()=>{
            if(!initialRender.current) {
                await showLoad(true)
                setStatistic((await getStatistic({
                    dateStart: dateStart ? dateStart : null,
                    dateType: dateType.value,
                    type: type.value,
                    city
                })))
                await showLoad(false)
            }
            else
                initialRender.current = false
        })()
    },[dateStart, dateType, type, city])
    return (
        <App backBarShow pageName='Статистика'>
            <Head>
                <title>Статистика</title>
                <meta name='description' content='OPUS.KG' />
                <meta property='og:title' content='Статистика' />
                <meta property='og:description' content='OPUS.KG' />
                <meta property='og:type' content='website' />
                <meta property='og:image' content={`${urlMain}/static/512x512.png`} />
                <meta property='og:url' content={`${urlMain}/statistic`} />
                <link rel='canonical' href={`${urlMain}/statistic`}/>
            </Head>
            <Card className={classes.page} style={{paddingTop: 35}}>
                <CardContent className={classes.column} style={isMobileApp?{}:{justifyContent: 'start', alignItems: 'flex-start'}}>
                    <div className={classes.row}>
                        {
                            type.value==='specialist'?
                                <Autocomplete
                                    options={cities}
                                    value={city}
                                    onChange={(event, newValue) => {
                                        setCity(newValue);
                                    }}
                                    className={classes.input}
                                    getOptionLabel={(option) => option}
                                    renderInput={(params) => <TextField {...params} label='Выберите город' />}
                                />
                                :
                                <>
                                <TextField
                                    className={classes.input}
                                    label='Дата начала'
                                    type='date'
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    value={dateStart}
                                    inputProps={{
                                        'aria-label': 'description',
                                    }}
                                    onChange={ event => setDateStart(event.target.value) }
                                />
                                <FormControl className={classes.input}>
                                    <InputLabel>Тип даты</InputLabel>
                                    <Select value={dateType.value} onChange={handleDateType}>
                                        {dateTypes.map((element)=>
                                            <MenuItem key={element.value} value={element.value} ola={element.name}>{element.name}</MenuItem>
                                        )}
                                    </Select>
                                </FormControl>
                                </>
                        }
                        <FormControl className={classes.input}>
                            <InputLabel>Тип данных</InputLabel>
                            <Select value={type.value} onChange={handleType}>
                                {types.map((element)=>
                                    <MenuItem key={element.value} value={element.value} ola={element.name}>{element.name}</MenuItem>
                                )}
                            </Select>
                        </FormControl>
                    </div>
                    <Table type='item' row={(statistic.row).slice(1)} columns={statistic.columns}/>
                </CardContent>
            </Card>
            <div className='count' >
                <div className={classes.rowStatic}> {`Количество: ${statistic.row[0].data[0]}`}</div>
                {/*<div className={classes.rowStatic}> {`Выручка: ${statistic.row[0].data[1]} сом`}</div>*/}
            </div>
        </App>
    )
})

Statistic.getInitialProps = async function(ctx) {
    await initialApp(ctx)
    if('admin'!==ctx.store.getState().user.profile.role)
        if(ctx.res) {
            ctx.res.writeHead(302, {
                Location: '/'
            })
            ctx.res.end()
        } else
            Router.push('/')
    const dateStart = pdDatePicker()
    return {
        data: {
            statistic: await getStatistic({type: 'category', dateStart, dateType: 'day'}, ctx.req?await getClientGqlSsr(ctx.req):undefined),
            dateStart
        }
    };
};

function mapStateToProps (state) {
    return {
        app: state.app,
        user: state.user,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        appActions: bindActionCreators(appActions, dispatch),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Statistic);