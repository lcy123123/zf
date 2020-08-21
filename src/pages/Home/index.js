import React from 'react'
import { TabBar } from 'antd-mobile';
import {Route} from 'react-router-dom'
import Index from '../index'
import './index.css'
import HouseList from '../HouseList'

//tabBar储存的数据
const tabItems=[
    {title:'首页',icon:'icon-ind',path:'/home'},
    {title:'找房',icon:'icon-findHouse',path:'/home/list'},
    {title:'资讯',icon:'icon-infom',path:'/home/news'},
    {title:'我的',icon:'icon-my',path:'/home/profile'}
]

export default class Home extends React.Component{
    state={
        selectedTab:this.props.location.pathname
    }
    renderTabBarItem(){
        return tabItems.map(item =>(
            <TabBar.Item 
                title={item.title}
                key={item.title}
                icon={<i className={`iconfont ${item.icon}`}/>}
                selectedIcon={<i className={`iconfont ${item.icon}`}/>}
                selected={this.state.selectedTab===item.path}
                onPress={()=>{
                    this.setState({
                        //将要显示的页面的路径存到state中的数据中 进行记录（这是路由没有跳转）
                        selectedTab:item.path
                    })
                    //设置路由跳转
                    this.props.history.push(item.path)
                }}
            />

        ))
    }
    //当页面发生更新时执行钩子函数
    componentDidUpdate(prevProps){
     //拿到更新之前路由（在prevProps.）
    //  console.log(this)
     if(prevProps.location.pathname!==this.props.location.pathname){
    //说明改变前和改变后路由不一样 将新的路由存到state里
    this.setState({
        selectedTab:this.props.location.pathname
    })
     }
    }
    render(){
        return(
            <div className='home'>
               {/* <div style={{position:'fixed',width:'100%',bottom:0}}> */}
                  <Route path='/home'exact component={Index}/>
                  {/* citylist的路由跳转 */}
                 <Route path='/home/list' component={HouseList}/>
                  <TabBar>
                     {this.renderTabBarItem()}
                  </TabBar>
                </div>
            // </div>
           
        )
    }
}