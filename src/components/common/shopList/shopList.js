import React, { Component } from 'react';
import {shopList} from '../../../services/getData'
import RatingStar from '../../../components/common/ratingStar/ratingStar'
import Loading from '../../../components/common/loading/loading'
import {showBack, animate} from '../../../config/mUtils'
import {getImgPath} from '../../../utils/utils'
import './shopList.css'
import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom' 

class ShopList extends Component {
    
    constructor(props) {
        super(props)
        this.state = {
            offset: 0,
            showLoading : true,
            shopListArr: [],
            showBackStatus: false
        }

    }

    
    componentDidMount() {
        this.initData()
    }

    async componentWillReceiveProps(nextProps) {
        if((this.props.restaurantCategoryIds != nextProps.restaurantCategoryIds) ||
            (this.props.sortByType != nextProps.sortByType) ||
            (this.props.confirmSelect != nextProps.confirmSelect)) {
                this.setState({
                    showLoading: true
                })
                let res = await shopList(nextProps.latitude, nextProps.longitude, 
                this.state.offset, '', nextProps.restaurantCategoryIds, nextProps.sortByType, nextProps.deliveryMode, nextProps.supportIds);
                this.setState({
                    shopListArr: [...res],
                    showLoading: false
                })
            }
    }
    componentWillUnmount() {
         this.unscription()
    }

    async initData() {
        let res = await shopList(this.props.latitude, this.props.longitude, this.state.offset, this.props.restaurantCategoryId);
        
        this.setState({
            shopListArr: [...res],
            showLoading: false
        })
        
        this.unscription = showBack(status => {
            this.setState({
                showBackStatus: status
            })
        })
    }

    backTop() {
        animate(document.body, {scrollTop: '0'}, 400,'ease-out');
    }
   
    render() {
        const listArr = this.state.shopListArr;
        
        return (
            
            <div className='shoplist_container'>
                {listArr.length ? (
                <ul>
                    {
                        listArr.map((item)=> {
                           return ( <Link to={{pathname: '/shop', search: '?geoHash='+ this.props.geoHash + '&id='+item.id}} key={item.id} className="shop_li">
                                <section>
                                    <img src={getImgPath(item.image_path)} className="shop_img" alt=""/>
                                </section>
                                <hgroup className="shop_right">
                                    <header className="shop_detail_header">
                                        <h4 className={item.is_premium? 'premium shop_title ellipsis': 'shop_title ellipsis'} >{item.name}</h4>
                                        <ul className="shop_detail_ul">
                                            {
                                                item.supports.map((support)=> (
                                                    <li className='supports' key={support.id}>{support.icon_name}</li>
                                                ))
                                            }
                                        </ul>
                                    </header>
                                    <h5 className="rating_order_num">
                                        <section className="rating_order_num_left">
                                            <section className="rating_section">
                                                <RatingStar rating={item.rating}/>
                                                <span className="rating_num">{item.rating}</span>
                                            </section>
                                            <section className="order_section">
                                                月售{item.recent_order_num}单
                                            </section>
                                        </section>
                                        {item.delivery_mode && (
                                            <section className="rating_order_num_right" >
                                            <span className="delivery_style delivery_left">{item.delivery_mode.text}</span>
                                            <span className="delivery_style delivery_right">准时达</span>
                                        </section>
                                        )}
                                        
                                    </h5>
                                    <h5 className="fee_distance">
                                        <section className="fee">
                                            ¥{item.float_minimum_order_amount}起送 
                                            <span className="segmentation">/</span>
                                            {item.piecewise_agent_fee.tips}
                                        </section>
                                        <section className="distance_time">
                                            <span>{item.distance > 1000? (item.distance/1000).toFixed(2) + 'km': item.distance + 'm'}
                                                <span className="segmentation">/</span>
                                            </span>
                                            <span className="order_time">{item.order_lead_time}分钟</span>
                                        </section>
                                    </h5>
                                </hgroup>
                            </Link>)
                        })
                    }
                    
                    
                </ul>
                ):(
                    <p className="empty_data">没有更多了</p>
                )}
                {this.state.showBackStatus && (
                    <aside className="return_top" onClick={this.backTop}>
                        <svg className="back_top_svg">
                            <use xmlnsXlink="http://www.w3.org/1999/xlink" xlinkHref="#backtop"></use>
                        </svg>
                    </aside>
                )}
                
                {this.state.showLoading && <Loading></Loading>}
            </div>
        )
    }
}

export default ShopList