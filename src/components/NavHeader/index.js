//NavBar
import React from 'react'
import {NavBar} from 'antd-mobile'

//引进css对象(就是引进css以对象方式 用的时候可以styles.类名来添加css)
import styles from './index.module.css'
//引进校验工具
import propsType from 'prop-types'
//引进加工工具
import {withRouter} from 'react-router-dom'
function NavHeader({history,children,className,onLiftClick,rightContent}){
    //设置返回方法（点击左侧时）
    const defaultHandler=()=>{
        history.go(-1);
    }
    return(
        <NavBar
        //类名 样式修饰
         className={[styles.navBar,className].join(' ')}
         //明亮模式
         mode='light'
         //返回的图标
         icon={<i className='iconfont icon-back'/>}
         //左侧被点击了
         onLeftClick={onLiftClick||defaultHandler}
         //右侧功能（参数传进来没传就没有）
         rightContent={rightContent}
        >
            {children}
        </NavBar>
    )
}

//参数校验
NavHeader.propsType={
    children:propsType.string.isRequired,
    onLeftClick:propsType.func,
    className:propsType.string,
    rightContent:propsType.arr

}

export default withRouter(NavHeader)