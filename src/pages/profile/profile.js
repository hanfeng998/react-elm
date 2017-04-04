import React, { Component } from 'react';
import Head from '../../components/header/head'
import FootGuide from '../../components/footer/footer'
import './profile.css'
import {imgBaseUrl} from '../../config/mUtils'
import { connect } from "react-redux";
import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom'
class Profile extends Component {
  constructor(props) {
    super(props)
    this.state = {
      profiletitle: '我的',
      getUserinfo: {},        //得到数据
      username: '登录/注册',           //用户名
      resetname: '',
      mobile: '登录后享受更多特权',             //电话号码
      balance: 0,            //我的余额
      count : 0,             //优惠券个数
      pointNumber : 0,       //积分数
      avatar: '',             //头像地址
      imgBaseUrl,
      userInfo: null
    }
  }

  render() {

    const userInfo = this.state.userInfo
    const avatar = this.state.avatar
    const username = this.state.username
    const mobile = this.state.mobile
    const balance = this.state.balance
    const count = this.state.count
    const pointNumber = this.state.pointNumber
    return (
    <div className="profile_page">
      <Head goBack='true' headTitle="我的"></Head>

      <section>
        <section className='profile-number'>
          <Link to={userInfo? '/profile/info' : '/login'} className="profile-link">
                    {avatar ? <img src="imgpath" className="privateImage" /> : (

                      <span className="privateImage" >
                          <svg className="privateImage-svg">
                              <use xmlnsXlink="http://www.w3.org/1999/xlink" xlinkHref="#avatar-default"></use>
                          </svg>
                      </span>
                    )}
                    <div className="user-info">
                        <p>{username}</p>
                        <p>
                            <span className="user-icon">
                                <svg className="icon-mobile" fill="#fff">
                                    <use xmlnsXlink="http://www.w3.org/1999/xlink" xlinkHref="#mobile"></use>
                                </svg>
                            </span>
                            <span className="icon-mobile-number">{mobile}</span>
                        </p>
                    </div>
                    <span className="arrow">
                        <svg className="arrow-svg" fill="#fff">
                            <use xmlnsXlink="http://www.w3.org/1999/xlink" xlinkHref="#arrow-right"></use>
                        </svg>
                    </span>
                </Link>
        </section>
        <section className="info-data">
                <ul className="clear">
                    <Link to="/balance"  className="info-data-link">
                        <span className="info-data-top"><b>{parseInt(balance).toFixed(2)}</b>元</span>
                        <span className="info-data-bottom">我的余额</span>
                    </Link>
                    <Link to="/benefit"  className="info-data-link">
                        <span className="info-data-top"><b>{count}</b>个</span>
                        <span className="info-data-bottom">我的优惠</span>
                    </Link>
                    <Link to="/points"  className="info-data-link">
                        <span className="info-data-top"><b>{pointNumber}</b>分</span>
                        <span className="info-data-bottom">我的积分</span>
                    </Link>
                </ul>
            </section>
              <section className="profile-1reTe">
                <Link to='/order' className="myorder">
                    <aside>
                        <svg fill="#4aa5f0">
                            <use xmlnsXlink="http://www.w3.org/1999/xlink" xlinkHref="#order"></use>
                        </svg>
                    </aside>
                    <div className="myorder-div">
                        <span>我的订单</span>
                        <span className="myorder-divsvg">
                            <svg fill="#bbb">
                                <use xmlnsXlink="http://www.w3.org/1999/xlink" xlinkHref="#arrow-right"></use>
                            </svg>
                        </span>
                    </div>
                </Link>
                <a href='https://home.m.duiba.com.cn/#/chome/index' className="myorder">
                    <aside>
                        <svg fill="#fc7b53">
                            <use xmlnsXlink="http://www.w3.org/1999/xlink" xlinkHref="#point"></use>
                        </svg>
                    </aside>
                    <div className="myorder-div">
                        <span>积分商城</span>
                        <span className="myorder-divsvg">
                            <svg fill="#bbb">
                                <use xmlnsXlink="http://www.w3.org/1999/xlink" xlinkHref="#arrow-right"></use>
                            </svg>
                        </span>
                    </div>
                </a>
                <Link to='/vipcard' className="myorder">
                    <aside>
                        <svg fill="#ffc636">
                            <use xmlnsXlink="http://www.w3.org/1999/xlink" xlinkHref="#vip"></use>
                        </svg>
                    </aside>
                    <div className="myorder-div">
                        <span>饿了么会员卡</span>
                        <span className="myorder-divsvg">
                            <svg fill="#bbb">
                                <use xmlnsXlink="http://www.w3.org/1999/xlink" xlinkHref="#arrow-right"></use>
                            </svg>
                        </span>
                    </div>
                </Link>
            </section>
            <section className="profile-1reTe">
                <Link to='/service' className="myorder">
                    <aside>
                        <svg fill="#4aa5f0">
                            <use xmlnsXlink="http://www.w3.org/1999/xlink" xlinkHref="#service"></use>
                        </svg>
                    </aside>
                    <div className="myorder-div">
                        <span>服务中心</span>
                        <span className="myorder-divsvg">
                            <svg fill="#bbb">
                                <use xmlnsXlink="http://www.w3.org/1999/xlink" xlinkHref="#arrow-right"></use>
                            </svg>
                        </span>
                    </div>
                </Link>
                <Link to='/download' className="myorder">
                    <aside>
                        <svg fill="#3cabff">
                            <use xmlnsXlink="http://www.w3.org/1999/xlink" xlinkHref="#download"></use>
                        </svg>
                    </aside>
                    <div className="myorder-div" style={{borderBottom: 0}}>
                        <span>下载饿了么APP</span>
                        <span className="myorder-divsvg">
                            <svg fill="#bbb">
                                <use xmlnsXlink="http://www.w3.org/1999/xlink" xlinkHref="#arrow-right"></use>
                            </svg>
                        </span>
                    </div>
                </Link>
            </section>
      </section>
      <FootGuide {...this.props}></FootGuide>
    </div>
    )
  }
}

const mapStateToProps = state => {
  const { shared } = state;
  return {
    geoHash: shared.geoHash,
    latitude: shared.latitude,
    longitude: shared.longitude
  };
};
export default connect(mapStateToProps)(Profile)