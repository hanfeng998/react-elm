import React, { Component } from 'react';
import Head from '../../components/header/head'
import {currentcity, searchplace} from '../../services/getData'
import {getStore, setStore} from '../../config/mUtils'
import './city.css'
import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom' 

class City extends Component {
    constructor(props) {
        super(props);
        this.state = {
            cityName: '',
            historytitle: true,
            placelist: [],
            placeNone: false,
            inputValue: null,
            cityId: ''
        }

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.nextpage = this.nextpage.bind(this);
    }

    componentDidMount() {
        this.setState({cityId: this.props.match.params.id});
        //获取搜索历史记录
        if (getStore('placeHistory')) {
           
            let placelist = JSON.parse(getStore('placeHistory'));
            this.setState({placelist: placelist})
        }
        currentcity(this.props.match.params.id).then(res => {
            this.setState(()=> {
                return {
                    cityName: res.name
                }
            })
        })
    }

    
    handleChange(event) {
        this.setState({inputValue: event.target.value});
    }
    handleSubmit(e) {
        e.preventDefault();
        if (this.state.inputValue) {
            searchplace(this.state.cityId, this.state.inputValue).then(res => {
                this.setState(()=> {
                    return {
                        historytitle: false,
                        placelist: res,
                        placeNone: res.length? false : true
                    }
                })
                
            })
        }
    }

    nextpage(index, geohash){
        let history = getStore('placeHistory');
        let choosePlace = this.state.placelist[index];
        let placeHistory = []
        if (history) {
            let checkrepeat = false;
            placeHistory = JSON.parse(history);
            placeHistory.forEach(item => {
                if (item.geohash == geohash) {
                    checkrepeat = true;
                }
            })
            if (!checkrepeat) {
                placeHistory.push(choosePlace)
            }
        }else {
            placeHistory.push(choosePlace)
        }
        setStore('placeHistory',placeHistory)
        this.props.history.push('/msite?geoHash='+geohash);
    }

    render() {
        return (
            <div className="city_container">
                <Head headTitle={this.state.cityName} goBack changeCity={<Link to='/' className='change_city'>切换城市</Link>}></Head>
                <form className="city_form" onSubmit={this.handleSubmit}>
                    <div>
                        <input type="search" name="city" onChange={this.handleChange} placeholder="输入学校、商务楼、地址" className="city_input input_style" required />
                    </div>
                    <div>
                        <input type="submit" name="submit" className="city_submit input_style" value="提交"/>
                    </div>
                </form>
                {this.state.historytitle&& <header className="pois_search_history">搜索历史</header>}
                <ul className="getpois_ul">
                    {this.state.placelist.map((obj,index)=>(
                        <li key={index} onClick={()=>this.nextpage(index, obj.geohash)}>
                        <h4 className="pois_name ellipsis">{obj.name}</h4>
                        <p className="pois_address ellipsis">{obj.address}</p>
                    </li>
                    ))}
                </ul>
                {this.state.placeNone&& <div className="search_none_place">很抱歉！无搜索结果</div>}
                
            </div>
             
        )
    }
}

export default City;