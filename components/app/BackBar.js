import React from 'react';
import Paper from '@material-ui/core/Paper';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import IconButton from '@material-ui/core/IconButton';
import Router from 'next/router'

const BackBar = React.memo((props) => {
    const { backBarShow } = props;
    return (
        <Paper className='BackBarDiv'>
            <IconButton aria-label='BackBar' onClick={()=>Router.back()}>
                <ArrowBackIcon/>
            </IconButton>
            <div className='BackBarTitle'>
                {backBarShow}
            </div>
        </Paper>
    )
})

export default BackBar