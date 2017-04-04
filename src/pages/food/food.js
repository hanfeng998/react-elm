import React, { Component } from 'react';
import Head from '../../components/header/head';
import ShopList from '../../components/common/shopList/shopList';
import {getImgPath } from '../../utils/utils';
import {msiteAdress,foodCategory } from '../../services/getData';
import {parse } from 'qs';
import {fetchCategories,clearAll,changeConfirmStatus,
    chooseCategoryIds,chooseSortType, setHeadTitle, chooseType, selectCategoryName, fetchActivity, fetchDelivery,selectDeliveryMode,selectSupportsId, initSupportIds} from '../../store/actions'
import './food.css'

class Food extends Component {
    constructor(props) {
        super(props)
    
        this.chooseType  = this.chooseType.bind(this)
        this.chooseCategoryIds = this.chooseCategoryIds.bind(this)
        this.selectCategoryName = this.selectCategoryName.bind(this)
    }

    componentDidMount() {
        const query = parse(this.props.location.search.substr(1));
        const title = query.title
        const id = query.restaurant_category_id
        this.props.dispatch(setHeadTitle(title))
        this.props.dispatch(fetchCategories(this.props.latitude,this.props.longitude)).then(()=> {
            let idx = 0;
            this.props.categories.forEach(item=> {
                if(id == item.id) {
                    this.props.dispatch(selectCategoryName(id, idx))
                }
                idx ++;
            })
        })
        this.props.dispatch(fetchDelivery(this.props.latitude, this.props.longitude))
        this.props.dispatch(fetchActivity(this.props.latitude, this.props.longitude))
    }

    componentWillUnmount() {
        this.props.dispatch(chooseType(''))
    }

    chooseType(type) {
        this.props.dispatch(chooseType(type))  
    }

   
    //选中Category右侧列表的某个选项时，进行筛选，重新获取数据并渲染
    chooseCategoryIds(id, name){
        this.props.dispatch(chooseCategoryIds(id, name))
    }

    selectCategoryName(id,index) {
        this.props.dispatch(selectCategoryName(id, index))
    }

    selectDeliveryMode(id) {
        this.props.dispatch(selectDeliveryMode(id))
    }

    selectSupportIds(index,id) {
        this.props.dispatch(selectSupportsId(index, id))
    }

    clearAll() {
        this.props.dispatch(clearAll())
    }

    sortList(e) {
        const sortByType = e.target.getAttribute('data');
        this.props.dispatch(chooseSortType(sortByType))
    }

    confirmSelectFun() {
        this.props.dispatch(changeConfirmStatus())
    }
    render() {
      
        return (
            <div className="food_container">
                <Head headTitle={this.props.headTitle} goBack="true"></Head>
                <section className='sort_container'>
                    <div className={this.props.sortBy=='food'? 'sort_item choose_type' : 'sort_item'}>
                        <div className="sort_item_container" onClick={()=>this.chooseType('food')}>
                            <div className="sort_item_border">
                                <span className={this.props.sortBy == 'food'&&'category_title'}>{this.props.foodTitle}</span>
                                <svg width="10" height="10" xmlns="http://www.w3.org/2000/svg" version="1.1" className="sort_icon">
                                    <polygon points="0,3 10,3 5,8"/>
                                </svg>
                            </div>
                        </div>
                        {this.props.sortBy == 'food' && (
                            <section className="category_container sort_detail_type">

                            <section className="category_left">
                                <ul>
                                    {this.props.categories.map((item, index)=> (
                                        <li key={index} className={this.props.restaurant_category_id ==item.id?'category_left_li category_active': 'category_left_li'} onClick={()=>this.selectCategoryName(item.id, index)}>
                                            <section>
                                                {!!index &&  (<img className='category_icon' src={getImgPath(item.image_url)} alt=""/>)}
                                                <span>{item.name}</span>
                                            </section>
                                            <section>
                                                <span className="category_count">{item.count}</span>
                                                {!!index&&  (
                                                <svg  width="8" height="8" xmlns="http://www.w3.org/2000/svg" version="1.1" className="category_arrow" >
                                                    <path d="M0 0 L6 4 L0 8"  stroke="#bbb" strokeWidth="1" fill="none"/>
                                                </svg>)}
                                            
                                            </section>
                                        </li>
                                    ))}
                                </ul>
                            </section>
                            <section className="category_right">
                                <ul>
                                    {this.props.categoryDetail.map((item,index)=>(
                                         <li  key={item.id} className={this.props.restaurant_category_ids == item.id || (!this.props.restaurant_category_ids)&&index == 0?"category_right_choosed category_right_li": 'category_right_li'} onClick={()=>this.chooseCategoryIds(item.id, item.name)} >
                                            <span>{item.name}</span>
                                            <span>{item.count}</span>
                                        </li>
                                    ))}
                                   
                                </ul>
                            </section>
                        </section>
                        )}
                        
                    </div>
                    <div className={this.props.sortBy=='sort'? 'sort_item choose_type' : 'sort_item'}>
                        <div className="sort_item_container" onClick={()=>this.chooseType('sort')}>
                        <div className="sort_item_border">
                                <span className={this.props.sortBy == 'sort'&&'category_title'}>排序</span>
                                <svg width="10" height="10" xmlns="http://www.w3.org/2000/svg" version="1.1" className="sort_icon">
                                    <polygon points="0,3 10,3 5,8"/>
                                </svg>
                            </div>
                        </div>
                        {this.props.sortBy == 'sort' && (
                             <section  className="sort_detail_type">
                                <ul className="sort_list_container" onClick={(e)=>this.sortList(e)}>
                                    <li className="sort_list_li">
                                        <svg>
                                            <use xmlnsXlink="http://www.w3.org/1999/xlink" xlinkHref="#default"></use>
                                        </svg>
                                        <p data="0" className="{sort_select: sortByType == 0}">
                                            <span>智能排序</span>
                                            {
                                                this.props.sortByType == 0 && (
                                                     <svg >
                                                        <use xmlnsXlink="http://www.w3.org/1999/xlink" xlinkHref="#selected"></use>
                                                    </svg>
                                                )
                                            }
                                           
                                        </p>
                                    </li>
                                    <li className="sort_list_li">
                                        <svg>
                                            <use xmlnsXlink="http://www.w3.org/1999/xlink" xlinkHref="#distance"></use>
                                        </svg>
                                        <p data="5" className="{sort_select: sortByType == 5}">
                                            <span>距离最近</span>
                                            {
                                                this.props.sortByType == 5 && (
                                                     <svg >
                                                        <use xmlnsXlink="http://www.w3.org/1999/xlink" xlinkHref="#selected"></use>
                                                    </svg>
                                                )
                                            }
                                        </p>
                                    </li>
                                    <li className="sort_list_li">
                                        <svg>
                                            <use xmlnsXlink="http://www.w3.org/1999/xlink" xlinkHref="#hot"></use>
                                        </svg>
                                        <p data="6" className="{sort_select: sortByType == 6}">
                                            <span>销量最高</span>
                                            {
                                                this.props.sortByType == 6 && (
                                                     <svg >
                                                        <use xmlnsXlink="http://www.w3.org/1999/xlink" xlinkHref="#selected"></use>
                                                    </svg>
                                                )
                                            }
                                        </p>
                                    </li>
                                    <li className="sort_list_li">
                                        <svg>
                                            <use xmlnsXlink="http://www.w3.org/1999/xlink" xlinkHref="#price"></use>
                                        </svg>
                                        <p data="1" className="{sort_select: sortByType == 1}">
                                            <span>起送价最低</span>
                                            {
                                                this.props.sortByType == 1 && (
                                                     <svg >
                                                        <use xmlnsXlink="http://www.w3.org/1999/xlink" xlinkHref="#selected"></use>
                                                    </svg>
                                                )
                                            }
                                        </p>
                                    </li>
                                    <li className="sort_list_li">
                                        <svg>
                                            <use xmlnsXlink="http://www.w3.org/1999/xlink" xlinkHref="#speed"></use>
                                        </svg>
                                        <p data="2" className="{sort_select: sortByType == 2}">
                                            <span>配送速度最快</span>
                                            {
                                                this.props.sortByType == 2 && (
                                                     <svg >
                                                        <use xmlnsXlink="http://www.w3.org/1999/xlink" xlinkHref="#selected"></use>
                                                    </svg>
                                                )
                                            }
                                        </p>
                                    </li>
                                    <li className="sort_list_li">
                                        <svg>
                                            <use xmlnsXlink="http://www.w3.org/1999/xlink" xlinkHref="#rating"></use>
                                        </svg>
                                        <p data="3" className="{sort_select: sortByType == 3}">
                                            <span>评分最高</span>
                                            {
                                                this.props.sortByType == 3 && (
                                                     <svg >
                                                        <use xmlnsXlink="http://www.w3.org/1999/xlink" xlinkHref="#selected"></use>
                                                    </svg>
                                                )
                                            }
                                        </p>
                                    </li>
                                </ul>
                        </section>
                        )}
                    </div>
                    <div className={this.props.sortBy=='activity'? 'sort_item choose_type' : 'sort_item'}>
                        <div className="sort_item_container" onClick={()=>this.chooseType('activity')}>
                        <div className="sort_item_border">
                                <span className={this.props.sortBy == 'activity'&&'category_title'}>筛选</span>
                                <svg width="10" height="10" xmlns="http://www.w3.org/2000/svg" version="1.1" className="sort_icon">
                                    <polygon points="0,3 10,3 5,8"/>
                                </svg>
                            </div>
                        </div>
                        {this.props.sortBy == 'activity' && (
                            <section className="sort_detail_type filter_container">
                                <section style={{width: '100%'}}>
                                    <header className="filter_header_style">配送方式</header>
                                    <ul className="filter_ul">
                                        {
                                            this.props.delivery.map(item => (
                                                <li key={item.id} className='filter_li' onClick={()=>this.selectDeliveryMode(item.id)}>
                                                    <svg style={{opacity: item.id == 0 && this.delivery_mode !==0? 0: 1}}>
                                                        <use xmlnsXlink="http://www.w3.org/1999/xlink" xlinkHref={this.props.delivery_mode == item.id? '#selected':'#fengniao'}></use>
                                                    </svg>
                                                    <span className={this.props.delivery_mode == item.id ? 'selected_filter': ''}>{item.text}</span>
                                                </li>
                                            ))
                                        }
                                    </ul>
                                </section>
                                <section style={{width: '100%'}}>
                                    <header className="filter_header_style">商家属性（可以多选）</header>
                                    <ul className="filter_ul" style={{paddingBottom: '.5rem'}}>
                                        {
                                            this.props.activity.map((item, index) => (
                                                <li key={item.id} className="filter_li" onClick={()=>this.selectSupportIds(index, item.id)}>
                                                    {this.props.support_ids[index].status && (
                                                        <svg className="activity_svg">
                                                            <use xmlnsXlink="http://www.w3.org/1999/xlink" xlinkHref="#selected"></use>
                                                        </svg>
                                                    )}
                                                    {
                                                        !this.props.support_ids[index].status && (
                                                            <span className='filter_icon' style={{color: '#' + item.icon_color, borderColor: '#' + item.icon_color}}>{item.icon_name}</span>
                                                        )
                                                    }
                                                    <span className={this.props.support_ids[index].status ? 'selected_filter': ''}>{item.name}</span>
                                                </li>
                                                ))
                                        }
                                    </ul>
                                </section>
                                <footer className="confirm_filter">
                                    <div className="clear_all filter_button_style" onClick={()=>this.clearAll()}>清空</div>
                                    <div className="confirm_select filter_button_style" onClick={()=>this.confirmSelectFun()}>确定
                                        {this.props.filterNum && (<span>({this.props.filterNum})</span>)}
                                            
                                    </div>
                                </footer>
                            </section>
                        )}
                        
                    </div>
                </section>
                <section className="shop_list_container">
                    {
                        this.props.latitude && (
                            <ShopList geoHash={this.props.geoHash} 
                            latitude={this.props.latitude}
                            longitude={this.props.longitude}
                            restaurantCategoryId={this.props.restaurant_category_id} 
                            restaurantCategoryIds={this.props.restaurant_category_ids}
                            sortByType={this.props.sortByType }
                            deliveryMode={this.props.delivery_mode}
                            confirmSelect={this.props.confirmStatus}
                            supportIds={this.props.support_ids}></ShopList>
                        )
                    }
	    	
                </section>
            </div>

        )
    }
}

export default Food;