import React, { Component } from 'react';
import Head from '../../components/header/head'
import FootGuide from '../../components/footer/footer'
import './search.css'
import {imgBaseUrl} from '../../config/env'
import { connect } from "react-redux";
import { searchRes } from "../../store/actions";
import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom'

class Search extends Component {
  constructor(props) {
    super(props)
    this.search = this.search.bind(this)
  }


  search(e) {
    e.preventDefault()
    if(!this.searchInput.value) {
      return
    }
    const {dispatch} = this.props
    dispatch(searchRes(this.props.geoHash,this.searchInput.value))
  }
  render() {
    const {restaurantList, emptyResult} = this.props
    console.log(this.props)
    return (
      <div className="paddingTop">
        <Head head-title="搜索" goBack="true"></Head>
        <form className="search_form">
            <input type="search" name="search" placeholder="请输入商家或美食名称" className="search_input" ref={input => this.searchInput = input} />
            <input type="submit" name="submit" className="search_submit" onClick={this.search}/>
        </form>
        {!!restaurantList.length && (
          <section>
             <h4 className="title_restaurant">商家</h4>
             <div className='list_container'>
               {restaurantList.map((item, index)=> (
                  <Link to={{pathname:'/shop', search:'id='+item.id}} key={index} className="list_li">
                  <section className="item_left">
                        <img src={imgBaseUrl + item.image_path} className="restaurant_img"/>
                    </section>
                     <section className="item_right">
                        <div className="item_right_text">
                            <p>
                                <span>{item.name}</span>
                                <svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="24" height="14" className="pay_icon">
                                    <polygon points="0,14 4,0 24,0 20,14" style={{fill:"none",stroke:"#FF6000",strokeWidth:1}} />
                                    <line x1="1.5" y1="12" x2="20" y2="12" style={{stroke:"#FF6000",strokeWidth:1.5}}/>
                                    <text x="3.5" y="9" style={{fill:"#FF6000",fontSize:9,fontWeight:"bold"}}>支付</text>
                                </svg>
                            </p>
                            <p>月售 {item.month_sales} 单</p>
                            <p>{item.delivery_fee} 元起送 / 距离{item.distance}</p>
                        </div>
                        <ul className="item_right_detail">
                          {
                            item.restaurant_activity.map(item=>(
                              <li key={item.id}>
                                <span style={{backgroundColor: '#' + item.icon_color}} className="activities_icon">{item.icon_name}</span>
                                <span>{item.name}</span>
                                <span className="only_phone">(手机客户端专享)</span>
                              </li>
                            ))
                          }
                          
                        </ul>
                    </section>
                  </Link>
               ))
               }
             </div>
          </section>
        )}
        {emptyResult && ( <div className="search_none" >很抱歉！无搜索结果</div>)}
        <FootGuide geoHash = {this.props.geoHash} {...this.props}></FootGuide>
    </div>
    )
  }
}
const mapStateToProps = state => {
  const { shared, searchPage} = state;
  return {
    geoHash: shared.geoHash,
    restaurantList: searchPage.restaurantList,
    emptyResult: searchPage.emptyResult
  };
}
export default connect(mapStateToProps)(Search)