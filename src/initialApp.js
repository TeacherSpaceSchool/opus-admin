import { getProfile } from '../redux/actions/user'
import { getJWT, checkMobile, getCity } from './lib'
import uaParserJs from 'ua-parser-js';
import { getClientGqlSsr } from './getClientGQL'
import { setDevice } from './gql/user'

export default async (ctx)=>{
    if (ctx.req) {
        let ua = uaParserJs(ctx.req.headers['user-agent'])
        ctx.store.getState().app.isMobileApp = ['mobile', 'tablet'].includes(ua.device.type)||checkMobile(ua.ua)||ctx.req.headers['sec-ch-ua-mobile']==='?1'
        ctx.store.getState().user.authenticated = getJWT(ctx.req.headers.cookie)
        ctx.store.getState().app.isApple = ua.device.model==='iPhone'
        ctx.store.getState().app.ua = ua.ua
        ctx.store.getState().app.showWelcomePage = !getCity(ctx.req.headers.cookie)&&!ctx.store.getState().user.authenticated
        if (ctx.store.getState().user.authenticated) {
            ctx.store.getState().user.profile = await getProfile(await getClientGqlSsr(ctx.req))
            if (ctx.store.getState().user.profile) {
                let deviceModel
                if (ua.device.model)
                    deviceModel = ua.device.model
                else if (ua.ua) {
                    deviceModel = ua.ua.split(' (')
                    if (deviceModel[1]) {
                        deviceModel = deviceModel[1].split('; ')
                        if (deviceModel[2]) {
                            deviceModel = deviceModel[2].split(') ')
                            if (deviceModel[0])
                                deviceModel = deviceModel[0]
                            else
                                deviceModel = ''
                        }
                    }
                }
                await setDevice(`${ua.device.vendor ? `${ua.device.vendor}-` : ''}${deviceModel} | ${ua.os.name ? `${ua.os.name}-` : ''}${ua.os.version ? ua.os.version : ''} | ${ua.browser.name ? `${ua.browser.name}-` : ''}${ua.browser.version ? ua.browser.version : ''}`, await getClientGqlSsr(ctx.req))
                if(ctx.store.getState().user.profile.specializations&&ctx.store.getState().user.profile.specializations.length){
                    const now = new Date()
                    let end
                    let expired
                    for(let i=0; i<ctx.store.getState().user.profile.specializations.length; i++) {
                        if(!ctx.store.getState().app.expired) {
                            end = new Date(ctx.store.getState().user.profile.specializations[i].end)
                            expired = (end - now) / 1000 / 60 / 60 / 24
                            if (expired < 5) {
                                if(expired < 0)
                                    ctx.store.getState().app.expired = 'СПЕЦИАЛИЗАЦИЯ ПРОСРОЧЕНА'
                                else
                                    ctx.store.getState().app.expired = 'СПЕЦИАЛИЗАЦИЯ СКОРО ЗАКОНЧИТьСЯ'
                                break;
                            }
                        }
                    }
                }
                else
                    ctx.store.getState().app.expired = false
            }
        }
        else {
            ctx.store.getState().user.profile = {}
            ctx.store.getState().app.expired = false
        }
    }
    ctx.store.getState().app.search = ''
    ctx.store.getState().app.sort = '-createdAt'
    if(!ctx.pathname.includes('order'))
        ctx.store.getState().app.filter = ''
    ctx.store.getState().app.date = ''
    ctx.store.getState().app.load = false
    ctx.store.getState().app.showLightbox = false
    ctx.store.getState().mini_dialog.show = false
    ctx.store.getState().mini_dialog.showFull = false

    if(ctx.pathname==='/')
        ctx.store.getState().app.bottomNavigationNumber = 0
    else if(ctx.pathname==='/orders')
        ctx.store.getState().app.bottomNavigationNumber = 1
    else if(ctx.pathname==='/other')
        ctx.store.getState().app.bottomNavigationNumber = 3
    else if(['/pushnotifications', '/notifications'].includes(ctx.pathname))
        ctx.store.getState().app.bottomNavigationNumber = 2
    else
        ctx.store.getState().app.bottomNavigationNumber = 4

}