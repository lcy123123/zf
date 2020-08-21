import React, { Component } from 'react'

import { Carousel, Flex } from 'antd-mobile'

import NavHeader from '../../components/NavHeader'
import HouseItem from '../../components/HouseItem'

import { isAuth, BASE_URL, API } from '../../utils'

import styles from './index.module.css'




//猜你喜欢数据
const recommendHouse=[
  {id:1,
   src:'http://localhost:8080/img/message/1.png',
   desc:'85平方米，两室一厅',
   title:'金牌国际南区',
   price:100,
   tags:['美女房东','随时看房']
  },
  {id:2,
    src:'http://localhost:8080/img/message/2.png',
    desc:'85平方米，两室0厅',
    title:'金牌国际南区',
    price:4500,
    tags:['美女房东','随时看房']
   },
   {id:3,
    src:'http://localhost:8080/img/message/3.png',
    desc:'85平方米，两室9厅',
    title:'金牌国际南区',
    price:6500,
    tags:['美女房东','随时看房']
   }

]


//取window中的BMap
const BMap=window.BMap
//地图标注样式
const labelStyle = {
  position:'absolute',
  zIndex:1,
  backgroundColor:'rgb(238, 93, 91)',
  color:'rgb(255,255,255)',
  height:30,
  padding:'5px 10px',
  fontSize:'12px',
  userSelect:'none'
}

export default class HouseDetail extends Component {
 
  state = {
    //数据加载中状态
    isLoading: false,
    //房屋信息
    houseInfo: {
      //小区名
      community: '',
      //房屋图片
      houseImg: [],
      title: '',
      floor: '',
      price: 0,
      description: '',
      oriented: [],
      tags: [],
      roomType: '',
      size: 0,
      supporting: []
    },

    //收藏
    isFavorite:false

  }

  //获取房屋详细信息
  async getHouseDetail () {
    //    /:id --->  this.props.match.params

    console.log(this.props, '********************')
    const { id } = this.props.match.params

    this.setState({
      isLoading: true
    })

    const res = await API.get(`http://localhost:8080/houses/${id}`)

    this.setState({
      houseInfo: res.data.body,
      isLoading: false
    })
    //渲染地图
    const {community,coord}=res.data.body
    this.renderMap(community,coord)
  }
  //渲染地图
  renderMap(community,coord){
    //将地图放在一个指定的容器
    const map =new BMap.Map('map')
    //从后台获取经纬度
    const {latitude,longitude}=coord
    //指定一个点
    const point=new BMap.Point(longitude,latitude)
    //给定指定的点以及距离地图的远近值
    map.centerAndZoom(point,20)
    //设置位置小图标
    const  label = new BMap.Label('',{
      position:point,
      //小图标距离目标位置的偏移值
      offset:new BMap.Size(0,-36)
    })
      //小图标的样式
    label.setStyle(labelStyle)
    //添加内容
    label.setContent(`
         <span>${community}</span>
         <div class="${styles.mapArrow}"></div>
    `)
    //将小图标放在地图上
    map.addOverlay(label)
  }

  componentDidMount () {
    //获取房屋数据
    this.getHouseDetail()
  }

//渲染swiper方法
  renderSwipers () {
    const { houseInfo: { houseImg } } = this.state
    console.log(houseImg)

    return houseImg.map(item => (
      <a key={item} href="http://www.bukaedu.com">
        <img src={'http://localhost:8080' + item} alt=""/>
        {/* <img src={`http://localhost:8080${item}`} alt=""/> */}
      </a>
    ))
  }

  //渲染标签方法
  renderTags () {
    const { houseInfo: { tags } } = this.state
    return tags.map((item, index) => {
      let tagClass = ''

      if (index > 2) {
        tagClass = 'tag3s'
      } else {
        tagClass = 'tag' + (index + 1)
      }

      return (
        <span key={item} className={[styles.tag, styles[tagClass]].join(' ')}>
          {item}
        </span>
      )
    })
  }

  render () {
    const {
      isLoading,
      houseInfo: {
        community,//小区名
        title,
        floor,
        price,
        description,
        oriented,
        roomType,
        size,
        supporting
      },isFavorite
    } = this.state
    return (
      <div className={styles.root}>
        {/*  导航栏*/}
        <NavHeader
          className={styles.navHeader}
          rightContent={[<i key="share" className="iconfont icon-share"/>]}
        >
          {community}
        </NavHeader>
        {/*  轮播图*/}
        <div className={styles.slides}>
          {
            !isLoading ? (
              <Carousel autoplay infinite autoplayInterval={5000}>
                {this.renderSwipers()}
              </Carousel>
            ) : (
              ''
            )
          }
        </div>
        {/*  房屋基础信息*/}
        <div className={styles.info}>
          {/*标题*/}
          <h3 className={styles.infoTitle}>{title}</h3>
          {/*标签*/}
          <Flex className={styles.tags}>
            <Flex.Item>{this.renderTags()}</Flex.Item>
          </Flex>
          {/*基础信息*/}
          <Flex className={styles.infoPrice}>
            <Flex.Item className={styles.infoPriceItem}>
              <div>
                {price}
                <span className={styles.month}>/月</span>
              </div>
              <div>租金</div>
            </Flex.Item>
            <Flex.Item className={styles.infoPriceItem}>
              <div>
                {roomType}
              </div>
              <div>房型</div>
            </Flex.Item>
            <Flex.Item className={styles.infoPriceItem}>
              <div>
                {size}平米
              </div>
              <div>面积</div>
            </Flex.Item>
          </Flex>

          <Flex className={styles.infoBasic}>
            <Flex.Item>
              <div>
                <span className={styles.title}>装修:</span>
                精装
              </div>
              <div>
                <span className={styles.title}>楼层:</span>
                {floor}
              </div>
            </Flex.Item>
            <Flex.Item>
              <div>
                <span className={styles.title}>朝向:</span>
                {oriented.join('、')}
              </div>
              <div>
                <span className={styles.title}>类型:</span>
                普通住宅
              </div>
            </Flex.Item>
          </Flex>
          {/*  地图展示*/}
          <div className={styles.map}>
            <div className={styles.mapTitle}>
              小区：<span>{community}</span>
            </div>
            <div className={styles.mapContainer} id='map'>
              地图
            </div>
          </div>

          {/*  房屋配套*/}

          <div className={styles.about}>

            <div className={styles.houseTitle}>房屋配套</div>

            {/*暂无数据*/}
            {supporting.length === 0 ? (
              <div>暂无数据</div>
            ) : (
              //  显示房屋配套相关内容
              <div>显示房屋配套相关内容</div>
            )}
          </div>

          {/*  房源概况*/}

          <div className={styles.set}>
            <div className={styles.houseTitle}>房源概况</div>
            <div>
              <div className={styles.contact}>
                <div className={styles.user}>
                  <img src={'http://localhost:8080/img/avatar.png'} alt="头像"/>
                  <div className={styles.useInfo}>
                    <div>王女士</div>
                    <div className={styles.userAuth}>
                      <i className={'iconfont icon-auth'}/>
                      已认证房主
                    </div>
                  </div>
                </div>
                <span className={styles.userMsg}>发消息</span>
              </div>
              <div className={styles.descText}>
                {description || '暂无房屋描述'}
              </div>
            </div>
          </div>

          {/*猜你喜欢*/}
          <div className={styles.recommend}>
            <div className={styles.houseTitle}>猜你喜欢</div>
            <div className={styles.items}>
             {recommendHouse.map(item=>(
               <HouseItem {...item} key={item.id}/>
             ))}
              
            </div>
          </div>

          {/*  底部按钮*/}

          <Flex className={styles.fixedBottom}>
            <Flex.Item
              // onClick={}
            >
              <img className={styles.favoriteImg} src={'http://localhost:8080' + (isFavorite ? '/img/star.png' : '/img/unstar.png')} alt="收藏"/>
              <span className={styles.favorite}>
                {isFavorite ? '已收藏' : '收藏'}
              </span>
            </Flex.Item>
            <Flex.Item>在线咨询</Flex.Item>
            <Flex.Item>
              <a href="tel:400-888-8888" className={styles.telephone}>电话预约</a>
            </Flex.Item>
          </Flex>
        </div>
      </div>
    )
  }
}















