//搜索框组件
import React from 'react'
import './index.scss'
import { Flex } from 'antd-mobile'
import {withRouter} from 'react-router-dom'
import PropTypes from 'prop-types'


//在调用组件时需要传类名  
//左侧 中间 右侧的整个flex的固定样式是search-box 
//如果调用组件时传了类名就用传进来的没传就用默认的
//因为类名多个时用的是数组方式 所以没传的情况要用空占位
//又因为classname多个类名时中间用空格 数组方式中间是逗号 用join将空格替换成逗号
function SearchHeader({history,className,cityName}){
    return(
        <Flex className={['search-box',className||''].join(' ')}>
            {/* 左侧城市 */}
            <Flex className='search'>
                <div className='location' onClick={()=>history.push('/citylist')} >
                    {/* 城市 */}
                     <span className='name'>{cityName}</span>
                     <i className='iconfont icon-arrow'/>
                </div>
                {/* 中间搜索框 */}
                <div className='form' onClick={()=>history.push('/search')}>
                    <i className='iconfont icon-seach'/>
                    <span className='text'>请输入小区名称地址</span>
                </div>
            </Flex>
            
            {/* 右侧地图 */}
            <i className='iconfont icon-map' onClick={()=>history.push('/map')}></i>
        </Flex>
    )
}

//对传进来的参数进行数据类型的校验
SearchHeader.propTypes={
    cityName:PropTypes.string.isRequired,
    className:PropTypes.string
}

//搜索框是一个组件 作为组件暴露出去时会缺少一些东西 所以用withRouter加工一下组件
export default withRouter(SearchHeader) 