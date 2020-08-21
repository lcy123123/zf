
// import React, { createRef } from 'react'
import React from 'react'

import axios from 'axios'
// import axios from '../../utils/api'

import { Toast } from 'antd-mobile'

import { List ,AutoSizer} from 'react-virtualized'

// 获取城市
import { getCurrentCity } from '../../utils'

// NavHeader 组件

import NavHeader from '../../components/NavHeader'

import './index.scss'
import { object } from 'prop-types'

const formatCityData = list => {
  const cityList = {}
  

  list.forEach(item => {
    // 1. 需要拿到城市名的首字母
    //深圳
    const first = item.short.substr(0, 1)
    // console.log(first)
    // 判断cityList中是否有该分类
    if (cityList[first]) {
      //如果有 , 直接往当前分类中push'数据
      cityList[first].push(item)
      // console.log(cityList[first],'aaa')
      // console.log(cityList)
    } else {
      //如果没有 , 就创建一个 , 存值
      cityList[first] = [item]
    }
    

  })
  //获取字母索引
  const cityIndex=Object.keys(cityList).sort()
  
return {
    cityList,
    cityIndex
}
}

   //索引高度（A B）
   const TITLE_HEIGHT=38
   //每个城市的高度
   const NAME_HEIGHT=50
   //有房源的城市
   const HOUSE_CITY=['北京','深圳','广州','上海']

//封装字母索引方法
const formatCityIndex=letter=>{
  
  switch(letter){
    case 'hot':
    return '热门城市'
    case '#':
      return '当前城市'
      default :
      return letter.toUpperCase()
  }
}

//城市列表信息

export default class CityList extends React.Component {
  constructor (props) {
    super(props)
    

    this.state = {
      //城市列表
      cityList: [],
    //  cityIndex 索引值
    cityIndex:[],
    //指定右侧字母高亮状态
    activeIndex:0
    }
    //创建ref对象
    // console.log(this)
    this.cityListComponent=React.createRef()
  }

  async componentDidMount(){
    await this.getCityList()
    //measureAllRows是主动计算高度 current代表当前（a所对应的块的高度）
    this.cityListComponent.current.measureAllRows()
  }

  async getCityList () {
    const res = await axios.get('http://localhost:8080/area/city?level=1')
    // console.log(res.data.body)

    // res.data.body
    //数据格式化处理城市列表

    const { cityList,cityIndex } = formatCityData(res.data.body)
// console.log('///',cityList)
    //热门城市获取
    const hotRes = await axios.get('http://localhost:8080/area/hot')

    cityList['hot'] = hotRes.data.body
    cityIndex.unshift('hot')

 

    //当前定位城市
    const curCity = await getCurrentCity() //北京
    // console.log(cityList,'111')
    cityList['#'] = [curCity]
    cityIndex.unshift('#')
    

    // console.log(curCity)
    // console.log(cityIndex,cityList)
    this.setState({
      cityIndex,
      cityList
    })

  }

  //封装动态创建每一行高度的方法（抽出来）
getRowHeight=({index})=>{
  //标题+城市数量*每个城市的高度
  const {cityList,cityIndex}=this.state
  return TITLE_HEIGHT+cityList[cityIndex[index]].length*NAME_HEIGHT
}


//改变城市的点击事件
changeCity=({label,value})=>{
if(HOUSE_CITY.indexOf(label)>-1){
  //有房源
  localStorage.setItem('zf_city',JSON.stringify({value,label}))
  this.props.history.go(-1)
}else{
  //没有房源
  Toast.info('该城市暂无房源',2,null,true)
}
}
//List渲染行 （将行显示出来）
rowRenderer=({key,style,index})=>{
  
  //将state里面的值取出来
  const {cityIndex,cityList}=this.state
  
  //将citylist里的数据取出来存放到letter里作为参数传进去（index是指citylist里的第几个数据 调用方法的时候传进来）
  const letter=cityIndex[index]
  // console.log(letter)
return(
<div key={key} style={style} className='city'>
<div className='title'>{formatCityIndex(letter)}</div>
{cityList[letter].map(item=>(
  <div className='name' key={item.value} onClick={()=>this.changeCity(item)}>{item.label}</div>
))}
</div>)
}
//渲染完成后执行 调用方法 自带startindex
onRowsRendered=({startIndex})=>{
  if(startIndex!=this.state.activeIndex){
    this.setState({
      activeIndex:startIndex
    })
  }
}

//渲染右侧索引字母
renderCityIndex=()=>{
  const {cityIndex,activeIndex}=this.state
  return cityIndex.map((item,index)=>(
<li className='city-index-item' key={item} onClick={()=>{
  this.cityListComponent.current.scrollToRow(index)
}}>
<span className={activeIndex===index?'index-active':''}>
  {item==='hot'?'热':item.toUpperCase()}
</span>
</li>
  ))
}

  render () {
    return (
      <div className="citylist">
        {/*顶部导航栏*/}
        <NavHeader>城市选择</NavHeader>
        {/*  城市列表*/}
        {/* AutoSizer是自动获取大小  双标签中间夹着方法 方法体是List  List是长列表 */}
        <AutoSizer>
         { ({width,height})=>(
            <List
            //宽
            width={width}
            //高
            height={height} 
            //获取到真实dom元素
            ref={this.cityListComponent}
            //每行多少个
            rowCount={this.state.cityIndex.length}
            //每行多高
            rowHeight={this.getRowHeight}
            //显示出行
            rowRenderer={this.rowRenderer}
            //显示完成后
            onRowsRendered={this.onRowsRendered}
            // 滚动条
            scrollToAlignment='start'
            />

         )}
          
        </AutoSizer>
        {/*右侧索引列表*/}
         <ul className='city-index'>{this.renderCityIndex()}</ul>
      </div>
    )
  }
}







