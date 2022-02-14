import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as mini_dialogActions from '../../redux/actions/mini_dialog'
import Button from '@material-ui/core/Button';
import dialogContentStyle from '../../src/styleMUI/dialogContent'
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';
import {cities, setCityCookie, getCity} from '../../src/lib'

const SetCity =  React.memo(
    (props) =>{
        const { classes, setCityProps } = props;
        const { showMiniDialog } = props.mini_dialogActions;
        let [cityChange, setCityChange] = useState(getCity(document.cookie));
        return (
            <div className={classes.main}>
                <Autocomplete
                    options={cities}
                    value={cityChange}
                    onChange={(event, newValue) => {
                        setCityChange(newValue);
                    }}
                    className={classes.input}
                    getOptionLabel={(option) => option}
                    renderInput={(params) => <TextField {...params} label='Выберите город' />}
                />
                <br/>
                <div>
                    <Button variant='contained' color='primary' onClick={async()=>{
                       await setCityCookie(cityChange)
                        if(setCityProps)
                            setCityProps(cityChange)
                       showMiniDialog(false);
                    }} className={classes.button}>
                        Сохранить
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
        mini_dialogActions: bindActionCreators(mini_dialogActions, dispatch)
    }
}

SetCity.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(dialogContentStyle)(SetCity));