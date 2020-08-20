module.exports = {
	// publicPath: process.env.NODE_ENV === 'production' ? '/' : '/',
	baseUrl: process.env.NODE_ENV === 'production' ? '/static/dist/' : '/',   //从 Vue CLI 3.3 起已弃用，3.3以上请使用publicPath
	filenameHashing: false,
	productionSourceMap: false,
	pages:{
		index: 'src/main.js',
		admin: 'src/admin/main.js'
	},
	devServer: {
		proxy: {
			'^/api': {
				target: 'https://m.lx.city',
				ws: true,
				changeOrigin: true
			},
			'^/admin': {
				target: 'https://m.lx.city',
				ws: true,
				changeOrigin: true
			},
			'^/storage':{
				target: 'https://m.lx.city',
				ws: true,
				changeOrigin: true
			}
		}
	}
}
