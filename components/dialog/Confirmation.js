import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as appActions from '../../redux/actions/app'
import * as mini_dialogActions from '../../redux/actions/mini_dialog'
import * as snackbarActions from '../../redux/actions/snackbar'
import dialogContentStyle from '../../src/styleMUI/dialogContent'
import Button from '@material-ui/core/Button';

const Confirmation =  React.memo(
    (props) =>{
        const { showMiniDialog } = props.mini_dialogActions;
        const { showSnackBar } = props.snackbarActions;
        const { showLoad } = props.appActions;
        const { classes, action, actionCancel } = props;
        return (
            action?
                <center className={classes.line}>
                    <Button variant='outlined' size='large' color='primary' style={{marginRight: 20}} onClick={async()=>{
                        try {
                            await showMiniDialog(false)
                            await showLoad(true)
                            await action()
                            await showLoad(false)
                        }  catch (err) {
                            console.error(err)
                            showSnackBar('Ошибка', 'error')
                        }
                    }}>
                        ДА
                    </Button>
                    <Button variant='outlined' color='secondary' size='large' onClick={async()=>{
                        showMiniDialog(false)
                        if(actionCancel){
                            await actionCancel()
                        }
                    }}>
                        НЕТ
                    </Button>
                </center>
                :
                null
        );
    }
)

function mapStateToProps () {
    return {}
}

function mapDispatchToProps(dispatch) {
    return {
        mini_dialogActions: bindActionCreators(mini_dialogActions, dispatch),
        appActions: bindActionCreators(appActions, dispatch),
        snackbarActions: bindActionCreators(snackbarActions, dispatch),
    }
}

Confirmation.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(dialogContentStyle)(Confirmation));