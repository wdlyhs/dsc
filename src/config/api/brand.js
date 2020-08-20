import qs from 'qs'
import axios from 'axios'

//品牌首页
function getBrand(){
	return new Promise((reslove,reject) => {
		axios.post(`${window.ROOT_URL}api/v4/brand`).then(res => {
			reslove(res.data.data)
		}).catch(err => {
			reject(err)
		})
	})
}

function getBrandDetail(o){
	return new Promise((reslove,reject) => {
		axios.post(`${window.ROOT_URL}api/v4/brand/detail`,qs.stringify(o)).then(res => {
			reslove(res.data.data)
		}).catch(err => {
			reject(err)
		})
	})
}

function getBrandProduct(o){
	return new Promise((reslove,reject) => {
		axios.post(`${window.ROOT_URL}api/v4/brand/goodslist`,qs.stringify(o)).then(res => {
			reslove({
				data:res.data.data,
				page:o.page,
				size:o.size
			})
		}).catch(err => {
			reject(err)
		})
	})
}

function getBrandList(){
	return new Promise((reslove,reject) => {
		axios.post(`${window.ROOT_URL}api/v4/brand/brandlist`).then(res => {
			reslove(res.data.data)
		}).catch(err => {
			reject(err)
		})
	})
}

export default{
	getBrand,
	getBrandList,
	getBrandDetail,
	getBrandProduct
}
