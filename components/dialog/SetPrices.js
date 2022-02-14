import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as mini_dialogActions from '../../redux/actions/mini_dialog'
import * as appActions from '../../redux/actions/app'
import Button from '@material-ui/core/Button';
import dialogContentStyle from '../../src/styleMUI/dialogContent'
import Remove from '@material-ui/icons/Remove';
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import Input from '@material-ui/core/Input';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import CardContent from '@material-ui/core/CardContent';
import { inputInt, checkInt } from '../../src/lib'

const SetPrices =  React.memo(
    (props) =>{
        const { classes, setPrices, prices, edit } = props;
        let [pricesChange, setPricesChange] = useState([...prices]);
        const { isMobileApp } = props.app;
        const { showMiniDialog } = props.mini_dialogActions;
        const width = isMobileApp? (window.innerWidth-112) : 500
        return (
            <div className={classes.main} onClick={()=>{if(!edit)showMiniDialog(false);}}>
                {
                    edit?
                        <>
                        {pricesChange.map((element, idx)=>
                            <div key={`price${idx}`} className={classes.row} style={{gap: 10}}>
                                <FormControl className={classes.input}>
                                    <InputLabel>Услуга {idx+1}</InputLabel>
                                    <Input
                                        multiline
                                        placeholder={`Услуга ${idx+1}`}
                                        value={element.name}
                                        onChange={(event)=>{
                                            if(!event.target.value.includes('\n')) {
                                                pricesChange[idx].name = event.target.value
                                                setPricesChange([...pricesChange])
                                            }
                                        }}
                                        inputProps={{
                                            'aria-label': 'description',
                                        }}
                                    />
                                </FormControl>
                                <FormControl  key={`address${idx}`} className={classes.input}>
                                    <InputLabel>Цена {idx+1} (сом)</InputLabel>
                                    <Input
                                        multiline
                                        placeholder={`Цена(сом) ${idx+1}`}
                                        value={element.price}
                                        onChange={(event)=>{
                                            if(!event.target.value.includes('\n')) {
                                                pricesChange[idx].price = inputInt(event.target.value)
                                                setPricesChange([...pricesChange])
                                            }
                                        }}
                                        inputProps={{
                                            'aria-label': 'description',
                                        }}
                                        startAdornment={
                                            <div>
                                                от&nbsp;
                                            </div>
                                        }
                                        endAdornment={
                                            <InputAdornment position='end'>
                                                <IconButton
                                                    onClick={()=>{
                                                        pricesChange.splice(idx, 1);
                                                        setPricesChange([...pricesChange])
                                                    }}
                                                >
                                                    <Remove/>
                                                </IconButton>
                                            </InputAdornment>
                                        }
                                    />
                                </FormControl>
                            </div>
                        )}
                        <Button onClick={async()=>{
                            setPricesChange([...pricesChange, {
                                name: '',
                                price: 0
                            }])
                        }} color='primary'>
                            Добавить услугу
                        </Button>
                        </>
                        :
                        <CardContent>
                            {pricesChange.map((element, idx)=> {
                                if(element.name)
                                    return <div key={`address${idx}`} className={classes.value}
                                         style={{width, fontSize: '0.9375rem'}}>
                                        {element.name} - от {element.price} сом
                                    </div>
                            })}
                        </CardContent>
                }
                {
                    edit?
                        <>
                        <br/>
                        <div className={classes.rowCenter} style={{width}}>
                            <Button variant='contained' color='primary' onClick={async()=>{
                                await setPrices(pricesChange.map(e=>{return {name: e.name, price: checkInt(e.price)}}))
                                showMiniDialog(false);
                            }} className={classes.button}>
                                Принять
                            </Button>
                            <Button variant='contained' color='secondary' onClick={()=>{showMiniDialog(false);}} className={classes.button}>
                                Закрыть
                            </Button>
                        </div>
                        </>
                        :
                        null
                }
            </div>
        );
    }
)

function mapStateToProps (state) {
    return {
        app: state.app
    }
}

function mapDispatchToProps(dispatch) {
    return {
        mini_dialogActions: bindActionCreators(mini_dialogActions, dispatch),
        appActions: bindActionCreators(appActions, dispatch),
    }
}

SetPrices.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(dialogContentStyle)(SetPrices));