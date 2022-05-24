import React, {useState} from 'react';
import welcomePageStyle from '../src/styleMUI/other/welcomePage'
import Head from 'next/head';
import { urlMain } from '../redux/constants/other'
import MobileStepper from '@material-ui/core/MobileStepper';
import Button from '@material-ui/core/Button';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import {setCityCookie, cities} from '../src/lib'
import Router from 'next/router'

const WelcomePage = React.memo(() => {
    const classesWelcomePage = welcomePageStyle();
    let [activeStep, setActiveStep] = useState(0);
    const handleNext = () => {
        if(activeStep<3) setActiveStep(activeStep+1)
        else {
            setCityCookie(city)
            Router.reload()
        }
    }
    const handleBack = () => {if(activeStep>0) setActiveStep(activeStep-1)}
    const [city, setCity] = useState('Бишкек');
    let handleCity = event => setCity(event.target.value)
    return (
        <div className={classesWelcomePage.main}>
            <Head>
                <title>Приветственная страница</title>
                <meta name='description' content='OPUS.KG' />
                <meta property='og:title' content='Приветственная страница' />
                <meta property='og:description' content='OPUS.KG' />
                <meta property='og:type' content='website' />
                <meta property='og:image' content={`${urlMain}/static/512x512.png`} />
                <meta property='og:url' content={`${urlMain}/`} />
                <link rel='canonical' href={`${urlMain}/`}/>
            </Head>
            <div className={classesWelcomePage.text} onClick={()=>{
                if(activeStep<3)setActiveStep(activeStep+1)
            }}>
                {
                    activeStep===0?
                        <>
                            <p style={{textAlign: 'center'}}><img alt='' src={`${urlMain}/static/opus GOTOVYI.png`} style={{height: '120px', width: '120px'}} /></p>
                            <p style={{textAlign: 'center', marginTop: 5, marginBottom: 5}}><span style={{fontFamily: 'Roboto', fontSize: '1.25rem'}}><strong>Салам</strong></span></p>
                            <p style={{textAlign: 'center', marginTop: 2, marginBottom: 2}}><span style={{fontFamily: 'Roboto', fontSize: '1rem'}}><span style={{color: '#000000'}}>OPUS сервиси менен ар кандай</span></span></p>
                            <p style={{textAlign: 'center', marginTop: 2, marginBottom: 2}}><span style={{fontFamily: 'Roboto', fontSize: '1rem'}}>татаал маселелер чечилет!</span></p>
                            <p style={{textAlign: 'center', height: 12}}><span style={{fontSize: '16px'}}><span style={{color: '#999999'}}>*****</span></span></p>
                            <p style={{textAlign: 'center', marginTop: 5, marginBottom: 5}}><span style={{fontFamily: 'Roboto', fontSize: '1.25rem'}}><strong>Привет</strong></span></p>
                            <p style={{textAlign: 'center', marginTop: 2, marginBottom: 2}}><span style={{fontFamily: 'Roboto', fontSize: '1rem'}}>В сервисе OPUS, на каждую </span></p>
                            <p style={{textAlign: 'center', marginTop: 2, marginBottom: 2}}><span style={{fontFamily: 'Roboto', fontSize: '1rem'}}>задачу имеется свое решение!</span></p>
                        </>
                        :
                    activeStep===1?
                        <>
                            <p style={{textAlign: 'center'}}><img alt='' src={`${urlMain}/static/lightbulb.png`} style={{height: '140px', width: '140px'}} /></p>
                            <p style={{textAlign: 'center', marginTop: 5, marginBottom: 5}}><strong><span style={{fontFamily: 'Roboto', fontSize: '1.25rem'}}>Чечимди табыңыз</span></strong></p>
                            <p style={{textAlign: 'center', marginTop: 2, marginBottom: 2}}><span style={{fontFamily: 'Roboto', fontSize: '1rem'}}>Заказ жасаңыз</span> <span style={{fontSize: '12px'}}><span style={{color: '#27ae60'}}>►</span></span>&nbsp; <span style={{fontFamily: 'Roboto', fontSize: '1rem'}}>Аткаруучуну</span></p>
                            <p style={{textAlign: 'center', marginTop: 2, marginBottom: 2}}><span style={{fontFamily: 'Roboto', fontSize: '1rem'}}>тандаңыз</span> <span style={{fontSize: '12px'}}><span style={{color: '#27ae60'}}>►</span></span> <span style={{fontFamily: 'Roboto', fontSize: '1rem'}}>Маселени чечиңиз</span></p>
                            <p style={{textAlign: 'center', height: 12}}><span style={{color: '#999999'}}><span style={{fontSize: '16px'}}>*****</span></span></p>
                            <p style={{textAlign: 'center', marginTop: 5, marginBottom: 5}}><strong><span style={{fontFamily: 'Roboto', fontSize: '1.25rem'}}>Найди свое решение</span></strong></p>
                            <p style={{textAlign: 'center', marginTop: 2, marginBottom: 2}}><span style={{fontFamily: 'Roboto', fontSize: '1rem'}}>Создайте заказ </span><span style={{color: '#27ae60'}}><span style={{fontSize: '12px'}}>►</span></span><span style={{fontFamily: 'Roboto', fontSize: '1rem'}}> Выбирайте</span></p>
                            <p style={{textAlign: 'center', marginTop: 2, marginBottom: 2}}><span style={{fontFamily: 'Roboto', fontSize: '1rem'}}>исполнителя </span><span style={{color: '#27ae60'}}><span style={{fontSize: '12px'}}>►</span></span><span style={{fontFamily: 'Roboto', fontSize: '1rem'}}> Решайте задачу</span></p>
                        </>
                        :
                    activeStep===2?
                        <>
                            <p style={{textAlign: 'center'}}><img alt='' src={`${urlMain}/static/wallet.png`} style={{height: '120px', width: '120px'}} /></p>
                            <p style={{textAlign: 'center', marginTop: 5, marginBottom: 5}}><strong><span style={{fontFamily: 'Roboto', fontSize: '1.25rem'}}>Иштеп акча табыңыз</span></strong></p>
                            <p style={{textAlign: 'center', marginTop: 2, marginBottom: 2}}><span style={{fontFamily: 'Roboto', fontSize: '1rem'}}>Сизге туура келген иштин т</span>үрүн</p>
                            <p style={{textAlign: 'center', marginTop: 2, marginBottom: 2}}><span style={{fontFamily: 'Roboto', fontSize: '1rem'}}>тандаңыз. Каалаган убакта жана</span></p>
                            <p style={{textAlign: 'center', marginTop: 2, marginBottom: 2}}><span style={{fontFamily: 'Roboto', fontSize: '1rem'}}>каалаган жерде эмгектенип, акы</span></p>
                            <p style={{textAlign: 'center', marginTop: 2, marginBottom: 2}}><span style={{fontFamily: 'Roboto', fontSize: '1rem'}}>aлуу мүмкүнчүлүгүнө ээ болуңуз!</span></p>
                            <p style={{textAlign: 'center', height: 12}}><span style={{color: '#999999'}}><span style={{fontSize: '16px'}}>*****</span></span></p>
                            <p style={{textAlign: 'center', marginTop: 5, marginBottom: 5}}><strong><span style={{fontFamily: 'Roboto', fontSize: '1.25rem'}}>Зарабатывайте</span></strong>&nbsp;</p>
                            <p style={{textAlign: 'center', marginTop: 2, marginBottom: 2}}><span style={{fontFamily: 'Roboto', fontSize: '1rem'}}>Выбирайте подходящие вам виды</span></p>
                            <p style={{textAlign: 'center', marginTop: 2, marginBottom: 2}}><span style={{fontFamily: 'Roboto', fontSize: '1rem'}}>работ. Имейте возможность</span></p>
                            <p style={{textAlign: 'center', marginTop: 2, marginBottom: 2}}><span style={{fontFamily: 'Roboto', fontSize: '1rem'}}>зарабатывать всегда и везде!</span></p>
                        </>
                        :
                        <>
                        <p style={{textAlign: 'center', marginTop: 2, marginBottom: 2}}><img alt='' src={`${urlMain}/static/fff.jpg`} style={{height: '140px', width: '226px'}} /></p>
                        <p style={{textAlign: 'center', marginTop: 5}}><strong><span style={{fontFamily: 'Roboto', fontSize: '1.25rem'}}>Шаар таңдоо</span></strong></p>
                        <p style={{textAlign: 'center', marginTop: 2, marginBottom: 2, height: 12}}><span style={{color: '#999999'}}><span style={{fontSize: '16px'}}>*****</span></span></p>
                        <p style={{textAlign: 'center'}}><strong><span style={{fontFamily: 'Roboto', fontSize: '1.25rem'}}>Выберите город</span></strong></p>
                        <FormControl className={classesWelcomePage.input}>
                            <InputLabel>Город</InputLabel>
                            <Select value={city} onChange={handleCity}>
                                {cities.map((element)=>
                                    <MenuItem key={element} value={element} ola={element}>{element}</MenuItem>
                                )}
                            </Select>
                        </FormControl>
                        </>
                }
            </div>
            <div>
                <MobileStepper
                    variant='dots'
                    steps={4}
                    position='static'
                    activeStep={activeStep}
                    backButton={
                        <Button size='large' onClick={handleBack} disabled={activeStep === 0}>
                            <KeyboardArrowLeft/>
                            Назад
                        </Button>
                    }
                    nextButton={
                        <Button size='large' onClick={handleNext} color={activeStep===3?'primary':'default'}>
                            {activeStep===3?'Начать':'Вперед'}
                            <KeyboardArrowRight />
                        </Button>
                    }
                />
            </div>

        </div>
    );
})

export default WelcomePage