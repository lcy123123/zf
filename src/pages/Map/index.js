import React, { Component } from 'react'

import { API, BASE_URL } from '../../utils'

import { Toast } from 'antd-mobile'

import NavHeader from '../../components/NavHeader'

import styles from './index.module.css'

//从window上取BMap
const BMap = window.BMap
//设置小图标的样式
const labelStyle = {
  cursor: 'pointer',
  border: '1px solid rgb(255,0,0)',
  fontSize: '12px',
  textAlign: 'center'
}

//地图组件
export default class Map extends Component {
  state = {
      //房源列表
    houseList: [],
    //是否显示列表
    isShowList: false,
  }
  //钩子函数（当组件加载完成后执行）
  componentDidMount () {
    //初始化地图（加载地图）
    this.initMap()
  }
//初始化地图
  initMap () {
      //在本地取城市名 和城市编号（转成对象之后在解构）
    const { label, value } = JSON.parse(localStorage.getItem('zf_city'))
    //指定装地图的容器
    const map = new BMap.Map('container')
    //this指向的是window 将组件内的局部map绑在window上（延长生命周期）
    this.map = map
    //创建地址解析器实例（为了得到经纬度）
    const myGeo = new BMap.Geocoder()
    //将地址解析的结果显示在地图上 , 视野
    myGeo.getPoint(
        //城市名称（在本地取的）
      label,
      //创建地图
      async point => {
        if (point) {
          //初始化地图
          map.centerAndZoom(point, 10)
          //常用控件
          //（左上角小工具）
          map.addControl(new BMap.NavigationControl()); 
          //比例尺（下面的缩放） 
          map.addControl(new BMap.OverviewMapControl());
          //折叠（右下角）
          map.addControl(new BMap.ScaleControl())

          //  覆盖物
          this.renderOverlays(value)
        }
      }
    )

    //
  }

  //  覆盖物
  //  位置 , 接收区域(房源数据)
  //  下级地图缩放级别
  async renderOverlays (id) {
    //开启loading
    Toast.loading('加载中...', 0, null, false)

    const res = await API.get(`http://localhost:8080/area/map?id=${id}`)
    //隐藏加载框
    Toast.hide()
    //存数据
    const data = res.data.body
    console.log(res.data.body)

    // zoom缩放级别   type类型
    const { nextZoom, type } = this.getZoomAndType()
    //遍历数据中的每一项
    data.forEach(item => {
      //创建覆盖物（给数据，级别，圆形还是方形）
      this.createOverlays(item, nextZoom, type)
    })
  }
//抽离缩放级别方法
  getZoomAndType () {
    //获取当前缩放级别（this.map下的方法）当前级别
    const zoom = this.map.getZoom()

    let nextZoom, type

    // console.log("当前地图缩放级别:" , zoom)   //10
    //判断级别远近（越向下越放大）
    if (zoom >= 10 && zoom < 12) {
      //  区
      nextZoom = 13
      type = 'circle'
    } else if (zoom >= 12 && zoom < 14) {
      //镇
      nextZoom = 15
      type = 'circle'
    } else if (zoom >= 14 && zoom < 16) {
      //小区
      type = 'rect'
    }

    return {
      //下一级别和类型
      nextZoom,
      type
    }
  }
  //创建遮盖物（给数据，级别，类型（圆型还是方形））
  createOverlays (data, zoom, type) {
    const {
      coord: { longitude, latitude },
      //小图标的名称（显示的内容）
      label: label,
      //小图标的个数
      count,
      //小图标的编号
      value
    } = data
    // console.log(data,'-------')
    //创建 区域Point
    const areaPoint = new BMap.Point(longitude, latitude)

    if (type === 'circle') {
      //区或镇
      this.createCircle(areaPoint, label, count, value, zoom)
    } else {
      //小区
      this.createRect(areaPoint, label, count, value)
    }
  }
 //创建圆型
  createCircle (point, name, count, id, zoom) {
    const label = new BMap.Label('', {
      position: point,
      //小图标的偏移值
      offset: new BMap.Size(-36, -36)
    })

    label.id = id

    label.setContent(`
      <div class="${styles.bubble}">
        <p class="${styles.name}">${name}</p>
        <p>${count}套</p>
      </div>
    `)
    //设置样式

    label.setStyle(labelStyle)

    //点击事件
    label.addEventListener('click', () => {
      //获取下一级数据
      this.renderOverlays(id)
      //让地图放大
      this.map.centerAndZoom(point, zoom)
      //清除覆盖物（上一级的）

      this.map.clearOverlays()
    })

    this.map.addOverlay(label)
  }
//创建方形
  createRect(point, name, count, id){
    const label = new BMap.Label('',{
      position:point,
      offset:new BMap.Size(-50,-30)
    })

    label.id = id
   //设置小图标的内容
    label.setContent(`
      <div class="${styles.rect}">
        <span class="${styles.housename}">${name}</span>
        <span class="${styles.housenum}">${count}</span>
      </div>
    `)

    label.setStyle(labelStyle)

    //点击事件 , 房源列表


    this.map.addOverlay(label)
  }

  render () {
    return (
      <div className={styles.map}>
        <NavHeader>地图找房</NavHeader>
        {/*  地图容器*/}
        <div id="container" className={styles.container}/>
      </div>
    )
  }
}























