import qs from 'qs'
import axios from 'axios'

async function getPageList(o) {
    return new Promise((reslove, reject) => {
        axios.post(`${window.ROOT_URL}api/v4/visual/view`, qs.stringify({
            ru_id: o.ruid,
            default: o.sDefault,
            number: o.number,
            type:o.type
        })).then(res => {
            reslove(res)
        }).catch(err => {
            console.error(err)
        })
    })
}
export default {
    getPageList
}