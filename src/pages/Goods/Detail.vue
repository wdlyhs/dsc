<template>
    <div class="con con_main" ref="box">
        <template v-if="!dscLoading">
        <header class="header-nav-content" :class="{'header-nav-fixed':!scrollState}">
            <van-nav-bar left-arrow @click-left="onClickLeft">
                <ul class="nav-con-warp" slot="title">
                    <li :class="{'active':navActive == index}" v-for="(item,index) in navTabs" :key="index">
                        <template v-if="index == 2">
                            <span @click="commentHandle">{{ item }}</span>
                        </template>
                        <template v-else>
                            <span @click="jump(index)">{{ item }}</span>
                        </template>
                    </li>
                </ul>
                <i class="iconfont icon-share-alt" slot="right" @click="onGoodsShare"></i>
            </van-nav-bar>
        </header>
        <section class="goods_info">
            <div class="goods_photo d_jump">
                <div class="goods_photo_warp">
                    <van-swipe :autoplay="3000">
                        <template v-if="gallery_list && gallery_list.length>0">
                        <van-swipe-item v-for="(image, index) in gallery_list" :key="index" style="position: relative;">
                            <img :src="image.img_url" class="img" v-if="image.img_url"/>
                            <img src="../../assets/img/no_image.jpg" class="img" v-else/>
                        </van-swipe-item>
                        </template>
                        <template v-else>
                            <van-swipe-item style="position: relative;">
                                <img :src="goodsInfo.goods_img" class="img" v-if="goodsInfo.goods_img"/>
                                <img src="../../assets/img/no_image.jpg" class="img" v-else/>
                            </van-swipe-item>
                        </template>
                    </van-swipe>
                    <div class="videoBox" v-if="goodsInfo.goods_video && index === 0">
                        <a href="javascript:void(0);" @click="handleVideo">
                            <van-icon name="play" size="1rem"/>
                            {{$t('lang.video')}}
                        </a>
                    </div>
                </div>
            </div>

            <template v-if="goodsInfo.promote_end_date > 0 &&  goodsInfo.promote_start_date > 0">
                <div class="seckill-header-title cont-box dis-box">
                    <div class="left box-flex">
                        <label>{{ regionGoodsPirceFormated ? regionGoodsPirceFormated : goodsPriceManage }}</label>
                    </div>
                    <div class="right">
                        <p class="f-02 text-c">{{$t('lang.promote_surplus_end')}}</p>
                        <template v-if="goodsInfo.promote_start_date != undefined && goodsInfo.promote_end_date != undefined">
                            <count-down class="seckill-time" :endTime="goodsInfo.promote_end_date" :endText="$t('lang.activity_end')"></count-down>
                        </template>
                    </div>
                </div>
            </template>

            <div class="goods-price" v-if="goodsInfo.promote_end_date == 0 &&  goodsInfo.promote_start_date == 0">
                <p class="price" :class="regionGoodsPirce"><em>{{ regionGoodsPirceFormated ? regionGoodsPirceFormated : goodsPriceManage }}</em>
                    <del v-if="goodsInfo.show_marketprice == 1">{{ goodsInfo.market_price_formated }}</del>
                </p>
                <div class="drp-share" @click="onGoodsShare" v-if="goodsInfo.is_show_drp > 0 && goodsInfo.commission_money != 0 && goodsInfo.is_distribution == 1">
                    <i class="iconfont icon-share"></i>
                    <span>{{$t('lang.share_zhuan_alt')}}{{goodsInfo.commission_money}}</span>
                </div>
            </div>

            <div class="hig-vip" v-if="goodsInfo.is_drp && goodsInfo.drp_shop == 0">
                <div class="hig-vip-warp">
                    <div class="text">
                        <i><img src="../../assets/img/newuser/icon-vip.png" class="img"></i>
                        <template v-if="goodsInfo.membership_card_discount_price > 0">
                            高级VIP享超值优惠价{{goodsInfo.membership_card_discount_price_formated}}
                        </template>
                        <template v-else>高级VIP可享超值优惠价</template>
                    </div>
                    <div class="vip-register">
                        <a href="javascript:;" v-if="isLogin" @click="onVipRegister"><span>{{$t('lang.immediately_opened')}}</span><i class="iconfont icon-more"></i></a>
                        <router-link :to="{ name: 'login' }" v-else><span>{{$t('lang.immediately_opened')}}</span><i class="iconfont icon-more"></i></router-link>
                    </div>
                </div>
            </div>

            <div class="goods_title" :class="{'goods_title_active':goodsInfo.promote_end_date > 0 &&  goodsInfo.promote_start_date > 0}">
                <h3 class="twolist-hidden">
                    <em v-if="goodsInfo.user_id == 0" class="em-promotion">{{$t('lang.self_support')}}</em>
                    {{ goodsInfo.goods_name }}
                </h3>
                <p class="f-05 color-red m-top02" v-if="goodsInfo.goods_brief">{{ goodsInfo.goods_brief }}</p>
            </div>
            <div class="goods_outer">
                <p class="g-p-tthree dis-box">
                    <span class="box-flex text-left">{{ goodsInfo.sales_volume }}{{$t('lang.people_have_buy')}}</span>
                    <span class="box-flex text-center" v-if="goodsInfo.show_goodsnumber == 1">{{$t('lang.stock')}}<em>{{ regionGoodsNumberFormated ? regionGoodsNumberFormated : goodsNumberManage }}</em></span>
                    <span class="box-flex text-right" v-if="goodsInfo.basic_info">
                        <template v-if="goodsInfo.basic_info && goodsInfo.basic_info.province_name">
                            {{ goodsInfo.basic_info.province_name }}
                        </template>
                        <template v-if="goodsInfo.basic_info && goodsInfo.basic_info.city_name">
                            {{ goodsInfo.basic_info.city_name }}
                        </template>
                    </span>
                </p>
            </div>

            <van-cell-group class="van-cell-noleft van-coupon m-top08">
                <van-cell :title="$t('lang.tiered_price')" value="" class="my-bottom" v-if="goodsInfo.volume_price_list && goodsInfo.volume_price_list.length > 0" @click="handleVolumePrice" is-link/>
                <van-cell :title="$t('lang.get_coupon')" value="" class="my-bottom" v-if="goodsInfo.coupon_count > 0" @click="handleCoupon" is-link>
                    <i class="iconfont icon-coupon"></i> {{$t('lang.receive_coupon')}}({{ goodsInfo.coupon_count }})
                </van-cell>
                <van-cell :title="$t('lang.label_promotion')" value="" class="my-bottom" v-if="goods_promotion && goods_promotion.length > 0 || goodsInfo.fittings" is-link>
                    <div class="promotion-popup-list">
                        <template v-if="goods_promotion && goods_promotion.length > 0">
                            <div class="promotion-popup-item" v-for="(item,index) in goods_promotion" @click="handlePromotion" :key="index" v-if="index < 2">
                                <em class="em-sales" v-if="item.act_type == 0">{{$t('lang.with_a_gift')}}</em>
                                <em class="em-sales" v-else-if="item.act_type == 1">{{$t('lang.lijian')}}</em>
                                <em class="em-sales" v-else-if="item.act_type == 2">{{$t('lang.discount')}}</em>
                                <em class="em-sales" v-else-if="item.act_type == 3">{{$t('lang.group_buy')}}</em>
                                <em class="em-sales" v-else-if="item.act_type == 4">{{$t('lang.auction')}}</em>
                                <em class="em-sales" v-else-if="item.act_type == 5">{{$t('lang.full_reduction')}}</em>
                                <span>{{item.act_name}}</span>
                            </div>
                             <div class="promotion-popup-item" v-if="goods_promotion && goods_promotion.length > 2">
                                 <em class="em-sales" v-for="(item,index) in goods_promotion" :key="index" v-if="index > 1">
                                    <template v-if="item.act_type == 0">{{$t('lang.with_a_gift')}}</template>
                                    <template v-else-if="item.act_type == 1">{{$t('lang.lijian')}}</template>
                                    <template v-else-if="item.act_type == 2">{{$t('lang.discount')}}</template>
                                    <template v-else-if="item.act_type == 3">{{$t('lang.group_buy')}}</template>
                                    <template v-else-if="item.act_type == 4">{{$t('lang.auction')}}</template>
                                    <template v-else-if="item.act_type == 5">{{$t('lang.full_reduction')}}</template>
                                 </em>
                             </div>
                        </template>

                        <div class="promotion-popup-item" v-if="goodsInfo.fittings" @click="handlePromotion">
                            <em class="em-sales">{{$t('lang.combined_package')}}</em>
                            <span>{{$t('lang.hig_discount')}}<i class="color-red">{{ spare_price }}</i>{{$t('lang.price_unit')}}</span>
                        </div>
                    </div>
                </van-cell>

                <van-cell :title="$t('lang.label_minimum')" value="" class="my-bottom" v-if="goodsInfo.is_minimum > 0">
                    {{ goodsInfo.minimum }} {{$t('lang.jian')}}
                </van-cell>

                <van-cell :title="$t('lang.label_available_integral')" value="" class="my-bottom" v-if="goodsInfo.integral > 0">
                    {{ goodsInfo.integral }} {{$t('lang.integral')}}
                </van-cell>

                <van-cell :title="$t('lang.label_service')" v-if="goodsInfo.goods_extend && (goodsInfo.goods_extend.is_reality || goodsInfo.goods_extend.is_return || goodsInfo.goods_extend.is_fast)">
                    <template v-if="goodsInfo.goods_extend && goodsInfo.goods_extend.is_reality">
                        {{$t('lang.is_reality')}}
                    </template>
                    <template v-if="goodsInfo.goods_extend && goodsInfo.goods_extend.is_return">
                        {{$t('lang.is_return')}}
                    </template>
                    <template v-if="goodsInfo.goods_extend && goodsInfo.goods_extend.is_fast">
                        {{$t('lang.is_fast')}}
                    </template>
                </van-cell>
            </van-cell-group>

            <van-cell-group class="van-cell-noleft m-top08">
                <van-cell :title="$t('lang.label_send_to')" v-model="regionSplic" class="my-cell-nobottom" is-link @click="handelRegionShow"/>
                <van-cell :title="$t('lang.label_freight')" :class="{'my-cell-nobottom' : goodsInfo.cross_border}">
                    <span v-html="freight"></span>
                    <span class="color-red" v-if="shipping_fee.shipping_title && shipping_fee.shipping_title != 0">({{ shipping_fee.shipping_title }})</span>
                </van-cell>
                <van-cell :title="$t('lang.label_import_tax')" v-if="goodsInfo.cross_border" v-model="importTax"/>
            </van-cell-group>
            <van-cell-group class="van-cell-noleft m-top08">
                <van-cell :title="$t('lang.label_selected')" v-model="attr_name" is-link @click="skuLink"/>
            </van-cell-group>

            <van-cell-group v-if="goodsInfo.store_count > 0" class="van-cell-noleft m-top08">
                <van-cell :title="$t('lang.private_store')" value="" is-link @click="handleStore"/>
            </van-cell-group>

            <van-cell-group class="van-cell-noleft m-top08">
              <van-cell :title="$t('lang.discuss_circle')" value="" is-link @click="onDiscover" />
            </van-cell-group>

            <div class="goods-shop m-top08" v-if="goodsInfo.user_id">
                <ShopHeader :shopInfo="shopInfo" :index="index" :shopScore="shopScore" @update="updateInfo"></ShopHeader>
            </div>

            <van-tabs v-model="active" class="goods_detail m-top08 d_jump">
                <van-tab v-for="(tab,index) in tabs" :key="index" :title="tab">
                    <template v-if="index == 0">
                        <template v-if="goodsInfo.goods_desc">
                            <div v-html="goodsInfo.goods_desc" class="goods_desc"></div>
                        </template>
                        <template v-else>
                            <NotCont></NotCont>
                        </template>
                    </template>
                    <template v-else>
                        <template v-if="goodsInfo.attr_parameter">
                            <div class="goods_attr_parameter">
                            <table cellpadding="0" cellspacing="1" width="100%" border="0" class="Ptable param_table">
                                <tbody>
                                    <tr><td>{{$t('lang.goods_sn')}}</td><td>{{ goodsInfo.goods_sn }}</td></tr>
                                </tbody>
                                <tbody>
                                    <tr><th class="tdTitle" colspan="2">{{$t('lang.subject')}}</th></tr>
                                    <tr><td>{{$t('lang.brand')}}</td><td>{{ goodsInfo.brand_name }}</td></tr>
                                    <tr><td>{{$t('lang.goods_weight')}}</td><td>{{ goodsInfo.goods_weight }}kg</td></tr>
                                    <tr><th class="tdTitle" colspan="2">{{$t('lang.attr_parameter')}}</th></tr>
                                    <tr v-for="item in goodsInfo.attr_parameter"><td>{{ item.attr_name }}</td><td>{{ item.attr_value }}</td></tr>
                                </tbody>
                            </table>
                            </div>
                        </template>
                        <template v-else>
                            <NotCont></NotCont>
                        </template>
                    </template>
                </van-tab>
            </van-tabs>

            <!--猜你喜欢-->
            <section class="goods-detail-guess text-center" v-if="goodsGuessList">
                <h5 class="title-hrbg"><span>{{$t('lang.guess_love')}}</span><hr></h5>
                <section class="product-list product-list-medium">
                    <ProductList :data="goodsGuessList" :routerName="routerName" :productOuter="productOuter" styleType="slide"></ProductList>
                </section>
            </section>
        </section>

        <!-- 加入购物车 -->
        <van-goods-action>
            <van-goods-action-mini-btn icon="chat" :text="$t('lang.customer_service')" @click="onChat(goods_id,goodsInfo.user_id)" />
            <van-goods-action-mini-btn :icon="collect_icon" :text="$t('lang.collect')" :class="{'curr':is_collect == 1}" @click="collection"/>
            <van-goods-action-mini-btn icon="cart" :info="cart_number" :to="{name:'cart'}">
                {{$t('lang.cart')}}
                <span class="add_num" :class="{'show':addCartClass == true}" id="popone">+{{ num }}</span>
            </van-goods-action-mini-btn>
            <template v-if="is_on_sale">
                <van-goods-action-big-btn :text="$t('lang.goods_sold_out')" class="van-button--disabled" disabled/>
            </template>
            <template v-else>
                <template v-if="regionGoodsNumberFormated ? regionGoodsNumberFormated : goodsNumberManage > 0">
                    <!-- 我要代言 -->
                    <template v-if="goodsInfo.is_show_drp > 0 && goodsInfo.drp_shop > 0 && goodsInfo.is_distribution == 1">
                        <van-goods-action-big-btn :text="$t('lang.want_represent')" @click="shareHandle" />
                    </template>
                    <!-- 加入购物车 -->
                    <template v-if="goodsInfo.membership_card_id && goodsInfo.membership_card_id > 0"></template>
                    <template v-else>
                    <van-goods-action-big-btn :text="$t('lang.add_cart')" @click="onSku" primary  />
                    </template>
                    <!-- 立即购买 -->
                    <template v-if="goodsInfo.is_show_drp > 0 && goodsInfo.drp_shop > 0 && goodsInfo.is_distribution == 1 && goodsInfo.membership_card_id == 0"></template>
                    <template v-else>
                    <van-goods-action-big-btn :text="$t('lang.button_buy')" @click="onSku" data-type="1"/>
                    </template>
                </template>
                <template v-else>
                    <van-goods-action-big-btn :text="$t('lang.understock')" class="van-button--disabled" disabled/>
                </template>
            </template>
        </van-goods-action>
        </template>
        <!-- 快捷菜单 -->
        <CommonNav></CommonNav>

        <!-- 属性弹窗 -->
        <van-popup v-model="showBase" position="bottom" class="attr-goods-box">
            <div class="attr-goods-header">
                <template v-if="attr != ''">
                    <div class="attr-img">
                        <img :src="goodsAttrOper.attr_img" class="img" v-if="goodsAttrOper.attr_img" />
                        <img :src="goodsInfo.goods_thumb" class="img" v-else>
                    </div>
                    <div class="attr-info">
                        <div class="attr-price">{{ goodsAttrOper.goods_price_formated }}</div>
                        <div class="attr-stock">{{$t('lang.label_stock')}}{{ goodsAttrOper.stock }}</div>
                        <div class="attr-other">{{$t('lang.label_selected')}}{{ goodsAttrOper.attr_name }} {{ num }}件</div>
                    </div>
                </template>
                <template v-else>
                    <div class="attr-img">
                        <img :src="goodsInfo.goods_img" class="img"/>
                    </div>
                    <div class="attr-info">
                        <div class="attr-name twolist-hidden">{{ goodsInfo.goods_name }}</div>
                        <div class="attr-price">{{ goodsPriceManage }}</div>
                        <div class="attr-stock">{{$t('lang.label_stock')}}{{ goodsInfo.goods_number }}</div>
                    </div>
                </template>
                <i class="iconfont icon-close" @click="closeSku"></i>
            </div>
            <div class="attr-goods-content" v-if="attr != ''">
                <van-radio-group class="sku-item" v-model="goodsAttrInit[index]" v-for="(item,index) in attr" :key="index" @change="changeAttr">
                    <div class="sku-tit">{{ item.attr_name }}</div>
                    <div class="sku-list">
                        <template v-for="(option,listIndex) in item.attr_key">
                            <van-radio class="option" :class="{'active':goodsAttrInit[index] == option.goods_attr_id}" :name="option.goods_attr_id">{{ option.attr_value }}
                            </van-radio>
                        </template>
                    </div>
                </van-radio-group>
            </div>
            <div class="attr-goods-number dis-box">
                <span class="tit box-flex">{{$t('lang.number')}}</span>
                <div class="stepper">
                    <van-stepper
                        v-model="number"
                        integer
                        :min="goodsInfo.is_minimum > 0 ? goodsInfo.minimum : 1"
                        :max="stock"
                    />
                </div>
            </div>
            <div class="van-sku-actions">
                <template v-if="!storeBtn">
                    <template v-if="zFittingAttr">
                        <van-button type="primary" class="van-button--bottom-action" @click="onFittingAttr">{{$t('lang.confirm')}}</van-button>
                    </template>
                    <template v-else>
                        <template v-if="is_on_sale">
                            <van-button type="disabled" class="van-button--bottom-action">{{$t('lang.button_buy')}}</van-button>
                            <van-button type="disabled" class="van-button--bottom-action">{{$t('lang.goods_sold_out')}}</van-button>
                        </template>
                        <template v-else>
                            <template v-if="stock">
                                <van-button type="default" class="van-button--bottom-action" @click="onBuyClicked">{{$t('lang.button_buy')}}
                                </van-button>
                                <van-button type="primary" class="van-button--bottom-action" @click="onAddCartClicked(0)">{{$t('lang.add_cart')}}
                                </van-button>
                            </template>
                            <template v-else>
                                <van-goods-action-big-btn :text="$t('lang.understock')" class="van-button--disabled" disabled/>
                            </template>

                        </template>
                    </template>
                </template>
                <template v-else>
                    <van-button type="primary" class="van-button--bottom-action" @click="onStoreClicked">{{$t('lang.private_store')}}
                    </van-button>
                </template>
            </div>
        </van-popup>

        <!-- 优惠券 -->
        <van-popup v-model="couponShow" position="bottom" class="show-popup-bottom show-goods-coupon">
            <section class="goods-show-title padding-all">
                <h3 class="fl">{{$t('lang.receive_coupon')}} ({{ goodsInfo.coupon_count }})</h3>
                <i class="iconfont icon-close fr" @click="handelClose('coupon')"></i>
            </section>
            <swiper class="goods-show-con" :options="swiperOption">
                <swiper-slide>
                    <div class="padding-all">
                        <van-loading type="spinner" color="white" v-if="conpouLoading"/>
                        <template v-else>
                            <ul v-if="goodsCouponList && goodsCouponList.length > 0">
                                <li class="new-coupons-box dis-box" v-for="(item,index) in goodsCouponList">
                                    <div class="remark-all box-flex">
                                        <div class="q-type">
                                            <div class="b-r-a-price">
                                                <em>￥</em>
                                                <strong class="coupons-money">{{ item.cou_money }}</strong>
                                                <div class="couons-text"><span>{{$t('lang.man')}}{{ item.cou_man }}{{$t('lang.available_full')}}</span></div>
                                            </div>
                                            <div class="b-r-a-con">
                                                <div class="range-item">{{ item.cou_name }}</div>
                                                <div class="range-item">{{ item.cou_start_time }} {{$t('lang.zhi')}} {{ item.cou_end_time }}<em class="color-red">({{$t('lang.cou_user_receive_hove')}}{{item.cou_user_num}}{{$t('lang.zhang')}})</em>
                                                </div>
                                            </div>
                                        </div>
                                        <b class="semi-circle"></b>
                                        <div class="print-img" v-if="item.cou_is_receive == 1"></div>
                                    </div>
                                    <a href="javascript:void(0);" class="b-r-a-btn tb-lr-center"
                                       @click="handelReceive(item.cou_id)">
                                        <template v-if="item.cou_is_receive == 1 && isLogin == true">{{$t('lang.receive_hove')}}</template>
                                        <template v-else>{{$t('lang.receive')}}</template>
                                    </a>
                                </li>
                            </ul>
                            <div class="notic-coupons" v-else>{{$t('lang.no_coupon_yet')}}</div>
                        </template>
                    </div>
                </swiper-slide>
            </swiper>
        </van-popup>

        <!-- 促销 -->
        <van-popup v-model="promotionShow" position="bottom" class="show-popup-bottom show-goods-promotion">
            <section class="goods-show-title padding-all">
                <h3 class="fl">{{$t('lang.promotion')}}</h3>
                <i class="iconfont icon-close fr" @click="handelClose('promotion')"></i>
            </section>
            <swiper class="goods-show-con" :options="swiperOption">
                <swiper-slide>
                    <div class="padding-all">
                        <ul class="promotion-popup-list m-b10" v-if="goods_promotion && goods_promotion.length > 0">
                            <li v-for="(item,index) in goods_promotion" :key="index" class="promotion-popup-item">
                                <template v-if="item.act_type == 0">
                                    <router-link :to="{name:'activity-detail',params:{act_id:item.act_id}}"><em class="em-sales">{{$t('lang.with_a_gift')}}</em><span>{{ item.act_name }}</span></router-link>
                                </template>
                                <template v-if="item.act_type == 1">
                                    <router-link :to="{name:'activity-detail',params:{act_id:item.act_id}}"><em class="em-sales">{{$t('lang.lijian')}}</em><span>{{ item.act_name }}</span></router-link>
                                </template>
                                <template v-if="item.act_type == 2">
                                    <router-link :to="{name:'activity-detail',params:{act_id:item.act_id}}"><em class="em-sales">{{$t('lang.discount')}}</em><span>{{ item.act_name }}</span></router-link>
                                </template>
                                <template v-if="item.act_type == 3">
                                    <router-link :to="{name:'groupbuy-detail',params:{group_buy_id:item.act_id}}"><em class="em-sales">{{$t('lang.group_buy')}}</em><span>{{ item.act_name }}</span></router-link>
                                </template>
                                <template v-if="item.act_type == 4">
                                    <router-link :to="{name:'auction-detail',params:{act_id:item.act_id}}"><em class="em-sales">{{$t('lang.auction')}}</em><span>{{ item.act_name }}</span></router-link>
                                </template>
                                <template v-if="item.act_type == 5">
                                    <a href="javascript:;" class="color-red"><em class="em-sales">{{$t('lang.full_reduction')}}</em><span>{{ item.act_name }}</span></a>
                                </template>
                            </li>
                        </ul>
                        <van-cell class="not_padding_lr" :class="{'my-top':goodsInfo.goods_promotion && goodsInfo.goods_promotion.length > 0}" is-link @click="handleFitting" v-if="goodsInfo.fittings">
                            <div class="promotion-popup-list">
                                <div class="promotion-popup-item">
                                    <em class="em-sales">{{$t('lang.combined_package')}}</em>
                                    <div class="prom_flex_box">
                                        <span>{{$t('lang.hig_discount')}}<i class="color-red">{{ spare_price }}</i>{{$t('lang.yuan')}}</span>
                                        <div class="scroll_box">
                                            <div class="scroll_box_item">
                                                <span class="scroll_box_item_good"><img :src="goodsInfo.goods_thumb" /></span>
                                                <span class="scroll_box_item_plus"></span>
                                                <template v-for="(item,index) in goodsInfo.fittings">
                                                    <template v-if="index < 2">
                                                    <span class="scroll_box_item_good"><img :src="item.goods_thumb" /></span>
                                                    <span class="scroll_box_item_plus" v-if="index != goodsInfo.fittings.length-1"></span>
                                                    </template>
                                                </template>
                                                <span class="scroll_box_item_last">...</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </van-cell>
                    </div>
                </swiper-slide>
            </swiper>
        </van-popup>

        <!-- 视频 -->
        <van-popup v-model="videoShow" style="width: 100%;">
            <video-player
                class="video-player-box"
                ref="videoPlayer"
                :options="playerOptions"
                :playsinline="true">
            </video-player>
        </van-popup>

        <!-- 组合购买 -->
        <van-popup v-model="fittingShow" style="height:100%; width: 100%;" class="fitting-show">
            <van-nav-bar
              :title="$t('lang.combined_package')"
              left-arrow
              @click-left="onFittingLeft"
              class="btyes"
            />
            <van-collapse v-model="fittingNames" class="fitting-coll" accordion>
                <van-collapse-item :title="item.text" :name="item.group_id" v-for="(item,index) in fittingInfo.comboTab">
                    <div class="card-act-goods">
                        <div class="card-goods__item">
                            <van-checkbox v-model="checked" :disabled="checkDisabled" />
                            <div class="van-checkbox__con">
                                <van-card class="cart-goods-info">
                                    <template slot="thumb">
                                        <img :src="fittingInfo.goods.goods_thumb" v-if="fittingInfo.goods.goods_thumb" />
                                        <img class="img" src="../../assets/img/no_image.jpg" v-else>
                                    </template>
                                    <div class="goods-title twolist-hidden" slot="title">{{ fittingInfo.goods.goods_name }}</div>
                                    <div class="goods-price" slot="tags">{{ fittingInfo.goods.shop_price_formated }}</div>
                                    <div class="goods-attr" slot="tags" v-if="fittingInfo.goods.attr.length > 0">
                                        <div class="property-box" @click="fittingAttrHandle()">
                                            <span>{{$t('lang.label_attr')}}</span>
                                            <span>{{ attr_name }}</span>
                                            <i class="iconfont icon-moreunfold fr"></i>
                                        </div>
                                    </div>
                                </van-card>
                            </div>
                        </div>
                        <van-checkbox-group v-model="fittingsCheckModel">
                        <div class="card-goods__item" v-for="(goodsItem,goodsindex) in fittingInfo.fittings" :index="goodsindex">
                            <template v-if="item.group_id == goodsItem.group_id">
                            <div @click="fittingsCheckChange(goodsindex)">
                                <van-checkbox :name="goodsItem.goods_id" ref="checkboxes" />
                            </div>
                            <div class="van-checkbox__con">
                                <van-card class="cart-goods-info">
                                    <template slot="thumb">
                                        <img :src="goodsItem.goods_thumb" v-if="goodsItem.goods_thumb" />
                                        <img class="img" src="../../assets/img/no_image.jpg" v-else>
                                        <em class="activity-tag"><img src="../../assets/img/parts-icon.png" /></em>
                                    </template>
                                    <div class="goods-title twolist-hidden" slot="title">{{ goodsItem.goods_name }}</div>
                                    <div class="goods-price" slot="tags">{{ goodsItem.fittings_price }}</div>
                                    <div class="goods-attr" slot="tags" v-if="goodsItem.attr && goodsItem.attr.length > 0">
                                        <div class="property-box" @click="fittingAttrHandle(goodsItem.goods_id)">
                                            <span>{{$t('lang.label_attr')}}</span>
                                            <span>{{ goodsItem.attr_name }}</span>
                                            <i class="iconfont icon-moreunfold fr"></i>
                                        </div>
                                    </div>
                                </van-card>
                            </div>
                            </template>
                        </div>
                        </van-checkbox-group>
                    </div>
                </van-collapse-item>
            </van-collapse>
            <div class="goods-suit-btn">
                <div class="gns_item">
                    <em class="color-red">({{$t('lang.gb_limited')}} {{ fittingInfo.goods.group_number }} {{$t('lang.cover')}})</em>
                    <span>{{$t('lang.label_buy')}}</span>
                    <div class="stepper">
                        <van-stepper
                            v-model="fittingNum"
                            integer
                            :min="fittingPriceData.limit_number"
                            :max="fittingInfo.goods.group_number"
                        />
                    </div>
                    <span>{{$t('lang.cover')}}</span>
                </div>
            </div>
            <div class="cart-submit van-submit-bar cart-submit-not-bot">
              <div class="van-submit-bar__bar">
                <div class="van-submit-bar__text">
                  <p><span>{{$t('lang.label_package_price')}}</span><span class="van-submit-bar__price">{{ fittings_minMax }}</span></p>
                  <p class="van-submit-bar__sub">{{$t('lang.sheng')}}：{{ save_minMaxPrice }}</p>
                </div>
                <van-button type="danger" @click="fittingsAddCart">{{$t('lang.add_cart')}}</van-button>
              </div>
            </div>
        </van-popup>

        <!-- 组合购买 配件 属性弹窗 -->
        <van-popup v-model="fittingShowBase" position="bottom" class="attr-goods-box">
            <div class="attr-goods-header">
                <div class="attr-img">
                    <img :src="fittingImg" class="img" v-if="fittingImg" />
                    <img src="../../assets/img/no_image.jpg" class="img" v-else/>
                </div>
                <div class="attr-info">
                    <div class="attr-price">{{ fittingPrice }}</div>
                    <div class="attr-stock">{{$t('lang.label_stock')}}{{ fittingAttrNumber }}</div>
                    <div class="attr-other">{{$t('lang.label_selected')}}{{ fittingAttrName }}</div>
                </div>
                <i class="iconfont icon-close" @click="closeFitting"></i>
            </div>
            <div class="attr-goods-content" v-if="fittingAttr != ''">
                <van-radio-group class="sku-item" v-model="fittingAttrInit[index]" v-for="(item,index) in fittingAttr" :key="index" @change="fittingLoad(0)">
                    <div class="sku-tit">{{ item.attr_name }}</div>
                    <div class="sku-list">
                        <template v-for="(option,listIndex) in item.attr_key">
                            <van-radio class="option" :class="{'active':fittingAttrInit[index] == option.goods_attr_id}" :name="option.goods_attr_id">{{ option.attr_value }}
                            </van-radio>
                        </template>
                    </div>
                </van-radio-group>
            </div>
            <div class="attr-goods-number dis-box"></div>
            <div class="van-sku-actions">
                <van-button type="primary" class="van-button--bottom-action" @click="closeFitting">{{$t('lang.confirm')}}</van-button>
            </div>
        </van-popup>

        <!-- 阶梯价格 -->
        <van-popup v-model="volumePriceShow" position="bottom" class="volume-price-show">
             <table cellpadding="0" cellspacing="1" width="100%" border="0" class="Ptable param_table">
                <tbody>
                    <tr><th>{{$t('lang.number')}}</th><th>{{$t('lang.price')}}</th></tr>
                </tbody>
                <tbody>
                    <tr v-for="(item,index) in goodsInfo.volume_price_list" :key="index">
                        <td>{{ item.number }}</td>
                        <td>{{ item.format_price }}</td>
                    </tr>
                </tbody>
            </table>
        </van-popup>

        <!--分享-->
        <div class="shopping-prompt ts-2" :class="{'active':drpShareActive}" @click="shoppingPromptHandle"><img src="../../assets/img/fengxiang.png" /></div>
        <van-popup v-model="shareImgShow" class="shareImg" overlay-class="shareImg-overlay">
            <img :src="shareImg" v-if="shareImg" class="img" />
            <span v-else>{{$t('lang.error_generating_image')}}</span>
        </van-popup>

        <Region :isPrice.sync="isPrice" :display.sync="regionShow" :regionOptionDate.sync="regionOptionDate"></Region>

        <!--初始化loading-->
        <DscLoading :dscLoading="dscLoading"></DscLoading>

        <!-- <div class="shopping-prompt ts-2 active" v-if="isGuide" @click="clickGuide"><img src="../../assets/img/liulanqi.png" /></div> -->
    </div>
</template>

<script>
    import { mapState } from 'vuex'

    import {
        NavBar,
        Swipe,
        SwipeItem,
        Cell,
        CellGroup,
        Tab,
        Tabs,
        GoodsAction,
        GoodsActionBigBtn,
        GoodsActionMiniBtn,
        Sku,
        Popup,
        Stepper,
        Button,
        Loading,
        RadioGroup,
        Radio,
        Toast,
        Dialog,
        Icon,
        Collapse,
        CollapseItem,
        Checkbox,
        CheckboxGroup,
        Card,
    } from 'vant'

    import {
        swiper,
        swiperSlide
    } from 'vue-awesome-swiper'

    import Region from '@/components/Region'
    import ShopHeader from '@/components/shop/ShopHeader'
    import NotCont from '@/components/NotCont'
    import CommonNav from '@/components/CommonNav'
    import CountDown from '@/components/CountDown'
    import ProductList from '@/components/ProductList'
    import DscLoading from '@/components/DscLoading'
    import formProcessing from '@/mixins/form-processing'
    import isApp from '@/mixins/is-app'

    import 'video.js/dist/video-js.css'
    import {videoPlayer} from 'vue-video-player'

    export default {
        mixins: [formProcessing],
        data() {
            return {
                navActive: 0,
                navTabs: [this.$t('lang.goods'), this.$t('lang.detail'), this.$t('lang.comment_alt')],
                active: 0,
                tabs: [this.$t('lang.goods_detail_info'), this.$t('lang.specification_parameter')],
                showBase: false,
                num: 1,
                swiperOption: {
                    direction: 'vertical',
                    slidesPerView: 'auto',
                    freeMode: true
                },
                couponShow: false,
                promotionShow:false,
                scrollState: false,
                regionShow: false,
                regionOptionDate: {
                    province: {
                        id: '',
                        name: ''
                    },
                    city: {
                        id: '',
                        name: ''
                    },
                    district: {
                        id: '',
                        name: ''
                    },
                    street: {
                        id: '',
                        name: ''
                    },
                    regionSplic: ''
                },
                conpouLoading: true,
                goods_id: this.$route.params.id,
                shopScore: true,
                index: 0,
                addCartClass: false,
                storeBtn: false,
                videoShow: false,
                drpShareActive:false,
                playerOptions: {
                    autoplay: false, // 如果true,浏览器准备好时开始回放。
                    muted: true, // 默认情况下将会消除任何音频。
                    loop: true, // 导致视频一结束就重新开始。
                    language: 'zh-CN',
                    fluid: true, // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
                    playbackRates: [0.7, 1.0, 1.5, 2.0], // 播放速度
                    sources: [{
                        type: "video/mp4",
                        src: null
                    }],
                },
                shareImg:'',
                shareImgShow:false,
                routerName:'goods',
                productOuter:true,
                fittingShow:false,
                fittingNames:'',
                checked:true,
                checkDisabled:true,
                fittingsCheckModel:[],
                fittingNum:1,
                fittings_minMax:0,
                save_minMaxPrice:0,
                zFittingAttr:false,
                fittingShowBase:false,
                fittingAttr:[],
                fittingAttrInit:[],
                fittingAttrId:'',
                fittingAttrNumber:'',
                fittingGoodsAttrId:'',
                fittingAttrName:'',
                fittingPrice:0,
                fittingImg:'',
                volumePriceShow:false,
                dscLoading:true,
                isPrice:0,
                regionGoodsPirceFormated:'',
                regionGoodsNumberFormated:'',
                activityRouterPath:'',
                platform: this.$route.query.platform ? this.$route.query.platform : ''
            }
        },
        components: {
            [NavBar.name]: NavBar,
            [Swipe.name]: Swipe,
            [SwipeItem.name]: SwipeItem,
            [Cell.name]: Cell,
            [CellGroup.name]: CellGroup,
            [Tab.name]: Tab,
            [Tabs.name]: Tabs,
            [GoodsAction.name]: GoodsAction,
            [GoodsActionBigBtn.name]: GoodsActionBigBtn,
            [GoodsActionMiniBtn.name]: GoodsActionMiniBtn,
            [Sku.name]: Sku,
            [Popup.name]: Popup,
            [Stepper.name]: Stepper,
            [Button.name]: Button,
            [Loading.name]: Loading,
            [RadioGroup.name]: RadioGroup,
            [Radio.name]: Radio,
            [Toast.name]: Toast,
            [Dialog.name]: Dialog,
            [Icon.name]: Icon,
            [Collapse.name]: Collapse,
            [CollapseItem.name]: CollapseItem,
            [Card.name]: Card,
            [Checkbox.name]: Checkbox,
            [CheckboxGroup.name]: CheckboxGroup,
            ShopHeader,
            swiper,
            swiperSlide,
            Region,
            CountDown,
            CommonNav,
            videoPlayer,
            ProductList,
            NotCont,
            DscLoading,
        },
        created() {
            let that = this
            setTimeout(() => {
                uni.getEnv(function(res){
                    if(res.plus || res.miniprogram){
                        uni.redirectTo({
                            url:'../../pages/goodsDetail/goodsDetail?id=' + that.goods_id
                        })
                    }
                })
            },100)

            let result = JSON.parse(localStorage.getItem('regionOption'))
            if (result) {
                this.regionOptionDate = result;
            }
            this.loadGoodsInfo(this.goods_id)

            //猜你喜欢列表
            this.goodsGuessHandle()
        },
        mounted() {
            this.$nextTick(() => {
                window.addEventListener('scroll', this.onScroll)
            })

            // let url = window.location.href
            // if(this.platform == 'APP'){
            //     if(isApp.isWeixinBrowser()){
            //         this.isGuide = true
            //     }else{
            //         Dialog.confirm({
            //             message:'即将离开本页面，打开"'+ window.pageTitle + '"',
            //             confirmButtonText:'允许',
            //             className: 'text-center'
            //         }).then(() => {
            //             window.location.href = "dscmall://startapp?page="+url
            //         }).catch(() => {
            //         // on cancel
            //         });
            //     }
            // }
        },
        computed: {
            ...mapState({
                goodsInfo: state => state.goods.goodsInfo,//商品基本信息
                goodsCouponList: state => state.goods.goodsCouponList,//优惠券信息
                shopDetail: state => state.shop.shopDetail,//店铺信息
                fittingInfo: state => state.goods.fittingInfo,//组合配件详情
                fittingPriceData: state => state.goods.fittingPriceData,//组合配件价格信息
                shipping_fee: state => state.shopping.shipping_fee,//配送运费信息
                goodsGuessList: state => state.shopping.goodsGuessList,//猜你喜欢
            }),
            gallery_list() {
                return this.$store.state.goods.goodsInfo.gallery_list
            },
            attr() {
                return this.$store.state.goods.goodsInfo.attr
            },
            goodsAttrInit() {
                return this.$store.state.goods.goodsAttrInit
            },
            goods_attr_id:{
                get(){
                    return this.goodsInfo.goods_attr_id ? this.goodsInfo.goods_attr_id : ''
                },
                set(val){
                    this.goodsInfo.goods_attr_id = val
                }
            },
            goodsAttrOper() {
                return this.$store.state.goods.goodsAttrOper
            },
            stock() {
                return this.attr != '' ? this.goodsAttrOper.stock : this.goodsInfo.goods_number
            },
            isLogin() {
                return localStorage.getItem('token') == null ? false : true
            },
            ru_id() {
                return this.$store.state.goods.goodsInfo.user_id
            },
            number:{
                get(){
                    return this.goodsInfo.is_minimum > 0 ? this.goodsInfo.minimum : 1
                },
                set(val){
                    this.num = val
                },
            },
            is_collect_shop: {
                get() {
                    return this.shopDetail.is_collect_shop
                },
                set(val) {
                    this.shopDetail.is_collect_shop = val
                }
            },
            count_gaze: {
                get() {
                    return this.shopDetail.count_gaze
                },
                set(val) {
                    this.shopDetail.count_gaze = val
                }
            },
            shopInfo() {
                let arr = []

                arr[this.index] = {
                    shopName: this.shopDetail.shop_name,
                    logo: this.shopDetail.logo_thumb,
                    ru_id: this.shopDetail.ru_id,
                    commentdelivery: this.shopDetail.commentdelivery,
                    commentdelivery_font: this.shopDetail.commentdelivery_font,
                    commentrank: this.shopDetail.commentrank,
                    commentrank_font: this.shopDetail.commentrank_font,
                    commentserver: this.shopDetail.commentserver,
                    commentserver_font: this.shopDetail.commentserver_font,
                    count_gaze: this.count_gaze,
                    is_collect_shop: this.is_collect_shop,
                }

                return arr
            },
            goodsCollectStatue() {
                return this.$store.state.user.goodsCollectStatue
            },
            regionSplic() {
                return this.regionOptionDate.regionSplic
            },
            freight() {
                return this.shipping_fee != null && this.shipping_fee.is_shipping > 0 ? this.shipping_fee
                .shipping_fee_formated : "<span class='color-red'>"+this.$t('lang.is_shipping_area')+"</span>"
            },
            importTax() {
                return this.goodsInfo.goods_rate != null && this.goodsInfo.goods_rate > 0 ? this.goodsInfo.formated_goods_rate : '0'
            },
            is_on_sale() {
                return this.$store.state.goods.goodsInfo.is_on_sale == 0 ? true : false
            },
            collect_icon() {
                return this.is_collect == 1 ? 'like' : 'like-o'
            },
            is_collect: {
                get() {
                    return this.$store.state.goods.goodsInfo.is_collect
                },
                set(val) {
                    this.$store.state.goods.goodsInfo.is_collect = val
                }
            },
            cart_number: {
                get() {
                    return this.$store.state.goods.goodsInfo.cart_number
                },
                set(val) {
                    this.$store.state.goods.goodsInfo.cart_number = val
                }
            },
            attr_name: {
                get() {
                    return this.attr != '' ? '‘' + this.$store.state.goods.goodsInfo.attr_name + '’' + this.num + this.goodsInfo.goods_unit  : this.num + '' + this.goodsInfo.goods_unit
                },
                set(val) {
                    this.$store.state.goods.goodsInfo.attr_name = val
                }
            },
            player() {
                return this.$refs.videoPlayer.player
            },
            regionGoodsPirce:{
                get(){
                    return this.shipping_fee.goods ? this.shipping_fee.goods.goods_price : 0
                },
                set(val){
                    if(this.shipping_fee.goods){
                        this.shipping_fee.goods.goods_price = val
                    }
                }
            },
            regionGoodsNumber:{
                 get(){
                    return this.shipping_fee.goods ? this.shipping_fee.goods.stock : 0
                 },
                 set(val){
                    if(this.shipping_fee.goods){
                        this.regionGoodsNumberFormated = val
                    }
                 }
            },
            //价格随属性变化
            goodsPriceManage(){
                let price = ''
                if(this.goodsAttrOper.goods_price_formated){
                    price = this.goodsAttrOper.goods_price_formated
                }else{
                    if(this.goodsInfo.promote_start_date > 0 && this.goodsInfo.promote_end_date > 0){
                        price = this.goodsInfo.promote_price_formated
                    }else{
                        price = this.goodsInfo.shop_price_formated
                    }
                }
                return price
            },
            //库存随属性变化
            goodsNumberManage(){
                let number = 0

                if(this.goodsAttrOper.stock){
                    number = this.goodsAttrOper.stock
                }else{
                    number = this.goodsInfo.goods_number
                }

                return number
            },
            goods_promotion(){
                let goods_promotion = this.goodsInfo.goods_promotion
                let act_name = ''
                let act_type = ''
                let act_id = ''
                let arr = []
                let obj = {}

                if(goods_promotion && goods_promotion.length > 0){
                    goods_promotion.forEach(v=>{
                        if(v.type == 'favourable'){//优惠活动
                            act_type = v.act_type
                            act_name = v.act_name
                        }else if(v.type == 'group_buy'){
                            act_type = 3
                            act_name = this.$t('lang.group_buy')
                        }else if(v.type == 'auction'){
                            act_type = 4
                            act_name = this.$t('lang.auction')
                        }

                        obj = {
                            act_type:act_type,
                            act_name:act_name,
                            act_id:v.act_id
                        }
                        arr.push(obj)
                    })
                }

                // if(this.goodsInfo.fittings){
                //     let a  = "<em class='em-sales'>"+ this.$t('lang.combined_package') +"</em><span>" + this.$t('lang.hig_discount') + "<i class='color-red'>" + this.spare_price + "</i>" + this.$t('lang.price_unit') + "</span>"
                //     arr.push(a)
                // }

                if(this.goodsInfo.consumption && this.goodsInfo.consumption.length > 0){
                    let consumption = ''
                    let str = ''
                    this.goodsInfo.consumption.forEach(v=>{
                        str = this.$t('lang.man') + v.cfull + this.$t('lang.minus') + v.creduce
                        consumption += str + ','
                    })

                    obj = {
                        act_type:5,
                        act_name:consumption
                    }

                    arr.push(obj)
                }

                return arr
            },
            spare_price(){
                return this.goodsInfo.fittings[0].spare_price
            }
        },
        methods: {
            loadGoodsInfo(goods_id){
                let parent_id = localStorage.getItem('parent_id') ? localStorage.getItem('parent_id') : this.$route.query.parent_id ? this.$route.query.parent_id : null
                this.$store.dispatch('setGoodsInfo', {
                    goods_id: goods_id,
                    warehouse_id: 0,
                    area_id: 0,
                    is_delete: 0,
                    is_on_sale: 1,
                    is_alone_sale: 1,
                    parent_id:parent_id
                })
            },
            onAddCartClicked(type) {
                let newAttr = []
                this.addCartClass = false

                if (this.attr.length > 0) {
                    newAttr = this.goodsAttrInit
                }

                this.$store.dispatch('setAddCart', {
                    goods_id: this.goods_id,
                    num: this.num,
                    spec: newAttr,
                    warehouse_id:'0',
                    area_id:'0',
                    parent_id:'0',
                    rec_type: type
                }).then(res => {
                    if (res == true) {
                        if (type == 10) {
                            if (this.isLogin) {
                                this.$router.push({
                                    name: 'checkout',
                                    query: {
                                        rec_type: type
                                    }
                                })
                            }else{
                                let msg = this.$t('lang.login_user_invalid')
                                this.notLogin(msg)
                            }
                        } else {
                            this.addCartClass = true
                            Toast.success({
                                duration: 1000,
                                message: this.$t('lang.added_to_cart')
                            })
                            this.cart_number = parseInt(this.cart_number) + this.num
                            this.closeSku()
                        }
                    } else {
                        Toast(res.msg)
                    }
                })
            },
            onBuyClicked() {
                this.onAddCartClicked(10)
            },
            skuLink() {
                this.showBase = true
                this.changeAttr()
            },
            onSku(e) {
                let type = e.target.dataset.type;
                if (this.attr.length > 0) {
                    this.showBase = true
                    this.changeAttr()
                } else {
                    if(type){
                        this.onAddCartClicked(10)
                    }else{
                        this.onAddCartClicked(0)
                    }
                }
            },
            handelClose(val) {
                if(val == 'coupon'){
                    this.couponShow = false
                }else if(val == 'promotion'){
                    this.promotionShow = false
                }
            },
            onClickLeft() {
                this.$router.go(-1)
            },
            closeSku() {
                this.showBase = false
                this.storeBtn = false
            },
            changeAttr() {
                this.$store.dispatch('setGoodsAttrOper', {
                    goods_id: this.goods_id,
                    num: this.num,
                    attr_id: this.goodsAttrInit
                })
            },
            handelRegionShow() {
                this.regionShow = this.regionShow ? false : true
            },
            //领取优惠券
            handleCoupon() {
                this.couponShow = true

                this.$store.dispatch('setGoodsCouponList', {
                    goods_id: this.goods_id,
                    ru_id: this.goodsInfo.user_id
                }).then(() => {
                    this.conpouLoading = false
                })
            },
            //阶梯价格
            handleVolumePrice(){
                this.volumePriceShow = true
            },
            //查看促销活动
            handlePromotion(){
                this.promotionShow = true
            },
            handelReceive(val) {
                this.$store.dispatch('setGoodsCouponReceive', {
                    cou_id: val
                }).then(({data:data}) => {
                    Toast({
                        message:data.msg,
                        duration:1000,
                    })

                    this.$store.dispatch('setGoodsCouponList', {
                        goods_id: this.goods_id,
                        ru_id: this.goodsInfo.user_id
                    })
                })
            },
            shippingFee(val) {
                this.$store.dispatch('setShippingFee', {
                    goods_id: this.goods_id,
                    position: val,
                    goods_attr_id: this.goods_attr_id,
                    is_price: this.isPrice
                })
            },
            //历史记录
            historyAdd() {
                let time = (new Date()).getTime()
                let price = this.goodsInfo.shop_price_formated
                this.$store.dispatch('setHistoryAdd', {
                    id: this.goods_id,
                    name: this.goodsInfo.goods_name,
                    img: this.goodsInfo.goods_thumb,
                    price: price,
                    addtime: time,
                })
            },
            collection() {
                if (this.isLogin) {
                    this.$store.dispatch('setCollectGoods', {
                        goods_id: this.goods_id,
                        status: this.is_collect
                    })
                } else {
                    let msg = this.$t('lang.fill_in_user_collect_goods')
                    this.notLogin(msg)
                }
            },
            //关注店铺
            updateInfo(obj) {
                this.is_collect_shop = obj.is_collect_shop
                this.count_gaze = this.is_collect_shop == 1 ? this.count_gaze + 1 : this.count_gaze - 1
            },
            handleStore() {
                this.changeAttr()
                this.showBase = true
                this.storeBtn = true
            },
            onStoreClicked() {
                if (this.isLogin) {
                    this.showBase = false
                    this.storeBtn = false
                    this.$router.push({
                        name: 'storeGoods',
                        query: {
                            id: this.goods_id,
                            attr_id: this.goodsAttrInit,
                            num:this.num
                        }
                    })
                } else {
                    let msg = this.$t('lang.login_user_not')
                    this.notLogin(msg)
                }
            },
            commentHandle(){
                this.$router.push({
                    name:'goodsComment',
                    id:this.goods_id
                })
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
                                name: 'goods',
                                params: {id: this.goods_id},
                                url:url
                            }
                        }
                    })
                }).catch(() => {

                })
            },
            handleVideo(){
                this.playerOptions.sources[0].src = this.goodsInfo.goods_video
                this.videoShow = true
            },
            //分销商品分享
            shareHandle(){
                this.drpShareActive = this.drpShareActive == true ? false : true
            },
            //分销商品分享层关闭
            shoppingPromptHandle(){
                this.drpShareActive = false
            },
            //商品分享生成分享图片
            onGoodsShare(){
                if (this.isLogin) {
                    Toast.loading({ duration: 0, mask: true, forbidClick: true, message: this.$t('lang.loading') })
                    let price = this.goodsInfo.goods_price || this.goodsInfo.shop_price
                    this.$store.dispatch('setGoodsShare',{
                        goods_id:this.goods_id,
                        price: price,
                        share_type:this.goodsInfo.is_distribution
                    }).then(res => {
                        if(res.status == 'success'){
                            this.shareImg = res.data
                            this.shareImgShow = true
                            Toast.clear()
                        }
                    })
                } else {
                    let msg = this.$t('lang.login_user_not')
                    this.notLogin(msg)
                }
            },
            onVipRegister(){
                let parent_id = localStorage.getItem('parent_id') ? localStorage.getItem('parent_id') : this.$route.query.parent_id ? this.$route.query.parent_id : null

                this.$router.push({
                    name:'drp-register',
                    query:{
                        parent_id:parent_id
                    }
                })
            },
            //网友讨论圈
            onDiscover(){
                this.$router.push({
                    name:'discoverList',
                    query:{
                        id:this.goods_id
                    }
                })
            },
            //组合套餐购买
            handleFitting(){
                this.fittingShow = true
                this.$store.dispatch('setFitting',{
                    goods_id:this.goods_id
                })
            },
            fittingLoad(load){
                let group_name = 'm_goods_' + this.fittingNames
                let group_id = group_name + '_' + this.goods_id
                let goods_attr_id = ''

                this.fittingAttrInit.forEach(v=>{
                    goods_attr_id += v + ','
                })

                this.fittingGoodsAttrId = goods_attr_id.substring(0,goods_attr_id.length-1)

                this.$store.dispatch('setFittingPrice',{
                    id:this.goods_id,
                    group:{
                        attr:this.fittingGoodsAttrId,
                        goods_attr:this.fittingAttrId,
                        number:1,
                        warehouse_id:0,
                        area_id:0,
                        area_city:0,
                        group_name:group_name,
                        group_id:group_id,
                        fittings_goods:this.goods_id,
                    },
                    type:1,
                    load_type:load
                })
            },
            //选择配件
            fittingsCheckChange(index){
                let group_name = 'm_goods_' + this.fittingNames
                let group_id = group_name + '_' + this.goods_id
                let that = this
                if(this.$refs.checkboxes[index].checked == false){
                    this.$store.dispatch('setAddToCartCombo',{
                        goods_id:this.$refs.checkboxes[index].name,
                        number:1,
                        spec:'',
                        parent_attr:'',
                        warehouse_id:0,
                        area_id:0,
                        area_city:0,
                        parent:this.goods_id,
                        group_id:group_id,
                        add_group:''
                    }).then(({data})=>{
                        if(data.error == 0){
                            this.save_minMaxPrice = data.save_minMaxPrice
                            this.fittings_minMax = data.fittings_minMax
                        }else{
                            Toast(data.msg)
                        }
                    })
                }else{
                    this.$store.dispatch('setDelInCartCombo',{
                        goods_id:this.$refs.checkboxes[index].name,
                        parent:this.goods_id,
                        group_id:group_id,
                        goods_attr:'',
                        warehouse_id:0,
                        area_id:0,
                        area_city:0,
                    }).then(({data})=>{
                        if(data.error == 0){
                            this.save_minMaxPrice = data.save_minMaxPrice
                            this.fittings_minMax = data.fittings_minMax
                        }else{
                            Toast(data.msg)
                        }
                    })
                }
            },
            //配件属性选择
            fittingAttrHandle(goods_id){
                let i = 0,
                    attr_id = '',
                    goods_attr_id = ''

                this.zFittingAttr = true
                if(goods_id){
                    this.fittingsCheckModel.forEach(v=>{
                        if(v == goods_id){
                            i++
                        }
                    })
                    if(i == 0){
                        Toast(this.$t('lang.fill_in_parts'))
                        return false
                    }

                    this.fittingShowBase = true
                    this.fittingInfo.fittings.forEach(v=>{
                        if(v.goods_id == goods_id){
                            this.fittingAttr = v.attr
                            this.fittingPrice = v.fittings_price
                            this.fittingImg = v.goods_thumb
                            v.attr.forEach(a => {
                                a.attr_key.forEach(k=>{
                                    if(k.attr_checked == 1){
                                        this.fittingAttrInit.push(k.goods_attr_id)

                                        attr_id += k.attr_id + ','
                                        goods_attr_id += k.goods_attr_id + ','
                                        this.fittingAttrName += k.attr_value + ' '
                                    }
                                })
                            })
                        }
                    })

                    //截取去除字符串最后一个字符
                    this.fittingAttrId = attr_id.substring(0,attr_id.length-1)
                    this.fittingGoodsAttrId = goods_attr_id.substring(0,goods_attr_id.length-1)
                }else{
                    this.skuLink()
                }
            },
            closeFitting(){
                this.fittingShowBase = false
            },
            //配件属性确定选择
            onFittingAttr(){
                this.showBase = false
            },
            onFittingLeft(){
                this.promotionShow = false
                this.fittingShow = false
            },
            //配件加入购物车
            fittingsAddCart(){
                let group_name = 'm_goods_' + this.fittingNames
                let group_id = group_name + '_' + this.goods_id
                this.$store.dispatch('setAddToCartGroup',{
                    group_name:group_name,
                    goods_id:this.goods_id,
                    warehouse_id:0,
                    area_id:0,
                    area_city:0,
                    number:this.fittingNum
                }).then(({data})=>{
                    Toast(data.msg)

                    if(data.error == 1){
                        this.$router.push({
                            name:'cart'
                        })
                    }
                })
            },
            //猜你喜欢
            goodsGuessHandle(){
                this.$store.dispatch('setGoodsGuess')
            },
            onScroll() {
                let scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop
                if (scrollTop > 10) {
                    this.scrollState = true
                } else {
                    this.scrollState = false
                }
            },
            jump(index) {
                this.navActive = index

                // 用 class="d_jump" 添加锚点
                let jump = document.querySelectorAll('.d_jump')
                let total = jump[index].offsetTop
                let scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop
                // 平滑滚动，时长500ms，每10ms一跳，共50跳
                let step = total / 50
                if (total > scrollTop) {
                    smoothDown()
                } else {
                    let newTotal = scrollTop - total
                    step = newTotal / 50
                    smoothUp()
                }

                function smoothDown() {
                    if (scrollTop < total) {
                        scrollTop += step
                        document.body.scrollTop = scrollTop
                        document.documentElement.scrollTop = scrollTop
                        setTimeout(smoothDown, 10)
                    } else {
                        document.body.scrollTop = total
                        document.documentElement.scrollTop = total
                    }
                }

                function smoothUp() {
                    if (scrollTop > total) {
                        scrollTop -= step
                        document.body.scrollTop = scrollTop
                        document.documentElement.scrollTop = scrollTop
                        setTimeout(smoothUp, 10)
                    } else {
                        document.body.scrollTop = total
                        document.documentElement.scrollTop = total
                    }
                }
            }
        },
        watch: {
            '$route'(to, from) {
                this.dscLoading = true
                this.goods_id = to.params.id
                this.loadGoodsInfo(to.params.id)
            },
            ru_id() {
                //店铺信息
                if (this.goodsInfo.user_id > 0) {
                    this.$store.dispatch('setShopDetail', {
                        ru_id: this.goodsInfo.user_id
                    })
                }
            },
            goodsInfo() {
                //秒杀id大于0 跳转到秒杀详情
                if(this.goodsInfo.seckill_id){
                    this.$router.push({
                        name:'seckill-detail',
                        query:{
                            seckill_id:this.goodsInfo.seckill_id,
                            back:this.activityRouterPath
                        }
                    })
                }else{
                    this.dscLoading = false
                }

                if (this.isLogin) {
                    this.historyAdd()
                }

                //设置title
                document.title = this.goodsInfo.goods_name;

                let parent_id = localStorage.getItem('parent_id') ? localStorage.getItem('parent_id') : this.$route.query.parent_id ? this.$route.query.parent_id : null

                //单独设置微信分享信息
                this.$wxShare.share({
                    title:this.goodsInfo.goods_name,
                    desc:this.goodsInfo.goods_brief,
                    link:`${window.ROOT_URL}mobile/#/goods/` + this.goods_id + '?parent_id=' + parent_id,
                    imgUrl:this.goodsInfo.goods_thumb
                })
                if(this.goodsInfo.is_minimum > 0){
                    this.num = this.goodsInfo.minimum
                }
            },
            goodsAttrOper() {
                if (this.goodsAttrOper) {
                    this.attr_name = this.goodsAttrOper.attr_name
                    this.regionGoodsPirce = 0
                }
            },
            goodsAttrInit(){
                let str = ''

                this.goodsAttrInit.forEach(v=>{
                    str += v + ','
                })
                this.goods_attr_id  = str.substring(str.length-1,0)
            },
            goodsCollectStatue() {
                this.goodsCollectStatue.forEach((v) => {
                    if (v.id == this.goods_id) {
                        this.is_collect = v.status
                    }
                })
            },
            regionSplic() {
                let shipping_region = {
                    province_id: this.regionOptionDate.province.id,
                    city_id: this.regionOptionDate.city.id,
                    district_id: this.regionOptionDate.district.id,
                    street_id: this.regionOptionDate.street.id
                }

                //运费
                this.shippingFee(shipping_region)
            },
            shipping_fee(){
                if(this.shipping_fee.goods){
                    this.regionGoodsPirce = this.shipping_fee.goods.shop_price
                    this.regionGoodsPirceFormated = this.shipping_fee.goods.shop_price_formated
                    this.regionGoodsNumber = this.shipping_fee.goods.stock
                }
            },
            fittingInfo(){
                this.fittingNames = this.fittingInfo.comboTab[0].group_id
            },
            fittingNames(){
                this.fittingLoad(1)
            },
            fittingPriceData(){
                this.fittingAttrNumber = this.fittingPriceData.attr_number
                this.fittingAttrName = ''

                if(this.fittingPriceData.fittings_interval){
                    this.fittingPriceData.fittings_interval.forEach(v=>{
                        if(v.groupId == this.fittingNames){
                            this.fittings_minMax = v.fittings_minMax
                            this.save_minMaxPrice = v.save_minMaxPrice
                        }
                    })
                }
            }
        },
        beforeRouteEnter(to,form,next){
            next(vm=>{
                vm.activityRouterPath = form.fullPath
            })
        }
    }
</script>
