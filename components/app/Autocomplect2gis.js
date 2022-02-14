import React, {useState, useEffect, useRef} from 'react';
import Autocomplete from '@material-ui/lab/Autocomplete';
import CircularProgress from '@material-ui/core/CircularProgress';
import TextField from '@material-ui/core/TextField';
import stylePageList from '../../src/styleMUI/list'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as mini_dialogActions from '../../redux/actions/mini_dialog'
import { getGeoFromAddress } from '../../src/2gis'

const Autocomplect2gis = React.memo((props) => {
    const classesPageList = stylePageList();
    const {setAddress, setGeo, defaultValue, label, _inputValue} = props;
    const focus = useRef(false);
    const initialRender = useRef(true);
    const [inputValue, setInputValue] = useState(defaultValue?defaultValue:'');
    useEffect(() => {
        if(initialRender.current)
            initialRender.current = false
        else
            setInputValue(_inputValue)
    }, [_inputValue]);
    let [searchTimeOut, setSearchTimeOut] = useState(null);
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        (async()=>{
            if (!focus.current||inputValue.length<3) {
                setElements([]);
                if(open)
                    setOpen(false)
                if(loading)
                    setLoading(false)
            }
            else {
                if(!loading)
                    setLoading(true)
                if(searchTimeOut)
                    clearTimeout(searchTimeOut)
                searchTimeOut = setTimeout(async()=>{
                    elements = await getGeoFromAddress(inputValue)
                    setElements(elements)
                    if(!open)
                        setOpen(true)
                    setLoading(false)
                }, 1000)
                setSearchTimeOut(searchTimeOut)
            }
        })()
    }, [inputValue]);
    const handleChange = event => {
        focus.current = true
        setInputValue(event.target.value);
    };
    let [elements, setElements] = useState([]);

    return (
        <Autocomplete
            defaultValue={defaultValue}
            onClose={()=>setOpen(false)}
            open={open}
            size={'medium'}
            inputValue={inputValue}
            disableOpenOnFocus
            className={classesPageList.input}
            options={elements}
            autoSelect
            freeSolo
            getOptionLabel={option => option.address?option.address:option}
            onChange={(event, newValue) => {
                focus.current = false
                if(newValue&&newValue.address) {
                    setInputValue(newValue.address)
                    setAddress(newValue.address)
                    setGeo(newValue.geo)
                }
                else if(newValue) {
                    setInputValue(newValue)
                    setAddress(newValue)
                }
                else {
                    setInputValue('')
                    setAddress('')
                }
            }}
            filterOptions={(options) => {
                return options;
            }}
            noOptionsText='Ничего не найдено'
            renderInput={params => (
                <TextField {...params} label={label} fullWidth  variant={'standard'}
                           onChange={handleChange}
                           InputProps={{
                               ...params.InputProps,
                               endAdornment: (
                                   <React.Fragment>
                                       {loading ? <CircularProgress color='inherit' size={20} /> : null}
                                       {params.InputProps.endAdornment}
                                   </React.Fragment>
                               ),
                           }}
                />
            )}
        />
    )
})

function mapStateToProps () {
    return {}
}

function mapDispatchToProps(dispatch) {
    return {
        mini_dialogActions: bindActionCreators(mini_dialogActions, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Autocomplect2gis);