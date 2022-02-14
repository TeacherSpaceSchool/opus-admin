import {  SET_EXPIRED, SET_IS_APPLE, SET_SHOW_LIGHTBOX, SET_IMAGES_LIGHTBOX, SET_INDEX_LIGHTBOX, SET_SEARCH, SET_FILTER, SET_SORT, SET_IS_MOBILE_APP, SHOW_LOAD, SET_DATE } from '../constants/app'

export function setExpired(data) {
    return {
        type: SET_EXPIRED,
        payload: data
    }
}

export function setShowLightbox(data) {
    return {
        type: SET_SHOW_LIGHTBOX,
        payload: data
    }
}

export function setIsApple(data) {
    return {
        type: SET_IS_APPLE,
        payload: data
    }
}

export function setImagesLightbox(data) {
    return {
        type: SET_IMAGES_LIGHTBOX,
        payload: data
    }
}

export function setIndexLightbox(data) {
    return {
        type: SET_INDEX_LIGHTBOX,
        payload: data
    }
}

export function setFilter(data) {
    return {
        type: SET_FILTER,
        payload: data
    }
}

export function setDate(data) {
    return {
        type: SET_DATE,
        payload: data
    }
}

export function setSort(data) {
    return {
        type: SET_SORT,
        payload: data
    }
}

export function setSearch(data) {
    return {
        type: SET_SEARCH,
        payload: data
    }
}

export function setIsMobileApp(data) {
    return {
        type: SET_IS_MOBILE_APP,
        payload: data
    }
}

export function showLoad(show) {
    return {
        type: SHOW_LOAD,
        payload: show
    }
}