<template>
    <div class="con con_main">
        <div class="flow-checkout" v-if="checkoutDisplay">
            <section class="flow-checkout-item flow-checkout-adr m-b10" v-if="total.real_goods_count > 0">
                <van-cell-group>
                    <van-cell :title="consignee_title" :label="consignee_address" icon="location" is-link
                              @click="checkoutAddress" v-if="store_id == 0"></van-cell>
                    <van-cell icon="location" v-else>
                        <div slot="title">
                            <h2 class="f-h-adr-title">{{ storeInfo.stores_name }}</h2>
                            <p class="f-04 col-7 m-top02">{{$t('lang.label_service_call')}}{{ storeInfo.stores_tel }}</p>
                            <p class="f-04 col-7 m-top02">{{$t('lang.label_business_hours')}}{{ storeInfo.stores_opening_hours }}</p>
                            <p class="f-04 col-7 m-top02">{{$t('lang.label_store_address')}}[{{ storeInfo.address }}] {{ storeInfo.stores_address }}</p>
                        </div>
                    </van-cell>
                </van-cell-group>
            </section>
            <section class="checkout-goods-list m-b10" v-for="(item,index) in checkoutInfo.goods_list" :key="index">
                <section class="section-list">
                    <div class="detail-title">{{ item.shop_name }}</div>
                    <template v-if="listShow[index]">
                        <div class="product-list product-list-max dis-box">
                            <ul class="box-flex">
                                <li v-for="(goodsItem,goodsIndex) in item.goods" :key="goodsIndex" @click="productLink(goodsItem)">
                                    <div class="p-d-img">
                                        <div class="p-r">
                                            <img class="img" :src="goodsItem.goods_thumb" v-if="goodsItem.goods_thumb">
                                            <img class="img" src="../../assets/img/no_image.jpg" v-else>
                                            <em class="activity-tag" v-if="goodsItem.is_gift > 0"><img src="../../assets/img/gift-icon.png" class="img"/></em>
                                        </div>
                                    </div>
                                </li>
                            </ul>
                            <div class="t-jiantou" @click="onListShow(index)">
        		    			<span class="user-more">
        		    				<em>{{$t('lang.gong')}} {{ item.goods_count }} {{$t('lang.jian')}}</em>
        		    				<i class="iconfont icon-more"></i>
        		    			</span>
                            </div>
                        </div>
                    </template>
                    <template v-else>
                        <div class="product-list dis-box">
                            <ul class="box-flex">
                                <li v-for="(goodsItem,goodsIndex) in item.goods">
                                    <div class="product-div" :class="{'package-box':goodsItem.extension_code == 'package_buy'}">
                                        <div class="product-list-img" @click="productLink(goodsItem)">
                                            <img class="img" :src="goodsItem.goods_thumb" v-if="goodsItem.goods_thumb"/>
                                            <img class="img" src="../../assets/img/no_image.jpg" v-else>
                                            <em class="activity-tag" v-if="goodsItem.is_gift > 0"><img src="../../assets/img/gift-icon.png" class="img"/></em>
                                            <em class="activity-tag" v-if="goodsItem.extension_code == 'package_buy'"><img src="../../assets/img/package.png" class="img"/></em>
                                        </div>
                                        <div class="product-info" @click="productLink(goodsItem)">
                                            <h4>
                                                <em class="em-promotion" v-if="rec_type == 1">{{$t('lang.group_buy')}}</em>
                                                <em class="em-promotion" v-if="rec_type == 2">{{$t('lang.auction')}}</em>
                                                <em class="em-promotion" v-if="rec_type == 4">{{$t('lang.integral')}}</em>
                                                <em class="em-promotion" v-if="rec_type == 5">{{$t('lang.presale')}}</em>
                                                <em class="em-promotion" v-if="rec_type == 6">{{$t('lang.seckill')}}</em>
                                                <em class="em-promotion" v-if="rec_type == 7">{{$t('lang.team')}}</em>
                                                <em class="em-promotion" v-if="rec_type == 8">{{$t('lang.bargain')}}</em>
                                                <em class="em-promotion" v-if="goodsItem.extension_code == 'package_buy'">{{$t('lang.package')}}</em>
                                                {{ goodsItem.goods_name }}
                                            </h4>
                                            <template v-if="goodsItem.extension_code == 'package_buy'">
                                            <div class="price">
                                                <em class="color-red" style="font-size:1.5rem;">{{$t('lang.label_package_price')}}{{goodsItem.goods_price_format}}</em>
                                                <span>x{{goodsItem.package_goods_list.length}}</span>
                                            </div>
                                            <div class="p-attr">{{$t('lang.is_discount')}}{{ goodsItem.format_package_list_saving }}</div>
                                            </template>
                                            <template v-else>
                                            <div class="price">
                                                <em>{{ goodsItem.goods_price_format }}</em>
                                                <span>x{{ goodsItem.goods_number }}</span>
                                            </div>
                                            <div class="p-attr" v-if="goodsItem.goods_attr">{{ goodsItem.goods_attr }}</div>
                                            </template>
                                        </div>
                                        <div class="t-jiantou t-jantou-xia" style="margin-top: 0;" @click="onListPackage" v-if="goodsItem.extension_code == 'package_buy'">
                                            <span class="user-more">
                                              <i class="iconfont" :class="[listPackageShow ? 'icon-moreunfold' :'icon-more']" style="font-size:1.4rem;"></i>
                                            </span>
                                        </div>
                                    </div>
                                    <template v-if="goodsItem.extension_code == 'package_buy' && listPackageShow">
                                        <div class="product-div package-list" v-for="packageItem in goodsItem.package_goods_list">
                                            <div class="product-list-img">
                                            <img class="img" :src="packageItem.goods_thumb" v-if="packageItem.goods_thumb"/>
                                            <img class="img" src="../../assets/img/no_image.jpg" v-else>
                                            </div>
                                            <div class="product-info">
                                                <h4>{{ packageItem.goods_name }}</h4>
                                                <div class="price">
                                                    <em>{{ packageItem.rank_price_format }}</em>
                                                    <span>x{{ packageItem.goods_number }}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </template>
                                    <van-cell-group class="van-cell-noright" v-if="goodsItem.membership_card_id > 0">
                                         <van-cell is-link>
                                            <template slot="title">
                                                <van-tag color="#ee0a24" size="medium" plain>{{$t('lang.give')}}</van-tag>
                                                <span style="font-size: 12px; color: #666; margin-left: 5px;">{{$t('lang.song')}}[{{goodsItem.membership_card_name}}] {{$t('lang.onezhang')}}</span>
                                            </template>
                                            <span style="color: #999;" @click="drpApplyHref(goodsItem.membership_card_id)">{{$t('lang.go_to_kk')}}</span>
                                        </van-cell>
                                    </van-cell-group>
                                </li>
                            </ul>
                            <div class="t-jiantou t-jantou-xia" @click="onListShow(index)" v-if="item.goods.length > 1">
                                <span class="user-more">
                                    <i class="iconfont icon-moreunfold"></i>
                                </span>
                            </div>
                        </div>

                    </template>
                </section>
                <van-cell-group class="van-cell-noright m-top08">
                    <van-cell :title="$t('lang.shipping_mode')" v-if="store_id == 0 && total.real_goods_count > 0">
                        <div @click="feeHandle(index,item.shipping.default_shipping.shipping_id)"
                             v-if="item.shipping.default_shipping"><span>{{ shipping_name[index] }}</span>&nbsp;<em class="color-red">{{ format_shipping_fee[index] }}</em></div>
                        <div class="color-red" v-else>{{$t('lang.not_shipping')}}</div>
                    </van-cell>
                    <van-cell :title="$t('lang.buyer_message')" class="b-min b-min-t">
                        <div>
                            <van-field v-model="postscriptValue[index]" :placeholder="$t('lang.buyer_message_placeholder')" class="van-cell-ptb0"/>
                        </div>
                    </van-cell>
                    <van-cell class="b-min b-min-t">
                        <div><span>{{$t('lang.gong')}} {{ item.goods_count }} {{$t('lang.total_amount_propmt_alt')}}：</span> <em class="color-red">{{ item.amount }}</em>
                        </div>
                    </van-cell>
                </van-cell-group>
            </section>

            <section class="checkout-goods-other">
                <van-cell-group class="van-cell-noright">
                    <van-cell :title="$t('lang.payment_mode')" v-model="pay_name" is-link @click="paymentSelect"/>
                    <van-cell :title="$t('lang.invoice_info')" class="b-min b-min-t" @click="invoiceSelect" :is-link="!checkoutInfo.cross_border" v-if="rec_type != 4 && checkoutInfo.can_invoice > 0">
                        <div class="box-flex" solt="value">
                            <template v-if="checkoutInfo.cross_border">
                                <p class="receipt-title color-red">{{$t('lang.cross_border_no_invoice')}}</p>
                            </template>
                            <template v-else>
                                <template v-if="!invoice.invoiceType">
                                    <p class="receipt-title">
                                        <template v-if="!invoice.company">{{ invoice.invoiceTitle }}</template>
                                        <template v-else>{{ invoice.company_name }}</template>
                                    </p>
                                    <p class="receipt-name">{{ invoice.invoiceConent }}</p>
                                </template>
                                <template v-else>
                                    <p class="receipt-title">{{$t('lang.vat_tax_invoice')}}</p>
                                </template>
                            </template>
                        </div>
                    </van-cell>
                    <van-cell v-model="bonusObject.bonusContent" class="b-min b-min-t" is-link v-if="bonusList.length>0"
                              @click="bonusHandle">
                        <template slot="title"><span>{{$t('lang.bonus')}}({{bonusList.length}}{{$t('lang.zhang')}})</span></template>
                    </van-cell>
                    <van-cell v-model="couponsObject.couponsContent" class="b-min b-min-t" is-link
                              v-if="couponsList.length>0" @click="couponsHandle">
                        <template slot="title"><span>{{$t('lang.coupons')}}({{couponsList.length}}{{$t('lang.zhang')}})</span></template>
                    </van-cell>
                    <van-cell v-model="valueCardObject.valueCardContent" value="" class="b-min b-min-t" is-link
                              v-if="valueCard.length > 0" @click="valueCardHandle">
                        <template slot="title"><span>{{$t('lang.value_card')}}({{valueCard.length}}{{$t('lang.zhang')}})</span></template>
                    </van-cell>
                </van-cell-group>
                <van-cell-group class="van-cell-noright m-top08" v-if="checkoutInfo.cross_border">
                    <van-cell :title="$t('lang.real_name')" class="van-cell-title b-min b-min-b"></van-cell>
                    <van-cell :title="$t('lang.truename')" class="b-min b-min-t">
                        <div><van-field type="text" v-model="checkout_real_name" :placeholder="$t('lang.fill_in_real_name')" class="van-cell-ptb0"></van-field></div>
                    </van-cell>
                    <van-cell :title="$t('lang.id_number')" class="b-min b-min-t">
                        <div><van-field type="tel" v-model="checkout_real_id" :placeholder="$t('lang.fill_in_id_number')" class="van-cell-ptb0"></van-field></div>
                    </van-cell>
                    <van-cell class="b-min b-min-t" v-for="(item,index) in checkoutInfo.article_list" :key="index">
                        <template slot="title">
                            <div class="dis-box">
                                <van-checkbox v-model="articleCheck" class="box-flex">{{$t('lang.checkout_help_article')}}</van-checkbox>
                                <span style="margin-left: 10px; color: #0087ff;" @click="clickArticle(index)">《{{item.title}}》</span>
                            </div>
                        </template>
                    </van-cell>
                </van-cell-group>
                <van-cell-group class="van-cell-noright m-top08" >
                    <van-cell class="van-cell-title b-min b-min-b" v-if="checkoutInfo.use_surplus > 0 && pay_code == 'onlinepay'">
                        <div slot="title">{{$t('lang.is_use_balance')}}</div>
                        <van-switch v-model="surplusSelf" size="20px" class="fr"/>
                    </van-cell>
                    <van-cell class="b-min b-min-b" v-if="checkoutInfo.use_surplus > 0 && use_surplus_val > 0 && pay_code == 'onlinepay'">
                        <template slot="title">
                            <span>{{$t('lang.label_use_balance')}}</span>
                        </template>
                        <template solt="value">
                            <div class="cell-value-flex">
                                <div class="input-bor"><input type="number" v-model="surplus" min="1" :placeholder="$t('lang.fill_in_use_balance')" :max="checkoutInfo.user_money" @input="surplusSelfHandle"></div>
                                <div class="user_money">{{$t('lang.label_sy_use_balance')}}{{ checkoutInfo.user_money_formated }}</div>
                            </div>
                        </template>
                    </van-cell>
                    <van-cell v-if="checkoutInfo.allow_use_integral > 0 && checkoutInfo.integral.length > 0">
                        <div slot="title">{{$t('lang.in_commission')}}<em class="color-red">{{ checkoutInfo.integral[0].integral }}</em>{{$t('lang.points_deduction')}}<em
                                class="color-red">{{ checkoutInfo.integral[0].integral_money_formated}}</em></div>
                        <van-switch v-model="integralSelf" size="20px" class="fr" @change="integralSelfHandle"/>
                    </van-cell>
                </van-cell-group>

                <van-cell-group class="van-cell-noright m-top08" v-if="checkoutInfo.use_membership_card > 0">
                    <van-cell class="van-cell-title b-min b-min-b">
                        <template slot="title">
                            <div class="vip-zk">
                                <i class="icon-vip"><img src="../../assets/img/newuser/icon-vip.png" class="img"></i>
                                <div class="vip-zk-info">
                                    <div class="tit">开通高级会员，再减<em class="color-red">{{ vipCard.membership_card_discount_price_formated }}</em>元<div class="i" @click="quanyiClick"><i class="iconfont icon-49"></i></div></div>
                                    <div class="subtit">开通即享专属权益</div>
                                </div>
                            </div>
                        </template>
                        <template solt="value">
                            <div class="vip-zk-price" :class="{'active':vipReceiveState}" @click="vipReceive">
                                <em class="color-red" :class="{'mf':!vipCard.membership_card_buy_money > 0}">{{ vipCard.membership_card_buy_money > 0 ? vipCard.membership_card_buy_money_formated : '免费领取' }}</em>
                                <i class="iconfont icon-gouxuan"></i>
                            </div>
                        </template>
                    </van-cell>
                </van-cell-group>

                <van-cell-group class="van-cell-noright m-top08 van-cell-total">
                    <van-cell :title="$t('lang.goods_together')" class="van-cell-title b-min b-min-b">
                        <div>
                            <em class="color-red">
                                <template v-if="rec_type == 5">{{$t('lang.label_presale_deposit')}}</template>
                                <template v-if="rec_type == 1 && checkoutInfo.is_group_deposit == 1">{{$t('lang.label_group_deposit')}}</template>
                                {{ total.goods_price_formated }}
                            </em>
                        </div>
                    </van-cell>
                    <van-cell :title="$t('lang.taxes_dues')" v-if="rateFee > 0">
                        <div><em class="color-red">+ ¥{{ rateFee }}</em></div>
                    </van-cell>
                    <van-cell :title="$t('lang.delivery_cost')" v-if="shippingFee > 0 && store_id == 0 && total.real_goods_count > 0">
                        <div><em class="color-red">+ ¥{{ shippingFee }}</em></div>
                    </van-cell>

                    <van-cell :title="$t('lang.discount')" v-if="total.discount > 0">
                        <div><em class="color-red">-{{ total.discount_formated }}</em></div>
                    </van-cell>
                    <van-cell :title="$t('lang.integral')" v-if="total.integral_money > 0">
                        <div><em class="color-red">-{{ total.integral_money_formated }}</em></div>
                    </van-cell>
                    <van-cell :title="$t('lang.bonus')" v-if="bonusObject.bonusMoney > 0">
                        <div><em class="color-red">-{{ total.bonus_money_formated }}</em></div>
                    </van-cell>
                    <template v-if="total.cou_type != 5">
                        <van-cell :title="$t('lang.coupons')" v-if="couponsObject.couponsMoney > 0">
                            <div><em class="color-red">-{{ total.coupons_money_formated }}</em></div>
                        </van-cell>
                    </template>
                    <van-cell :title="$t('lang.coupon_tab_3')" v-else>
                        <div><em class="color-red">-{{ total.shopping_fee_formated }}</em></div>
                    </van-cell>
                    <van-cell :title="$t('lang.value_card')" v-if="valueCardObject.valueCardMoney > 0">
                        <div><em class="color-red">-{{ total.card_money_formated }}</em></div>
                    </van-cell>
                    <van-cell :title="$t('lang.value_card_discount')" v-if="valueCardObject.vc_dis > 0 && valueCardObject.vc_dis < 10">
                        <div><em class="color-red">{{ valueCardObject.vc_dis }}{{$t('lang.zhe')}}</em></div>
                    </van-cell>
                    <van-cell :title="$t('lang.money')" v-if="total.surplus > 0">
                        <div><em class="color-red">-{{ total.surplus_formated }}</em></div>
                    </van-cell>
                    <van-cell :title="$t('lang.membership_card_buy_money')" v-if="vipCard.order_membership_card_id > 0 && vipReceiveState  && vipCard.membership_card_buy_money > 0">
                        <div><em class="color-red">+{{ vipCard.membership_card_buy_money_formated }}</em></div>
                    </van-cell>
                    <van-cell :title="$t('lang.membership_card_discount_price')" v-if="vipCard.order_membership_card_id > 0 && vipReceiveState && vipCard.membership_card_discount_price > 0">
                        <div><em class="color-red">-{{ vipCard.membership_card_discount_price_formated }}</em></div>
                    </van-cell>
                </van-cell-group>
            </section>
            <section class="order-detail-submit order-checkout-submit">
                <template v-if="rec_type == 4">
                    <van-submit-bar :button-text="$t('lang.immediate_payment')" @submit="onSubmit">
                        <div class="van-submit-bar-zdy">
                            <span class="label-title">{{$t('lang.label_actual_payment')}}</span>
                            <em class="color-red">{{ amountPrice }}{{$t('lang.integral')}}<template v-if="shippingFee > 0"> + ¥{{ shippingFee }}</template></em>
                        </div>
                    </van-submit-bar>
                </template>
                <template v-else>
                    <template v-if="loading">
                        <van-submit-bar :price="amountPrice * 100" :label="label_text" button-text="$t('lang.immediate_payment')" :currency="currency" :loading="loading" />
                    </template>
                    <template v-else>
                        <van-submit-bar :price="amountPrice * 100" :label="label_text" :button-text="$t('lang.immediate_payment')" :currency="currency" :disabled="!articleCheck" :loading="loading" @submit="onSubmit"/>
                    </template>
                </template>
            </section>
        </div>

        <!--发票-->
        <van-popup v-model="showBase" position="right" :overlay="overlay" class="invoice_show">
            <section class="invoice-warp-box padding-all">
                <div class="header-tit">{{$t('lang.invoice_type')}}</div>
                <ul class="ect-selects">
                    <li class="ect-select" :class="{'active':invoice.invoiceType == false}" @click="incrementHandle(1)">
                        <span>{{$t('lang.plain_invoice')}}</span></li>
                    <template v-if="!invoice.increment">
                        <li class="ect-select btn-box" @click="incrementHandle(2)"><span>{{$t('lang.vat_invoice')}}</span></li>
                    </template>
                    <template v-else>
                        <li class="ect-select" :class="{'active':invoice.invoiceType == true}"
                            @click="incrementHandle(2)"><span>{{$t('lang.vat_invoice')}}</span></li>
                    </template>
                </ul>
                <p>{{$t('lang.checkout_inv_help')}}</p>
            </section>
            <section class="invoice-cont-box" v-if="!invoice.invoiceType">
                <ul class="ect-selects">
                    <li class="ect-select" :class="{'active':invoice.company == false}" @click="invTab(1)">
                        <span>{{$t('lang.person')}}</span></li>
                    <li class="ect-select" :class="{'active':invoice.company == true}" @click="invTab(2)">
                        <span>{{$t('lang.company')}}</span></li>
                </ul>
                <div class="invoice-cont-1 van-cell-field" v-if="invoice.company">
                    <van-cell :title="$t('lang.label_company_name')" :value="invoice.company_name" is-link class="my-cell-nobottom" @click="companySelect" v-if="invoice.invoiceCompany.length > 0"></van-cell>
                    <van-field :label="$t('lang.label_company_name')" class="my-cell-nobottom" v-model="invoice.company_name" :placeholder="$t('lang.fill_in_company_name')" v-else />
                    <van-field :label="$t('lang.taxpayer_id_number')" :placeholder="$t('lang.enter_taxpayer_id_number')" v-model="invoice.company_tid"/>
                </div>
                <div class="invoice-cont-2">
                    <div class="header-tit">{{$t('lang.invoice_content')}}</div>
                    <van-radio-group v-model="invoice.invValueRadio" @change="invValueRadioHandle">
                        <van-radio :name="index" v-for="(item,index) in invoiceValue" :key="index">{{item}}</van-radio>
                    </van-radio-group>
                </div>
            </section>
            <div class="my-box">
                <div class="ect-button-more">
                    <div class="btn btn-submit" @click="submitBtn">{{$t('lang.confirm')}}</div>
                </div>
            </div>
        </van-popup>

        <!--单位发票-->
        <van-popup class="show-popup-bottom" v-model="invoice.companyShow" position="bottom">
            <div class="goods-show-title padding-all">
                <h3 class="fl">{{$t('lang.company_name')}}</h3>
                <i class="iconfont icon-close fr" @click="companyClose"></i>
            </div>
            <div class="s-g-list-con">
                <div class="select-two">
                    <ul>
                        <li class="ect-select" v-for="(item,index) in invoice.invoiceCompany" :key="index"
                            :class="{'active':invoice.invoice_id == item.invoice_id}"
                            @click="invoice_company_select(item.invoice_id,item.inv_payee,item.tax_id)">
                            <label class="dis-box">
                                <span class="box-flex">{{ item.inv_payee }}</span>
                                <i class="iconfont icon-gou"></i>
                            </label>
                        </li>
                    </ul>
                </div>
            </div>
        </van-popup>

        <!--红包-->
        <van-popup v-model="bonusObject.bonusBase" position="right" :overlay="overlay">
            <div class="con-filter-div con-filter-div-coupon">
                <ul class="flow-couon-list padding-all-n bonus-list" v-for="(item,index) in bonusList" :key="index">
                    <li class="big-remark-all new-coupons-box bonus-select-box"
                        :class="{'active':bonusObject.bonusId == item.bonus_id, 'disabled': bonusObject.bonusId != item.bonus_id && bonusDisabled}"
                        @click="bonusActive(item.bonus_id)">
                        <div class="cont dis-box">
                            <div class="bonus-left">
                                <div class="img-box">
                                    <div class="color-red"><strong class="bonus-money">¥{{item.type_money}}</strong>
                                    </div>
                                </div>
                            </div>
                            <div class="box-flex bonus-right">
                                <p class="bonus-tit"><strong>{{item.type_name}}</strong></p>
                                <p class="bonus-desc">{{ $t('lang.man') }}{{item.min_goods_amount}}{{ $t('lang.price_unit') }}{{ $t('lang.have_access_to') }}</p>
                            </div>
                        </div>
                        <div class="time">{{$t('lang.label_service_life')}}{{item.use_start_date}} {{$t('lang.zhi')}} {{item.use_end_date}}</div>
                        <div class="new-store-radio-box"><i class="iconfont icon-gou"></i></div>
                    </li>
                </ul>
            </div>
            <div class="filterlayer_bottom_buttons">
                <span class="filterlayer_bottom_button bg_1" @click="closeBonus">{{$t('lang.close')}}</span>
                <span class="filterlayer_bottom_button bg_2" @click="submitBonus">{{$t('lang.confirm')}}</span>
            </div>
        </van-popup>

        <!--优惠券-->
        <van-popup v-model="couponsObject.couponsBase" position="right" :overlay="overlay" class="coupons-filter-con">
            <div class="con-filter-div-1">
                <ul class="flow-couon-list padding-all couon-list">
                    <li class="dis-box new-coupons-box" v-for="(item,index) in couponsList" :key="index"
                        :class="{'active':couponsObject.couponsId == item.uc_id, 'disabled': couponsObject.couponsId != item.uc_id && bonusDisabled}"
                        @click="couponsActive(item.uc_id)">
                        <div class="box-flex remark-all p-r">
                            <div class="q-type">
                                <div class="b-r-a-price">
                                    <em>¥</em>
                                    <strong class="coupons-money">{{ item.cou_money }}</strong>
                                    <div class="couons-text text-left" style="padding-top: 1rem;"><span>{{$t('lang.man')}}{{ item.cou_man }}{{$t('lang.price_unit')}}</span>
                                    </div>
                                </div>
                                <div class="b-r-a-con text-left">
                                    <div class="range-item">{{ item.shop_name }}</div>
                                    <div class="range-item">{{$t('lang.label_scope')}}[{{item.cou_type_name}}][{{item.cou_goods_name}}]</div>
                                    <div class="range-item col-7">{{$t('lang.valid_until')}}{{ item.cou_end_time }}</div>
                                </div>
                            </div>
                        </div>
                        <div class="new-store-radio-box"><i class="iconfont icon-gou"></i></div>
                    </li>
                </ul>
            </div>
            <div class="filterlayer_bottom_buttons">
                <span class="filterlayer_bottom_button bg_1" @click="closeCoupons">{{$t('lang.close')}}</span>
                <span class="filterlayer_bottom_button bg_2" @click="submitCoupons">{{$t('lang.confirm')}}</span>
            </div>
        </van-popup>

        <!--储值卡-->
        <van-popup v-model="valueCardObject.valueCardBase" position="right" :overlay="overlay">
            <div class="con-filter-div-card">
                <ul class="padding-all user_valuecard flow-couon-list">
                    <li :class="{'active':valueCardObject.valueCardId == item.vc_id}" v-for="(item,index) in valueCard"
                        :key="index" @click="valueCardActive(item.vc_id)">
                        <div class="valuecard_top padding-all">
                            <header class="user_col">
                                <strong>NO.{{item.value_card_sn}}</strong>
                                <label class="user_tag_box active">{{$t('lang.activated')}}</label>
                            </header>
                            <h3 class="text-center user_col"><em>{{$t('lang.label_sum')}}</em>¥{{ item.card_money }}</h3>
                        </div>
                        <div class="user_card_num padding-all">
                            <p>{{$t('lang.label_expiration_time')}}{{item.end_time}}<label class="valuecard_num"><em>{{$t('lang.face_value')}}: </em>¥{{ item.card_money }}</label></p>
                        </div>
                        <div class="new-store-radio-box"><i class="iconfont icon-gou"></i></div>
                    </li>
                </ul>
            </div>
            <div class="filterlayer_bottom_buttons">
                <span class="filterlayer_bottom_button bg_1" @click="closeValuecard">{{$t('lang.close')}}</span>
                <span class="filterlayer_bottom_button bg_2" @click="submitValuecard">{{$t('lang.confirm')}}</span>
            </div>
        </van-popup>

        <!--配送方式-->
        <van-popup class="show-popup-bottom" v-model="feeShow" position="bottom">
            <div class="goods-show-title padding-all">
                <h3 class="fl">{{$t('lang.shipping_mode')}}</h3>
                <i class="iconfont icon-close fr" @click="feeclose"></i>
            </div>
            <div class="s-g-list-con">
                <div class="select-two">
                    <ul>
                        <li class="ect-select" v-for="(item,index) in shippingList" :key="index"
                            :class="{'active':shipping_id[shipping_active_id] == item.shipping_id}"
                            @click="shipping_select(item)">
                            <label class="dis-box">
                                <span class="box-flex">{{ item.shipping_name }}</span>
                                <i class="iconfont icon-gou"></i>
                            </label>
                        </li>
                    </ul>
                </div>
            </div>
        </van-popup>

        <!--支付方式-->
        <van-popup class="show-popup-bottom" v-model="paymentShow" position="bottom">
            <div class="goods-show-title padding-all">
                <h3 class="fl">{{$t('lang.payment_mode')}}</h3>
                <i class="iconfont icon-close fr" @click="paymentClose"></i>
            </div>
            <div class="s-g-list-con">
                <div class="select-two">
                    <ul>
                        <li class="ect-select" v-for="(item,index) in payment_method" :key="index"
                            :class="{'active':pay_id == item.pay_id}"
                            @click="payment_method_select(item.pay_id,item.pay_name,item.pay_code)">
                            <label class="dis-box">
                                <span class="box-flex">{{ item.pay_name }}</span>
                                <i class="iconfont icon-gou"></i>
                            </label>
                        </li>
                    </ul>
                </div>
            </div>
        </van-popup>

        <!--支付方式-->
        <van-popup class="paypwdShow" v-model="paypwdShow">
            <van-password-input
              :value="paypwdValue"
              :info="$t('lang.paypwd_value_info')"
              @focus="showKeyboard = true"
            />
            <van-number-keyboard
              :show="showKeyboard"
              @input="onInput"
              @delete="onDelete"
              @blur="showKeyboard = false"
              @hide="onHide"
            />
        </van-popup>

        <!--协议文章-->
        <van-popup class="show-popup-bottom" style="top: 0" v-model="articleShow" position="bottom">
            <div class="goods-show-title padding-all text-all">
                <h3 class="fl">{{showArticle.title}}</h3>
                <i class="iconfont icon-close fr" @click="articleClose"></i>
            </div>
            <div class="s-g-list-con padding-all" style="max-height: none;">
                <div class="t-remark m-b10">{{showArticle.add_time}}</div>
                <div v-html="showArticle.content"></div>
            </div>
        </van-popup>

        <!--权益卡-->
        <van-popup class="quanyiShow" v-model="quanyiShow">
            <div class="quanyi-top">
                <i class="icon-vip"><img src="../../assets/img/newuser/icon-vip.png" class="img"></i>
                <div class="name">{{ vipCard.name }}</div>
                <i class="iconfont icon-close" @click="handelClose"></i>
            </div>
            <div class="quanyi-xian"><span>可享受以下权益</span></div>
            <div class="quanyi-list">
                <div class="item" v-for="(item,index) in vipCard.user_membership_card_rights_list" :key="index">
                    <i class="icon"><img :src="item.icon" class="img" /></i>
                    <div class="txt">{{item.name}}</div>
                </div>
            </div>
        </van-popup>

        <CommonNav></CommonNav>
    </div>
</template>

<script>
    import qs from 'qs'

    import {mapState} from 'vuex'
    import {
        Checkbox,
        CheckboxGroup,
        Cell,
        CellGroup,
        SubmitBar,
        GoodsAction,
        GoodsActionBigBtn,
        GoodsActionMiniBtn,
        Field,
        Dialog,
        Popup,
        RadioGroup,
        Radio,
        Toast,
        Switch,
        PasswordInput,
        NumberKeyboard,
        Tag
    } from 'vant'

    import CommonNav from '@/components/CommonNav'

    export default {
        data() {
            return {
                loading:false,
                checkoutDisplay: false,
                postscriptValue: [],
                showBase: false,
                overlay: true,
                invoice: {
                    company: false,
                    company_name: '',
                    company_tid: '',
                    increment: false,
                    invoiceType: false,
                    invoiceTitle: this.$t('lang.person'),
                    invoiceConent: this.$t('lang.no_invoice'),
                    invoiceCompany:[],
                    tax_id: 0,
                    invValueRadio: 0,
                    companyShow:false,
                    invoice_id:null,
                },
                bonusObject: {
                    bonusContent: this.$t('lang.no_use_bonus'),
                    bonusBase: false,
                    bonusId: 0,
                    bonusMoney: 0,
                    bonusSn: 0
                },
                couponsObject: {
                    couponsContent: this.$t('lang.no_use_coupons'),
                    couponsBase: false,
                    couponsId: 0,
                    couponsMoney: 0
                },
                valueCardObject: {
                    valueCardContent: this.$t('lang.no_use_value_card'),
                    valueCardBase: false,
                    valueCardId: 0,
                    valueCardMoney: 0,
                    vc_dis: 0
                },
                bonusDisabled: false,
                couponsDisabled: false,
                feeShow: false,
                paymentShow: false,
                pay_code:'',
                pay_id: null,
                pay_name: '',
                shippingList: [],
                shipping_active_id: 0,
                use_surplus_val: 0,
                use_integral_val: 0,
                price: 0,
                rec_type: this.$route.query.rec_type ? this.$route.query.rec_type : 0,
                type_id: this.$route.query.type_id ? this.$route.query.type_id : 0,
                store_id: this.$route.query.store_id > 0 ? this.$route.query.store_id : 0,
                store_type: '',
                store_mobile: 0,
                take_time: '',
                bs_id: 0,
                team_id: this.$route.query.team_id,
                t_id:0,
                extension_id:0,       //扩展活动id
                currency:'¥',
                label_text:this.$t('lang.label_total_amount_payable'),
                shipping_id:[],
                shipping_code:[],
                shipping_type:[],
                shipping_name:[],
                format_shipping_fee:[],
                shipping_fee:[],
                rate_price:[],
                checkout_real_name:'',
                checkout_real_id:'',
                paypwdShow:false,
                paypwdValue:'',
                showKeyboard: true,
                articleCheck: true,
                articleShow: false,
                showArticle:{},
                listPackageShow:false,
                surplus:0,
                timer:'',
                vipReceiveState:false,
                quanyiShow:false
            }
        },
        components: {
            [Checkbox.name]: Checkbox,
            [CheckboxGroup.name]: CheckboxGroup,
            [Cell.name]: Cell,
            [CellGroup.name]: CellGroup,
            [SubmitBar.name]: SubmitBar,
            [GoodsAction.name]: GoodsAction,
            [GoodsActionBigBtn.name]: GoodsActionBigBtn,
            [GoodsActionMiniBtn.name]: GoodsActionMiniBtn,
            [Field.name]: Field,
            [Dialog.name]: Dialog,
            [Popup.name]: Popup,
            [RadioGroup.name]: RadioGroup,
            [Radio.name]: Radio,
            [Toast.name]: Toast,
            [Switch.name]: Switch,
            [PasswordInput.name]: PasswordInput,
            [NumberKeyboard.name]: NumberKeyboard,
            [Tag.name]: Tag,
            CommonNav
        },
		
		
        created() {
			
            let that = this
            let url = ''
            if(that.rec_type > 0){
                url = '../../pages/checkout/checkout?rec_type='+that.rec_type+'&type_id='+that.type_id
            }else{
                url = '../../pages/checkout/checkout'
            }

            setTimeout(() => {
              uni.getEnv(function(res){
                  if(res.plus || res.miniprogram){
                      uni.redirectTo({
                          url:url
                      })
                  }
              })
            },100)

            this.checkoutDefault()
        },
        computed: {
            ...mapState({
                checkoutInfo: state => state.shopping.checkoutInfo,
                checkout_done: state => state.shopping.checkout_done
            }),
            consignee_title() {
                if (this.checkoutInfo.consignee) {
                    return this.checkoutInfo.consignee.consignee + ' ' + this.checkoutInfo.consignee.mobile
                } else {
                    return ''
                }
            },
            consignee_address() {
                if (this.checkoutInfo.consignee) {
                    return this.checkoutInfo.consignee.province_name + this.checkoutInfo.consignee.city_name + this.checkoutInfo.consignee.district_name + this.checkoutInfo.consignee.address
                } else {
                    return ''
                }
            },
            address_id(){
                if (this.checkoutInfo.consignee) {
                    return this.checkoutInfo.consignee.address_id ? this.checkoutInfo.consignee.address_id : ''
                } else {
                    return ''
                }
            },
            cart_id() {
                let rec_ids = []
                this.checkoutInfo.goods_list.forEach((v) => {
                    v.goods.forEach((res) => {
                        rec_ids.push(res.rec_id)
                    })
                })

                return rec_ids
            },
            bonusList() {
                return this.checkoutInfo.bonus_list ? this.checkoutInfo.bonus_list : 0
            },
            couponsList() {
                return this.checkoutInfo.coupons_list ? this.checkoutInfo.coupons_list : 0
            },
            valueCard() {
                return this.checkoutInfo.value_card ? this.checkoutInfo.value_card : 0
            },
            isLogin() {
                return localStorage.getItem('token') == null ? false : true
            },
            payment_method() {
                return this.checkoutInfo.payment_list ? this.checkoutInfo.payment_list : ''
            },
            total: {
                get() {
                    return this.checkoutInfo.total ? this.checkoutInfo.total : ''
                },
                set(val) {
                    console.log(val)
                }
            },
            amountPrice: {
                get() {
                    let priceStr = ''
                    if (this.rec_type == 4) {
                        //积分兑换
                        this.price = this.total.exchange_integral
                        this.currency = ''

                        return this.price
                    } else {
                        //普通商品价格
                        if (this.price == 0) {
                            this.price = this.total.amount
                        }

                        if(this.surplusSelf && this.surplus > 0){
                            priceStr = this.total.amount
                        }else{
                            if (this.shippingFee && this.total.real_goods_count > 0 && this.total.cou_type != 5) {
                                priceStr = this.price + this.shippingFee
                            } else {
                                priceStr = this.price
                            }
                        }
                        return Number(priceStr)
                    }
                },
                set(val) {
                    this.price = val
                }
            },
            shipping() {
                let arr = []
                if (this.checkoutInfo.goods_list) {
                    this.checkoutInfo.goods_list.forEach((v) => {
                        arr.push(v.shipping.default_shipping)
                    })
                }

                return arr
            },
            shippingFee() {
                let shippingFeePrice = 0
                if (this.shipping_fee && this.store_id == 0) {
                    this.shipping_fee.forEach(v => {
                        shippingFeePrice += Number(v) * 100
                    })
                }

                return shippingFeePrice/100
            },
            rateFee() {
                let ratePrice = 0
                if(this.rate_price && this.store_id == 0){
                    this.rate_price.forEach(v=>{
                        ratePrice += Number(v)
                    })
                }
                return ratePrice
            },
            surplusSelf: {
                get() {
                    return this.use_surplus_val == 0 ? false : true
                },
                set(val) {
                    this.use_surplus_val = val == true ? 1 : 0
                }
            },
            integralSelf: {
                get() {
                    return this.use_integral_val == 0 ? false : true
                },
                set(val) {
                    this.use_integral_val = val == true ? 1 : 0
                }
            },
            integral() {
                return this.checkoutInfo.integral.length > 0 ? this.checkoutInfo.integral[0].integral : 0
            },
            storeInfo() {
                return this.checkoutInfo.store
            },
            storeCart() {
                return this.checkoutInfo.store_cart
            },
            listShow() {
                return this.$store.state.shopping.listShow
            },
            invoiceValue(){
                return this.checkoutInfo.invoice_content
            },
            use_paypwd(){
                return this.checkoutInfo.use_paypwd ? this.checkoutInfo.use_paypwd : 0
            },
            vipCard(){
                return this.checkoutInfo.use_membership_card > 0  ? this.checkoutInfo.membership_card_info : ''
            }
        },
        methods: {
            checkoutDefault() {
                if (this.isLogin) {
                    if (this.store_id > 0) {
                        this.$store.dispatch('setShoppingCheckout', {
                            rec_type: this.rec_type,
                            store_id: this.store_id
                        })
                    } else {
                        this.$store.dispatch('setShoppingCheckout', {
                            rec_type: this.rec_type,
                            type_id: this.type_id,
                            team_id: this.team_id
                        })
                    }
                } else {
                    let msg = this.$t('lang.login_user_invalid')
                    this.notLogin(msg)
                }
            },
            checkoutAddress() {
                let value = {
                    routerLink: 'checkout'
                }

                if (this.$route.query) {
                    value = {
                        routerLink: 'checkout',
                        rec_type: this.rec_type,
                        type_id: this.type_id,
                        team_id: this.team_id
                    }
                }

                this.$router.push({
                    name: 'address',
                    query: value
                })
            },
            onSubmit() {
                let shop_id = []

                this.checkoutInfo.goods_list.forEach((v) => {
                    shop_id.push(v.ru_id)
                })

                /* 根据活动rec_type值判断type_id 是什么活动id*/
                if (this.rec_type == 1 || this.rec_type == 2 || this.rec_type == 5 || this.rec_type == 6) {
                    this.extension_id = this.type_id
                } else if (this.rec_type == 7) {
                    this.t_id = this.type_id

                    if(this.pay_code == 'cod' && this.use_surplus_val == 0){
                        Toast(this.$t('lang.team_not_pay_delivery'))
                        return false
                    }
                } else if (this.rec_type == 8) {
                    this.bs_id = this.type_id
                }
                if((this.use_surplus_val > 0 || this.valueCardObject.valueCardId > 0) && this.use_paypwd > 0 && this.paypwdValue.length < 6){
                    this.paypwdShow = true
                    this.showKeyboard = true
                    return false
                }

                if(this.checkoutInfo.cross_border){
                    if(this.checkout_real_name == ''){
                        Toast(this.$t('lang.truename_not_null'))
                        return false
                    }else if(this.checkout_real_id == ''){
                        Toast(this.$t('lang.id_number_not_null'))
                        return false
                    }
                }

                if(Number(this.surplus) > Number(this.checkoutInfo.user_money)){
                    Toast(this.$t('lang.use_balance_propmt_1'))
                    return false
                }

                // if(Number(this.surplus) > Number(this.amountPrice)){
                //     Toast(this.$t('lang.use_balance_propmt_2'))
                //     return false
                // }

                this.loading = true

                //发票
                let inv_payee = this.invoice.company ? this.invoice.company_name : this.invoice.invoiceTitle
                let tax_id = this.invoice.invoiceType ? this.invoice.tax_id : this.invoice.company_tid
                let isRecId = this.checkoutInfo.isshipping_list.length > 0 ? this.checkoutInfo.isshipping_list : this.cart_id

                let o = {
                    cart_value: isRecId,    //购物车id
                    flow_type: this.checkoutInfo.flow_type,                     //购物类型
                    store_id: this.store_id,                                    //门店id
                    store_type: '',                                             //门店类型、自营/商家
                    store_mobile: this.store_mobile,                            //门店电话
                    take_time: this.take_time,                                  //门店提货时间
                    pay_type: 1,                                                //支付方式类型
                    pay_id: this.pay_id,                                        //支付方式id
                    ru_id: shop_id,                                             //商家id
                    shipping: this.shipping_id,                                 //配送方式
                    shipping_code: this.shipping_code,                          //配送方式code
                    shipping_type: this.shipping_type,                          //是否是上门自取
                    point_id: 0,                                                //自提编号
                    shipping_dateStr: 0,                                        //自提时间
                    is_surplus: this.use_surplus_val,                           //是否使用余额
                    surplus: this.surplus,                                      //使用余额值
                    use_integral: this.use_integral_val,                        //是否使用积分
                    integral: this.integral,                                    //本单可使用积分
                    bonus_id: this.bonusObject.bonusId,                         //红包id
                    bonus: this.bonusObject.bonusMoney,                         //红包金额
                    bonus_sn: this.bonusObject.bonusSn,                         //红包编号
                    uc_id: this.couponsObject.couponsId,                        //优惠券id
                    coupons: this.couponsObject.couponsMoney,                   //优惠券金额
                    vc_id: this.valueCardObject.valueCardId,                    //储值卡id
                    use_value_card: this.valueCardObject.valueCardMoney,        //储值卡金额
                    goods_amount: this.amountPrice,                             //商品总价
                    discount: 0,                                                //优惠金额
                    how_oos: 0,                                                 //缺货处理
                    postscript: this.postscriptValue,                           //订单留言
                    invoice: 0,
                    inv_type: this.invoice.invoiceType ? 1 : 0,                 //发票类型
                    inv_payee: inv_payee,                                       //发票类别、个人/公司
                    tax_id: tax_id,                                             //纳税人识别码或者增值税发票id
                    inv_content: this.invoice.invoiceConent,                    //发票内容
                    need_inv: 0,
                    card_message: '',                                           //贺卡信息
                    tax: 0,                                                     //税
                    pack: 0,
                    card: 0,
                    vat_id: 0,
                    need_insure: 0,
                    bs_id: this.bs_id,                                          //砍价id
                    t_id: this.t_id,                                            //拼团活动id
                    team_id: this.team_id,                                      //拼团开团活动id
                    extension_id: this.extension_id,                            //扩展活动id
                    rel_name:this.checkout_real_name,                           //身份证姓名
                    id_num:this.checkout_real_id,                               //身份证号
                    address_id:this.address_id,                                 //收货地址id
                    pay_pwd:this.paypwdValue,                                   //支付密码
                    referer:'H5',                                                //订单来源
                    order_membership_card_id:this.vipReceiveState ? this.vipCard.order_membership_card_id : 0, //权益卡id
                    membership_card_discount_price:this.vipCard.membership_card_discount_price //购买权益卡折扣
                }

                //判断是否是门店自提
                if(this.store_id == 0){
                    //判断是否支持配送方式
                    if (this.checkoutInfo.noshipping_list.length > 0) {
                        Dialog.confirm({
                            message: this.$t('lang.noshipping_list_cur_propmt'),
                            className: 'text-center'
                        }).then(() => {
                            this.$store.dispatch('setCheckoutSubmit', o).then((res) => {
                                if (res.data.error == 1) {
                                    Toast(res.data.msg)
                                    this.loading = false
                                }else{
                                    Toast.success({
                                        duration: 1000,
                                        forbidClick: true,
                                        loadingType: 'spinner',
                                        message: this.$t('lang.submit_success')
                                    })
                                    this.$router.push({
                                        name: 'done',
                                        query: {
                                            order_sn: res.data
                                        }
                                    })
                                }
                            })
                        }).catch(() => {
                            this.$router.push({
                                name: 'cart'
                            })
                        })
                    } else if (this.checkoutInfo.isshipping_list.length > 0) {
                        this.$store.dispatch('setCheckoutSubmit', o).then(res => {
                            if (res.data.error == 1) {
                                Toast(res.data.msg)
                                this.loading = false
                                this.paypwdValue = ''
                            }else{
                                Toast.success({
                                    duration: 1000,
                                    forbidClick: true,
                                    loadingType: 'spinner',
                                    message: this.$t('lang.submit_success')
                                })
                                this.$router.push({
                                    name: 'done',
                                    query: {
                                        order_sn: res.data
                                    }
                                })
                            }
                        })
                    }
                }else{
                    this.$store.dispatch('setCheckoutSubmit', o).then(res => {
                        if (res.data.error == 1) {
                            Toast(res.data.msg)
                            this.loading = false
                            this.paypwdValue = ''
                        }else{
                            Toast.success({
                                duration: 1000,
                                forbidClick: true,
                                loadingType: 'spinner',
                                message: this.$t('lang.submit_success')
                            })
                            this.$router.push({
                                name: 'done',
                                query: {
                                    order_sn: res.data
                                }
                            })
                        }
                    })
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
                                name: 'cart',
                                url:url
                            }
                        }
                    })
                }).catch(() => {

                })
            },
            invoiceSelect() {
                if(this.checkoutInfo.cross_border){
                    return false
                }

                this.showBase = true
                this.$http.get(`${window.ROOT_URL}api/v4/invoice`).then(res => {
                    let data = res.data.data
                    if (data.user_vat_invoice == '') {
                        this.invoice.increment = false
                    } else {
                        this.invoice.increment = true
                        this.invoice.tax_id = data.user_vat_invoice.id
                        this.invoice.invoiceCompany = data.order_invoice_info
                    }
                })
            },
            invTab(val) {
                if (val == 1) {
                    this.invoice.company = false
                    this.invoice.company_name = ''
                    this.invoice.company_tid = ''
                } else {
                    this.invoice.company = true

                    if(this.invoice.invoiceCompany.length>0){
                        this.invoice.invoice_id = this.invoice.invoiceCompany[0].invoice_id
                        this.invoice.company_name = this.invoice.invoiceCompany[0].inv_payee
                        this.invoice.company_tid = this.invoice.invoiceCompany[0].tax_id
                    }
                }
            },
            companySelect() {
                this.invoice.companyShow = true
            },
            companyClose() {
                this.invoice.companyShow = false
            },
            invoice_company_select(id, name, tax_id) {
                this.invoice.invoice_id = id
                this.invoice.company_name = name
                this.invoice.company_tid = tax_id
            },
            incrementHandle(val) {
                if (val == 1) {
                    this.invoice.invoiceType = false
                } else {
                    if (this.invoice.increment == true) {
                        this.invoice.invoiceType = true
                    } else {
                        Dialog.confirm({
                            message: this.$t('lang.apply_vat_tax_invoice'),
                            className: 'text-center'
                        }).then(() => {
                            this.$router.push({
                                name: 'invForm'
                            })
                        }).catch(() => {

                        })
                    }
                }
            },
            invValueRadioHandle() {
                this.invoiceValue.forEach((v,i) => {
                    if (i == this.invoice.invValueRadio) {
                        this.invoice.invoiceConent = v
                    }
                })
            },
            submitBtn() {
                if (this.invoice.company) {
                    if (this.invoice.company_name == '') {
                        Toast(this.$t('lang.fill_in_company_name'))
                        return false
                    } else if (this.invoice.company_tid == '') {
                        Toast(this.$t('lang.fill_in_taxpayer_id_number'))
                        return false
                    } else {
                        this.showBase = false
                    }
                } else {
                    this.showBase = false
                }
            },
            bonusHandle() {
                this.bonusObject.bonusBase = true
                this.surplusSelf = false
            },
            bonusActive(id) {
                if (this.bonusObject.bonusId != id) {
                    if(!this.bonusDisabled){
                        this.bonusObject.bonusId = id
                    }
                } else {
                    this.bonusObject.bonusId = 0
                }
            },
            closeBonus() {
                this.bonusObject.bonusBase = false
            },
            submitBonus() {
                this.$http.post(`${window.ROOT_URL}api/v4/trade/changebon`, qs.stringify({
                    bonus_id: this.bonusObject.bonusId,
                    total: this.total
                })).then(({data: {data}}) => {
                    this.$store.dispatch('setCheckoutTotal', data)
                    if (data.bonus_money > 0) {
                        this.bonusObject.bonusContent = data.bonus_money_formated
                    } else {
                        this.bonusObject.bonusContent = this.$t('lang.no_use_bonus')
                    }
                    this.total.bonus_money = data.bonus_money
                    this.amountPrice = data.amount
                    this.ratePrice = data.rate_price
                    this.valueCardObject.valueCardMoney = data.card_money
                    this.bonusObject.bonusMoney = data.bonus_money
                    if(data.check_type !== undefined){
                        this.toggleDisabled("bonus",data.check_type)
                    }
                })
                this.bonusObject.bonusBase = false
            },
            couponsHandle() {
                this.couponsObject.couponsBase = true
                this.surplusSelf = false
            },
            couponsActive(id) {
                if (this.couponsObject.couponsId != id) {
                    if(!this.couponsDisabled){
                        this.couponsObject.couponsId = id
                    }
                } else {
                    this.couponsObject.couponsId = 0
                }
            },
            closeCoupons() {
                this.couponsObject.couponsBase = false
            },
            submitCoupons() {
                this.$http.post(`${window.ROOT_URL}api/v4/trade/changecou`, qs.stringify({
                    uc_id: this.couponsObject.couponsId,
                    total: this.total,
                    shopping_fee: this.shippingFee
                })).then(({data: {data}}) => {
                    this.$store.dispatch('setCheckoutTotal', data)
                    if (data.coupons_money > 0) {
                        this.couponsObject.couponsContent = data.coupons_money_formated
                    } else {
                        if(data.cou_type == 5){
                            this.couponsObject.couponsContent = this.$t('lang.coupon_tab_3');
                        }else{
                            this.couponsObject.couponsContent = this.$t('lang.no_use_coupons')
                        }
                    }
                    this.total.coupons_money = data.coupons_money
                    this.couponsObject.couponsMoney = data.coupons_money
                    this.valueCardObject.valueCardMoney = data.card_money
                    this.amountPrice = data.amount
                    this.ratePrice = data.rate_price
                    if(data.check_type !== undefined){
                        this.toggleDisabled("coupons",data.check_type)
                    }
                })

                this.couponsObject.couponsBase = false
            },
            toggleDisabled(type,state){
                if(type == 'bonus'){
                    if(state == 1){
                        this.couponsDisabled = true
                    }else{
                        this.couponsDisabled = false
                    }
                }else if(type == 'coupons'){
                    if(state == 1){
                        this.bonusDisabled = true
                    }else{
                        this.bonusDisabled = false
                    }
                }
            },
            valueCardHandle() {
                this.valueCardObject.valueCardBase = true
                this.surplusSelf = false
            },
            valueCardActive(id) {
                if (this.valueCardObject.valueCardId != id) {
                    this.valueCardObject.valueCardId = id
                } else {
                    this.valueCardObject.valueCardId = 0
                }
            },
            closeValuecard() {
                this.valueCardObject.valueCardBase = false
            },
            submitValuecard() {
                this.$http.post(`${window.ROOT_URL}api/v4/trade/changecard`, qs.stringify({
                    vid: this.valueCardObject.valueCardId,
                    total: this.total
                })).then(({data: {data}}) => {
                    this.$store.dispatch('setCheckoutTotal', data)

                    if (data.card_money > 0) {
                        this.valueCardObject.valueCardContent = data.card_formated
                    } else {
                        this.valueCardObject.valueCardContent = this.$t('lang.no_use_value_card')
                    }

                    this.valueCardObject.vc_dis = data.vc_dis

                    this.amountPrice = data.amount
                    this.ratePrice = data.rate_price
                    this.valueCardObject.valueCardMoney = data.card_money
                    this.total.card_money = data.card_money
                })

                this.valueCardObject.valueCardBase = false
            },
            feeHandle(val, id) {
                let ru_id = 0
                let rec_ids = ''
                let flow_type = this.checkoutInfo.flow_type
                let shipping_region = {
                    country: 1,
                    province: this.checkoutInfo.consignee.province,
                    city: this.checkoutInfo.consignee.city,
                    district: this.checkoutInfo.consignee.district,
                    street: this.checkoutInfo.consignee.street
                }

                this.feeShow = true
                this.shipping_active_id = val
                this.checkoutInfo.goods_list[val].goods.forEach((v) => {
                    rec_ids += v.rec_id + ','
                    ru_id = v.ru_id
                })

                rec_ids = rec_ids.substr(0, rec_ids.length - 1)

                this.$store.dispatch('setShipping', {
                    rec_ids: rec_ids,
                    ru_id: ru_id,
                    consignee: shipping_region,
                    flow_type: flow_type
                }).then((res) => {
                    if (res.shipping) {
                        this.shippingList = res.shipping
                    }
                })
            },
            feeclose() {
                this.feeShow = false
            },
            shipping_select(item) {
                this.shipping_id.splice(this.shipping_active_id, 1, item.shipping_id)
                this.shipping_code.splice(this.shipping_active_id, 1, item.shipping_code)
                this.shipping_name.splice(this.shipping_active_id, 1, item.shipping_name)
                this.shipping_fee.splice(this.shipping_active_id, 1, item.shipping_fee)
                this.format_shipping_fee.splice(this.shipping_active_id, 1, item.format_shipping_fee)
                this.rate_price.splice(this.shipping_active_id, 1, item.rate_price)
            },
            paymentSelect() {
                this.paymentShow = true
            },
            paymentClose() {
                this.paymentShow = false
            },
            payment_method_select(id, name, code) {
                this.pay_id = id
                this.pay_name = name
                this.pay_code = code
            },
            integralSelfHandle() {
                this.$http.post(`${window.ROOT_URL}api/v4/trade/changeint`, qs.stringify({
                    total: this.total,
                    integral_type: this.use_integral_val,
                    cart_value: this.cart_id,
                    flow_type: this.checkoutInfo.flow_type,
                })).then(({data: {data}}) => {
                    if (data) {
                        this.$store.dispatch('setCheckoutTotal', data)
                        this.amountPrice = data.amount
                        this.ratePrice = data.rate_price
                        this.total.integral = data.integral

                        this.valueCardObject.valueCardMoney = data.card_money

                        if (data.card_money == 0) {
                            this.valueCardObject.valueCardContent = this.$t('lang.no_use_value_card')
                        }

                        this.total.integral_money = data.integral_money

                        this.surplusSelf = false
                    }
                })
            },
            surplusSelfHandle(){
                if(this.surplus < 0){
                    Toast('请填写合法值');
                    return false
                }
                clearTimeout(this.timer);
                this.timer = setTimeout(()=>{
                    this.$http.post(`${window.ROOT_URL}api/v4/trade/changesurplus`, qs.stringify({
                        total: this.total,
                        surplus: this.surplus,
                        shopping_fee: this.shippingFee
                    })).then(({data: {data}}) => {
                        this.$store.dispatch('setCheckoutTotal', data)
                        this.amountPrice = data.amount
                        this.ratePrice = data.rate_price
                        this.total.surplus = data.surplus
                        this.total.surplus_formated = data.surplus_formated
                        this.surplus = data.surplus

                        this.valueCardObject.valueCardMoney = data.card_money

                        if (data.card_money == 0) {
                            this.valueCardObject.valueCardContent = this.$t('lang.no_use_value_card')
                        }
                    })
                },1000)
            },
            onListShow(index) {
                let cur = this.listShow[index] ? false : true
                this.listShow.splice(index, 1, cur)
            },
            onListPackage(){
              this.listPackageShow = this.listPackageShow ? false : true
            },
            onInput(key) {
                this.paypwdValue = (this.paypwdValue + key).slice(0, 6);
                if(this.paypwdValue.length == 6){
                    this.paypwdShow = false
                    this.onSubmit();
                }
            },
            onDelete() {
                this.paypwdValue = this.paypwdValue.slice(0, this.paypwdValue.length - 1);
            },
            onHide(){
                this.paypwdValue = ''
            },
            clickArticle(index){
                if(index != undefined){
                    this.showArticle = this.checkoutInfo.article_list[index];
                    this.articleShow = true;
                }
            },
            articleClose(){
                this.articleShow = false;
            },
            productLink(item){
                if(this.rec_type == 0 && item.extension_code != 'package_buy'){ //普通商品
                    this.$router.push({ name:'goods', params:{id:item.goods_id}})
                }else if(this.rec_type == 1){ //团购商品
                    this.$router.push({ name:'groupbuy-detail',params:{group_buy_id:this.type_id}})
                }else if(this.rec_type == 2){ //拍卖商品
                    this.$router.push({name:'auction-detail',params:{act_id:this.type_id}})
                }else if(this.rec_type == 4){ //积分兑换商品
                    this.$router.push({ name:'exchange-detail',params:{id:this.type_id}})
                }else if(this.rec_type == 5){ //预售商品
                    this.$router.push({name:'presale-detail',params:{act_id:this.type_id}})
                }else if(this.rec_type == 6){ //秒杀商品
                    this.$router.push({name:'seckill-detail',params:{seckill_id:this.type_id,tomorrow:0}})
                }else if(this.rec_type == 7){ //拼团商品
                    this.$router.push({name:'team-detail',query:{goods_id:item.goods_id,team_id:this.team_id}})
                }else if(this.rec_type == 8){ //砍价商品
                    this.$router.push({name:'bargain-detail',query:{id:this.type_id}})
                }else if(item.extension_code == 'package_buy'){ //超值礼包
                    this.$router.push({name:'package'})
                }
            },
            //分销会员卡
            drpApplyHref(id){
                this.$router.push({
                    name:'drp-apply',
                    query:{
                        card_id:id
                    }
                })
            },
            //vip优惠领取
            vipReceive(){
                this.vipReceiveState = !this.vipReceiveState;

                this.$http.post(`${window.ROOT_URL}api/v4/trade/change_membership_card`, qs.stringify({
                    total: this.total,
                    order_membership_card_id:this.vipReceiveState ? this.vipCard.order_membership_card_id : 0,
                    membership_card_discount_price:this.vipCard.membership_card_discount_price
                })).then(({data: {data}}) => {
                    this.$store.dispatch('setCheckoutTotal', data)
                    this.amountPrice = data.amount
                    this.ratePrice = data.rate_price

                    this.total.membership_card_buy_money = data.membership_card_buy_money
                    this.total.membership_card_buy_money_formated = data.membership_card_buy_money_formated
                    this.total.membership_card_discount_price = data.membership_card_discount_price
                    this.total.membership_card_discount_price_formated = data.membership_card_discount_price_formated

                    this.vipCard.membership_card_buy_money = data.membership_card_buy_money
                    this.vipCard.membership_card_buy_money_formated = data.membership_card_buy_money_formated
                    this.vipCard.membership_card_discount_price = data.membership_card_discount_price
                    this.vipCard.membership_card_discount_price_formated = data.membership_card_discount_price_formated
                })
            },
            quanyiClick(){
                this.quanyiShow = true
            },
            handelClose(){
               this.quanyiShow = false
            }
        },
        watch: {
            checkoutInfo() {
                if (this.checkoutInfo.length == 0) {
                    this.$router.replace({
                        name: 'cart'
                    })

                    return false
                }

                //默认选中在线支付
                if (this.pay_name == '' && this.checkoutInfo != 'address') {
                    this.payment_method.forEach(v => {
                       // if (v.pay_code == 'onlinepay') {
						 if (v.pay_code == 'balance') {
                            this.pay_name = v.pay_name
                            this.pay_id = v.pay_id
                            this.pay_code = v.pay_code
                        }
                    })
                }

                //是否是门店商品
                if (this.storeCart) {
                    this.store_type = ''
                    this.store_mobile = this.storeCart.store_mobile
                    this.take_time = this.storeCart.take_time
                }

                if (this.checkoutInfo == 'address') {
                    this.checkoutDisplay = false
                    if(this.$route.query){
                        this.$router.push({
                            name: 'addAddressForm',
                            query: {
                                routerLink: 'checkout',
                                entrance:'first',
                                rec_type: this.rec_type,
                                type_id: this.type_id
                            }
                        })
                    }else{
                        this.$router.push({
                            name: 'addAddressForm',
                            query: {
                                routerLink: 'checkout',
                                entrance:'first'
                            }
                        })
                    }
                }else {
                    this.checkoutDisplay = true
                }

                //跨境身份证信息
                if(this.checkoutInfo.consignee){
                    this.checkout_real_id = this.checkoutInfo.consignee.id_num ? this.checkoutInfo.consignee.id_num : ''
                    this.checkout_real_name = this.checkoutInfo.consignee.rel_name ? this.checkoutInfo.consignee.rel_name : ''
                }
            },
            payment_method() {
                if (this.payment_method == '') {
                    Toast(this.$t('lang.payment_method_not_installed'))
                    return false
                }
            },
            surplusSelf(){
				//二开自动填写余额
				if(this.surplusSelf){

					this.surplus=this.checkoutInfo.user_money>=this.checkoutInfo.total.amount?this.checkoutInfo.total.amount:this.checkoutInfo.user_money
					this.surplusSelfHandle()
				}
				//结束
                if(!this.surplusSelf){
                    Toast.loading({
                        message: '加载中...',
                        forbidClick: true,
                        loadingType: 'spinner',
                        duration: 0,
                        mask:true,
                        forbidClick:true
                    });
                    clearTimeout(this.timer);
                    this.timer = setTimeout(()=>{
                        this.$http.post(`${window.ROOT_URL}api/v4/trade/changesurplus`, qs.stringify({
                            total: this.total,
                            surplus: 0,
                            shopping_fee: this.shippingFee
                        })).then(({data: {data}}) => {
                            this.$store.dispatch('setCheckoutTotal', data)
                            this.amountPrice = data.amount
                            this.ratePrice = data.rate_price
                            this.total.surplus = data.surplus
                            this.total.surplus_formated = data.surplus_formated
                            this.surplus = data.surplus

                            this.valueCardObject.valueCardMoney = data.card_money

                            if (data.card_money == 0) {
                                this.valueCardObject.valueCardContent = this.$t('lang.no_use_value_card')
                            }

                            Toast.clear();
                        })
                    },1000)
                }
            },
            shipping() {
                //获取默认配送放id,code,type
                this.shipping.forEach((v) => {
                    if (v == undefined && this.store_id == 0) {
                        this.shipping_name.push('')
                        Toast(this.$t('lang.noshipping_list_propmt'))
                        return false
                    }

                    this.shipping_id.push(v.shipping_id)
                    this.shipping_code.push(v.shipping_code)
                    this.shipping_name.push(v.shipping_name)
                    this.format_shipping_fee.push(v.format_shipping_fee)
                    this.shipping_fee.push(v.shipping_fee)
                    this.shipping_type.push(0)
                    this.rate_price.push(v.rate_price)
                })
            }
        }
    }
</script>
<style scoped>
.product-list .package-box .product-info{
    margin-right: 1rem;
}
.product-list .package-box .t-jantou-xia{
    position: absolute;
    right: 0;
    top: 50%;
    padding: 0;
}
.cell-value-flex{
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
}
.user_money{
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    align-items: center;
    font-size: 1.2rem;
}

.vip-zk{ display: flex; flex-direction: row; align-items: center; justify-content: flex-start; }
.vip-zk .icon-vip{ width: 3rem; height: 3rem; }
.vip-zk .vip-zk-info{ margin-left: 1rem; }
.vip-zk .vip-zk-info .tit{ font-size: 1.5rem; color: #333; display: flex;}
.vip-zk .vip-zk-info .tit em{ margin: 0 .5rem; }
.vip-zk .vip-zk-info .tit i{ margin-left: .5rem; }
.vip-zk .vip-zk-info .subtit{ font-size: 1.1rem; color: #999; }

.vip-zk-price{ height: 100%; display: flex; flex-direction: row; justify-content: flex-end; align-items: center; }
.vip-zk-price em{ font-size: 1.6rem; margin-right: .5rem; }
.vip-zk-price .mf{ font-size: 1.2rem; }
.vip-zk-price .iconfont{ color: #999; margin-top: .3rem; }
.vip-zk-price.active .iconfont{ color: #f92028; }

.quanyiShow{ width: 80%; border-radius: 1rem; padding: 1rem; }
.quanyiShow .quanyi-top { text-align: center; margin: 1rem 0 0; position: relative;}
.quanyiShow .quanyi-top .icon-vip{ width: 4rem; height: 4rem; display: inline-block;}
.quanyiShow .quanyi-top .name{ font-size: 1.6rem; font-weight: bold; margin-top: 1rem;}
.quanyiShow .quanyi-top .icon-close{ position: absolute; top: 0; right: 1rem;}
.quanyiShow .quanyi-xian{ text-align: center; position: relative; margin: 1.5rem 0;}
.quanyiShow .quanyi-xian span{ display: inline-block; padding: 0 1rem; background: #fff; overflow: hidden; font-size: 1.2rem; color: #999; line-height: 2rem; height: 2rem; position: relative; z-index: 3;}
.quanyiShow .quanyi-xian:after{ content: " "; width: 100%; height: 1px; background: #f0f0f0; position: absolute; top: 1rem; left: 0; right: 0; z-index: 2 }
.quanyiShow .quanyi-list{ overflow: hidden; display: flex; flex-direction: row; flex-wrap: wrap;}
.quanyiShow .quanyi-list .item{ width: 33.3%; display: flex; flex-direction: column; justify-content: center; align-items: center; margin: 1rem 0;}
.quanyiShow .quanyi-list .item .icon{ width: 5rem; height: 5rem; border-radius: 50%; overflow: hidden; }
.quanyiShow .quanyi-list .item .txt{  font-size: 1.2rem; color: #666; margin-top: 1rem;}
</style>
