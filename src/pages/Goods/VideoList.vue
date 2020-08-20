<template>
	<div class="video-page" v-waterfall-lower="loadMore" waterfall-disabled="disabled" waterfall-offset="300">
		<Search></Search>
		<!-- 列表 -->
		<section class="video-list" :class="{'video-list-grid':mode === 'grid'}">
			<div class="videolist">
				<template v-if="list.length > 0">
					<div class="videolist-item" v-for="(item,index) in list" :key="index" @click="showPopup(index)">
						<div class="inner">
							<div class="img">
								<img :src="item.goods_thumb" v-if="item.goods_thumb">
								<img src="@/assets/img/no_image.jpg" v-else>
							</div>
							<div class="i-mask"></div>
							<div class="info">
								<div class="i-play"></div>
								<div class="i-top">
									<div class="sales">{{item.sales_volume}}{{$t('lang.piece_sold')}}</div>
								</div>
								<div class="i-bottom">
									<div class="name">{{item.goods_name}}</div>
									<div class="flex">
										<div class="shop flex1">
											<img class="shop-logo" :src="item.shop_logo" v-if="item.shop_logo">
											{{item.get_seller_shop_info.shop_name}}
										</div>
										<div class="comment"><i></i><span v-if="item.comment_num">{{item.comment_num}}</span><span v-else>0</span></div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</template>
				<template v-else>
					<NotCont></NotCont>
				</template>
			</div>
			<div class="footer-cont" v-if="footerCont">{{$t('lang.no_more')}}</div>
			<template v-if="loading">
				<van-loading type="spinner" color="black" />
			</template>
		</section>

		<van-popup class="video-popup" v-model="popupShow" position="right" v-if="popupInfo.goods_video">
			<div class="video">
				<video :src="popupInfo.goods_video" id="movie" loop></video>
			</div>
			<div class="close" @click="hidePopup"></div>
			<div class="bottom">
				<router-link class="goodsinfo" :to="{ name: 'goods', params: { id: popupInfo.goods_id }}">
					<div class="img">
						<img :src="popupInfo.goods_thumb" v-if="popupInfo.goods_thumb">
						<img src="@/assets/img/no_image.jpg" v-else>
					</div>
					<div class="text">
						<h3>{{popupInfo.goods_name}}</h3>
						<p>{{popupInfo.shop_price_formated}}</p>
					</div>
				</router-link>
				<div class="like" :class="{'active':popupInfo.is_collect == 1}" @click="collection(popupInfo.goods_id)">
					<i></i>
					<span v-if="popupInfo.is_collect == 1">{{$t('lang.followed')}}</span>
					<span v-else>{{$t('lang.attention')}}</span>
				</div>
			</div>
		</van-popup>

		<!--初始化loading-->
        <DscLoading :dscLoading="dscLoading"></DscLoading>
	</div>
</template>
<script>
import qs from 'qs'
import EcTabDown from '@/components/tab-down/Frontend'
import Search from '@/components/Search'
import DscLoading from '@/components/DscLoading'
import arrRemove from '@/mixins/arr-remove'
import NotCont from '@/components/NotCont'

import {
	Popup,
	Waterfall,
	Loading,
    Dialog,
    Toast
} from 'vant'

export default {
	name: 'videoList',
	data(){
		return {
		    placeholder:this.$t('lang.search_goods'),
			disabled:false,
		    keyword:'',
			mode:'large',
			list:[],
			page:1,
			size:10,
			footerCont:false,
			loading:false,
			app:false,
			dscLoading:true,
			popupShow: false,
			popupInfo:{}
		} 
	},
	directives: {
		WaterfallLower: Waterfall('lower')
	},
	components: {
		EcTabDown,
		Search,
	  	DscLoading,
	  	NotCont,
		[Popup.name] : Popup,
		[Loading.name] : Loading,
		[Dialog.name] : Dialog,
		[Toast.name] : Toast,
	},
    computed: {
        isLogin() {
            return localStorage.getItem('token') == null ? false : true
        }
    },
	created(){
		this.loadList()
	},
	methods:{
		loadList(page){
			if(page){
				this.page = page
				this.size = Number(page) * 10
			}
			this.$http.post(`${window.ROOT_URL}api/v4/goods/goodsvideo`,qs.stringify({
			    size:this.size,
			    page:this.page,
			    sort: 'goods_id',
			    order: 'desc'
			})).then(({data})=>{
				if(!page){
					this.list = this.list.concat(data.data);
				}else{
					this.list = data.data;
				}
				if(this.list.length>=10){
					this.mode = 'grid'
				}else{
					this.mode = 'large'
				}
			})
		},
	    loadMore(){
			setTimeout(() => {
				this.disabled = true
		    	if(this.page * this.size == this.list.length){
		  			this.page ++
		  			this.loadList()	
		  		}
			},200)
	    },
	    showPopup(index){
	    	let item = this.list[index];
	    	this.popupInfo = item;
	    	this.popupShow = true;
	    	this.videoPlay();
	    },
	    hidePopup(){
	    	this.popupShow = false;
	    	this.videoPause();
	    },
        collection(goods_id) {
        	let that = this;
            if (this.isLogin) {
                this.$http.post(`${window.ROOT_URL}api/v4/collect/collectgoods`,qs.stringify({
                    goods_id: this.popupInfo.goods_id,
                    status: this.popupInfo.is_collect
                })).then(({data})=>{
                	if(data.data.error == 0){
                		Toast(data.data.msg)
	                	that.popupInfo.is_collect = !that.popupInfo.is_collect
	                	if(that.popupInfo.is_collect){

	                	}
                	}
                })
            } else {
                let msg = this.$t('lang.fill_in_user_collect_goods')
                this.notLogin(msg)
            }
        },
        notLogin(msg) {
            let url = window.location.href;
            Dialog.confirm({
                message: msg,
                className: 'text-center'
            }).then(() => {
                this.$router.push({
                    name: 'login',
                    query: {
                        redirect: {
                            name: 'videoList', 
                            url:url
                        }
                    }
                })
            }).catch(() => {

            })
        },
        videoPlay(){
        	setTimeout(function(){
	        	var video = document.getElementById('movie');
	            video.play();
        	},300)
        },
        videoPause(){
        	var video = document.getElementById('movie');
            video.pause();
        }
	},
	watch:{
		list(){
			this.dscLoading = false
			if(this.page * this.size == this.list.length){
				this.disabled = false
				this.loading = true
			}else{
				this.loading = false
				this.footerCont = this.page > 1 ? true : false
			}

			this.list = arrRemove.trimSpace(this.list)
		}
	}
}
</script>
<style lang="scss" scoped>
.secrch-warp{
	.input-text{
		.search-check{
			width: 4.6rem;
			height: 4.6rem;
			top: 0;
			right: 0;
			.iconfont{
				position: absolute;
				left: 50%;
				top: 50%;
				transform: translate(-50%,-50%);
			}
		}
	}
}
.video-list{
	padding: .5rem 0;
}
.videolist{
	margin: 0 .5rem;
	overflow: hidden;
}
.videolist-item{
	float: left;
	overflow: hidden;
	width: 100%;
	transition: width .2s;
	.inner{
		margin: .5rem;
		background: #000;
		border-radius: 1rem;
		overflow: hidden;
		position: relative;
	}
	.img{
		opacity: .8;
		position: relative;
		padding-top: 100%;
		img{
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
		}
	}
	.i-mask{
		position: absolute;
		left: 0;
		right: 0;
		bottom: 0;
		top: 30%;
		z-index: 2;
		background: rgba(255,255,255,0);
		background: -moz-linear-gradient(top, rgba(255,255,255,0) 0%, rgba(0,0,0,0.6) 100%);
		background: -webkit-gradient(left top, left bottom, color-stop(0%, rgba(255,255,255,0)), color-stop(100%, rgba(0,0,0,0.6)));
		background: -webkit-linear-gradient(top, rgba(255,255,255,0) 0%, rgba(0,0,0,0.6) 100%);
		background: -o-linear-gradient(top, rgba(255,255,255,0) 0%, rgba(0,0,0,0.6) 100%);
		background: -ms-linear-gradient(top, rgba(255,255,255,0) 0%, rgba(0,0,0,0.6) 100%);
		background: linear-gradient(to bottom, rgba(255,255,255,0) 0%, rgba(0,0,0,0.6) 100%);
		filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#ffffff', endColorstr='#000000', GradientType=0 );
	}
	.info{
		position: absolute;
		z-index: 3;
		top: 1.5rem;
		left: 1.5rem;
		right: 1.5rem;
		bottom: 1.5rem;
		.i-play{
			width: 5rem;
			height: 5rem;
			position: absolute;
			left: 0;
			right: 0;
			bottom: 0;
			top: 0;
			margin: auto;
	    	background: url(../../assets/img/video/play.png) no-repeat center;
	    	background-size: contain;
		}
		.i-top{
			position: absolute;
			top: 0;
			left: 0;
			right: 0;
			.sales{
				background: rgba(0,0,0,.5);
				color: #fff;
				display: inline-block;
				height: 2rem;
				line-height: 2rem;
				padding: 0 1rem;
				border-radius: 1rem;
				&:before{
					content:'';
					display: inline-block;
					width: .5rem;
					height: .5rem;
					border-radius: 100%;
					vertical-align: 0.1rem;
					background:linear-gradient(90deg,rgba(254,76,76,1),rgba(253,47,47,1));
					margin-right: .5rem;
				}
			}
		}
		.i-bottom{
			bottom: 0;
			position: absolute;
			left: 0;
			right: 0;
			.name{
				color: #fff;
				font-size: 1.6rem;
				height: 2rem;
				line-height: 2rem;
				white-space: nowrap;
				overflow: hidden;
				text-overflow: ellipsis;
				margin-bottom: 0.7rem;
			}
			.shop{
				font-size: 1.4rem;
				color: #d0d0d0;
				line-height: 2.3rem;
				height: 2.3rem;
				overflow: hidden;
				white-space: nowrap;
				.shop-logo{
					display: inline-block;
					width: 2.3rem;
					height: 2.3rem;
					vertical-align: top;
					margin-right: .5rem;
					overflow: hidden;
					background: #fff;
					border-radius: 100%;
				}
			}
			.comment{
				color: #fff;
			    font-size: 1.4rem;
			    line-height: 2.3rem;
		    	padding-left: .7rem;
			    i{
			    	display: inline-block;
			    	width: 1.4rem;
			    	height: 1.4rem;
			    	vertical-align: -0.2rem;
			    	background: url(../../assets/img/video/comment.png) no-repeat center;
			    	background-size: contain;
			    	margin-right: .5rem;
			    }
			}
		}
	}
}
.video-list-grid{
	.inner{
		border-radius: 0.7rem;
	}
	.videolist-item{
		width: 50%;
		.info{
			left: 1rem;
			top: 0.7rem;
			right: 1rem;
			bottom: 0.7rem;
			.i-play{
				width: 2.7rem;
				height: 2.7rem;
			}
			.i-bottom{
				.name{
					font-size: 1.3rem;
					margin-bottom: 0;
				}
				.shop{
					font-size: 1.2rem;
					height: 1.7rem;
					line-height: 1.7rem;
					.shop-logo{
						width: 1.7rem;
						height: 1.7rem;
					}
				}
				.comment{
					font-size: 1.2rem;
					line-height: 1.7rem;
				}
			}
		}
	}
}
/*弹窗*/
.video-popup{
	background: #000;
	.video{
		position: absolute;
		top: 0;
		right: 0;
		left: 0;
		bottom: 0;
		video{
			position: absolute;
			width: 100%;
			max-height: 100%;
			left: 50%;
			top: 50%;
			transform: translate(-50%,-50%);
		}
	}
	.close{
		position: absolute;
		right: 2rem;
		top: 2rem;
		width: 4rem;
		height: 4rem;
		background: rgba(0,0,0,.3) url(../../assets/img/video/close.png) no-repeat center;
		background-size: 1.3rem;
		border-radius: 100%;
	}
	.bottom{
		position: absolute;
		bottom: 2rem;
		left: 1.8rem;
		right: 2rem;
		text-align: center;
		.goodsinfo{
			background: #fff;
			height: 5.4rem;
			padding: 0.2rem;
			display: inline-block;
			width: 70%;
			border-radius: .5rem;
			.img{
				float: left;
				width: 5rem;
				height: 5rem;
				border-radius: .5rem;
				overflow: hidden;
				img{ width: 5rem; height: 5rem; display: block; vertical-align: top;}
			}
			.text{
				margin-left: 6rem;
				padding-top: 0.7rem;
				text-align: left;
				h3,
				p{
					line-height: 1.8rem;
					white-space: nowrap;
					overflow: hidden;
					text-overflow: ellipsis;
					font-size: 1.4rem;
				}
				p{
					color: #FD2F2F;
				}
			}
		}
		.like{
			display: inline-block;
			vertical-align: top;
			color: #fff; 
			height: 5.2rem;
			line-height: 5.2rem;
			width: 22%;
			margin-left: 1.7rem;
			i{
				display: inline-block;
				width: 1.4rem;
				height: 1.2rem;
				vertical-align: -0.2rem;
				background: url(../../assets/img/video/heart.png) no-repeat left bottom;
				background-size: 1.4rem;
				margin-right: .5rem;
			}
			&.active i{
				background-position: left top;
			}
		}
	}
}
</style>