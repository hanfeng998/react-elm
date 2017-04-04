import React, { Component } from 'react';
import './ratingStar.css'

class RatingStar extends Component {
    constructor (props) {
        super(props)
    }

    render() {
        const num  = [0,0,0,0,0]
        return (
            <div className="rating_container">
                <section className="star_container">
                    {
                        num.map((item,index)=> (
                            <svg className="grey_fill"  key={index}>
                                <use xmlnsXlink="http://www.w3.org/1999/xlink" xlinkHref="#star"></use>
                            </svg>
                        ))
                    }
                </section>
                <div style={{width: this.props.rating*2/5 +'rem'}} className="star_overflow">
                    <section className='star_container'>
                        {
                            num.map((item, index) => (
                                <svg className='orange_fill' key={index}>
                                    <use  xmlnsXlink="http://www.w3.org/1999/xlink" xlinkHref="#star"></use>
                                </svg>
                                
                            ))
                        }
                    </section>
                </div>  
            </div>
        )
    }
}

export default RatingStar