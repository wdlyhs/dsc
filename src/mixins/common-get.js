/**
 * 通用方法
 */

import { Toast } from 'vant'

import i18n from '@/locales'

function loadingData(){
	Toast.loading({
		duration: 600,
		mask: true,
		message: i18n.t('lang.loading')
	})
}

export default{
	loadingData
}

