import {
  ADD_GEO,
  INVALIDATE_CATEGORIES,
  REQUEST_CATEGORIES,
  RECEIVE_CATEGORIES,
  SET_HEADTITLE,
  SET_FOODTITL,
  CHOOSE_TYPE,
  SELECTCATEGORYNAME,
  SET_SORTTYPE,
  CLEAR_ALL,
  RECEIVE_DELIVERY,
  RECEIVE_ACTIVITY,
  SELECT_DELIVERY_MODE,
  SELECT_SUPPORT_IDS,
  INIT_SUPPORT_IDS,
  CHOOSE_CATEGORY_IDS,
  CHOOSE_SORT_TYPE,
  CHANGE_CONFIRM_STATUS,
  INIT_SHOP_PAGE,
  CHANGE_SHOW_TYPE,
  CHOOSE_MENU,
  INIT_CATEGORY_NUM,
  ADD_TO_CART,
  CLEAR_SHOP,
  REDUCE_CART,
  TOGGLE_CART_LIST,
  CLEAR_CART,
  RECEIVE_REST_LIST
} from "./actions";
import { combineReducers } from "redux";
import {getStore, setStore} from '../config/mUtils'

function initialGeo(type) {
  const geo = JSON.parse(getStore('geo'))
  if(geo) {
    return geo[type]
  }else {
    return ''
  }
}
function initialCart() {
  const cart = JSON.parse(getStore('cartList'))
  if(cart) {
    return cart
  }else {
    return {}
  }
}
const shared = (state = {
  cartList: initialCart(),
  geoHash: initialGeo('geoHash'),
  latitude: initialGeo('latitude'),
  longitude: initialGeo('longitude')
}, action) => {
  switch (action.type) {
    case "ADD_GEO":
      setStore('geo', {geoHash: action.geoHash, latitude: action.latitude, longitude: action.longitude})
      return Object.assign({}, state, {
        geoHash: action.geoHash,
        latitude: action.latitude,
        longitude: action.longitude
      })
    case ADD_TO_CART:
      const newCart1 =  Object.assign({}, state, {
        cartList: getNewCartList(state, action)
      })
      setStore('cartList', newCart1['cartList'])
      return newCart1
    case REDUCE_CART:
      const newCart2 = Object.assign({}, state, {
        cartList: reduceCart(state, action)
      })
      setStore('cartList', newCart2['cartList'])
      return newCart2
   
    case CLEAR_CART:
      const newCart3 = Object.assign({}, state, {
        cartList: clearCart(state, action)
      })
      setStore('cartList', newCart3['cartList']);
      return newCart3
    default:
      return state;
  }
};

function foodPage(
  state = {
    isFetching: false,
    didInvalidate: false,
    categories: [],
    headTitle: "", // msiet页面头部标题
    foodTitle: "",
    sortBy: "",
    sortByType: null,
    categoryDetail: [],
    restaurant_category_id: "",
    restaurant_category_ids: "",
    delivery: [], // 配送方式数据
    activity: [], // 商家支持活动数据
    delivery_mode: null, // 选中的配送方式
    support_ids: [], // 选中的商铺活动列表
    filterNum: 0, // 所选中的所有样式的集合
    confirmStatus: false
  },
  action
) {
  switch (action.type) {
    case INVALIDATE_CATEGORIES:
      return Object.assign({}, state, {
        didInvalidate: true
      });
    case REQUEST_CATEGORIES:
      return Object.assign({}, state, {
        isFetching: true,
        didInvalidate: false
      });
    case RECEIVE_CATEGORIES:
      return Object.assign({}, state, {
        isFetching: false,
        didInvalidate: false,
        categories: action.categories
      });
    case SET_HEADTITLE:
      return Object.assign({}, state, {
        headTitle: action.title,
        foodTitle: action.title
      });
    case SET_SORTTYPE:
      return Object.assign({}, state, {
        sortByType: action.sortType
      });
    case CHOOSE_TYPE:
      if (state.sortBy !== action.sortBy) {
        let nState = Object.assign({}, state, {
          sortBy: action.sortBy
        });
        if (action.sortBy == "food") {
          nState.foodTitle = "分类";
        } else {
          nState.foodTitle = nState.headTitle;
        }
        return nState;
      } else {
        let nState = Object.assign({}, state, {
          sortBy: ""
        });
        if (action.sortBy === "food") {
          nState.foodTitle = nState.headTitle;
        }
        return nState;
      }
    case SELECTCATEGORYNAME:
      let nState = Object.assign({}, state);
      if (action.index === 0) {
        nState.restaurant_category_ids = null;
        nState.sortBy = "";
      } else {
        nState.restaurant_category_id = action.id;
        nState.categoryDetail = state.categories[action.index].sub_categories;
      }
      return nState;
    case SELECT_DELIVERY_MODE:
      let nState2 = Object.assign({}, state);
      if (state.delivery_mode == null) {
        nState2.filterNum++;
        nState2.delivery_mode = action.id;
        //delivery_mode为当前已有值时，清空所选项，并且filterNum减一
      } else if (state.delivery_mode == action.id) {
        nState2.filterNum--;
        nState2.delivery_mode = null;
        //delivery_mode已有值且不等于当前选择值，则赋值delivery_mode为当前所选id
      } else {
        nState2.delivery_mode = action.id;
      }
      return nState2;
    case INIT_SUPPORT_IDS:
      return Object.assign({}, state, {
        support_ids: action.ids
      });
    case SELECT_SUPPORT_IDS:
      let nState3 = Object.assign({}, state);
      //数组替换新的值
      nState3.support_ids.splice(action.index, 1, {
        status: !state.support_ids[action.index].status,
        id: action.id
      });
      //重新计算filterNum的个数
      nState3.filterNum = state.delivery_mode == null ? 0 : 1;
      nState3.support_ids.forEach(item => {
        if (item.status) {
          nState3.filterNum++;
        }
      });
      return nState3;
    case RECEIVE_DELIVERY:
      return Object.assign({}, state, {
        delivery: action.delivery
      });
    case CHOOSE_CATEGORY_IDS:
      return Object.assign({}, state, {
        restaurant_category_ids: action.id,
        sortBy: '',
        foodTitle : action.name,
        headTitle: action.name
      })
    case CHOOSE_SORT_TYPE:
      return Object.assign({}, state, {
        sortByType: action.sortType,
        sortBy: ''
      })
    case CHANGE_CONFIRM_STATUS:
      return Object.assign({}, state, {
        confirmStatus: !state.confirmStatus,
        sortBy: ''
      })
    case RECEIVE_ACTIVITY:
      return Object.assign({}, state, {
        activity: action.activity
      });
    case CLEAR_ALL:
      return Object.assign({}, state, {
        delivery_mode: null,
        support_ids: state.support_ids.map(item => {
          item.status = false;
          return item;
        }),
        filterNum: 0
      });
    default:
      return state;
  }
}


function shopPage(
  state= {
    shopId: null, //商店id值
    showLoading: true, //显示加载动画
    changeShowType: 'food',//切换显示商品或者评价
    shopDetailData: null, //商铺详情
    showActivities: false, //是否显示活动详情
    menuList: [], //食品列表
    menuIndex: 0, //已选菜单索引值，默认为0
    menuIndexChange: true,//解决选中index时，scroll监听事件重复判断设置index的bug
    shopListTop: [], //商品列表的高度集合
    TitleDetailIndex: null, //点击展示列表头部详情
    categoryNum: [], //商品类型右上角已加入购物车的数量
    totalPrice: 0, //总共价格
    cartFoodList: [], //购物车商品列表
    showCartList: false,//显示购物车列表
    receiveInCart: false, //购物车组件下落的圆点是否到达目标位置
    ratingList: null, //评价列表
    ratingOffset: 0, //评价获取数据offset值
    ratingScoresData: null, //评价总体分数
    ratingTagsList: null, //评价分类列表
    ratingTageIndex: 0, //评价分类索引
    preventRepeatRequest: false,// 防止多次触发数据请求
    ratingTagName: '',//评论的类型
    loadRatings: false, //加载更多评论是显示加载组件
    foodScroll: null,  //食品列表scroll
    showSpecs: false,//控制显示食品规格
    specsIndex: 0, //当前选中的规格索引值
    choosedFoods: null, //当前选中视频数据
    showDeleteTip: false, //多规格商品点击减按钮，弹出提示框
    showMoveDot: [], //控制下落的小圆点显示隐藏
    windowHeight: null, //屏幕的高度
    elLeft: 0, //当前点击加按钮在网页中的绝对top值
    elBottom: 0, //当前点击加按钮在网页中的绝对left值
    ratingScroll: null, //评论页Scroll
    wrapperMenu: null
  },
  action
) {
  switch(action.type) {
    case INIT_SHOP_PAGE:
      return Object.assign({}, state, {
        shopDetailData: action.shopDetailData,
        menuList: action.menuList,
        ratingList: action.ratingList,
        ratingScoresData: action.ratingScoresData,
        ratingTagsList: action.ratingTagsList,
        shopId: action.shopId,
        showLoading: false
      })
    case CLEAR_SHOP:
      return Object.assign({}, state, {
        shopDetailData: null,
        menuList: [],
        ratingList: null,
        ratingScoresData: null,
        ratingTagsList: null,
        shopId: null,
        showLoading: true,
        changeShowType: 'food',
        menuIndex: 0
      })
    case CHANGE_SHOW_TYPE:
      return Object.assign({}, state, {
        changeShowType: action.showType
      })
    case CHOOSE_MENU:
      return Object.assign({}, state, {
        menuIndex: action.index
      })
    case INIT_CATEGORY_NUM:
      return Object.assign({}, state, {
        cartFoodNum: action.cartFoodNum,
        totalPrice: action.totalPrice,
        cartFoodList: action.cartFoodList,
        categoryNum: action.categoryNum
      })
    case TOGGLE_CART_LIST: 
      return Object.assign({}, state, {
        showCartList: state.cartFoodList.length ? !state.showCartList : true
      })

   
    default:
      return state
  }

}

function searchPage(state= {
  restaurantList: []
}, action) {
  switch(action.type) {
    case RECEIVE_REST_LIST:
      return Object.assign({}, state, {
        restaurantList: action.list,
        emptyResult: action.list.length? false: true
      })
    default:
      return state
  }
}

function getNewCartList(state, action) {
    let cart = state.cartList;
		let shop = cart[action.shopId] = (cart[action.shopId] || {});
		let category = shop[action.categoryId] = (shop[action.categoryId] || {});
		let item = category[action.itemId] = (category[action.itemId] || {});
		if (item[action.foodId]) {
			item[action.foodId]['num']++;
		} else {
			item[action.foodId] = {
					"num" : 1,
					"id" : action.foodId,
					"name" : action.name,
					"price" : action.price,
					"specs" : action.specs,
					"packing_fee" : action.packingFee,
					"sku_id" : action.skuId,
					"stock" : action.stock
			};
		}
		return  {...cart}

}

function reduceCart(state, action) {
  let cart = state.cartList;
		let shop = (cart[action.shopId] || {});
		let category = (shop[action.categoryId] || {});
		let item = (category[action.itemId] || {});
		if (item && item[action.foodId]) {
			if (item[action.foodId]['num'] > 0) {
				item[action.foodId]['num']--;
		
			} else {
				//商品数量为0，则清空当前商品的信息
				item[action.food_id] = null;
			}
		}
    return {...cart}
}

function clearCart(state, action) {
  state.cartList[action.id] = null;
		return {...state.cartList};
		
}
const rootReducer = combineReducers({
  shared,
  foodPage,
  shopPage,
  searchPage
});

export default rootReducer;
