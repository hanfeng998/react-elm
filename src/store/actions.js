import {
  msiteAdress,
  foodCategory,
  foodDelivery,
  foodActivity,
  shopDetails,
  foodMenu,
  getRatingList,
  ratingScores,
  ratingTags,
  searchRestaurant
} from ".././services/getData";

export const ADD_GEO = "ADD_GEO";
export const INVALIDATE_CATEGORIES = "INVALIDATE_SUBREDDIT";
export const REQUEST_CATEGORIES = "REQUEST_CATEGORIES";
export const RECEIVE_CATEGORIES = "RECEIVE_CATEGORIES";
export const SET_HEADTITLE = "SET_HEADTITLE";
export const SET_FOODTITLE = "SET_FOODTITLE";
export const CHOOSE_TYPE = "CHOOSE_TYPE";
export const SELECTCATEGORYNAME = "SELECTCATEGORYNAME";
export const SET_SORTTYPE = "SET_SORTTYPE";
export const RECEIVE_DELIVERY = "RECEIVE_DELIVERY";
export const RECEIVE_ACTIVITY = "RECEIVE_ACTIVITY";
export const SELECT_DELIVERY_MODE = "SELECT_DELIVERY_MODE";
export const SELECT_SUPPORT_IDS = "SELECT_SUPPORT_IDS";
export const INIT_SUPPORT_IDS = "INIT_SUPPORT_IDS";
export const CLEAR_ALL = "CLEAR_ALL";
export const CHOOSE_CATEGORY_IDS = "CHOOSE_CATEGORY_IDS";
export const CHOOSE_SORT_TYPE = "CHOOSE_SORT_TYPE";
export const CHANGE_CONFIRM_STATUS = "CHANGE_CONFIRM_STATUS";
export const INIT_SHOP_PAGE = "INIT_SHOP_PAGE";
export const CHANGE_SHOW_TYPE = "CHANGE_SHOW_TYPE";
export const CHOOSE_MENU = "CHOOSE_MENU";
export const INIT_CATEGORY_NUM = "INIT_CATEGORY_NUM";
export const ADD_TO_CART = "ADD_TO_CART";
export const CLEAR_SHOP = "CLEAR_SHOP";
export const REDUCE_CART = "REDUCE_CART";
export const TOGGLE_CART_LIST = "TOGGLE_CART_LIST";
export const CLEAR_CART = "CLEAR_CART";
export const RECEIVE_REST_LIST = "RECEIVE_REST_LIST";

/*
 * action creators
 */

export function addGeo(siteInfo) {
  return {
    type: ADD_GEO,
    geoHash: siteInfo.geohash,
    latitude: siteInfo.latitude,
    longitude: siteInfo.longitude
  };
}

export function setHeadTitle(title) {
  return {
    type: SET_HEADTITLE,
    title: title
  };
}

export function chooseType(type) {
  return {
    type: CHOOSE_TYPE,
    sortBy: type
  };
}

export function setSortType(type) {
  return {
    type: SET_SORTTYPE,
    sortType: type
  };
}

export function selectCategoryName(id, index) {
  return {
    type: SELECTCATEGORYNAME,
    id: id,
    index: index
  };
}
export function selectDeliveryMode(id) {
  return {
    type: SELECT_DELIVERY_MODE,
    id: id
  };
}

export function selectSupportsId(index, id) {
  return {
    type: SELECT_SUPPORT_IDS,
    id: id,
    index: index
  };
}

export function initSupportIds(ids) {
  return {
    type: INIT_SUPPORT_IDS,
    ids: ids
  };
}

function requestCategories() {
  return {
    type: REQUEST_CATEGORIES
  };
}

function receiveCategories(json) {
  return {
    type: RECEIVE_CATEGORIES,
    categories: json
  };
}
function receiveDelivery(json) {
  return {
    type: RECEIVE_DELIVERY,
    delivery: json
  };
}
function receiveActivity(json) {
  return {
    type: RECEIVE_ACTIVITY,
    activity: json
  };
}
export function fetchCategories(latitude, longitude) {
  // Thunk middleware knows how to handle functions.
  // It passes the dispatch method as an argument to the function,
  // thus making it able to dispatch actions itself.

  return function(dispatch) {
    // First dispatch: the app state is updated to inform
    // that the API call is starting.

    dispatch(requestCategories());

    // The function called by the thunk middleware can return a value,
    // that is passed on as the return value of the dispatch method.

    // In this case, we return a promise to wait for.
    // This is not required by thunk middleware, but it is convenient for us.

    return foodCategory(latitude, longitude).then(json =>
    // We can dispatch many times!
    // Here, we update the app state with the results of the API call.
      dispatch(receiveCategories(json)));
    // In a real world app, you also want to
    // catch any error in the network call.
  };
}

export function fetchDelivery(latitude, longitude) {
  return function(dispatch) {
    return foodDelivery(latitude, longitude).then(json =>
      dispatch(receiveDelivery(json)));
  };
}
export function fetchActivity(latitude, longitude) {
  return function(dispatch) {
    return foodActivity(latitude, longitude).then(json => {
      const ids = [];
      json.forEach((item, index) => {
        ids[index] = { status: false, id: item.id };
      });
      dispatch(initSupportIds(ids));
      dispatch(receiveActivity(json));
    });
  };
}

export function clearAll() {
  return {
    type: CLEAR_ALL
  };
}

export function chooseCategoryIds(id, name) {
  return {
    type: CHOOSE_CATEGORY_IDS,
    id: id,
    name: name
  }
}

export function chooseSortType(type) {
  return {
    type: CHOOSE_SORT_TYPE,
    sortType: type
  }
}

export function changeConfirmStatus() {
  return {
    type: CHANGE_CONFIRM_STATUS
  }
}

export function initShopPage(latitude, longitude,shopId, ratingOffset) {
  return async function(dispatch) {
    const shopDetailData = await shopDetails(shopId, latitude, longitude);
                //获取商铺食品列表
    const menuList = await foodMenu(shopId);
    //评论列表
    const ratingList = await getRatingList(ratingOffset);
    //商铺评论详情
    const ratingScoresData = await ratingScores(shopId);
    //评论Tag列表
    const ratingTagsList = await ratingTags(shopId);

    dispatch({
      type: INIT_SHOP_PAGE,
      shopDetailData: shopDetailData,
      menuList: menuList,
      ratingList: ratingList,
      ratingScoresData: ratingScoresData,
      ratingTagsList: ratingTagsList,
      shopId: shopId
    })
  }

}

export function changeShowType(type) {
  return {
    type: CHANGE_SHOW_TYPE,
    showType: type
  }
}

export function chooseMenu(index) {
  return {
    type: CHOOSE_MENU,
    index: index
  }
}

export function initCategoryNum(cartFoodNum, totalPrice, cartFoodList, categoryNum) {
  return {
    type: INIT_CATEGORY_NUM,
    cartFoodNum: cartFoodNum,
    totalPrice: totalPrice,
    cartFoodList: cartFoodList,
    categoryNum: categoryNum
  }
}

export function addToCart(shopId,category_id, item_id, food_id, name, price, specs, packing_fee, sku_id, stock) {
    return {
      type: ADD_TO_CART,
      shopId: shopId,
      categoryId: category_id,
      itemId: item_id,
      foodId: food_id,
      name: name,
      price: price,
      specs: specs,
      packingFee: packing_fee,
      skuId: sku_id,
      stock: stock
    }
}
export function reduceCart(food) {
    return {
      type: REDUCE_CART,
      shopId: food.shopId,
      categoryId: food.category_id,
      itemId: food.item_id,
      foodId: food.food_id,
      name: food.name,
      price: food.price,
      specs: food.specs,
      packingFee: food.packing_fee,
      skuId: food.sku_id,
      stock: food.stock
    }
}

export function clearShop() {
  return {
    type: CLEAR_SHOP
  }
}

export function toggleCartList() {
  return {
    type: TOGGLE_CART_LIST
  }
}

export function clearCart(id) {
  return {
    type: CLEAR_CART,
    id: id
  }
}

export function searchRes(geoHash,value) {
  return (dispatch,getState) => {
      searchRestaurant(geoHash, value).then((json)=>{
        dispatch({
          type: RECEIVE_REST_LIST,
          list: json
        })
      })
  }

}