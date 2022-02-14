export let urlGQL
export let urlGQLws
export let urlMain
export let urlSubscribe
export let applicationKey
export let urlGQLSSR
if(process.env.URL==='opus.kg') {
    urlGQLSSR = `http://localhost:4000/graphql`
    urlGQL = `https://${process.env.URL}:3000/graphql`
    urlGQLws = `wss://${process.env.URL}:3000/graphql`
    urlSubscribe = `https://${process.env.URL}:3000/subscribe`
    urlMain = `https://${process.env.URL}`
    applicationKey = 'BNMNr1MfiPQzgK-VeZMIJQdfQ8mOI_jNN4HNsY-B2uqh52ko2Wq5VKi43CCj6JKmLkBNkiaOnIQQL8GShkS9Ivk'
}
else {
    urlGQLSSR = `http://localhost:3000/graphql`
    urlGQL = `http://${process.env.URL}:3000/graphql`
    urlGQLws = `ws://${process.env.URL}:3000/graphql`
    urlMain = `http://${process.env.URL}`
    urlSubscribe = `http://${process.env.URL}:3000/subscribe`
    applicationKey = 'BITwuSN4PDzoZMRnq37P0KfG9aHbBTIAuuljcIjCRQYrGlIh-_Y-K-p-s05H9GXJbLgwIHmfaE_UuA88cM2n6ec'
}
