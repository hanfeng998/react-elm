import React, { Component } from 'react';
import Head from '../../components/header/head'
import {cityGuess, hotcity, groupcity} from '../../services/getData'
import './home.css'
import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom' 
class Home extends Component {
    constructor (props) {
        super(props);
         // 获取当前城市
        this.state = {
            guessCity: '',
            guessCityId: 0,
            hotcity: [],
            groupcity: {},
        }
    }

    componentDidMount() {
        cityGuess().then(res => {
            this.setState((state) => {
                return {
                    guessCity :res.name,
                    guessCityId :res.id
                }
            })
        })

         //获取热门城市
        hotcity().then(res => {
            this.setState((state) => {
                return {
                    hotcity : res
                }
            })
        })
        // 获取所有城市
        groupcity().then(res => {
            this.setState((state) => {
                return {
                    groupcity: this.sortgroupcity(res)
                }
            })
        })
    }
    sortgroupcity(groupcity){
            let sortobj = {};
            for (let i = 65; i <= 90; i++) {
                if (groupcity[String.fromCharCode(i)]) {
                    sortobj[String.fromCharCode(i)] = groupcity[String.fromCharCode(i)];
                }
            }
        return sortobj
    }
    
    render() {
        return (
            <div>
                <Head logo={<Logo/>} signUp>

                </Head>
                <nav className="city_nav">
                    <div className="city_tip">
                        <span>当前定位城市：</span>
                        <span>定位不准时，请在城市列表中选择</span>
                    </div>
                    <Link to={'/city/' + this.state.guessCityId} className="guess_city">
                        <span>{this.state.guessCity}</span>
                        <svg className="arrow_right">
                            <use xmlnsXlink="http://www.w3.org/1999/xlink" xlinkHref="#arrow-right"></use>
                        </svg>
                    </Link>  
                </nav>
                
                 <section id="hot_city_container">
                    <h4 className="city_title">热门城市</h4>
                    <ul className="citylistul clear">
                        {this.state.hotcity.map((item) => <Link key={item.id} to={"/city/" + item.id} >{item.name}</Link>)}
                    </ul>
                </section>
                <section className="group_city_container">
                    <ul className="letter_classify">
                        
                        {Object.keys(this.state.groupcity).map((key, index) => (
                            <li className="letter_classify_li" key= {index}>
                                <h4 className="city_title">{key}
                                    {index == 0 && (<span>（按字母排序）</span>)}
                                </h4>
                                <ul className="groupcity_name_container citylistul clear">
                                    {this.state.groupcity[key].map((item)=> <Link key={item.id} to= {'/city/' + item.id} className="ellipsis">{item.name}</Link>)}
                                </ul>
                            </li>
                        ))}
                        
                    </ul>
                </section>
            </div>
        )
    }
}

const Logo = () => (
    <span className="head_logo">ele.me</span>
)

export default Home;