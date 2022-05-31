import React, {useState, useEffect, useRef} from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as mini_dialogActions from '../../redux/actions/mini_dialog'
import * as snackbarActions from '../../redux/actions/snackbar'
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import dialogContentStyle from '../../src/styleMUI/dialogContent'
import Autocomplete from '@material-ui/lab/Autocomplete';
import { getSubcategories } from '../../src/gql/subcategory'
import { pdDatePicker } from '../../src/lib'
import IconButton from '@material-ui/core/IconButton';
import ClearIcon from '@material-ui/icons/Clear';

const Mailing =  React.memo(
    (props) =>{
        let { classes, categories, type, category, setCategory, subcategory, setSubcategory, dateStart, setDateStart, dateEnd, setDateEnd } = props;
        const { isMobileApp } = props.app;
        const { showMiniDialog } = props.mini_dialogActions;
        const width = isMobileApp? (window.innerWidth-112) : 500
        const initialRender = useRef(true);
        let [_category, _setCategory] = useState(category);
        let [_subcategory, _setSubcategory] = useState(subcategory);
        let [_dateStart, _setDateStart] = useState(dateStart);
        let [_dateEnd, _setDateEnd] = useState(dateEnd);
        let [subcategories, setSubcategories] = useState([]);
        useEffect(() => {
            (async()=>{
                if(_category)
                    setSubcategories(await getSubcategories({compressed: true, category: _category._id}))
                else
                    setSubcategories([])
                if(!initialRender.current){
                    setSubcategory(null)
                    _setSubcategory(null)
                }
                else
                    initialRender.current = false
            })()
        }, [_category]);
        return (
            <div className={classes.main}>
                {
                    categories&&categories.length?
                        <>
                        <Autocomplete
                            options={categories}
                            value={_category}
                            onChange={(event, newValue) => {
                                setCategory(newValue);
                                _setCategory(newValue);
                            }}
                            style={{width}}
                            className={classes.textField}
                            getOptionLabel={(option) => option.name}
                            renderInput={(params) => <TextField {...params} label='Выберите категорию' />}
                        />
                        <br/>
                        {
                            subcategories&&subcategories.length?
                                <>
                                <Autocomplete
                                    options={subcategories}
                                    value={_subcategory}
                                    onChange={(event, newValue) => {
                                        setSubcategory(newValue);
                                        _setSubcategory(newValue);
                                    }}
                                    style={{width}}
                                    className={classes.textField}
                                    getOptionLabel={(option) => option.name}
                                    renderInput={(params) => <TextField {...params} label='Выберите подкатегорию' />}
                                />
                                <br/>
                                </>
                                :
                                null
                        }
                        </>
                        :
                        null
                }
                {
                    setDateStart?
                        <>
                        <div className={classes.row}>
                            <TextField
                                className={classes.input}
                                label='Дата начала'
                                type='date'
                                value={_dateStart}
                                inputProps={{
                                    'aria-label': 'description',
                                }}
                                onChange={ event => {
                                    if(event.target.value&&_dateEnd&&_dateEnd<=event.target.value){
                                        _dateEnd = new Date(event.target.value)
                                        _dateEnd.setDate(_dateEnd.getDate() + 1)
                                        setDateEnd(pdDatePicker(_dateEnd))
                                        _setDateEnd(pdDatePicker(_dateEnd))
                                    }
                                    setDateStart(event.target.value)
                                    _setDateStart(event.target.value)
                                }}
                            />
                            <IconButton
                                onClick={()=>{
                                    setDateStart('')
                                    _setDateStart('')
                                }}
                            >
                                <ClearIcon/>
                            </IconButton>
                        </div>
                        <br/>
                        </>
                        :
                        null
                }
                {
                    setDateEnd?
                        <>
                        <div className={classes.row}>
                            <TextField
                                className={classes.input}
                                label='Дата окончания'
                                type='date'
                                value={_dateEnd}
                                inputProps={{
                                    'aria-label': 'description',
                                }}
                                onChange={ event => {
                                    if(event.target.value&&(!_dateStart||_dateStart>=event.target.value)){
                                        _dateStart = new Date(event.target.value)
                                        _dateStart.setDate(_dateStart.getDate() - 1)
                                        setDateStart(pdDatePicker(_dateStart))
                                        _setDateStart(pdDatePicker(_dateStart))
                                    }
                                    setDateEnd(event.target.value)
                                    _setDateEnd(event.target.value)
                                }}
                            />
                            <IconButton
                                onClick={()=>{
                                    setDateEnd('')
                                    _setDateEnd('')
                                }}
                            >
                                <ClearIcon/>
                            </IconButton>
                        </div>
                        <br/>
                        </>
                        :
                        null
                }
                <div>
                    <Button variant='contained' color='primary' onClick={async()=>{
                        showMiniDialog(false);
                        initialRender.current = true
                    }} className={classes.button}>
                        Сохранить
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
        snackbarActions: bindActionCreators(snackbarActions, dispatch),
    }
}

Mailing.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(dialogContentStyle)(Mailing));