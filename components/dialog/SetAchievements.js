import React, {useState} from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as mini_dialogActions from '../../redux/actions/mini_dialog'
import Button from '@material-ui/core/Button';
import dialogContentStyle from '../../src/styleMUI/dialogContent'
import Remove from '@material-ui/icons/Remove';
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';

const SetAchievements =  React.memo(
    (props) =>{
        let { classes, achievements, setAchievements } = props;
        const { isMobileApp } = props.app;
        const { showMiniDialog } = props.mini_dialogActions;
        let [achievementsChange, setAchievementsChange] = useState([...achievements]);
        const width = isMobileApp? (window.innerWidth-112) : 500
        return (
            <div className={classes.main}>
                {achievementsChange.map((element, idx)=>
                    <FormControl key={`phone${idx}`} className={classes.input}>
                        <InputLabel>Достижение{idx+1}</InputLabel>
                        <Input
                            value={element}
                            onChange={(event)=>{
                                achievementsChange[idx] = event.target.value
                                setAchievementsChange([...achievementsChange])
                            }}
                            inputProps={{
                                'aria-label': 'description',
                            }}
                            endAdornment={
                                <InputAdornment position="end">
                                    <IconButton
                                        onClick={()=>{
                                            achievementsChange.splice(idx, 1);
                                            setAchievementsChange([...achievementsChange])
                                        }}
                                        aria-label='toggle password visibility'
                                    >
                                        <Remove/>
                                    </IconButton>
                                </InputAdornment>
                            }
                        />
                    </FormControl>
                )}
                <Button onClick={async()=>{
                    setAchievementsChange([...achievementsChange, ''])
                }} color='primary'>
                    Добавить достижение
                </Button>
                <br/>
                <div className={classes.rowCenter} style={{width}}>
                    <center>
                        <Button variant='contained' color='primary' onClick={()=>{
                            setAchievements([...achievementsChange])
                            showMiniDialog(false);
                        }} className={classes.button}>
                            Принять
                        </Button>
                        <Button variant='contained' color='secondary' onClick={()=>{showMiniDialog(false);}} className={classes.button}>
                            Закрыть
                        </Button>
                    </center>
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

SetAchievements.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(dialogContentStyle)(SetAchievements));