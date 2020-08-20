import qs from 'qs'
import axios from 'axios'

function getVisualStorein(o){
    return new Promise((reslove, reject) => {
        axios.post(`${window.ROOT_URL}api/v4/visual/storein`,qs.stringify(o)).then(res=>{
            reslove(res.data);
        })
    })
}

function getVisualAddcollect(o){
    return new Promise((reslove, reject) => {
        axios.post(`${window.ROOT_URL}api/v4/visual/addcollect`,qs.stringify(o)).then(res=>{
            reslove(res.data);
        })
    })
}

export default{
    getVisualStorein,
    getVisualAddcollect
}