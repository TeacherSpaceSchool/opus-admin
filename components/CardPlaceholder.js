import React from 'react';
import Skeleton from '@material-ui/lab/Skeleton';

const CardPlaceholder = React.memo((props) => {
    const { height, width } = props;
    return (
        <div
             style={{
                borderRadius: 10,
                ...width?{width}:{width: 'calc(100vw - 20px)', maxWidth: 385},
                ...height?{height}:{height: '80px'}}}>
            <Skeleton variant='rect' height='100%'/>
        </div>
    );
})

export default CardPlaceholder