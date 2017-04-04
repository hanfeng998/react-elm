import React, { Component } from 'react';
import './head.css'
import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom'


class Head extends Component {
    constructor(props) {
        super(props);
        this.state = {
            
        }
        
    }
    goBack() {
        window.history.back()
    }
    render() {
        return (
        <header id='head_top'>
            {this.props.logo}
            {this.props.search}
            {
                this.props.goBack && (
                    <section className="head_goback" onClick = {this.goBack}>
                        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" version="1.1">
                            <polyline points="12,18 4,9 12,0" style={{fill:"none",stroke:"rgb(255,255,255)", strokeWidth:2}}/>
                        </svg>
                    </section>
                )
            }
            
            <Link to={this.state.userInfo? '/profile':'/login'} className="head_login">  
                {this.props.signUp&&<span className="login_span" >登录|注册</span>}
            </Link>
            {this.props.headTitle&&(
                 <section className="title_head ellipsis" >
                    <span className="title_text">{this.props.headTitle}</span>
                </section>
            )}
            {this.props.msiteTitle}
            {this.props.changeCity}
        </header>
        )
    }
}

export default Head