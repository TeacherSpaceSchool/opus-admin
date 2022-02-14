import { SET_EXPIRED, SET_IS_APPLE, SET_SHOW_LIGHTBOX, SET_IMAGES_LIGHTBOX, SET_INDEX_LIGHTBOX, SET_FILTER, SET_SORT, SET_SEARCH, SET_IS_MOBILE_APP, SHOW_LOAD, SET_DATE} from '../constants/app'

const initialState = {
    search: '',
    filter: '',
    sort: '-createdAt',
    isMobileApp: undefined,
    load: false,
    date: '',
    showLightbox: false,
    imagesLightbox: [],
    indexLightbox: 0,
    bottomNavigationNumber: 0,
    isApple: false,
    ua: '',
    showWelcomePage: false,
    expired: false,
}

export default function mini_dialog(state = initialState, action) {
    switch (action.type) {
        case SET_EXPIRED:
            return {...state, expired: action.payload}
        case SET_IS_APPLE:
            return {...state, isApple: action.payload, ua: ''}
        case SET_SORT:
            return {...state, sort: action.payload}
        case SET_FILTER:
            return {...state, filter: action.payload}
        case SET_SEARCH:
            return {...state, search: action.payload}
        case SET_IS_MOBILE_APP:
            return {...state, isMobileApp: action.payload}
        case SHOW_LOAD:
            return {...state, load: action.payload}
        case SET_DATE:
            return {...state, date: action.payload}
        case SET_SHOW_LIGHTBOX:
            return {...state, showLightbox: action.payload}
        case SET_INDEX_LIGHTBOX:
            return {...state, indexLightbox: action.payload}
        case SET_IMAGES_LIGHTBOX:
            return {...state, imagesLightbox: action.payload}
        default:
            return state
    }
}