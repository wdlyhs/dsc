<template>
	<div class="con" v-waterfall-lower="loadMore" waterfall-disabled="disabled" waterfall-offset="300">
		<List :discoverList="discoverList" v-on:getLikeNum="handleLikeNum" v-on:getDelete="handleDelete"></List>
		<div class="footer-cont" v-if="footerCont">{{$t('lang.no_more')}}</div>
		<template v-if="loading">
			<van-loading type="spinner" color="black" />
		</template>
		<Nav :mode="mode" :type="type"></Nav>
	</div>
</template>

<script>
import { mapState } from 'vuex'
import List from './components/List'
import Nav from './components/Nav'
import arrRemove from '@/mixins/arr-remove'

import { 
	Waterfall,
	Loading
} from 'vant'

export default{
	data(){
		return{
			mode:true,
			dis_type:this.$route.query.type,
			page:1,
			size:10,
			type:'ListType',
			communityType:true,
			loading:false,
			footerCont:false
		}
	},
	directives: {
    	WaterfallLower: Waterfall('lower')
	},
	components:{ 
		List,
		Nav,
		[Loading.name]:Loading
	},
	created(){
		this.onlist()
	},
	computed:{
		discoverList:{
        	get(){
        		return this.$store.state.discover.discoverList
        	},
        	set(val){
        		this.$store.state.discover.discoverList = val
        	}
        }
	},
	methods:{
		onlist(page){
			if(page){
				this.page = page
				this.size = Number(page) * 10
			}

			this.$store.dispatch('setDiscoverList',{
				dis_type:this.dis_type,
				page:this.page,
				size:this.size
			})
		},
		handleLikeNum(obj){
			this.discoverList.forEach(v=>{
				if(v.dis_id == obj.dis_id){
					v.like_num = obj.likeNum
				}
			})
		},
		handleDelete(obj){
			this.discoverList.forEach((v,i)=>{
				if(v.dis_id == obj.dis_id){
					 this.discoverList.splice(i, 1)
				}
			})
		},
		loadMore(){
			setTimeout(() => {
				this.disabled = true
		    	if(this.page * this.size == this.discoverList.length){
		  			this.page ++
		  			this.onlist()	
		  		}
			},200)
	    }
	},
	watch:{
		discoverList(){
			if(this.page * this.size == this.discoverList.length){
				this.disabled = false
				this.loading = true
			}else{
				this.loading = false
				this.footerCont = this.page > 1 ? true : false
			}

			this.discoverList = arrRemove.trimSpace(this.discoverList)
		},
	}
}
</script>