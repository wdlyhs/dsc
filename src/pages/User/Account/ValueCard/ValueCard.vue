<template>
	<div class="con bonus" v-waterfall-lower="loadMore" waterfall-disabled="disabled" waterfall-offset="300">
		<template v-if="valueCardList && valueCardList.length > 0">
			<ul class="padding-all user_valuecard">
				<li v-for="(item,index) in valueCardList" :key="index">
					<div class="valuecard_top padding-all">
                        <header class="f-08 user_col ">
                        	<strong>NO.{{item.value_card_sn}}</strong>
                        	<label class="user_tag_box active">
                        		<template v-if="item.status">{{ $t('lang.activated') }}</template>
                        		<template v-else>{{ $t('lang.have_expired') }}</template>
                        	</label>
                        </header>
                        <h3 class="text-center user_col">
                          <em class="f-03">{{ $t('lang.sum') }}: </em>{{ item.card_money }}
                        </h3>
                        <p class="f-03 text-center col-9 m-top02"><label class="user_col"><router-link :to="{name:'valueCardDetail',params:{id:item.vid}}">{{ $t('lang.view_detail') }}<i class="iconfont icon-next-s"></i></router-link></label></p>
                    </div>
                    <div class="user_card_num padding-all">
                        <p class="f-02 color-whie">{{ $t('lang.expiration_time') }}：{{item.end_time}} <label class="valuecard_num"><em class="f-03">{{ $t('lang.face_value') }}: </em>{{item.vc_value}}</label></p>
                    </div>
				</li>
			</ul>
		</template>
		<template v-else>
			<NotCont />
		</template>
		<van-goods-action>
			<van-goods-action-big-btn :text="$t('lang.bind_value_card')" @click="onClickBigBtn" primary />
		</van-goods-action>
		<template v-if="loading">
			<van-loading type="spinner" color="black" />
		</template>
		<CommonNav></CommonNav>
	</div>
</template>

<script>
import { mapState } from 'vuex'

import {
	Loading,
	Waterfall,
	GoodsAction,
	GoodsActionBigBtn,
	GoodsActionMiniBtn,
} from 'vant'

import NotCont from '@/components/NotCont'
import CommonNav from '@/components/CommonNav'
import arrRemove from '@/mixins/arr-remove'
export default{
	name:'value-card',
	components: {
		NotCont,
		CommonNav,
		[Loading.name] : Loading,
		[GoodsAction.name] : GoodsAction,
		[GoodsActionBigBtn.name] : GoodsActionBigBtn,
		[GoodsActionMiniBtn.name] : GoodsActionMiniBtn,
	},
	directives: {
		WaterfallLower: Waterfall('lower')
	},
	data(){
		return {
			loading:true,
			page:1,
			size:10,
		}
	},
	created() {
		this.valueCardLoad()
	},
	computed: {
		valueCardList:{
			get(){
				return this.$store.state.user.valueCardList
			},
			set(val){
				this.$store.state.user.valueCardList = val
			}
		}
	},
	methods: {
		valueCardLoad(page){
			if(page){
				this.page = page
				this.size = Number(page) * 10
			}

			this.$store.dispatch('setValueCard',{
				page: this.page,
				size: this.size
			})
		},
		onClickBigBtn(){
			this.$router.push({
				name: 'addValueCard'
			})
		},
		loadMore(){
			//瀑布流分页
			setTimeout(() => {
				this.disabled = true
				if(this.page * this.size == this.valueCardList.length){
					this.page ++	
					this.valueCardLoad()
				}
			},200)
		},
	},
	watch:{
		valueCardList(){
			if(this.page * this.size == this.valueCardList.length){
				this.disabled = false
				this.loading = true
			}else{
				this.loading = false
			}

			this.bonusData = arrRemove.trimSpace(this.valueCardList)
		}
	}
}
</script>