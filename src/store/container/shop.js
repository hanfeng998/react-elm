import { connect } from "react-redux";
import { addGeo } from "../actions";
import Shop from "../../pages/shop/shop";

const mapStateToProps = state => {
  const { shared, shopPage } = state;
  return {
    cartList: shared.cartList,
    geohash: shared.geoHash, //geohash位置信息
    longitude: shared.longitude,
    latitude: shared.latitude,
    shopId: shopPage.shopId, //商店id值
    showLoading: shopPage.showLoading, //显示加载动画
    changeShowType: shopPage.changeShowType,//切换显示商品或者评价
    shopDetailData: shopPage.shopDetailData, //商铺详情
    showActivities: shopPage.showActivities, //是否显示活动详情
    menuList: shopPage.menuList, //食品列表
    menuIndex: shopPage.menuIndex, //已选菜单索引值，默认为0
    menuIndexChange: shopPage.menuIndexChange,//解决选中index时，scroll监听事件重复判断设置index的bug
    shopListTop: shopPage.shopListTop, //商品列表的高度集合
    TitleDetailIndex: shopPage.TitleDetailIndex, //点击展示列表头部详情
    categoryNum: shopPage.categoryNum, //商品类型右上角已加入购物车的数量
    totalPrice: shopPage.totalPrice, //总共价格
    cartFoodNum: shopPage.cartFoodNum,
    cartFoodList: shopPage.cartFoodList, //购物车商品列表
    showCartList: shopPage.showCartList,//显示购物车列表
    receiveInCart: shopPage.receiveInCart, //购物车组件下落的圆点是否到达目标位置
    ratingList: shopPage.ratingList, //评价列表
    ratingOffset: shopPage.ratingOffset, //评价获取数据offset值
    ratingScoresData: shopPage.ratingScoresData, //评价总体分数
    ratingTagsList: shopPage.ratingTagsList, //评价分类列表
    ratingTageIndex: shopPage.ratingTageIndex, //评价分类索引
    preventRepeatRequest: shopPage.preventRepeatRequest,// 防止多次触发数据请求
    ratingTagName: shopPage.ratingTagName,//评论的类型
    loadRatings: shopPage.loadRatings, //加载更多评论是显示加载组件
    foodScroll: shopPage.foodScroll,  //食品列表scroll
    showSpecs: shopPage.showSpecs,//控制显示食品规格
    specsIndex: shopPage.specsIndex, //当前选中的规格索引值
    choosedFoods: shopPage.choosedFoods, //当前选中视频数据
    showDeleteTip: shopPage.showDeleteTip, //多规格商品点击减按钮，弹出提示框
    showMoveDot: shopPage.showMoveDot, //控制下落的小圆点显示隐藏
    windowHeight: shopPage.windowHeight, //屏幕的高度
    elLeft: shopPage.elLeft, //当前点击加按钮在网页中的绝对top值
    elBottom: shopPage.elBottom, //当前点击加按钮在网页中的绝对left值
    ratingScroll: shopPage.ratingScroll, //评论页Scroll
    wrapperMenu: shopPage.wrapperMenu,
  };
};

const ShopContainer = connect(mapStateToProps)(Shop);

export default ShopContainer;
