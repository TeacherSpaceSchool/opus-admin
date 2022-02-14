import React from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import cardStyle from '../src/styleMUI/card'
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';
import { connect } from 'react-redux'

const CardMainsubcategory = React.memo((props) => {
    const classesCard = cardStyle();
    const { mainSubcategory, field, setMainsubcategory, subcategories } = props;
    const { isMobileApp } = props.app;
    return (
        <Card className={isMobileApp?classesCard.cardM:classesCard.cardD}>
            <CardContent>
                <Autocomplete
                    className={classesCard.input}
                    options={subcategories}
                    getOptionLabel={option => option.name}
                    value={mainSubcategory[field]}
                    onChange={(event, newValue) => {
                        mainSubcategory[field] = newValue
                        setMainsubcategory({...mainSubcategory})
                    }}
                    noOptionsText='Ничего не найдено'
                    renderInput={params => (
                        <TextField {...params} label='Подкатегория' fullWidth/>
                    )}
                />
            </CardContent>
        </Card>
    );
})

function mapStateToProps (state) {
    return {
        app: state.app
    }
}

export default connect(mapStateToProps)(CardMainsubcategory)