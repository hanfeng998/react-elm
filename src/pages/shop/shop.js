import React, { Component } from 'react';
import {initShopPage, clearCart,changeShowType, toggleCartList,chooseMenu, initCategoryNum, addToCart, clearShop,reduceCart} from '../../store/actions';
import {getImgPath } from '../../utils/utils';
import {parse } from 'qs';
import BScroll from 'better-scroll';
import BuyCart from '../../components/common/buyCart/buyCart'
import RatingStar from '../../components/common/ratingStar/ratingStar'
import Loading from '../../components/common/loading/loading'
import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom'
import './shop.css'

class Shop extends Component {
  shopListTop = []
  menuIndexChange = true;
  showMoveDot= [];
  windowHeight = window.innerHeight;
  count = 0
  constructor(props) {
    super(props)
    this.state = {
      TitleDetailIndex: null,
      receiveInCart: false
    }
    this.addToCart = this.addToCart.bind(this)
    this.reduceCart = this.reduceCart.bind(this)
    this.toggleCartList = this.toggleCartList.bind(this)
    this.clearCart = this.clearCart.bind(this)
    this.update = this.update.bind(this)
    this.showMoveDotFun = this.showMoveDotFun.bind(this)
  }

  componentWillMount() {
    const query = parse(this.props.location.search.substr(1));
    this.props.dispatch(initShopPage(this.props.latitude, this.props.longitude, query.id, this.props.ratingOffset))
  }

  changeShowType(type) {
    this.props.dispatch(changeShowType(type))
  }

  

  componentDidUpdate(prevProps, prevState) {
    if(prevProps.showLoading!==this.props.showLoading) {
      this.initCategoryNum();
      if(!this.shopListTop.length) {
        this.getFoodListHeight()
      }
    }
    const canbind = prevProps.changeShowType !== this.props.changeShowType
    if(!this.props.showLoading && canbind) {
      this.bindToScroll(this.props.changeShowType)
    }
    if(this.showMoveDot && this.showMoveDot[this.showMoveDot.length-1]) {
      const dot = this.moveDotContainer.children[0]
      const liner = this.moveDotContainer.children[0].children[0]
      if(this.count<1) {
        this.count++
        setTimeout(()=> {

        this.animateDot(dot, liner)
        })
      } else {
        this.count = 0;
      }
     
    }
  }

  
  
  componentWillUnmount() {
    const {dispatch} = this.props
    dispatch(clearShop())
    this.wrapperMenu.off('scroll')
    this.foodScroll.off('scroll')
  }

  componentWillReceiveProps(nextProps) {
    const prev = this.props.cartList
    const next = nextProps.cartList
    if( prev !== next ){
      this.initCategoryNum()
    }
  }

  bindToScroll(value) {
     if (value === 'rating') {
      this.ratingScroll = new BScroll('#ratingContainer', {
          probeType: 3,
          deceleration: 0.003,
          bounce: false,
          swipeTime: 2000,
          click: true,
      });
      this.ratingScroll.on('scroll', (pos) => {
          if (Math.abs(Math.round(pos.y)) >=  Math.abs(Math.round(this.ratingScroll.maxScrollY))) {
          }
      })
      
    } else {
          const listContainer = this.menuFoodList;
          this.listenScroll(listContainer)    
    }
  }
  chooseMenu(index) {
    this.props.dispatch(chooseMenu(index))
    //menuIndexChange解决运动时listenScroll依然监听的bug
    this.menuIndexChange = false;
    this.foodScroll.scrollTo(0, -this.shopListTop[index], 400);
    this.foodScroll.once('scrollEnd', () => {
        this.menuIndexChange = true;
    })
  }
  
  getFoodListHeight() {
    const baseHeight = this.shopheader.clientHeight;
    const chooseTypeHeight = this.chooseType.clientHeight;
    const listContainer = this.menuFoodList;
    const listArr = Array.from(listContainer.children[0].children);
    listArr.forEach((item, index) => {
        this.shopListTop[index] = item.offsetTop - baseHeight - chooseTypeHeight;
    });
    this.listenScroll(listContainer)
  }

  update(index) {
    this.props.dispatch(chooseMenu(index))
  }

  listenScroll(element) {
    let oldScrollTop;
    let requestFram;
    this.foodScroll = new BScroll(element, {  
        probeType: 3,
        deceleration: 0.001,
        bounce: false,
        swipeTime: 2000,
        click: true,
    }); 

    this.wrapperMenu = new BScroll('#wrapper_menu', {
        click: true,
    });

    this.foodScroll.on('scroll', (pos) => {
        let now, prev
        this.shopListTop.forEach((item, index) => {
            if (this.menuIndexChange && Math.abs(Math.round(pos.y)) >= item) {
              now = index
            }
        })
        if(prev !== now) {
          this.props.dispatch(chooseMenu(now))
          prev = now
        }
        
    })
  }

  initCategoryNum(){
    let newArr = [];
    let cartFoodNum = 0;
    let totalPrice = 0; 
    let cartFoodList = [];
    this.shopCart = {...this.props.cartList[this.props.shopId]};
    this.props.menuList.forEach((item, index) => {
        if (this.shopCart&&this.shopCart[item.foods[0].category_id]) {
            let num = 0;
            Object.keys(this.shopCart[item.foods[0].category_id]).forEach(itemid => {
                Object.keys(this.shopCart[item.foods[0].category_id][itemid]).forEach(foodid => {
                    let foodItem = this.shopCart[item.foods[0].category_id][itemid][foodid];
                    num += foodItem.num;
                    if (item.type == 1) {
                        totalPrice += foodItem.num*foodItem.price;
                        if (foodItem.num > 0) {
                            cartFoodList[cartFoodNum] = {};
                            cartFoodList[cartFoodNum].category_id = item.foods[0].category_id;
                            cartFoodList[cartFoodNum].item_id = itemid;
                            cartFoodList[cartFoodNum].food_id = foodid;
                            cartFoodList[cartFoodNum].num = foodItem.num;
                            cartFoodList[cartFoodNum].price = foodItem.price;
                            cartFoodList[cartFoodNum].name = foodItem.name;
                            cartFoodList[cartFoodNum].specs = foodItem.specs;
                            cartFoodNum ++;
                        }
                    }
                })
            })
            newArr[index] = num;
        }else{
            newArr[index] = 0;
        }
    })
    totalPrice = totalPrice.toFixed(2);
    this.categoryNum = [...newArr];
    this.props.dispatch(initCategoryNum(cartFoodNum, totalPrice, cartFoodList, this.categoryNum))
  }

  showTitleDetail(index) {
    if (this.state.TitleDetailIndex == index) {
      this.setState({
        TitleDetailIndex: null
      })
    }else {
        this.setState({
          TitleDetailIndex: index
        })
      }
                  
  }

  addToCart(category_id, item_id, food_id, name, price, specs, packing_fee, sku_id, stock) {
    this.props.dispatch(addToCart(this.props.shopId,category_id, item_id, food_id, name, price, specs, packing_fee, sku_id, stock))
  }

  reduceCart(food) {
    this.props.dispatch(reduceCart({ ...food,shopId: this.props.shopId}))
  }
  getTotalNum() {
    
    let num = 0;
    if(this.props.cartFoodList) {

      this.props.cartFoodList.forEach(item => {
          num += item.num
      })
    }
    return num

  }

  showMoveDotFun(elLeft, elBottom) {
    this.showMoveDot = [...this.showMoveDot, true];
    this.elLeft = elLeft;
    this.elBottom = elBottom;
    console.log(this.showMoveDot)
  }

  animateDot(dot, liner) {
      dot.style.transform = `translate3d(0,0,0)`;
      liner.style.transform = `translate3d(0,0,0)`;
      dot.style.transition = 'transform .55s cubic-bezier(0.3, -0.25, 0.7, -0.15)';
      liner.style.transition = 'transform .55s linear';
      
      this.showMoveDot = this.showMoveDot.map(item => false);

      liner.style.opacity = 1;
      liner.addEventListener('transitionend', () => {
          this.listenInCart();
      })
      liner.addEventListener('webkitAnimationEnd', () => {
          this.listenInCart();
      })
  }
  toggleCartList() {
    const {dispatch} = this.props;
    dispatch(toggleCartList())
  }
  clearCart() {
    const {dispatch} = this.props;
    this.toggleCartList();
    dispatch(clearCart(this.props.shopId))
  }

  listenInCart() {
    const {receiveInCart} = this.state
    if (!receiveInCart) {
        this.setState({
          receiveInCart: true
        })
        this.cartContainer.addEventListener('animationend', () => {
        this.setState({
            receiveInCart: false
          })
        })
        this.cartContainer.addEventListener('webkitAnimationEnd', () => {
        this.setState({
            receiveInCart: false
          })
        })
    }
  }
  renderFood() {
    const {shopDetailData,promotionInfo,menuIndex,menuList,totalPrice,
      showCartList, cartFoodList, changeShowType, shopId, cartList
    } = this.props
    
    const {receiveInCart} = this.state
   
    const totalNum = this.getTotalNum()
    const deliveryFee = this.props.shopDetailData ? this.props.shopDetailData.float_delivery_fee : null
    const minimumOrderAmount = shopDetailData ? shopDetailData.float_minimum_order_amount - totalPrice
                                            : null
    const categoryNum = this.props.categoryNum || []                                        
  
    if(changeShowType === 'food') {
      return (
          <section className="food_container">
            <section className="menu_container">
              <section className="menu_left" id="wrapper_menu">
                  <ul>
                      {
                        menuList.map((item,index)=>(
                          <li key={index} className={index == menuIndex ? 'activity_menu menu_left_li' : 'menu_left_li' } onClick={()=>this.chooseMenu(index)} >
                            {item.icon_url && <img src={getImgPath(item.icon_url)} />}
                            <span>{item.name}</span>
                            {
                              !!categoryNum[index]&&item.type==1 && (
                                <span className="category_num" >{categoryNum[index]}</span>
                              )
                            }
                            
                          </li>
                        ))
                      }
                  </ul>
              </section>
              <section className='menu_right' ref={(menuFoodList)=> this.menuFoodList= menuFoodList}>
                <ul>
                  {
                    menuList.map((item,index)=> (
                      <li key={index}>
                        <header className='menu_detail_header'>
                          <section className="menu_detail_header_left">
                            <strong className="menu_item_title">{item.name}</strong>
                            <span className="menu_item_description">{item.description}</span>
                          </section>
                          <span className="menu_detail_header_right" onClick={()=>this.showTitleDetail(index)}></span>
                          
                          {
                            index == this.state.TitleDetailIndex && (
                              <p className="description_tip">
                                <span>{item.name}</span>
                                {item.description}
                              </p>
                            )
                          }
                        </header>
                        {
                          item.foods.map((food,index)=> (
                            <section className='menu_detail_list' key={index}>
                              <div  className="menu_detail_link">
                                <section className='menu_food_img'>
                                  <img src={getImgPath(food.image_path)} alt=""/>
                                </section>
                                <section className='menu_food_description'>
                                  <h3 className='food_description_head'>
                                    <strong className="description_foodname">{food.name}</strong>
                                      {
                                        !!food.attributes.length && (
                                          <ul className='attributes_ul'>
                                            {
                                              food.attributes.map((attribute, index) => (
                                                <li key={index} className={attribute.icon_name=='新' && 'attribute_new'} style={{color: '#' + attribute.icon_color,borderColor:'#' +attribute.icon_color}}>
                                                  <p style={{color: attribute.icon_name == '新'? '#fff' : '#' + attribute.icon_color}}>{attribute.icon_name == '新'? '新品':attribute.icon_name}</p>
                                                </li>
                                              ))
                                            }
                                          </ul>
                                        )
                                      }
                                  </h3>
                                  <p className='food_description_content'>{food.description}</p>
                                  <p className='food_description_sale_rating'>
                                    <span>月售{food.month_sales}份</span>
                                    <span>好评率{food.satisfy_rate}%</span>
                                  </p>
                                  {
                                    food.activity && (
                                      <p className='food_activity'>
                                        <span style={{color: '#' + food.activity.image_text_color,borderColor:'#' +food.activity.icon_color}}>
                                          {food.activity.image_text}
                                        </span>
                                      </p>
                                    )
                                  }
                                </section>
                              </div>
                              <footer className="menu_detail_footer">
                                <section className="food_price">
                                    <span>¥</span>
                                    <span>{food.specfoods[0].price}</span>
                                    {food.specifications.length && <span>起</span>}
                                </section>
                                <BuyCart showMoveDot={this.showMoveDotFun} addToCart={this.addToCart} reduceCart={this.reduceCart} shopId={shopId} food={food} cartList={cartList}></BuyCart>
                              </footer>
                            </section>
                          ))
                        }
                      </li>
                    ))
                  }
                </ul>
              </section>
            </section>
            <section className='buy_cart_container'>
              <section onClick={this.toggleCartList} className='cart_icon_num'>
                  <div  className={`cart_icon_container ${totalPrice > 0 ?'cart_icon_activity': ''} ${receiveInCart?'move_in_cart':''}`} ref={(cartContainer)=>this.cartContainer = cartContainer}>
                          {
                            !!totalNum && (
                              <span className='cart_list_length'>
                                {totalNum}
                              </span>
                            )
                          }
                          <svg className="cart_icon">
                              <use xmlnsXlink="http://www.w3.org/1999/xlink" xlinkHref="#cart-icon"></use>
                          </svg>
                      </div>
                      <div className="cart_num">
                          <div>¥ {totalPrice}</div>
                          <div>配送费¥{deliveryFee}</div>
                      </div>
              </section>
              <section  className={minimumOrderAmount<=0  ? 'gotopay gotopay_acitvity': ' gotopay'}>
                {
                  minimumOrderAmount>0? (
                    <span className="gotopay_button_style" >还差¥{minimumOrderAmount}起送</span>
                  ): (
                    <Link to={{pathName:'/confirmOrder'}} className="gotopay_button_style">去结算</Link>
                  )
                }
              </section>
            </section>
            {
              (showCartList&&(!!cartFoodList.length)) && (
              <section className="cart_food_list" >
                <header>
                    <h4>购物车</h4>
                    <div onClick={this.clearCart}>
                        <svg>
                            <use xmlnsXlink="http://www.w3.org/1999/xlink" xlinkHref="#cart-remove"></use>
                        </svg>
                        <span className="clear_cart">清空</span>
                    </div>
                </header>
                <section className="cart_food_details" id="cartFood">
                    <ul>
                      {
                        cartFoodList.map((item, index)=> (
                          <li className='cart_food_li' key={index}>
                              <div className="cart_list_num">
                                <p className="ellipsis">{item.name}</p>
                                <p className="ellipsis">{item.specs}</p>
                            </div>
                            <div className="cart_list_price">
                                <span>¥</span>
                                <span>{item.price}</span>
                            </div>
                            <section className="cart_list_control">
                                <span onClick={()=>this.reduceCart({category_id:item.category_id, item_id: item.item_id, food_id:item.food_id, name: item.name, price:item.price, specs:item.specs})}>
                                    <svg>
                                        <use xmlnsXlink="http://www.w3.org/1999/xlink" xlinkHref="#cart-minus"></use>
                                    </svg>
                                </span>
                                <span className="cart_num">{item.num}</span>
                                <svg className="cart_add" onClick={()=>this.addToCart(item.category_id, item.item_id, item.food_id, item.name, item.price, item.specs)}>
                                    <use xmlnsXlink="http://www.w3.org/1999/xlink" xlinkHref="#cart-add"></use>
                                </svg>
                            </section>
                          </li>
                        ))
                      }
                      
                    </ul>
                </section>
              </section>
              )
            }
            {showCartList&&!!cartFoodList.length && (
                <div className="screen_cover"  onClick={this.toggleCartList}></div>
            )}
          </section>
      )
    }else {
      return null
    }
  }

  renderRating() {
    const shopDetailData = this.props.shopDetailData
    const promotionInfo = this.props.promotionInfo
    const showActivities = this.props.showActivities
    const changeShowType = this.props.changeShowType
    const menuIndex = this.props.menuIndex
    const menuList = this.props.menuList
    const totalPrice = this.props.totalPrice
    const receiveInCart = this.props.receiveInCart
    const ratingScoresData = this.props.ratingScoresData
    const ratingTagsList = this.props.ratingTagsList
    const ratingList = this.props.ratingList
    const ratingTageIndex = this.props.ratingTageIndex
    const totalNum = this.getTotalNum()
    const deliveryFee = this.props.shopDetailData ? this.props.shopDetailData.float_delivery_fee : null
    const minimumOrderAmount = shopDetailData ? shopDetailData.float_minimum_order_amount - totalPrice
                                            : null

    const showCartList = this.props.showCartList
    const cartFoodList = this.props.cartFoodList
        

    const categoryNum = this.props.categoryNum || []
    const {showLoading}= this.props
    if (changeShowType == 'rating') {
        return (
                <section className='ratingContainer' id='ratingContainer'>

                  <section type='2'>
                    <section>
                      <header className='rating_header'>
                        <section className='rating_header_left'>
                          <p>{shopDetailData.rating}</p>
                          <p>综合评价</p>
                          <p>高于周边商家{(ratingScoresData.compare_rating*100).toFixed(1)}%</p>
                        </section>
                        <section className="rating_header_right">
                            <div className='cate'>
                                <span>服务态度</span>
                                <RatingStar rating={ratingScoresData.service_score}></RatingStar>
                                <span className="rating_num">{ratingScoresData.service_score.toFixed(1)}</span>
                            </div>
                            <div className='cate'>
                                <span>菜品评价</span>
                                <RatingStar rating={ratingScoresData.food_score}></RatingStar>
                                <span className="rating_num">{ratingScoresData.food_score.toFixed(1)}</span>
                            </div>
                            <div className='cate'>
                                <span>送达时间</span>
                                <span className="delivery_time">{shopDetailData.order_lead_time}分钟</span>   
                            </div>
                        </section>
                      </header>
                      <ul className="tag_list_ul">
                        {
                          ratingTagsList.map((item, index)=> (
                            <li key={index} className={(item.unsatisfied? 'unsatisfied':'') + (ratingTageIndex == index?'tagActivity':'')}>
                              {item.name}({item.count})
                            </li>
                          ))
                        }
                      </ul>

                      <ul className='rating_list_ul'>
                        {
                          ratingList.map((item, index)=> (
                            <li key={index} className='rating_list_li'>
                              <img src={getImgPath(item.avatar)} className="user_avatar"/>
                              <section className="rating_list_details">
                                  <header>
                                      <section className="username_star">
                                          <p className="username">{item.username}</p>
                                          <div className="star_desc">
                                              <RatingStar rating={item.rating_star}></RatingStar>
                                              <span className="time_spent_desc">{item.time_spent_desc}</span>
                                          </div>
                                      </section>
                                      <time className="rated_at">{item.rated_at}</time>
                                  </header>
                                  <ul className="food_img_ul">
                                    {
                                      item.item_ratings.map((item,index)=>(
                                        <li key={index}>
                                          {item.image_hash && <img src={getImgPath(item.image_hash)} alt=""/>}
                                        </li>
                                      ))
                                    }
                                  </ul>
                                  <ul className="food_name_ul">
                                    {
                                      item.item_ratings.map((item, index) => (
                                        <li key={index} className="ellipsis">
                                          {item.food_name}
                                        </li>
                                      ))
                                    }
                                  </ul>
                                </section>
                            </li>
                          ))
                        }
                      </ul>
                    </section>
                  </section>
                </section>
              )
    } else {
      return null
    }
  }
  render() {
    const {shopDetailData, changeShowType, showLoading,showActivities} = this.props;
    return (
      <div>
        {
          !showLoading ? (
            <section className="shop_container">
              <header className="shop_detail_header" ref={(shopheader)=>this.shopheader=shopheader} style={{zIndex: showActivities? '14':'10'}}>
                <img src={getImgPath(shopDetailData.image_path)} className="header_cover_img"/>
                <section className="description_header">
                  <Link to="/shop/shopDetail" className="description_top">
                            <section className="description_left">
                                <img src={getImgPath(shopDetailData.image_path)}/>
                            </section>
                            <section className="description_right">
                                <h4 className="description_title ellipsis">{shopDetailData.name}</h4>
                                <p className="description_text">商家配送／{shopDetailData.order_lead_time}分钟送达／配送费¥{shopDetailData.float_delivery_fee}</p>
                                <p className="description_promotion ellipsis">公告：{shopDetailData.promotion_info || '欢迎光临，用餐高峰期请提前下单，谢谢。'}</p>
                            </section>
                            <svg width="14" height="14" xmlns="http://www.w3.org/2000/svg" version="1.1" className="description_arrow" >
                                <path d="M0 0 L8 7 L0 14"  stroke="#fff" strokeWidth="1" fill="none"/>
                            </svg>
                        </Link>
                        {shopDetailData.activities.length && (
                           <footer className="description_footer"  >
                            <p className="ellipsis">
                                <span className="tip_icon" style={{backgroundColor: '#' + shopDetailData.activities[0].icon_color, borderColor: '#' + shopDetailData.activities[0].icon_color}}>{shopDetailData.activities[0].icon_name}</span>
                                <span>{shopDetailData.activities[0].description}（APP专享）</span>
                            </p>
                            <p>{shopDetailData.activities.length}个活动</p>
                            <svg className="footer_arrow">
                                <use xmlnsXlink="http://www.w3.org/1999/xlink" xlinkHref="#arrow-left"></use>
                            </svg>
                        </footer>
                        )}
                       
                </section>
              </header>
              <section className="change_show_type" ref={(chooseType)=>this.chooseType=chooseType}>
                <div>
                    <span className={ changeShowType =="food" && 'activity_show'} onClick={() => this.changeShowType('food')}>商品</span>
                </div>
                <div>
                    <span className={ changeShowType =="rating" && 'activity_show'} onClick={() => this.changeShowType('rating')}>评价</span>   
                </div>
              </section>
              {
                this.renderFood()
              }
              {
                this.renderRating()
              }
            </section>        
          )
          :
          (<Loading></Loading>)
        }
        <div ref={(cont)=> this.moveDotContainer = cont}>

          {this.showMoveDot.map((item, index)=> (
            item && 
            (
              <span className="move_dot" key={index} style={{transform: `translate3d(0,${37 + this.elBottom - this.windowHeight}px,0)`}}>
              <svg className="move_liner" style={{transform :`translate3d(${this.elLeft - 30}px,0,0)`, opacity: 0}}>
                      <use xmlnsXlink="http://www.w3.org/1999/xlink" xlinkHref="#cart-add"></use>
                  </svg>
            </span>
            )
          ))}
        </div>
        
      </div>
    )
  }
}

export default Shop