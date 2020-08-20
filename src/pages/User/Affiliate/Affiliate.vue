<template>
  <div>
  	<template v-if="share && share.on > 0">
  		<div class="affiliate-cont-box">
		  	<header class="p-r">
				<img :src="shareImg" v-if="shareImg" class="img" />
				<img src="../../../assets/img/user_share_1_bg.png" class="img" v-else/>
			    <div class="share-ewm-box"><p>{{ $t('lang.affiliate_code') }}</p></div>
		    </header>
		    <template v-if="share.on == 1">
			    <template v-if="share.config.separate_by == 0">
				    <section class="affiliate-cont padding-all">
				    	<div class="bg-color-write padding-all border-radius-top05">
				    		<h4>{{ $t('lang.my_recommend_user') }}</h4>
				    		<table class="share-table-box">
				    			<tr class="share-top">
				    				<th>{{ $t('lang.rank') }}</th>
				    				<th>{{ $t('lang.number_people') }}</th>
				    				<th>{{ $t('lang.point_divide') }}</th>
				    				<th>{{ $t('lang.money_divide') }}</th>
				    			</tr>
				    			<tr v-for="(item,index) in affdb" :key="index">
				    				<td>{{ index }}</td>
				    				<td>{{ item.num }}</td>
				    				<td>{{ item.point }}</td>
				    				<td>{{ item.money }}</td>
				    			</tr>
				    		</table>
				    	</div>
				    </section>
			    </template>
			    <template v-if="all_res.length > 0">
				    <section class="affiliate-cont padding-all affiliate-ajax">
				  		<div class="bg-color-write padding-all border-radius-top05">
				  			<template v-if="all_res.length > 0">
				  			<table class="rule-table-box" v-for="(item,index) in all_res" :key="index">
				  				<tr class="share-top"><th colspan="4">订单号：{{ item.order_sn }}</th></tr>
				  				<tr class="rule-title">
				  					<td>{{ $t('lang.money_divide') }}</td>
				  					<td>{{ $t('lang.point_divide') }}</td>
				  					<td>{{ $t('lang.divide_mode') }}</td>
				  					<td>{{ $t('lang.divide_state') }}</td>
				  				</tr>
				  				<tr>
				    				<td>{{ item.money }}</td>
				    				<td>{{ item.point }}</td>
				    				<td v-if="item.affiliate_type == 0">{{ $t('lang.affiliate_register') }}</td>
				    				<td v-else>{{ $t('lang.order_divide') }}</td>
				    				<td v-if="item.is_separate == 1">{{ $t('lang.has_been_divide') }}</td>
				    				<td v-else>{{ $t('lang.waiting_process') }}</td>
				    			</tr>
				  			</table>
				  			</template>
				  			<template v-else>
				  				<NotCont></NotCont>
				  			</template>
				  		</div>
				  	</section>
			  	</template>
		  	</template>
	  	</div>
  	</template>
  	<template v-else>
  		<NotCont :isSpan="false">
  			<span class="cont" slot="spanCon">{{ $t('lang.affiliate_not_open') }}</span>
  		</NotCont>
  	</template>
  	<CommonNav></CommonNav>
  </div>
</template>
<script>
import NotCont from '@/components/NotCont'
import CommonNav from '@/components/CommonNav'
export default{
	data(){
		return{
			affdb:[],
			all_res:[],
			config_info:[],
			share:[],
            shareImg:''
		}
	},
	components:{
		NotCont,
		CommonNav
	},
	created(){
		let o = {
			page:1,
			size:10
		}
		this.$http.get(`${window.ROOT_URL}api/v4/invite`,{ params:o }).then(res=>{
			this.affdb = res.data.data.affdb
			this.all_res = res.data.data.all_res
			this.config_info = res.data.data.config_info
			this.share = res.data.data.share
            this.shareImg = res.data.data.img_src
		})
	}
}
</script>
