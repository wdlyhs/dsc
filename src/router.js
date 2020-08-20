import Vue from 'vue'
import axios from 'axios'
import qs from 'qs'
import store from './store/index'
import Router from 'vue-router'
import wxShare from './filters/wxShare'

// frontend
const Home = () => import('@/pages/Home/Home')
const Catalog = () => import('@/pages/Catalog/Catalog')
const List = () => import('@/pages/Goods/List')
const Goods = () => import('@/pages/Goods/Detail')
const GoodsComment = () => import('@/pages/Goods/GoodsComment')
const Cart = () => import('@/pages/Cart/Cart')
const Coudan = () => import('@/pages/Cart/Coudan')
const Checkout = () => import('@/pages/Trade/Checkout')
const Done = () => import('@/pages/Trade/Done')
const Respond = () => import('@/pages/Trade/Respond')
const User = () => import('@/pages/User/Index')
const Search = () => import('@/pages/Goods/Search')
const SearchList = () => import('@/pages/Goods/SearchList')

// user auth
const Register = () => import('@/pages/User/Auth/Register')
const Login = () => import('@/pages/User/Auth/Login')
const LoginMobile = () => import('@/pages/User/Auth/LoginMobile')
const Forget = () => import('@/pages/User/Auth/Forget')
const Reset = () => import('@/pages/User/Auth/Reset')
const Callback = () => import('@/pages/User/Auth/Callback')
// user center
const Account = () => import('@/pages/User/Account/Account')
const AccountDetail = () => import('@/pages/User/Account/Detail')
const AccountLog = () => import('@/pages/User/Account/AccountLog')
const AccountLogDetail = () => import('@/pages/User/Account/AccountLogDetail')
const Bonus = () => import('@/pages/User/Account/Bonus/Bonus')
const AddBonus = () => import('@/pages/User/Account/Bonus/AddBonus')
const Deposit = () => import('@/pages/User/Account/Deposit')
const AccountRaply = () => import('@/pages/User/Account/AccountRaply')
const InvForm = () => import('@/pages/User/Account/InvForm')
const ValueCard = () => import('@/pages/User/Account/ValueCard/ValueCard')
const AddValueCard = () => import('@/pages/User/Account/ValueCard/AddValueCard')
const ValueCardDetail = () => import('@/pages/User/Account/ValueCard/Detail')

const Address = () => import('@/pages/User/Address/Index')
const AddressForm = () => import('@/pages/User/Address/Form')
const Affiliate = () => import('@/pages/User/Affiliate/Affiliate')
const Booking = () => import('@/pages/User/Booking/Booking')
const CollectionGoods = () => import('@/pages/User/Collection/Goods')
const CollectionShop = () => import('@/pages/User/Collection/Shop')
const Comment = () => import('@/pages/User/Comment/Comment')
const CommentDetail = () => import('@/pages/User/Comment/Detail')
const Message = () => import('@/pages/User/Message/Message')
const Order = () => import('@/pages/User/Order/Index')
const OrderDetail = () => import('@/pages/User/Order/Detail')
const Profile = () => import('@/pages/User/Profile/Profile')
const Refound = () => import('@/pages/User/AfterSales/Index')
const RefoundDetail = () => import('@/pages/User/AfterSales/Detail')
const ApplyReturn = () => import('@/pages/User/AfterSales/ApplyReturn')
const Realname = () => import('@/pages/User/Profile/Realname')
const UploadCard = () => import('@/pages/User/Profile/UploadCard')
const UserCoupon = () => import('@/pages/User/Coupon/Coupon')
const UserAuction = () => import('@/pages/User/Auction/Index')
const Accountsafe = () => import('@/pages/User/Profile/Accountsafe')
const Paypwd = () => import('@/pages/User/Profile/Paypwd/Index')
const Help = () => import('@/pages/User/Help/Help')
const History = () => import('@/pages/User/History/Index')

//商家入驻
const Merchants = () => import('@/pages/User/Merchants/Index')

/* 文章 */
const Article = () => import('@/pages/Article/List')
const ArticleDetail = () => import('@/pages/Article/Detail')
const ArticleCommentList = () => import('@/pages/Article/CommentList')
const WechatMedia = () => import('@/pages/Article/WechatMedia')

/* 品牌 */
const Brand = () => import('@/pages/Brand/Index')
const BrandList = () => import('@/pages/Brand/List')
const BrandDetail = () => import('@/pages/Brand/Detail')

/* 网友讨论圈 */
const Discover = () => import('@/pages/Discover/Index')
const DiscoverListType = () => import('@/pages/Discover/ListType')
const DiscoverList = () => import('@/pages/Discover/List')
const DiscoverDetail = () => import('@/pages/Discover/Detail')
const MyDiscover = () => import('@/pages/Discover/Me')

const ShopHome = () => import('@/pages/Shop/Home')
const Shop = () => import('@/pages/Shop/Index')
const ShopDetail = () => import('@/pages/Shop/Detail')
const ShopGoodsList = () => import('@/pages/Shop/Goods')
const StoreGoods = () => import('@/pages/Store/Goods')

// activity
const Activity = () => import('@/pages/Ump/Activity/Index')
const ActivityDetail = () => import('@/pages/Ump/Activity/Detail')
// auction
const Auction = () => import('@/pages/Ump/Auction/Index')
const AuctionDetail = () => import('@/pages/Ump/Auction/Detail')
const AuctionLog = () => import('@/pages/Ump/Auction/Log')
// bonus
const BonusReceive = () => import('@/pages/Ump/Bonus/Bonus')
// bargain
const Bargain = () => import('@/pages/Ump/Bargain/Index')
const BargainDetail = () => import('@/pages/Ump/Bargain/Detail/Detail')
const BargainMylist = () => import('@/pages/Ump/Bargain/Detail/MyList')
// coupon
const Coupon = () => import('@/pages/Ump/Coupon/Coupon')
// crowdfunding
const CrowdFunding = () => import('@/pages/Ump/CrowdFunding/Index')
const CrowdFundingDetail = () => import('@/pages/Ump/CrowdFunding/Detail/Detail')
const CrowdFundingCheckout = () => import('@/pages/Ump/CrowdFunding/Detail/Checkout')
const CrowdFundingDone = () => import('@/pages/Ump/CrowdFunding/Detail/Done')
const CrowdFundingOrder = () => import('@/pages/Ump/CrowdFunding/Detail/Order')
const CrowdFundingOrderDetail = () => import('@/pages/Ump/CrowdFunding/Detail/OrderDetail')
const CrowdFundingUser = () => import('@/pages/Ump/CrowdFunding/Detail/User')
const CrowdFundingTopic = () => import('@/pages/Ump/CrowdFunding/Detail/Topic')
const CrowdFundingBuy = () => import('@/pages/Ump/CrowdFunding/Detail/Buy')
const CrowdFundingFocus = () => import('@/pages/Ump/CrowdFunding/Detail/Focus')
// drp
const Drp = () => import('@/pages/Ump/Drp/Index')
const DrpRegister = () => import('@/pages/Ump/Drp/Detail/Register')
const DrpFinish = () => import('@/pages/Ump/Drp/Detail/Finish')
const DrpWithdraw = () => import('@/pages/Ump/Drp/Detail/Withdraw')
const DrpSet = () => import('@/pages/Ump/Drp/Detail/Set')
const DrpOrder = () => import('@/pages/Ump/Drp/Detail/Order')
const DrpOrderDetail = () => import('@/pages/Ump/Drp/Detail/OrderDetail')
const DrpCard = () => import('@/pages/Ump/Drp/Detail/Card')
const DrpNew = () => import('@/pages/Ump/Drp/Detail/New')
const DrpShop = () => import('@/pages/Ump/Drp/Detail/Shop')
const DrpCategory = () => import('@/pages/Ump/Drp/Detail/Category')
const DrpRank = () => import('@/pages/Ump/Drp/Detail/Rank')
const DrpTeam = () => import('@/pages/Ump/Drp/Detail/Team')
const DrpTeamDetail = () => import('@/pages/Ump/Drp/Detail/TeamDetail')
const DrpDrplog = () => import('@/pages/Ump/Drp/Detail/Drplog')
const DrpDrpgoods = () => import('@/pages/Ump/Drp/Detail/Drpgoods')
const Drplist = () => import('@/pages/Ump/Drp/Detail/Drplist')
const DrpPurchase = () => import('@/pages/Ump/Drp/Detail/Purchase')
const DrpDone = () => import('@/pages/Ump/Drp/Detail/Done')
const DrpInfo = () => import('@/pages/Ump/Drp/Detail/Drpinfo')
const DrpProtection = () => import('@/pages/Ump/Drp/Detail/Protection')
const DrpApply = () => import('@/pages/Ump/Drp/Detail/DrpApply')
// exchange
const Exchange = () => import('@/pages/Ump/Exchange/Index')
const ExchangeDetail = () => import('@/pages/Ump/Exchange/Detail')
// groupbuy
const GroupBuy = () => import('@/pages/Ump/GroupBuy/Index')
const GroupBuyDetail = () => import('@/pages/Ump/GroupBuy/Detail')
// package
const Package = () => import('@/pages/Ump/Package/Index')
// presale
const Presale = () => import('@/pages/Ump/Presale/Index')
const PresaleDetail = () => import('@/pages/Ump/Presale/Detail')
const PresaleList = () => import('@/pages/Ump/Presale/List')
// seckil
const Seckill = () => import('@/pages/Ump/Seckill/Index')
const SeckillDetail = () => import('@/pages/Ump/Seckill/Detail')
// team
const Team = () => import('@/pages/Ump/Team/Index')
const TeamList = () => import('@/pages/Ump/Team/Detail/List')
const TeamRank = () => import('@/pages/Ump/Team/Detail/Rank')
const TeamDetail = () => import('@/pages/Ump/Team/Detail/Detail')
const TeamOrder = () => import('@/pages/Ump/Team/Detail/Order')
const TeamWait = () => import('@/pages/Ump/Team/Detail/Wait')
const TeamUser = () => import('@/pages/Ump/Team/Detail/User')
// topic
const Topic = () => import('@/pages/Ump/Topic/Index')
const TopicDetail = () => import('@/pages/Home/Home')
// Supplier
const Supplier = () => import('@/pages/Ump/Supplier/Index')
const SupplierSearch = () => import('@/pages/Ump/Supplier/Detail/Search')
const SupplierDetail = () => import('@/pages/Ump/Supplier/Detail/Detail')
const SupplierList = () => import('@/pages/Ump/Supplier/Detail/List')
const SupplierCart = () => import('@/pages/Ump/Supplier/Detail/Cart')
const SupplierCheckout = () => import('@/pages/Ump/Supplier/Detail/Checkout')
const SupplierDone = () => import('@/pages/Ump/Supplier/Detail/Done')
const SupplierBuy = () => import('@/pages/Ump/Supplier/Detail/Buy')
const SupplierBuyinfo = () => import('@/pages/Ump/Supplier/Detail/Buyinfo')
const SupplierShop = () => import('@/pages/Ump/Supplier/Detail/Shop')
const SupplierOrderList = () => import('@/pages/User/Supplier/Order')
const SupplierApplyReturn = () => import('@/pages/User/Supplier/ApplyReturn')
const SupplierReturnDetail = () => import('@/pages/User/Supplier/ReturnDetail')
const SupplierReturnIndex = () => import('@/pages/User/Supplier/ReturnIndex')
const SupplierApply = () => import('@/pages/User/Supplier/Apply')
// giftCard
const GiftCard = () => import('@/pages/Ump/GiftCard/Index')
const GiftCardResult = () => import('@/pages/Ump/GiftCard/Result')
const GiftCardAddress = () => import('@/pages/Ump/GiftCard/Address')
const GiftCardOrder = () => import('@/pages/Ump/GiftCard/Order')

// 视频列表
const VideoList = () => import('@/pages/Goods/VideoList')

//扫码支付
const Qrpay = () => import('@/pages/Ump/Qrpay/Qrpay')

//webview
const WebView = () => import('@/pages/WebView/WebView')

//语言包
import i18n from '@/locales'

Vue.use(Router)

const router = new Router({
    //mode: 'history',
    base: process.env.BASE_URL,
    routes: [
        {path: '/', redirect: '/home'},
        {path: '/home', name: 'home', component: Home, meta: {title: i18n.t('lang.home'), requireAuth: true}},
        {path: '/catalog', name: 'catalog', component: Catalog, meta: {title: i18n.t('lang.category'), requireAuth: true}},
        {path: '/list/:id', name: 'list', component: List, meta: {title: i18n.t('lang.product_list'),keepAlive: true}},
        {path: '/goods/:id', name: 'goods', component: Goods,meta: {title: i18n.t('lang.goods_detail_info')}},
        {path: '/goods/comment/:id', name: 'goodsComment', component: GoodsComment, meta: {title: i18n.t('lang.goods_comments')}},
        {path: '/cart', name: 'cart', component: Cart, meta: {title: i18n.t('lang.cart')}},
        {path: '/coudan', name: 'coudan', component: Coudan, meta: {title: i18n.t('lang.coudan')}},
        {path: '/checkout', name: 'checkout', component: Checkout, meta: {title: i18n.t('lang.checkout_page')}},
        {path: '/done', name: 'done', component: Done, meta: {title: i18n.t('lang.order_pay')}},
        {path: '/respond', name: 'respond', component: Respond, meta: {title: ''}},
        {path: '/article', name: 'article', component: Article, meta: {title: i18n.t('lang.article_page')}},
        {path: '/articleDetail/:id', name: 'articleDetail', component: ArticleDetail, meta: {title: i18n.t('lang.article_detail_page')}},
        {
            path: '/ArticleCommentList/:id',
            name: 'articleCommentList',
            component: ArticleCommentList,
            meta: {title: i18n.t('lang.article_comment_list_page')}
        },
        {path: '/wechatMedia/:id', name: 'wechatMedia', component: WechatMedia, meta: {title: ''}},
        {path: '/brand', name: 'brand', component: Brand, meta: {title: i18n.t('lang.brand')}},
        {path: '/brandList', name: 'brandList', component: BrandList, meta: {title: i18n.t('lang.brand_list_page')}},
        {path: '/brandDetail/:id', name: 'brandDetail', component: BrandDetail, meta: {title: i18n.t('lang.brand_detail_page')}},
        {path: '/discover', name: 'discover', component: Discover, meta: {title: i18n.t('lang.discover_page')}},
        {path: '/discoverList', name: 'discoverList', component: DiscoverList, meta: {title: i18n.t('lang.discover_page')}},
        {path: '/discoverListType', name: 'discoverListType', component: DiscoverListType, meta: {title: i18n.t('lang.discover_page')}},
        {path: '/discoverDetail', name: 'discoverDetail', component: DiscoverDetail, meta: {title: ''}},
        {path: '/myDiscover', name: 'myDiscover', component: MyDiscover, meta: {title: ''}},
        {path: '/shopHome/:id', name: 'shopHome', component: ShopHome, meta: {requireAuth: true, bindStore: true,keepAlive: true}},
        {path: '/shop', name: 'shop', component: Shop, meta: {title: i18n.t('lang.shop_street')}},
        {path: '/shopDetail/:id', name: 'shopDetail', component: ShopDetail, meta: {title: i18n.t('lang.shop_details'), requireAuth: true, bindStore: true}},
        {path: '/ShopGoodsList', name: 'shopGoodsList', component: ShopGoodsList, meta: {title: i18n.t('lang.shop_goods_list_page'), keepAlive:true}},

        {path: '/storeGoods', name: 'storeGoods', component: StoreGoods, meta: {title: i18n.t('lang.store_goods_page')}},

        //user auth
        {path: '/register', name: 'register', component: Register, meta: {title: i18n.t('lang.register_page')}},        
        {path: '/login', name: 'login', component: Login, meta: {title: i18n.t('lang.account_pwd_login')}},
        {path: '/loginMobile', name: 'loginMobile', component: LoginMobile, meta: {title: i18n.t('lang.login_mobile_page')}},
        {path: '/forget', name: 'forget', component: Forget, meta: {title: i18n.t('lang.forget_password')}},
        {path: '/user/reset', name: 'reset', component: Reset, meta: {title: i18n.t('lang.reset_pwd')}},
        {path: '/callback', name: 'callback', component: Callback, meta: {title: i18n.t('lang.authorization_page')}},
        {path: '/user', name: 'user', component: User, meta: {requireAuth: true, title: i18n.t('lang.user_center_page')}},
        // user center
        {path: '/user/account', name: 'account', component: Account, meta: {requireAuth: true, title: i18n.t('lang.account_manage')}},
        {
            path: '/user/account/detail',
            name: 'accountDetail',
            component: AccountDetail,
            meta: {requireAuth: true, title: i18n.t('lang.account_manage_detail_page')}
        },
        {
            path: '/user/account/log',
            name: 'accountLog',
            component: AccountLog, 
            meta: {title: i18n.t('lang.application_record')},
            children: [
                {
                    path: ':id',
                    component: AccountLogDetail
                }
            ]
        },
        {path: '/user/account/deposit', name: 'deposit', component: Deposit, meta: {requireAuth: true, title:i18n.t('lang.recharge')}},
        {path: '/user/account/accountRaply', name: 'accountRaply', component: AccountRaply, meta: {requireAuth: true, title:i18n.t('lang.deposit')}},
        {path: '/user/account/valuecard', name: 'valueCard', component: ValueCard, meta: {requireAuth: true, title:i18n.t('lang.value_card')}},
        {path: '/user/account/addValueCard', name: 'addValueCard', component: AddValueCard, meta: {requireAuth: true, title:i18n.t('lang.bind_value_card')}},
        {
            path: '/user/account/detail/:id',
            name: 'valueCardDetail',
            component: ValueCardDetail,
            meta: {requireAuth: true}
        },
        {path: '/user/account/bonus', name: 'bonus', component: Bonus, meta: {requireAuth: true, title:i18n.t('lang.bonus')}},
        {path: '/user/account/addBonus', name: 'addBonus', component: AddBonus, meta: {requireAuth: true, title:i18n.t('lang.add_bonus')}},
        {path: '/user/account/invForm', name: 'invForm', component: InvForm, meta: {requireAuth: true, title:i18n.t('lang.vat_tax_invoice')}},
        {path: '/user/address', name: 'address', component: Address, meta: {requireAuth: true, title:i18n.t('lang.address')}},
        {path: '/user/addAddress', name: 'addAddressForm', component: AddressForm, meta: {requireAuth: true, title:i18n.t('lang.add_address')}},
        {path: '/user/editAddress/:id', name: 'editAddressForm', component: AddressForm, meta: {requireAuth: true, title:i18n.t('lang.edit_address')}},
        {path: '/user/affiliate', name: 'affiliate', component: Affiliate, meta: {requireAuth: true, title:i18n.t('lang.affiliate')}},
        {path: '/user/refound', name: 'refound', component: Refound, meta: {requireAuth: true, title:i18n.t('lang.return_list')}},
        {path: '/user/refoundDetail', name: 'refoundDetail', component: RefoundDetail, meta: {requireAuth: true, title:i18n.t('lang.return_detail')}},
        {path: '/user/rpplyReturn', name: 'rpplyReturn', component: ApplyReturn, meta: {requireAuth: true, title:i18n.t('lang.return_apply')}},
        {path: '/user/collectionGoods', name: 'collectionGoods', component: CollectionGoods, meta: {requireAuth: true, title:i18n.t('lang.collection_goods')}},
        {path: '/user/collectionShop', name: 'collectionShop', component: CollectionShop, meta: {requireAuth: true, title:i18n.t('lang.collection_shop')}},
        {path: '/user/comment', name: 'comment', component: Comment, meta: {requireAuth: true, title:i18n.t('lang.my_evaluation')}},
        {path: '/user/commentDetail/:id', name: 'commentDetail', component: CommentDetail, meta: {requireAuth: true, title:i18n.t('lang.evaluation_detail')}},
        {path: '/user/profile', name: 'profile', component: Profile, meta: {requireAuth: true, title:i18n.t('lang.profile')}},
        {path: '/user/realname', name: 'realname', component: Realname, meta: {requireAuth: true, title:i18n.t('lang.real_name')}},
        {path: '/user/uploadcard', name: 'uploadcard', component: UploadCard, meta: {requireAuth: true, title:i18n.t('lang.upload_id_card_pic')}},
        {path: '/user/accountsafe', name: 'accountsafe', component: Accountsafe, meta: {requireAuth: true, title:i18n.t('lang.account_security')}},
        {path: '/user/paypwd', name: 'paypwd', component: Paypwd, meta: {requireAuth: true, title:i18n.t('lang.pay_pwd')}},
        {path: '/user/order', name: 'order', component: Order, meta: {requireAuth: true, title:i18n.t('lang.my_order')}},
        {path: '/user/orderDetail/:id', name: 'orderDetail', component: OrderDetail, meta: {requireAuth: true, title:i18n.t('lang.order_detail')}},
        {path: '/user/booking', name: 'booking', component: Booking, meta: {requireAuth: true, title:i18n.t('lang.booking')}},
        {path: '/user/help', name: 'help', component: Help, meta: {requireAuth: true, title:i18n.t('lang.help_center')}},
        {path: '/user/message', name: 'message', component: Message, meta: {requireAuth: true, title:i18n.t('lang.my_message')}},
        {path: '/user/history', name: 'history', component: History, meta: {requireAuth: true, title:i18n.t('lang.browsing_history')}},
        {path: '/user/coupon', name: 'userCoupon', component: UserCoupon, meta: {requireAuth: true, title:i18n.t('lang.my_coupons')}},
        {path: '/user/auction', name: 'userAuction', component: UserAuction, meta: {requireAuth: true, title:i18n.t('lang.my_auction')}},

        {path: '/user/merchants', name: 'merchants', component: Merchants, meta: {requireAuth: true, title:i18n.t('lang.merchants_store')}},
        
        // activity
        {path: '/activity', name: 'activity', component: Activity, meta:{title: i18n.t('lang.activity')}},
        {path: '/activity/detail/:act_id', name: 'activity-detail', component: ActivityDetail, meta:{title: i18n.t('lang.activity_detail')}},

        // auction
        {path: '/auction', name: 'auction', component: Auction, meta:{title: i18n.t('lang.auction')}},
        {path: '/auction/detail/:act_id', name: 'auction-detail', component: AuctionDetail, meta:{title: i18n.t('lang.auction_detail')}},
        {path: '/auction/log/:act_id', name: 'auction-log', component: AuctionLog, meta:{title: i18n.t('lang.auction_log')}},
        // bonus
        {path: '/bonus', name: 'bonusReceive', component: BonusReceive, meta:{title: i18n.t('lang.bonus_receive')}},
        // bargain
        {path: '/bargain', name: 'bargain', component: Bargain, meta:{title: i18n.t('lang.bargain')}},
        {path: '/bargain/detail/:id', name: 'bargain-detail', component: BargainDetail, meta:{title: i18n.t('lang.bargain_detail')}},
        {path: '/bargain/myList', name: 'bargain-mylist', component: BargainMylist, meta:{title: i18n.t('lang.my_bargain')}},
        // coupon
        {path: '/coupon', name: 'coupon', component: Coupon, meta:{title: i18n.t('lang.coupons_receive')}},
        // crowdfunding
        {path: '/crowdfunding', name: 'crowdfunding', component: CrowdFunding, meta:{title: i18n.t('lang.crowdfunding')}},
        {path: '/crowdfunding/detail/:id', name: 'crowdfunding-detail', component: CrowdFundingDetail, meta:{title: i18n.t('lang.crowdfunding_detail')}},
        {path: '/crowdfunding/checkout', name: 'crowdfunding-checkout', component: CrowdFundingCheckout, meta:{title: i18n.t('lang.crowdfunding_checkout')}},
        {path: '/crowdfunding/done', name: 'crowdfunding-done', component: CrowdFundingDone, meta:{title: i18n.t('lang.crowdfunding_done')}},
        {path: '/crowdfunding/order', name: 'crowdfunding-order', component: CrowdFundingOrder, meta:{title: i18n.t('lang.square_order')}},
        {path: '/crowdfunding/orderDetail/:id', name: 'crowdfunding-orderdetail', component: CrowdFundingOrderDetail, meta:{title: i18n.t('lang.crowdfunding_order_detail')}},
        {path: '/crowdfunding/user', name: 'crowdfunding-user', component: CrowdFundingUser, meta:{title: i18n.t('lang.crowdfunding_user')}},
        {path: '/crowdfunding/topic', name: 'crowdfunding-topic', component: CrowdFundingTopic},
        {path: '/crowdfunding/buy', name: 'crowdfunding-buy', component: CrowdFundingBuy},
        {path: '/crowdfunding/focus', name: 'crowdfunding-focus', component: CrowdFundingFocus},
        // drp
        {path: '/drp', name: 'drp', component: Drp, meta:{title: i18n.t('lang.drp')}},
        {path: '/drp/register', name: 'drp-register', component: DrpRegister, meta: {title: i18n.t('lang.vip')}},
        {path: '/drp/finish', name: 'drp-finish', component: DrpFinish},
        {path: '/drp/withdraw', name: 'drp-withdraw', component: DrpWithdraw},
        {path: '/drp/set', name: 'drp-set', component: DrpSet, meta:{title: i18n.t('lang.drp_set')}},
        {path: '/drp/order', name: 'drp-order', component: DrpOrder, meta:{title: i18n.t('lang.drp_order')}},
        {path: '/drp/orderDetail/:order_id', name: 'drp-orderdetail', component: DrpOrderDetail, meta:{title: i18n.t('lang.drp_order_detail')}},
        {path: '/drp/card', name: 'drp-card', component: DrpCard, meta:{title: i18n.t('lang.drp_qrcode')}},
        {path: '/drp/new', name: 'drp-new', component: DrpNew},
        {path: '/drp/shop', name: 'drp-shop', component: DrpShop, meta:{title: i18n.t('lang.drp_shop')}},
        {path: '/drp/category', name: 'drp-category', component: DrpCategory, meta:{title: i18n.t('lang.drp_category')}},
        {path: '/drp/rank', name: 'drp-rank', component: DrpRank, meta:{title:i18n.t('lang.drp_rank')}},
        {path: '/drp/team/:user_id', name: 'drp-team', component: DrpTeam, meta:{title: i18n.t('lang.drp_team')}},
        {path: '/drp/teamDetail/:user_id', name: 'drp-teamdetail', component: DrpTeamDetail, meta:{title: i18n.t('lang.drp_team_detail')}},
        {path: '/drp/drplog', name: 'drp-drplog', component: DrpDrplog, meta:{title: i18n.t('lang.drp_commission')}},
        {path: '/drp/drpgoods', name: 'drp-drpgoods', component: DrpDrpgoods, meta:{title: i18n.t('lang.drp_goods')}},
        {path: '/drp/drplist/:id', name: 'drp-drplist', component: Drplist, meta:{title: i18n.t('lang.drp_list')}},
        {path: '/drp/drpPurchase', name: 'drp-purchase', component: DrpPurchase, meta: {title: i18n.t('lang.vip_title_pay'), requireAuth: true}},
        {path: '/drp/drpDone', name: 'drp-done', component: DrpDone, meta:{title: i18n.t('lang.drp_done')}},
        {path: '/drp/drpinfo', name: 'drp-info', component: DrpInfo, meta:{title: i18n.t('lang.high_grade_vip')}},
        {path: '/drp/protection', name: 'drp-protection', component: DrpProtection, meta:{title: i18n.t('lang.equity_detail')}},
        {path: '/drp/apply', name: 'drp-apply', component: DrpApply, meta:{title: i18n.t('lang.equity_apply')}},
        
        // exchange
        {path: '/exchange', name: 'exchange', component: Exchange, meta:{title: i18n.t('lang.exchange')}},
        {path: '/exchange/detail/:id', name: 'exchange-detail', component: ExchangeDetail, meta:{title: i18n.t('lang.exchange_detail')}},
        // groupbuy
        {path: '/groupbuy', name: 'groupbuy', component: GroupBuy, meta:{title: i18n.t('lang.group_buy')}},
        {path: '/groupbuy/detail/:group_buy_id', name: 'groupbuy-detail', component: GroupBuyDetail, meta:{title: i18n.t('lang.group_buy_detail')}},
        // package
        {path: '/package', name: 'package', component: Package, meta:{title: i18n.t('lang.package_box')}},
        // presale
        {path: '/presale', name: 'presale', component: Presale, meta:{title: i18n.t('lang.presale')}},
        {path: '/presale/detail/:act_id', name: 'presale-detail', component: PresaleDetail, meta:{title: i18n.t('lang.presale_detail')}},
        {path: '/presale/list/:cat_id', name: 'presale-list', component: PresaleList, meta:{title: i18n.t('lang.presale_list')}},
        // seckill
        {path: '/seckill', name: 'seckill', component: Seckill, meta:{title: i18n.t('lang.seckill')}},
        {path: '/seckill/detail', name: 'seckill-detail', component: SeckillDetail, meta:{title: i18n.t('lang.seckill_detail')}},
        // team
        {path: '/team', name: 'team', component: Team, meta:{title: i18n.t('lang.team')}},
        {path: '/team/list/:id', name: 'team-list', component: TeamList, meta:{title: i18n.t('lang.team_list')}},
        {path: '/team/rank', name: 'team-rank', component: TeamRank, meta:{title: i18n.t('lang.team_rank')}},
        {path: '/team/detail/', name: 'team-detail', component: TeamDetail, meta:{title: i18n.t('lang.team_detail')}},
        {path: '/team/order', name: 'team-order', component: TeamOrder, meta:{title: i18n.t('lang.team_order')}},
        {path: '/team/wait', name: 'team-wait', component: TeamWait, meta:{title: i18n.t('lang.team_schedule')}},
        {path: '/team/user', name: 'team-user', component: TeamUser, meta:{title: i18n.t('lang.team_user')}},
        // topic
        {path: '/topic', name: 'topic', component: Topic, meta:{title: i18n.t('lang.topic')}},
        {path: '/topicHome/:id', name: 'topicHome', component: TopicDetail, meta:{title: i18n.t('lang.topic_detail')}},
        // supplier
        {path: '/supplier', name: 'supplier', component: Supplier,meta: {requireAuth: true,supplierAuth: true,title: i18n.t('lang.suppliers')}},
        {path: '/supplier/search', name: 'supplier-search', component: SupplierSearch,meta: {requireAuth: true,supplierAuth: true,title: i18n.t('lang.supplier_search')}},
        {path: '/supplier/detail/:id', name: 'supplier-detail', component: SupplierDetail,meta: {requireAuth: true,supplierAuth: true,title: i18n.t('lang.supplier_detail')}},
        {path: '/supplier/list', name: 'supplier-list', component: SupplierList,meta: {requireAuth: true,supplierAuth: true,title: i18n.t('lang.supplier_list')}},
        {path: '/supplier/cart', name: 'supplier-cart', component: SupplierCart,meta: {requireAuth: true,supplierAuth: true,title: i18n.t('lang.supplier_cart')}},
        {path: '/supplier/checkout', name: 'supplier-checkout', component: SupplierCheckout,meta: {requireAuth: true,supplierAuth: true,title: i18n.t('lang.supplier_checkout')}},
        {path: '/supplier/done', name: 'supplier-done', component: SupplierDone,meta: {requireAuth: true,supplierAuth: true,title: i18n.t('lang.supplier_done')}},
        {path: '/supplier/buy', name: 'supplier-buy', component: SupplierBuy,meta: {requireAuth: true,supplierAuth: true,title: i18n.t('lang.supplier_buy')}},
        {path: '/supplier/buyinfo', name: 'supplier-buyinfo', component: SupplierBuyinfo,meta: {requireAuth: true,supplierAuth: true}},
        {path: '/supplier/orderlist', name: 'supplier-orderlist', component: SupplierOrderList,meta: {requireAuth: true,supplierAuth: true,title: i18n.t('lang.supplier_order_list')}},
        {path: '/supplier/applyreturn', name: 'supplier-applyreturn', component: SupplierApplyReturn,meta: {requireAuth: true,supplierAuth: true,title: i18n.t('lang.supplier_applyreturn')}},
        {path: '/supplier/returndetail', name: 'supplier-returndetail', component: SupplierReturnDetail,meta: {requireAuth: true,supplierAuth: true,title:i18n.t('lang.supplier_applyreturn_detail')}},
        {path: '/supplier/returnindex', name: 'supplier-returnindex', component: SupplierReturnIndex,meta: {requireAuth: true,supplierAuth: true,title: i18n.t('lang.supplier_applyreturn')}},
        {path: '/supplier/suppliershop/:id', name: 'supplier-shop', component: SupplierShop,meta: {requireAuth: true,supplierAuth: true,title: i18n.t('lang.supplier_shop')}},
        {path: '/supplier/apply', name: 'supplier-apply', component: SupplierApply,meta: {requireAuth: true,title: i18n.t('lang.supplier_apply')}},
        // giftCard
        {path: '/giftCard', name: 'giftCard', component: GiftCard,meta: {title: i18n.t('lang.my_gift_card'), requireAuth: true}},
        {path: '/giftCardResult', name: 'giftCardResult', component: GiftCardResult,meta: {title: i18n.t('lang.gift_card_list_page'), requireAuth: true}},
        {path: '/giftCardAddress/:id', name: 'giftCardAddress', component: GiftCardAddress,meta: {title: i18n.t('lang.gift_card_th_page'), requireAuth: true}},
        {path: '/giftCardOrder', name: 'giftCardOrder', component: GiftCardOrder,meta: {title: i18n.t('lang.my_th_page'), requireAuth: true}},
        {path: '/search', name: 'search', component: Search,meta:{title: i18n.t('lang.search')}},

        // 视频列表
        {path: '/videoList', name: 'videoList', component: VideoList,meta:{title: i18n.t('lang.video_list')}},
        {path: '/searchList', name: 'searchList', component: SearchList,meta:{requireAuth: true,title: i18n.t('lang.search_list')}},

        {path: '/qrpay', name: 'qrpay', component: Qrpay,meta:{title: i18n.t('lang.qrpay')}},
        {path: '/WebView', name: 'webView', component: WebView},
        {path: '*', redirect: '/'}

        //Custom 二次开发路由
    ],
    scrollBehavior(to, from, savedPosition) {
        if(savedPosition){
			//二开
			 // if (to.name=="shopHome")
			 // localStorage.setItem('sx',0)
			//二开结束
            return savedPosition
        }else{
            if(from.meta.keepAlive){
				
				console.log("滚动位置1")
                from.meta.savedPosition = document.body.scrollTop
            }

            return { 
                x: 0,
                y: to.meta.savedPosition || 0 
            }
        }
    }
})

//全局前置守卫
router.beforeEach(async(route, redirect, next) => {
	
    //统计代码 百度
    if(typeof _hmt !== 'undefined'){
        if(route.path){
            // eslint-disable-next-line no-undef
            _hmt.push(['_trackPageview'], `${window.ROOT_URL}mobile/#` + route.fullPath);
        }
    }
    
    //获取本地存储的token
    store.state.token = localStorage.getItem('token')

    //路由跳转如果headers token为空添加token
    axios.defaults.headers.common['token'] = localStorage.getItem('token')
    //获取本地parent_id
    if(route.query.parent_id){
        localStorage.setItem('parent_id',route.query.parent_id)
    }

    window.ecjiahash = route.query.ecjiahash ? route.query.ecjiahash : ''

    if(window.ecjiahash){
        store.dispatch('userLogout')

        const roles = await store.dispatch('userRegister',{ ecjiahash:route.query.ecjiahash })
        
        if(roles.status == 'success'){
            localStorage.setItem('token', roles.data)
            store.state.token = roles.data
            axios.defaults.headers.common['token'] = roles.data
        }
    }

    // 后续开发预留
    // await uni.getEnv(function(res){
    //     console.log(JSON.stringify(res))
    //     if(res.plus || res.miniprogram){
    //         uni.redirectTo({  
    //             url:'../../pages/goodsDetail/goodsDetail?id=' + that.goods_id
    //         })
    //     }
    // })
    
    if(route.meta.requireAuth){ // 判断该路由是否需要登录权限
        if(store.state.token !== null){ //判断是否登录,已登录
            //供应链权限验证
            if(route.meta.supplierAuth){
                store.dispatch('setSupplier').then(res=>{
                    if(res.status == 'success'){
                        store.state.supplierLoading = !res.data;
                    }
                })
            }
            
			
			
			
            // 店铺绑定
            let bindRuId = localStorage.getItem('bind_ru_id')
		
            if (!bindRuId) {
                await store.dispatch('userProfile', true).then((res) => {
                    localStorage.setItem('bind_ru_id', res.data.bind_ru_id)
                    bindRuId = localStorage.getItem('bind_ru_id')
                })
            }
            if (bindRuId > 0 && route.meta.bindStore) {
			    
                if (route.name === 'shopHome' && route.params.id !== bindRuId) {
                    next({
                        path: `/shopHome/${bindRuId}`
                    });
                } else if (route.name === 'shopGoodsList' && route.query.ru_id !== bindRuId) {
                    next({
                        path: `/shopGoodsList/${bindRuId}`
                    });
                } else {
						
                    next()
                }
            } else {
                const needRedirectRoute = [
                    'home',
                    'catalog',
                    'list'
                ]
                
                if (bindRuId > 0) {
				
                    switch (route.name) {
                        case 'home':
							
                            if (redirect.name !== 'shopHome') {
                                 next({
                                    path: `/shopHome/${bindRuId}`
                                })
                            }
                            break
                            
                        case 'catalog':
                            if (redirect.name !== 'shopGoodsList') {
                                 next({
                                    path: `/ShopGoodsList?ru_id=${bindRuId}`
                                });
                            }
                            break
                            
                        default:
                            next()
                            break
                    }
                } else {
                    next()
                }
            }

            //校验登录是否失效
            // if(redirect.query.parent_id != parent_id){
            //     parent_id = redirect.query.parent_id
            // }

            // if((route.query.parent_id != parent_id) && parent_id != null){ //判断是否有parent_id 推荐人id
            //     let query = route.query
            //     query.parent_id = parent_id
            //     next({
            //         path: route.path,
            //         query: query
            //     })
            // }else{
                // next()
            //}
        }else{
            next({
                path: '/login',
                query: { redirect: route.fullPath }
            })
        }
    }else{ //不要求登录页面路由
        // if(store.state.token == null){ //未登录
        //     if(route.query.parent_id){  
        //         //如果parent_id不存在值，直接在路由上添加parent_id把存储到localStorage
        //         localStorage.setItem('parent_id',route.query.parent_id)
        //         parent_id = localStorage.getItem('parent_id')
        //     }
        // }

        // if((route.query.parent_id != parent_id) && parent_id != null){ //判断是否有parent_id 推荐人id
        //     let query = route.query
        //     query.parent_id = parent_id
        //     next({
        //         path: route.path,
        //         query: query
        //     })
        // }else{
            next()
        //}
    }

    /* 路由发生变化修改页面title */
    if(route.query.title){
         document.title = route.query.title
    }else{
        if(route.meta.title){
            document.title = route.meta.title ? route.meta.title : window.pageTitle
        }
    }
})

//全局后置钩子
router.afterEach((route,from) => {
    let u = navigator.userAgent.toLowerCase();
    let url = location.origin + '/mobile/#' + route.fullPath;
    let configUrl = window.location.href.split('#')[0];
    let configData = JSON.parse(sessionStorage.getItem('configData'));//获取后台配置
    let userRegion = JSON.parse(localStorage.getItem('userRegion'));//获取定位地址
    
    //全局微信分享
    wxShare.initConfig(configUrl)
    
    //获取定位地址
    if(!userRegion){
        navigator.geolocation.getCurrentPosition(async function(postion){
            //谷歌定位到
            let lat = postion.coords.latitude;
            let lng = postion.coords.longitude;
            let position = await store.dispatch('setPosition',{
                lat:lat,
                lng:lng
            });
            curPosition(postion,lat,lng)
        },async function(err){
            console.log(err)
            let lat = 31.23037;
            let lng = 121.4737;
            let position = await store.dispatch('setPosition',{
                lat:lat,
                lng:lng
            });

            //谷歌定位不到默认定位到上海
            curPosition(position,lat,lng)
        })
    }

    //获取shopConfig后台配置
    if(!configData){
        axios.get(`${window.ROOT_URL}api/v4/shop/config`).then(({data:{data}})=>{
            wxShare.share({
                title:route.meta.title || data.shop_title,
                desc:route.meta.desc || data.shop_desc,
                link:url,
                imgUrl:route.meta.imgUrl || data.wap_logo
            })
            
            sessionStorage.setItem('configData',JSON.stringify(data));
        })
    }else{
        wxShare.share({
            title:route.meta.title || configData.shop_title,
            desc:route.meta.desc || configData.shop_desc,
            link:url,
            imgUrl:route.meta.imgUrl || configData.wap_logo
        })
    }
    
    // if(u.match(/MicroMessenger/i) == 'micromessenger'){
    //     if(route.path !== location.pathname){
    //         location.replace(url)
    //     }
    // }

    if(route.path !== '/'){
        document.body.scrollTop = 0
    }else{
        Vue.nextTick(() => {
            document.body.scrollTop = 0
        })
    }
})

function curPosition(position,lat,lng){
    let data = position.data

    let itemsBak = {
        province:{ id:data.province_id,name:data.province },
        city:{ id:data.city_id,name:data.city },
        district:{ id:data.district_id, name:data.district},
        postion:{ lat:lat,lng:lng }
    }

    //设置本地地区存储
    localStorage.setItem('userRegion',JSON.stringify(itemsBak))

    store.state.userRegion = itemsBak
}

export default router
