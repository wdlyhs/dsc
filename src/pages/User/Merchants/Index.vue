<template>
    <div class="merchants" v-if="merchantsInfo">
        <div class="step" :class="'step_'+step">
            <template v-if="step == 1">
                <div class="surface"><img src="../../../assets/img/merchants.jpg" class="img" /></div>
            </template>
            <template v-else-if="step == 2">
                <div class="header">
                    <div class="title">{{$t('lang.company_information_rz')}}</div>
                    <div class="subtitle"><i>{{$t('lang.contact_information')}}</i></div>
                </div>
                <div class="content">
                    <van-cell-group class="van-cell-noleft m-top08">
                        <van-cell :title="$t('lang.label_sex')">
                            <van-radio-group v-model="sex">
                              <van-radio name="0">{{$t('lang.male')}}</van-radio>
                              <van-radio name="1">{{$t('lang.woman')}}</van-radio>
                            </van-radio-group>
                        </van-cell>
                        <van-field :label="$t('lang.label_contact_name')" v-model="username" required :placeholder="$t('lang.enter_name')" />
                        <van-field :label="$t('lang.label_contact_phone')" v-model="mobile" required :placeholder="$t('lang.enter_contact_phone')" />
                        <van-field :label="$t('lang.label_dz_email')" v-model="email" :placeholder="$t('lang.enter_email')" />
                    </van-cell-group>
                </div>
            </template>
            <template v-else-if="step == 3">
                <div class="header">
                    <div class="title">{{$t('lang.company_information_rz')}}</div>
                </div>
                <div class="content">
                    <van-cell-group class="van-cell-noleft m-top08">
                        <van-cell :title="$t('lang.label_cross_border_supply')" class="flex-align-items" v-if="merchantsInfo.cross_border_version">
                            <ec-select v-model="huoyuanSelect" :placeholder="$t('lang.select')">
                                <ec-option
                                  v-for="item in huoyuanList"
                                  :key="item"
                                  :label="item"
                                  :value="item">
                                </ec-option>
                            </ec-select>
                        </van-cell>
                        <van-field :label="$t('lang.label_corporate_name')" v-model="companyName" :placeholder="$t('lang.enter_contact_name')" />
                        <van-cell :title="$t('lang.label_business_license')" class="after-read">
                            <van-uploader :after-read="afterRead('business_license')">
                                <i class="iconfont icon-uploader"></i>
                                <span>{{$t('lang.upload_business_license')}}</span>
                            </van-uploader>
                            <i class="iconfont icon-picture" @click="previewImage('business_license')" v-if="business_license"></i>
                        </van-cell>
                        <van-cell :title="$t('lang.label_corporate_id_card')" class="after-read">
                            <van-uploader :after-read="afterRead('id_card')">
                                <i class="iconfont icon-uploader"></i>
                                <span>{{$t('lang.upload_id_card_pic')}}</span>
                            </van-uploader>
                            <i class="iconfont icon-picture" @click="previewImage('id_card')" v-if="id_card"></i>
                        </van-cell>
                        <van-field :label="$t('lang.label_contact_tel')" v-model="company_contactTel" :placeholder="$t('lang.enter_contact_tel')" />
                    </van-cell-group>
                </div>
            </template>
            <template v-else-if="step == 4">
                <div class="header">
                    <div class="title">{{$t('lang.add_cate')}}</div>
                </div>
                <div class="content">
                    <van-cell-group class="van-cell-noleft m-top08">
                        <van-cell :title="$t('lang.label_one_category')" class="flex-align-items">
                            <ec-select v-model="mainCategorySelect" :placeholder="$t('lang.select')">
                                <ec-option
                                  v-for="item in merchantsCategory"
                                  :key="item.cat_id"
                                  :label="item.cat_name"
                                  :value="item.cat_id">
                                </ec-option>
                            </ec-select>
                        </van-cell>
                    </van-cell-group>
                    <van-cell-group class="van-cell-noleft m-top08">
                        <van-cell :title="$t('lang.label_detail_category')" class="flex-align-items">
                            <button type="button" class="btn btn-min btn-lg-red" @click="addCate">{{$t('lang.add')}}</button>
                        </van-cell>
                    </van-cell-group>

                    <div class="category-list">
                        <div class="item" v-for="(item,index) in recordList" :key="index">
                            <div class="tit">{{$t('lang.label_serial_number')}}{{index+1}}</div>
                            <div class="lie ellipsis-one">{{$t('lang.label_one_category')}}{{item.stair.cat_name}}</div>
                            <div class="lie">
                                {{$t('lang.label_two_category')}}
                                <span v-for="(childItem,childIndex) in item.child" :key="childIndex">{{childItem.cat_name}}<i class="iconfont icon-close" @click="deleteCate(childItem.ct_id,index)"></i></span>
                            </div>
                        </div>
                    </div>
                </div>
            </template>
            <template v-else-if="step == 5">
                <div class="header">
                    <div class="title">{{$t('lang.its_name')}}</div>
                    <div class="subtitle"><i>{{$t('lang.basic_store_info')}}</i></div>
                </div>
                <div class="content">
                    <van-cell-group class="van-cell-noleft m-top08">
                        <van-cell :title="$t('lang.label_shop_type')" style="align-items: center;">
                            <ec-select v-model="shoptypeSelect" :placeholder="$t('lang.select')">
                                <ec-option
                                  v-for="item in shopType"
                                  :key="item.value"
                                  :label="item.label"
                                  :value="item.value">
                                </ec-option>
                            </ec-select>
                        </van-cell>
                        <van-cell :title="$t('lang.label_shop_z_type')" style="align-items: center;" v-if="shoptypeSelect == 1">
                            <ec-select v-model="subShoptypeSelect" :placeholder="$t('lang.select')">
                                <ec-option
                                  v-for="item in subShopType"
                                  :key="item.value"
                                  :label="item.label"
                                  :value="item.value">
                                </ec-option>
                            </ec-select>
                        </van-cell>
                        <van-field :label="$t('lang.label_shop_name')" v-model="rz_shopName" :placeholder="$t('lang.enter_shop_name')" />
                        <van-field :label="$t('lang.label_shop_login_name')" v-model="hopeLoginName" :placeholder="$t('lang.enter_shop_login_name')" />
                    </van-cell-group>
                </div>
            </template>
            <template v-else-if="step == 6 && shop">
                <div class="audit-pic">
                    <template v-if="shop.merchants_audit == 0"><img src="../../../assets/img/merchants_audit_3.png" class="img" /></template>
                    <template v-if="shop.merchants_audit == 1"><img src="../../../assets/img/merchants_audit_1.png" class="img" /></template>
                    <template v-if="shop.merchants_audit == 2"><img src="../../../assets/img/merchants_audit_2.png" class="img" /></template>
                </div>
                <div class="audit-type">
                    <template v-if="shop.merchants_audit == 0">
                        <div class="title">{{$t('lang.merchants_audit_0')}}</div>
                        <div class="subtitle">{{$t('lang.merchants_audit_0_desc')}}</div>
                    </template>
                    <template v-if="shop.merchants_audit == 1">
                        <div class="title">{{$t('lang.merchants_audit_1')}}</div>
                        <div class="subtitle">{{$t('lang.merchants_audit_1_desc')}}</div>
                    </template>
                    <template v-if="shop.merchants_audit == 2">
                        <div class="title">{{$t('lang.merchants_audit_2')}}</div>
                        <div class="subtitle">{{$t('lang.label_platform_reply')}}{{shop.merchants_message}}</div>
                    </template>
                </div>
                <div class="audit-shopname" v-if="shop.merchants_audit == 1">{{$t('lang.label_rz_shop_name')}}{{shop.rz_shopName}}</div>
                <template v-if="shop.merchants_audit == 2 || shop.merchants_audit == 0">
                <div class="audit-update">
                    <button type="button" @click="merchants(2)" class="audit-shopname" v-if="shop.steps_audit == 0">{{$t('lang.new_registration')}}</button>
                </div>
                </template>
            </template>

            <div class="btn-bar btn-bar-radius">
                <template v-if="step == 1">
                    <button type="button" @click="merchantStep(1)" class="btn" :class="[checked ? 'btn-lg-red' : 'btn-disabled']">{{$t('lang.iyou_move_into')}}</button>
                </template>
                <template v-else-if="step == 2">
                    <button type="button" @click="merchantStep(2)" class="btn btn-lg-red">{{$t('lang.merchant_step_1')}}</button>
                </template>
                <template v-else-if="step == 3">
                    <button type="button" @click="backStep(3)" class="btn btn-lg-white">{{$t('lang.last_step')}}</button>
                    <button type="button" @click="merchantStep(3)" class="btn btn-lg-red">{{$t('lang.merchant_step_2')}}</button>
                </template>
                <template v-else-if="step == 4">
                    <button type="button" @click="backStep(4)" class="btn btn-lg-white">{{$t('lang.last_step')}}</button>
                    <button type="button" @click="merchantStep(4)" class="btn btn-lg-red">{{$t('lang.merchant_step_3')}}</button>
                </template>
                <template v-else-if="step == 5">
                    <button type="button" @click="backStep(5)" class="btn btn-lg-white">{{$t('lang.last_step')}}</button>
                    <button type="button" @click="merchantStep(5)" class="btn btn-lg-red">{{$t('lang.merchant_step_4')}}</button>
                </template>
                <template v-else>
                    <button type="button" @click="linkHref('user')" class="btn btn-lg-red">{{$t('lang.enter_user_center')}}</button>
                    <button type="button" @click="linkHref('home')" class="btn btn-lg-white">{{$t('lang.home_back')}}</button>
                </template>
            </div>
            <div class="m-checkbox" v-if="step == 1" @click="checkboxChange">
                <van-checkbox checked-color="#2F80F9" v-model="checked">{{$t('lang.is_shop_rz_xy')}}</van-checkbox>
            </div>
        </div>
        <!--初始化loading-->
        <DscLoading :dscLoading="dscLoading"></DscLoading>

        <van-popup v-model="showBase" :overlay="true" :lock-scroll="true" class="merchants_article">
            <div class="title">{{$t('lang.read_entry_agreement')}}<van-icon name="close" @click="closeArticle" /></div>
            <div class="content" v-html="merchantsGuide.article_content"></div>
        </van-popup>
        <van-popup v-model="showCate" class="category-popup">
            <div class="title">{{$t('lang.add_cate')}}</div>
            <van-cell-group class="van-cell-noleft">
                <van-cell :title="$t('lang.label_one_category')" style="align-items: center;">
                   <ec-select v-model="categorySelect" :placeholder="$t('lang.select')" @change="categoryChange">
                    <ec-option
                      v-for="item in merchantsCategory"
                      :key="item.cat_id"
                      :label="item.cat_name"
                      :value="item.cat_id">
                    </ec-option>
                  </ec-select>
                </van-cell>
                <van-cell :title="$t('lang.label_two_category')">
                    <div class="all">
                        <van-checkbox checked-color="#F92028" shape="square" v-model="all_checked" @change="allCategoryChange">{{$t('lang.checkd_all_back')}}</van-checkbox>
                    </div>
                    <van-checkbox-group v-model="result" @change="changeResult">
                        <van-checkbox v-for="(item, index) in merchantsChildCate" :key="item.cat_id" :name="item.cat_id" shape="square">{{item.cat_name}}</van-checkbox>
                    </van-checkbox-group>
                </van-cell>
            </van-cell-group>
            <div class="btn-bar btn-bar-radius">
                <button type="button" @click="cancel" class="btn btn-lg-white">{{$t('lang.cancel')}}</button>
                <button type="button" @click="cateConfirm" class="btn btn-lg-red">{{$t('lang.confirm')}}</button>
            </div>
        </van-popup>
    </div>
</template>

<script>
import qs from 'qs'
import { mapState } from 'vuex'
import { Select, Option, OptionGroup, } from 'element-ui'

import DscLoading from '@/components/DscLoading'

import { 
    Checkbox,
    CheckboxGroup,
    Popup,
    Cell,
    CellGroup,
    Radio,
    RadioGroup,
    Field,
    Uploader,
    Button,
    Icon,
    Toast,
    ImagePreview
} from 'vant'

export default{
    data(){
        return{
            checked: false,
            showBase:false,
            showCate:false,
            guideData:'',
            username:'',
            mobile:'',
            sex:'0',
            email:'',
            categorySelect:'',
            mainCategorySelect:'',
            result: [],
            business_license:'',
            id_card:'',
            business_license_image:'',
            id_card_image:'',
            companyName:'',
            company_contactTel:'',
            shopType:[{
                value:1,
                label:this.$t('lang.flagship_store')
            },{
                value:2,
                label:this.$t('lang.exclusive_shop')
            },{
                value:3,
                label:this.$t('lang.franchised_store')
            }],
            shoptypeSelect:'',
            subShopType:[{
                value:1,
                label:this.$t('lang.subShoprz_type_0')
            },{
                value:2,
                label:this.$t('lang.subShoprz_type_1')
            },{
                value:3,
                label:this.$t('lang.subShoprz_type_2')
            }],
            subShoptypeSelect:'',
            rz_shopName:'',
            hopeLoginName:'',
            huoyuanSelect:this.$t('lang.domestic_warehouse'),
            huoyuanList:[this.$t('lang.domestic_warehouse'),this.$t('lang.free_trade_zone'),this.$t('lang.shipping_from_abroad')],
            dscLoading:true,
        }
    },
    components: {
        'EcSelect': Select,
        'EcOptionGroup': OptionGroup,
        'EcOption': Option,
        [Checkbox.name]: Checkbox, 
        [CheckboxGroup.name]: CheckboxGroup,
        [Popup.name]: Popup,
        [Cell.name]: Cell, 
        [CellGroup.name]: CellGroup,
        [Radio.name]: Radio, 
        [RadioGroup.name]: RadioGroup,
        [Field.name]: Field,
        [Uploader.name]: Uploader,
        [Button.name]: Button,
        [Icon.name]: Icon,
        [Toast.name]: Toast,
        DscLoading
    },
    computed:{
        ...mapState({
            merchantsInfo: state => state.user.merchantsInfo,
            merchantsGuide: state => state.user.merchantsGuide,
            merchantsCategory: state => state.user.merchantsCategory,
            merchantsCategoryInfo: state => state.user.merchantsCategoryInfo
        }),
        steps(){
            return this.merchantsInfo.steps
        },
        shop(){
            return this.merchantsInfo.shop
        },
        step:{
            get(){
                return this.merchantsInfo.shop ? this.shop.step_id :this.merchantsInfo.step_id
            },
            set(val){
                this.merchantsInfo.shop ? (this.shop.step_id = val) : (this.merchantsInfo.step_id = val)
            }
        },
        all_checked:{
            get(){
                return this.$store.state.user.all_checked
            },
            set(val){
                this.$store.state.user.all_checked = val
            }
        },
        merchantsChildCate:{
            get(){
                return this.$store.state.user.merchantsChildCate
            },
            set(val){
                this.$store.state.user.merchantsChildCate = val
            }
        },
        recordList(){
            return this.$store.state.user.recordList
        }
    },
    created(){
        this.merchants();
    },
    methods:{
        merchants(val){
            let that = this
            that.$store.dispatch('setMerchants',{
                step_id:val
            })
        },
        getMerchantsGuide(){
            let that = this
            that.$store.dispatch('setMerchantsGuide')
        },
        getMerchantsAgree(val){
            let that = this
            that.$store.dispatch('setMerchantsAgree',{
                fid:that.steps.fid ? that.steps.fid : 0,
                agree:that.checked ? 1 : 0,
                contactName:that.username,
                contactPhone:that.mobile,
                contactXinbie:that.sex,
                contactEmail:that.email,
                companyName:that.companyName,
                legal_person_fileImg:that.id_card,
                license_fileImg:that.business_license,
                company_contactTel:that.company_contactTel,
                huoyuan:that.merchantsInfo.cross_border_version ? that.huoyuanSelect : ''
            }).then(res=>{
                if(res.status == 'success'){
                    if(res.data.code == 0){
                        that.step = val + 1
                        this.getMerchantsShop();
                    }else{
                        Toast(res.data.msg);
                        return false
                    }
                }
            })
        },
        getMerchantsShop(){
            let that = this
            that.$store.dispatch('setMerchantsShop')
        },
        checkboxChange(){
            this.showBase = this.checked
        },
        categoryChange(){
            let that = this
            that.$store.dispatch('setMerchantsChildCate',{
                cat_id:this.categorySelect
            })
        },
        allCategoryChange(){
            let arr = []

            if(this.all_checked){
                this.merchantsChildCate.forEach(res=>{
                    arr.push(res.cat_id)
                })
                this.result = arr
            }else{
                this.result = []
            }
        },
        cateConfirm(){
            let catName = ''
            let childCateId = ''
            if(this.result.length > 0){
                this.showCate = false

                this.result.forEach(v=>{
                    childCateId += v + ','
                })

                this.$store.dispatch('setMerchantsAddCate',{
                    cat_id:this.categorySelect,
                    child_cate_id:childCateId.substring(0,childCateId.length-1)
                })
            }else{
                Toast(this.$t('lang.fill_in_category'))
            }
        },
        addCate(){
            this.result = []
            this.showCate = true
        },
        cancel(){
            this.showCate = false
        },
        changeResult(){
            if(this.result.length != this.merchantsChildCate.length){
                this.all_checked = false
            }
        },
        deleteCate(ct_id,index){
            this.$store.dispatch('setMerchantsDeleteCate',{
                ct_id:ct_id,
                index:index
            })
        },
        closeArticle(){
            this.showBase = false
            this.checked = true
        },
        addShop(val){
            let that = this
            that.$store.dispatch('setMerchantsAddShop',{
                data:{
                    rz_shopName:this.rz_shopName,
                    hopeLoginName:this.hopeLoginName,
                    shoprz_type:this.shoptypeSelect,
                    subShoprz_type:this.subShoptypeSelect,
                    shop_categoryMain:this.mainCategorySelect
                }
            }).then(res=>{
                if(res.status == "success"){
                    Toast(res.data.msg)
                    if(res.data.code == 0){
                        this.dscLoading = true
                        this.audit();
                        this.step = val + 1
                    }
                }else{
                    Toast(this.$t('lang.jk_error'))
                }
            })
        },
        audit(){
            let that = this
            that.$store.dispatch('setMerchantsAudit');
        },
        merchantStep(val){
            switch(val){
                case 1:
                    if(this.checked){
                        this.step = val + 1
                    }else{
                        Toast(this.$t('lang.please_read_merchant_agreement'))
                        return false
                    }
                    break;
                case 2:
                    if(this.username == ''){
                        Toast(this.$t('lang.contact_name_not_null'))
                        return false
                    }else if(!this.checkMobile()){
                        Toast(this.$t('lang.phone_number_format'))
                        return false
                    }else{
                        this.step = val + 1
                    }
                    break;
                case 3:
                    if(this.companyName == ''){
                        Toast(this.$t('lang.corporate_name_not_null'))
                        return false
                    }else if(this.business_license == ''){
                        Toast(this.$t('lang.please_upload_business_license'))
                        return false
                    }else if(this.id_card == ''){
                        Toast(this.$t('lang.please_upload_id_card'))
                        return false
                    }else if(this.company_contactTel == ''){
                        Toast(this.$t('lang.corporate_tel_not_null'))
                        return false
                    }else{
                        this.getMerchantsAgree(val);
                    }
                    break;
                case 4:
                    if(this.recordList.length > 0){
                        this.step = val + 1
                    }else if(this.mainCategorySelect == ''){
                        Toast(this.$t('lang.fill_in_one_category'))
                        return false
                    }else{
                        Toast(this.$t('lang.fill_in_two_category'))
                        return false
                    }
                    break;
                case 5:
                    if(this.shoptypeSelect == ''){
                        Toast(this.$t('lang.fill_in_shop_type'))
                        return false
                    }else if(this.rz_shopName == ''){
                        Toast(this.$t('lang.fill_in_shop_name'))
                        return false
                    }else if(this.hopeLoginName == ''){
                        Toast(this.$t('lang.fill_in_login_name'))
                        return false
                    }else{
                        this.addShop(val);
                    }
                    break;
                default:
                    break
            }
        },
        backStep(val){
            this.step = val - 1  
        },
        afterRead(item){
            return file => {
                if(file.length > 1){
                    Toast(this.$t('lang.only_one_image_can_be_selected'))
                }else{
                    this.$store.dispatch('setMaterial',{
                        file:file,
                        type:item
                    }).then(res=>{
                        if(item == 'business_license'){
                            this.business_license = res.data[0]
                        }else if(item == 'id_card'){
                            this.id_card = res.data[0]
                        }
                    })
                }
            }    
        },
        checkMobile() {
            let rule = /^((13|14|15|16|17|18|19)[0-9]{1}\d{8})$/
            if (rule.test(this.mobile)) {
                return true
            } else {
                return false
            }
        },
        previewImage(item){
            if(item == 'business_license'){
                this.business_license_image = ImagePreview({
                    images: [this.business_license],
                })
            }else if(item == 'id_card'){
                this.id_card_image = ImagePreview({
                    images: [this.id_card],
                })
            }
        },
        linkHref(name){
            this.$router.push({
                name:name
            })
        }
    },
    watch:{
        merchantsInfo(){
            this.dscLoading = false
        },
        steps(){
            if(this.steps == ''){
                this.getMerchantsGuide();
                this.showBase = true
            }else{
                this.checked = true
                this.username = this.steps.contactName
                this.mobile = this.steps.contactPhone
                this.sex = this.steps.contactXinbie == '男' ? '0' : '1'
                this.email = this.steps.contactEmail
                this.companyName = this.steps.companyName
                this.id_card = this.steps.legal_person_fileImg
                this.business_license = this.steps.license_fileImg
                this.company_contactTel = this.steps.company_contactTel
            }
        },
        shop(){
            if(this.shop){
                this.mainCategorySelect = this.shop.shop_categoryMain
                this.shoptypeSelect = this.shop.shoprz_type
                if(this.shop.shoprz_type == 1){
                    this.subShoptypeSelect = this.shop.subShoprz_type
                }
                this.rz_shopName = this.shop.rz_shopName
                this.hopeLoginName = this.shop.hopeLoginName
                this.dscLoading = false
            }
        },
        showCate(){
            if(!this.showCate){
                this.result = []
                this.categorySelect = ''
                this.all_checked = false
                this.merchantsChildCate = []
            }
        }
    }
}
</script>

<style scoped>
.merchants{ background: #ffffff; height: 100vh; }
.surface{ }

.btn-bar{ margin-top: 2rem; justify-content: center;}
.btn-bar .btn{ display: inline-block; width: auto; padding: .8rem 2rem; margin-left:1rem; }
.btn-bar .btn:first-child{ margin-left: 0; }

.btn-min{ display: inline-block; width: auto; padding: .6rem 1.5rem; border-radius: .4rem; }

.merchants_article{ width: 90%; height: 90%;}
.merchants_article .title{ text-align: center; font-size: 2rem; color: #000; padding: 2rem 0; position: relative; }
.merchants_article .title .van-icon{ position: absolute; top: 1rem; right: 1rem; }
.merchants_article .content{ padding: 0 2rem 2rem; font-size: 1.5rem; height: 88%; overflow: auto; line-height: 2;word-wrap: break-word; word-break: normal;}

.step .header{ text-align: center; }
.step .header .title{ font-size: 3rem; color: #333; padding-top: 5.5rem;}
.step .header .subtitle{ font-size: 1.8rem; padding: 0 2rem; color: #666; padding-top: 1rem; display: inline-block; margin: 0 auto; position: relative;}
.step .header .subtitle i{ overflow: hidden; position: relative; z-index: 2; background: #ffffff; padding: 0 .5rem; }
.step .header .subtitle:before{ content: " "; position: absolute; left: 0; right: 0; height: 1px; background: #E6E6E6; top: 66%; }
.step .content{ margin-top: 4rem; }
.step .content .van-uploader{ color: #666666; }
.step .content .van-uploader .icon-uploader{ font-size: 14px; color: #D2D4D9; margin-right: 5px; }

.category-popup{ width: 90%; height: 60%; overflow: scroll;}
.category-popup .title{text-align: center; font-size: 2rem; color: #000; padding: 2rem 0; position: relative; }

.category-list{ margin: 3rem 3rem 0; height: 24rem; overflow: auto; }
.category-list .item{ margin-bottom: 1rem; border: 1px solid #E6E6E6;}
.category-list .item:last-child{ margin-bottom: 0; }
.category-list .item .tit{ background: #F2F3F7; padding: 5px 20px; color: #666666;}
.category-list .item .lie{ padding: 5px 20px; color: #999999;}
.category-list .item .lie span{ margin:0 10px 5px 0; display: inline-block;}
.category-list .item .lie .iconfont{ font-size: 12px; margin-left: 5px; }

.step_6{ text-align: center; }
.audit-pic{ padding: 5rem 0 2rem; }
.audit-pic .img{ width: 70%; margin: 0 auto; }
.audit-type{ text-align: center; }
.audit-type .title{ font-size: 3rem; color: #333333; margin-bottom: 1.5rem; }
.audit-type .subtitle{ font-size: 1.8rem; color: #666666; }
.audit-shopname{ display: inline-block; padding: 1.2rem 1.5rem; background: linear-gradient(-90deg,rgba(45,123,249,1),rgba(61,174,253,1)); margin: 0 auto; color: #ffffff; font-size: 1.5rem; border-radius: 3rem; margin-top: 3rem;}
.audit-update .audit-shopname{ border-radius: 0; padding: 1.2rem 3rem; }
</style>