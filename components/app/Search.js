import React from 'react';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as appActions from '../../redux/actions/app'
import Paper from '@material-ui/core/Paper';
import CancelIcon from '@material-ui/icons/Cancel';
import Input from '@material-ui/core/Input';
import InputAdornment from '@material-ui/core/InputAdornment';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import IconButton from '@material-ui/core/IconButton';
import Router from 'next/router'

const Search = React.memo((props) => {
    const { searchShow } = props;
    const { search } = props.app;
    const { setSearch } = props.appActions;
    let handleSearch = (event) => {
        setSearch(event.target.value)
    };
    return (
        <div className='SearchDiv'>
            <Paper className='Search'>
                <Input className='SearchField'
                   type={'login'}
                   value={search}
                   onChange={handleSearch}
                   placeholder={searchShow.length?searchShow:'Поиск...'}
                   endAdornment={
                       search?
                           <InputAdornment position='end'>
                               <IconButton aria-label='Search' onClick={()=>{setSearch('');}}>
                                   <CancelIcon />
                               </IconButton>
                           </InputAdornment>
                           :
                           null
                   }
                   startAdornment={
                       <InputAdornment position='end'>
                           <IconButton aria-label='Search' onClick={()=>Router.back()}>
                               <ArrowBackIcon/>
                           </IconButton>
                       </InputAdornment>
                   }/>
            </Paper>
        </div>
    )
})

function mapStateToProps (state) {
    return {
        app: state.app
    }
}

function mapDispatchToProps(dispatch) {
    return {
        appActions: bindActionCreators(appActions, dispatch),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Search)