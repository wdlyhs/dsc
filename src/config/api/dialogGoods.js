import axios from 'axios'
import qs from 'qs'


/**
 * 获取 goods 列表
 * 
 * @param {object} o - 传递过来的配置信息
 * @return 返回一个 promise 
 */
function getGoods(o, oF){
    return axios.post(`/${window.apiAuthority}/touch_visual/search`,qs.stringify({
        cat_id:o.catId || '',
        brand_id:o.brandId || '',
        pageSize:o.pageSize || 15,
        type:o.type || '',
        keyword:o.kwords || '',
        currentPage:o.currentPage || 1,
        ru_id:o.ru_id || 0
    }))
}

/**
 *获取 选中的 goods 列表
 *  
 * @param {Object} o - 请求信息 
 */
function getGoodsSel(o){
    return axios.post(`${window.ROOT_URL}api/v4/visual/checked`,qs.stringify({
        number:o.number,
        goods_id:o.selectGoodsId.join(',') || '',
        currentPage:o.currentPage,
        pageSize:o.pageSize
    }))
}

export default{
    getGoods,
    getGoodsSel
}