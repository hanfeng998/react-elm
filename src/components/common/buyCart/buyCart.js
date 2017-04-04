import React, { Component } from 'react';
import './buyCart.css'

class BuyCart extends Component {
  showMoveDot = []
  constructor(props) {
    super(props)
  }

  getFoodNum() {
    const shopCart = this.props.cartList[this.props.shopId];
    let category_id = this.props.food.category_id;
    let item_id = this.props.food.item_id;
    if (shopCart&&shopCart[category_id]&&shopCart[category_id][item_id]) {
        let num = 0;
        Object.values(shopCart[category_id][item_id]).forEach((item,index) => {
            num += item.num;
        })
        return num;
    }else {
        return 0;
    }
  }
  addToCart(category_id, item_id, food_id, name, price, specs, packing_fee, sku_id, stock, event){
      this.props.addToCart(category_id, item_id, food_id, name, price, specs, packing_fee, sku_id, stock)
      let elLeft = event.target.getBoundingClientRect().left;
      let elBottom = event.target.getBoundingClientRect().bottom;
      
      this.props.showMoveDot(elLeft, elBottom)
  }

  //移出购物车
  removeOutCart(category_id, item_id, food_id, name, price, specs, packing_fee, sku_id, stock){
      if (this.getFoodNum() > 0) {
          this.props.reduceCart({category_id, item_id, food_id, name, price, specs, packing_fee, sku_id, stock});
      }
  }
  render () {
    const food = this.props.food
    const shopCart = this.props.cartList[this.props.shopId];
    const foodNum = this.getFoodNum()
    return (
      <section className="cart_module">
        {
          !food.specifications.length ? (
            <section className='cart_button'>
                {
                  !!foodNum &&　(
                    <span onClick={()=>this.removeOutCart(food.category_id, food.item_id, food.specfoods[0].food_id, food.specfoods[0].name, food.specfoods[0].price, '', food.specfoods[0].packing_fee, food.specfoods[0].sku_id, food.specfoods[0].stock)}>
                      <svg>
                          <use xmlnsXlink="http://www.w3.org/1999/xlink" xlinkHref="#cart-minus"></use>
                      </svg>
                    </span>
                  )
                }
               
                {!!foodNum && <span className="cart_num" >{foodNum}</span>}
                
                <svg className="add_icon" onTouchStart={(ev)=>this.addToCart(food.category_id, food.item_id, food.specfoods[0].food_id, food.specfoods[0].name, food.specfoods[0].price, '', food.specfoods[0].packing_fee, food.specfoods[0].sku_id, food.specfoods[0].stock, ev)}>
                    <use xmlnsXlink="http://www.w3.org/1999/xlink" xlinkHref="#cart-add"></use>
                </svg>
            </section>
          ) : (
            <section className='choose_specification'>
               <section className="choose_icon_container">
                    {
                      !!foodNum && (
                        <svg className="specs_reduce_icon"  >
                          <use xmlnsXlink="http://www.w3.org/1999/xlink" xlinkHref="#cart-minus"></use>
                        </svg>
                      )
                    }

                    {!!foodNum && <span className="cart_num">{foodNum}</span>}
                   
                <span className="show_chooselist">选规格</span>
              </section>
            </section>
          )
        }
      </section>
    )
  }
}

export default BuyCart;