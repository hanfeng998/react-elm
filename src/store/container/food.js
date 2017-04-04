import { connect } from "react-redux";
import { addGeo } from "../actions";
import Food from "../../pages/food/food";

const mapStateToProps = state => {
  const { shared, foodPage } = state;
  return {
    categories: foodPage.categories,
    categoryDetail: foodPage.categoryDetail,
    sortByType: foodPage.sortByType,
    restaurant_category_id: foodPage.restaurant_category_id,
    restaurant_category_ids: foodPage.restaurant_category_ids,
    headTitle: foodPage.headTitle,
    foodTitle: foodPage.foodTitle,
    sortBy: foodPage.sortBy,
    geoHash: shared.geoHash,
    latitude: shared.latitude,
    confirmStatus: foodPage.confirmStatus,
    longitude: shared.longitude,
    delivery: foodPage.delivery, // 配送方式数据
    activity: foodPage.activity, // 商家支持活动数据
    delivery_mode: foodPage.delivery_mode, // 选中的配送方式
    support_ids: foodPage.support_ids, // 选中的商铺活动列表
    filterNum: foodPage.filterNum // 所选中的所有样式的集合
  };
};

const FoodContainer = connect(mapStateToProps)(Food);

export default FoodContainer;
