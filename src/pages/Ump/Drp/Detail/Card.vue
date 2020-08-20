<template>
    <div class="con">
        <div class="card" v-if="isWx">
            <div class="banner">
                <img src="../../../../assets/img/newuser/fx-img-1.jpg" class="img" />
            </div>
            <div class="content">
                <div class="tit">邀请规则</div>
                <div class="text">
                    <p>可以直接复制邀请码给好友下载APP注册填写</p>
                    <p>专属海报中的二维码和邀请链接已经包含在您的邀请信息<p>
                    <p>好友通过您的邀请码或者邀请海报注册汇演并下载APP后，Ta将永久成为您的下级会员，未来Ta产生的订单佣金您都有奖励，会自动计入您的账户中！</p>
                </div>
                <div class="button"><img src="../../../../assets/img/newuser/fx-img-2.png" class="img" /></div>
            </div>
        </div>
        <div class="card" v-else>
            <img :src="cardData" class="img" />
        </div>

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
    import isApp from '@/mixins/is-app'
    import CommonNav from '@/components/CommonNav'
    export default {
        name: "drp-card",
        components: {
            CommonNav
        },
        mixins: [isApp],
        data() {
            return {
                routerName:'drp',
                cardData:'',
                isWx:false
            }
        },
        created(){
            // if(isApp.isWeixinBrowser()){
            //     this.isWx = true
            // }else{
            //     this.isWx = false
            // }

            this.$http.get(`${window.ROOT_URL}api/v4/drp/user_card`).then(({ data:{ data } })=>{
                this.cardData = data.outImg
            })
        },
        computed: {},
        methods: {

        }
    }
</script>
