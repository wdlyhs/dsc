<template>
	<div class="account_detail">
		<template v-if="accountlog_list.length > 0">
			<van-cell class="detail-list" v-for="(item,index) in accountlog_list" :key="index">
				<div class="dis-box">
					<div class="card-div box-flex">
						<template v-if="item.short_change_desc_part1">
							<p>{{ item.short_change_desc_part1}}</p>
							<p>{{ item.short_change_desc_part2}}</p>
						</template>
						<template v-else>
							<p>{{ item.short_change_desc}}</p>
						</template>
						
						<span>{{ item.change_time }}</span>
					</div>
					<span class="color-red">{{ item.type }} <span v-html="item.amount"></span></span>
				</div>
			</van-cell>
		</template>
		<template v-else>
        	<NotCont></NotCont>
      	</template>
      	<CommonNav></CommonNav>
	</div>
</template>

<script>
import { 
	List,
	Cell
} from 'vant'

import CommonNav from '@/components/CommonNav'
import NotCont from '@/components/NotCont'

export default{
	data(){
		return {
			loading:false,
			accountlog_list:[]
		}
	},
	components:{
		[List.name]:List,
		[Cell.name]:Cell,
		NotCont,
		CommonNav
	},
	created(){
		this.$http.get(`${window.ROOT_URL}api/v4/account/accountlog`).then(res =>{
			if(res.data.status == 'success'){
				this.accountlog_list = res.data.data
			}
		})
	},
	methods:{
		
	}
}
</script>