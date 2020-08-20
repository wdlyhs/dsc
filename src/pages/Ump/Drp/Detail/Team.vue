<template>
	<div class="drp-team">
		<van-tabs :active="active">
			<van-tab v-for="(item,index) in tabs" :key="index">
				<div class="nav_active" slot="title" @click="CommonTabs(index)">{{item}}</div>
			</van-tab>
		</van-tabs>
		<template v-if="active == 0">
			<div class="team-info" v-if="drpTeamData.team_info && drpTeamData.team_info.length > 0">
				<div class="tit">
					<div class="t1">{{$t('lang.user')}}ID</div>
					<div class="t2">{{$t('lang.contribution_amount')}}</div>
				</div>
				<div class="team-list">
					<router-link :to="{name:'drp-teamdetail',params:{user_id:item.user_id}}" class="item" v-for="(item,index) in drpTeamData.team_info"
				    :key="index">
						<div class="left">
							<div class="picture">
								<img v-if="item.user_picture" class="img" :src="item.user_picture" />
								<img v-else class="img" src="../../../../assets/img/user_default.png" />
							</div>
							<div class="team_info_con">
								<h4 class="onelist-hidden">{{item.user_name}}</h4>
								<p>{{$t('lang.label_addtime')}}{{item.reg_time}}</p>
							</div>
						</div>
						<div class="right">
							<p class="price">{{item.money}}</p>
							<i class="iconfont icon-more" />
						</div>
					</router-link>
				</div>
			</div>
			<NotCont v-else />
		</template>
		<template v-if="active == 1">
			<div class="team-info" v-if="drpOffkineUserData.user_list && drpOffkineUserData.user_list.length > 0">
				<div class="team-list">
					<div class="item" v-for="(item,index) in drpOffkineUserData.user_list" :key="index">
						<div class="left">
							<div class="picture">
								<img v-if="item.user_picture" class="img" :src="item.user_picture" />
								<img v-else class="img" src="../../../../assets/img/user_default.png" />
							</div>
							<div class="team_info_con">
								<h4 class="onelist-hidden">{{item.user_name}}</h4>
								<p>{{$t('lang.label_addtime')}}{{item.reg_time}}</p>
							</div>
						</div>
					</div>
				</div>
			</div>
			<NotCont v-else />
		</template>
		<CommonNav :routerName="routerName">
	         <li slot="aloneNav">
				<router-link :to="{name: 'drp'}">
					<i class="iconfont icon-fenxiao"></i>
					<p>{{$t('lang.drp_center')}}</p>
				</router-link>
			</li>
	    </CommonNav>
	</div>
</template>
<script>
	import CommonNav from '@/components/CommonNav'
	import NotCont from '@/components/NotCont'
	import { mapState } from 'vuex'
	import {
		Toast,
		Row,
		Col,
		Tab,
		Tabs,
		Loading,
		Waterfall
	} from 'vant'
	export default {
		name: "drp-team",
		components: {
			CommonNav,
			NotCont,
			[Toast.name]: Toast,
			[Row.name]: Row,
			[Col.name]: Col,
			[Tab.name]: Tab,
			[Tabs.name]: Tabs,
			[Loading.name]: Loading,
		},
		data() {
			return {
				routerName:'drp',
				Loading:false,
				active: 0,
				tabs: [this.$t('lang.my_team_alt'), this.$t('lang.direct_referrals')],
				user_id:this.$route.params.user_id ? this.$route.params.user_id : 0
			};
		},
		//初始化加载数据
		created() {
			this.myDrpTeam()
		},
		computed: {
			...mapState({
				drpTeamData: state => state.drp.drpTeamData,
				drpOffkineUserData: state => state.drp.drpOffkineUserData,
			})
		},
		mounted() {},
		methods: {
			//我的团队
			myDrpTeam(){
				this.$store.dispatch('setDrpTeam',{
					user_id:this.user_id,
					size: 100,
					page: 1
				})
			},
			//下级会员
			drpOffline() {
				this.$store.dispatch('setDrpOfflineUser',{
					user_id:this.user_id,
					size: 100,
					page: 1
				})
			},
			CommonTabs(index) {
				this.active = index

				if(index == 0){
					this.myDrpTeam()
				}else{
					this.drpOffline()
				}
			}
		}
	};
</script>
