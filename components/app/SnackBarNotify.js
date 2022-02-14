import React from 'react';
import Snackbar from '@material-ui/core/Snackbar';
import Button from '@material-ui/core/Button';
import { Alert, AlertTitle } from '@material-ui/lab';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Router from 'next/router'

const SnackBarNotify =  React.memo(
    (props) =>{
        const router = useRouter();
        const { snackBarNotify, showSnackBarNotify, closeShowSnackBarNotify } = props;
        return (
            <Snackbar
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                }}
                open={showSnackBarNotify}
                autoHideDuration={5000}
                onClose={closeShowSnackBarNotify}>
                    <Alert severity='info'
                           action={
                               snackBarNotify.order||snackBarNotify.application?
                                   snackBarNotify.order&&router.query.id===snackBarNotify.order._id||snackBarNotify.application&&router.query.id===snackBarNotify.application._id?
                                       <Button color='inherit' onClick={()=>{
                                           Router.reload()
                                       }}>
                                           Посмотреть
                                       </Button>
                                       :
                                       <Link
                                           href={{
                                               pathname: snackBarNotify.order?'/order/[id]':'/application/[id]',
                                               query: snackBarNotify.order?{page: 1}:{}
                                           }}
                                           as={
                                               snackBarNotify.order?
                                                   `/order/${snackBarNotify.order._id}?page=1`
                                                   :
                                                   `/application/${snackBarNotify.application._id}`
                                           }
                                       >
                                           <Button color='inherit'>
                                               Посмотреть
                                           </Button>
                                       </Link>
                                   :
                                   null
                           }>
                        <AlertTitle>{snackBarNotify.title}</AlertTitle>
                        {snackBarNotify.message}
                    </Alert>
            </Snackbar>
        );
    }
)

export default SnackBarNotify