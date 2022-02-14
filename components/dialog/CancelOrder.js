import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as mini_dialogActions from '../../redux/actions/mini_dialog'
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import dialogContentStyle from '../../src/styleMUI/dialogContent'
import { cancelOrder } from '../../src/gql/order'
import Router from 'next/router'

const CancelOrder =  React.memo(
    (props) =>{
        const { classes, _id } = props;
        let [message, setMessage] = useState('');
        const { isMobileApp } = props.app;
        const { showMiniDialog } = props.mini_dialogActions;
        const width = isMobileApp? (window.innerWidth-112) : 500
        return (
            <div className={classes.main}>
                <TextField
                    style={{width: width}}
                    placeholder='Причина отмены заказа'
                    label='Причина отмены заказа'
                    className={classes.textField}
                    margin='normal'
                    value={message}
                    onChange={(event)=>{setMessage(event.target.value)}}
                />
                <br/>
                <div>
                    <Button variant='contained' color='primary' onClick={async()=>{
                        let _responseOrder = await cancelOrder({_id, message})
                        if(_responseOrder==='OK')
                            Router.reload()
                       showMiniDialog(false);
                    }} className={classes.button}>
                        Отправить
                    </Button>
                    <Button variant='contained' color='secondary' onClick={()=>{showMiniDialog(false);}} className={classes.button}>
                        Закрыть
                    </Button>
                </div>
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
    }
}

CancelOrder.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(dialogContentStyle)(CancelOrder));