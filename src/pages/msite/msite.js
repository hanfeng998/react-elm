import React, { Component } from 'react';
import { parse } from 'qs'
import Head from '../../components/header/head'
import FootGuide from '../../components/footer/footer'
import ShopList from '../../components/common/shopList/shopList'
import {currentcity, searchplace} from '../../services/getData'
import {imgBaseUrl} from '../../config/env'
import {getStore, setStore} from '../../config/mUtils'
import {msiteAdress, msiteFoodTypes, msiteShopList} from '../../services/getData'
import Swiper from 'swiper'
import '../../lib/swiper.min.css'
import './msite.css'
import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom' 

class Msite extends Component {
    constructor(props) {
        super(props)
        this.state = {
            geohash: '', // city页面传递过来的地址geohash
            mSiteTitle: '请选择地址...', // msite页面头部标题
            foodTypes: [], // 食品分类列表
            hasGetData: false, //是否已经获取地理位置数据，成功之后再获取商铺列表信息
            imgBaseUrl, //图片域名地址
        }
    }

    async componentDidMount() {
        const query = parse(this.props.location.search.substr(1));
        const geoHash = query.geoHash || 'wtw3sm0q087';
        const res = await msiteAdress(geoHash);
        this.props.onAddGeo(res)
        let foodTypes = []
         //获取导航食品类型列表
       	msiteFoodTypes(geoHash).then(res => {
       		let resLength = res.length;
       		let resArr = res.concat([]); // 返回一个新的数组
       		let foodArr = [];
    		for (let i = 0, j = 0; i < resLength; i += 8, j++) {
    			foodArr[j] = resArr.splice(0, 8);
    		}
    		foodTypes = foodArr;
            this.setState({
                foodTypes: foodTypes
            })
        }).then(() => {
        	//初始化swiper
        	new Swiper('.swiper-container', {
		        pagination: '.swiper-pagination',
		        loop: true
		    });
        })
        this.setState({
            geoHash: geoHash,
            mSiteTitle: res.name,
            hasGetData: true,
        })
    }

    getCategoryId(url){
        let urlData = decodeURIComponent(url.split('=')[1].replace('&target_name',''));
        if (/restaurant_category_id/gi.test(urlData)) {
            return JSON.parse(urlData).restaurant_category_id.id
        }else{
            return ''
        }
    }
    render() {

        return (
            <div>
                <Head signUp search={<Search geoHash={this.state.geoHash}/>} msiteTitle={<Title msiteTitle={this.state.mSiteTitle}/>}/>
                <nav className="msite_nav">
                    <div className="swiper-container">
                        <div className="swiper-wrapper">
                            {
                                this.state.foodTypes.map((item,index)=> (
                                    <div className="swiper-slide food_types_container" key={index}>
                                        {item.map((foodItem)=> {
                                            return foodItem.title !== '预订早餐'
                                                    ?(<Link  to={{pathname: '/food',search: '?geohash='+ this.state.geoHash +'&title='+foodItem.title+'&restaurant_category_id='+this.getCategoryId(foodItem.link)}} key={foodItem.id} className="link_to_food">
                                                            <figure>
                                                                <img src={this.state.imgBaseUrl + foodItem.image_url}/>
                                                                <figcaption>{foodItem.title}</figcaption>
                                                            </figure>
                                                    </Link>)
                                                    :(<a href="https://zaocan.ele.me/" className="link_to_food" key ={foodItem.id} >
                                                            <figure>
                                                                <img src={this.state.imgBaseUrl + foodItem.image_url}/>
                                                                <figcaption>{foodItem.title}</figcaption>
                                                            </figure>
                                                    </a>)	
                                        })}
                                    </div>
                                ))
                            }
                            
                        </div>
                        <div className="swiper-pagination"></div>
                    </div>
                </nav>
                <div className="shop_list_container">
                    <header className="shop_header">
                        <svg className="shop_icon">
                            <use xmlnsXlink="http://www.w3.org/1999/xlink" xlinkHref="#shop"></use>
                        </svg>
                        <span className="shop_header_title">附近商家</span>
                    </header>
                    {
                        this.state.hasGetData && <ShopList geoHash={this.state.geoHash} latitude={this.props.latitude} longitude= {this.props.longitude}></ShopList>
                    }
                    
                </div>
                <FootGuide geoHash={this.state.geoHash} {...this.props}></FootGuide>
            </div>
        )
    }
}

const Search = (props) => (
    <Link to={'/search/' + props.geoHash} className='link_search'>
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" version="1.1">
            <circle cx="9" cy="9" r="8" stroke="rgb(255,255,255)" strokeWidth="2" fill="none"/>
            <line x1="15" y1="15" x2="20" y2="20" style={{stroke : 'rgb(255,255,255)',strokeWidth:2}}/>
        </svg>
    </Link>
)

const Title = (props) => (
    <Link to='/' className='msite_title'>
        <span className='title_text ellipsis'>{props.msiteTitle}</span>
    </Link>
)

export default Msite;