import React, {useState} from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as mini_dialogActions from '../../redux/actions/mini_dialog'
import * as snackbarActions from '../../redux/actions/snackbar'
import Button from '@material-ui/core/Button';
import dialogContentStyle from '../../src/styleMUI/dialogContent'
import Remove from '@material-ui/icons/Remove';
import IconButton from '@material-ui/core/IconButton';
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';
import { inputInt, pdtDatePicker } from '../../src/lib'
import Switch from '@material-ui/core/Switch';

const SetSpecializations =  React.memo(
    (props) =>{
        let { classes, specializations, setSpecializations, subcategories } = props;
        const { isMobileApp } = props.app;
        const { showMiniDialog } = props.mini_dialogActions;
        const { showSnackBar } = props.snackbarActions;
        let [specializationsChange, setSpecializationsChange] = useState([...specializations]);
        const width = isMobileApp? (window.innerWidth-112) : 500
        return (
            <div className={classes.main}>
                {specializationsChange.map((element, idx)=>
                    <div className={classes.column}>
                        <div className={classes.row} style={{width}}>
                            <Switch
                                checked={specializationsChange[idx].enable}
                                onChange={()=>{
                                    specializationsChange[idx].enable = !specializationsChange[idx].enable
                                    setSpecializationsChange([...specializationsChange])
                                }}
                                color='primary'
                            />
                            <Autocomplete
                                options={subcategories.filter(element=>{
                                    return !JSON.stringify(specializationsChange).includes(element._id)
                                })}
                                value={specializationsChange[idx].subcategory}
                                onChange={(event, newValue) => {
                                    if(newValue){
                                        specializationsChange[idx].category = newValue.category._id
                                        specializationsChange[idx].subcategory = newValue
                                    }
                                    else {
                                        specializationsChange[idx].category = newValue
                                        specializationsChange[idx].subcategory = newValue
                                    }
                                    setSpecializationsChange([...specializationsChange])
                                }}
                                className={classes.input}
                                getOptionLabel={(option) => `${option.name}|${option.category?option.category.name:'undefined'}`}
                                renderInput={(params) => <TextField {...params} label='Выберите подкатегорию' />}
                            />
                            <IconButton
                                onClick={()=>{
                                    specializationsChange.splice(idx, 1);
                                    setSpecializationsChange([...specializationsChange])
                                }}
                                aria-label='toggle password visibility'
                            >
                                <Remove/>
                            </IconButton>
                        </div>
                        <div className={classes.row} style={{gap: '10px'}}>
                            <TextField
                                label='Скидка'
                                value={specializationsChange[idx].discount}
                                onChange={(event)=>{
                                    specializationsChange[idx].discount = inputInt(event.target.value)
                                    setSpecializationsChange([...specializationsChange])
                                }}
                                className={classes.input}
                                inputProps={{
                                    'aria-label': 'description',
                                }}
                            />
                            <TextField
                                className={classes.input}
                                label='Дата окончания'
                                type='date'
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                value={specializationsChange[idx].end}
                                inputProps={{
                                    'aria-label': 'description',
                                }}
                                onChange={(event)=>{
                                    specializationsChange[idx].end = event.target.value
                                    setSpecializationsChange([...specializationsChange])
                                }}
                            />
                        </div>
                        <br/>
                    </div>
                )}
                <Button onClick={async()=>{
                    let end = new Date()
                    end.setMonth(end.getMonth()+1)
                    setSpecializationsChange([
                        ...specializationsChange,
                        {
                            enable: true,
                            category: null,
                            subcategory: null,
                            end: pdtDatePicker(end),
                            discount: 0
                        }
                    ])
                }} color='primary'>
                    Добавить специализацию
                </Button>
                <br/>
                <div className={classes.rowCenter} style={{width}}>
                    <center>
                        <Button variant='contained' color='primary' onClick={()=>{
                            let set = true
                            for(let i=0; i<specializationsChange.length; i++) {
                                if(!specializationsChange[i].subcategory)
                                    set = false
                            }
                            if(set) {
                                setSpecializations([...specializationsChange])
                                showMiniDialog(false);
                            }
                            else
                                showSnackBar('Заполните все поля')
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
        snackbarActions: bindActionCreators(snackbarActions, dispatch),
    }
}

SetSpecializations.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(dialogContentStyle)(SetSpecializations));