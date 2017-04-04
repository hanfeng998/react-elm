import React, { Component } from 'react';
import Head from '../../components/header/head'
import FootGuide from '../../components/footer/footer'
import './login.css'
import {imgBaseUrl} from '../../config/mUtils'
import { connect } from "react-redux";
import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom'
class Login extends Component {
  constructor(props) {
    super(props)
    this.state = {
      loginWay:true
    }
  }

  render() {
    const loginWay = this.state.loginWay
    return (
      <div className='loginContainer'>
        <Head headTitle='登录' goBack='true'></Head>
        {
          loginWay ? (
            <form className='loginForm'>
                <section className="input_container phone_number">
                  <input type="text" placeholder="手机号" name="phone"  />
                  <button>获取验证码</button>
                </section>
                <section className="input_container">
                    <input type="text" placeholder="验证码" name="mobileCode"  />
                </section>
            </form>
          ): (
             <form className="loginForm" >
                <section className="input_container">
                    <input type="text" placeholder="手机号/邮箱/用户名"/ >
                </section>
                <section className="input_container">
                    <input  type="password" placeholder="密码"  />
                    <input  type="text" placeholder="密码"  />
                    <div className="button_switch">
                        <div className="circel_button"></div>
                        <span>abc</span>
                        <span>...</span>
                    </div>
                </section>
                <section className="input_container captcha_code_container">
                    <input type="text" placeholder="验证码"  />
                    <div className="img_change_img">
                        <img  src="captchaCodeImg"/>
                        <div className="change_img" >
                            <p>看不清</p>
                            <p>换一张</p>
                        </div>
                    </div>
                </section>
            </form>
          )
        }
         <p className="login_tips">
            温馨提示：未注册饿了么账号的手机号，登录时将自动注册，且代表您已同意
            <a href="https://h5.ele.me/service/agreement/">《用户服务协议》</a>
        </p>
        <div className="login_container">登录</div>

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
}
export default connect(mapStateToProps)(Login)