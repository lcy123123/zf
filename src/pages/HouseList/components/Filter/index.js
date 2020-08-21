import React, { Component } from 'react'
import FilterTitle from '../FilterTitle'
import FilterMore from '../FilterMore'
import FilterPicker from '../FilterPicker'

import styles from './index.module.css'
import {API} from '../../../../utils/api'
import { Spring } from 'react-spring/renderprops-universal'

//标题高粱状态 true代表高亮  false 不亮
const titleSelectedStatus = {
  area: false,
  mode: false,
  price: false,
  more: false
}

//FilterPicker 和  FIlterMore 组件的选中值
const selectedValues = {
  area: ['area', 'null'],
  mode: ['null'],
  price: ['null'],
  more: []
}

//动画  spring组件  react 动画库
// 提供了2套api
// 1. Hooks api  (react 16.8 新特性  -- Hook)
// 2. Render-props api

export default class Filter extends Component {

  state = {
    // title点击后 赋值
    titleSelectedStatus,
    //记录筛选条件的选中值 (More 点击确定后赋值)
    selectedValues,
    //所有筛选条件的数据
    filtersData: {
      //FilterMore
      roomType: [],
      characteristic: [],
      floor: [],
      oriented: [],
      //FilterPicker
      area: {},
      subway: {},
      rentType: [],
      price: []
    },
    //控制FilterPicker或者 FilterMore组件的现实和隐藏
    openType: ''
  }

  componentDidMount () {
    this.htmlBody = document.body

    //获取Filter数据
    this.getFiltersData()
  }

  async getFiltersData () {
    const { value } = JSON.parse(localStorage.getItem('zf_city'))
    const res = await API.get(`http://localhost:8080/houses/condition?id=${value}`)

    // console.log(res.data.body)

    this.setState({
      filtersData: res.data.body
    })
  }

  onTitleClick = (type) => {
    //body 不能滚了  ?
    this.htmlBody.className = 'body-fixed'

    //type  当前被点击了的title对应的type

    const { titleSelectedStatus, selectedValues } = this.state

    // 根据选中的状态渲染相应的picker组件(确定和取消按钮footer)
    // console.log(titleSelectedStatus , selectedValues)

    // 根据得到的筛选条件对象
    const newTitleSelectedStatus = { ...titleSelectedStatus }
    // 遍历这个对象 , 通过判断 type === 'area'
    // 通过 遍历出来的键名key 确定 bool类型(true/false) 来获取当前高亮

    Object.keys(titleSelectedStatus).forEach(key => {

      //key 表示数组中的每一项 , 此处代表type的值
      if (key === type) {
        //确定了当前被点击了的标题
        newTitleSelectedStatus[type] = true
        return
      }

      //其他标题
      const selectedVal = selectedValues[key]
      if (
        key === 'area' &&
        (selectedVal.length !== 2 || selectedVal[0] !== 'area')
      ) {
        //高亮
        newTitleSelectedStatus[key] = true
      } else if (key === 'mode' && selectedVal[0] !== 'null') {
        //高亮
        newTitleSelectedStatus[key] = true
      } else if (key === 'price' && selectedVal[0] !== 'null') {
        newTitleSelectedStatus[key] = true
      } else if (key === 'more' && selectedVal.length !== 0) {
        newTitleSelectedStatus[key] = true
      } else {
        newTitleSelectedStatus[key] = false
      }

    })

    this.setState({
      //展示对话框
      openType: type,
      //使用新的标题选中状态对象来更新
      titleSelectedStatus: newTitleSelectedStatus
    })

  }

  onCancel = type => {
    // 取消 隐藏对话框
    const { titleSelectedStatus, selectedValues } = this.state
    // 创建新的标题选中的对象
    const newTitleSelectedStatus = { ...titleSelectedStatus }

    //高亮的逻辑处理
    const selectedVal = selectedValues[type]

    if (
      type === 'area' && (selectedVal.length !== 2 || selectedVal[0] !== 'area')
    ) {
      //高亮
      newTitleSelectedStatus[type] = true
    } else if (
      type === 'mode' && (selectedVal[0] !== 'null')
    ) {
      //高亮
      newTitleSelectedStatus[type] = true
    } else if (
      type === 'price' && (selectedVal[0] !== 'null')
    ) {
      //高亮
      newTitleSelectedStatus[type] = true
    } else if (type === 'more' && (selectedVal.length !== 0)) {
      //高亮
      newTitleSelectedStatus[type] = true
    } else {
      newTitleSelectedStatus[type] = false
    }

    // 隐藏对话框

    this.setState({
      openType: '',
      titleSelectedStatus: newTitleSelectedStatus
    })
  }
  onSave = (type, value) => {
    // 确定 隐藏对话框

    const { titleSelectewdStatus } = this.state

    //创建新的对象

    const newTitleSelectedStatus = { ...titleSelectewdStatus }

    //高亮的逻辑处理
    const selectedVal = value

    if (
      type === 'area' && (selectedVal.length !== 2 || selectedVal[0] !== 'area')
    ) {
      //高亮
      newTitleSelectedStatus[type] = true
    } else if (
      type === 'mode' && (selectedVal[0] !== 'null')
    ) {
      //高亮
      newTitleSelectedStatus[type] = true
    } else if (
      type === 'price' && (selectedVal[0] !== 'null')
    ) {
      //高亮
      newTitleSelectedStatus[type] = true
    } else if (type === 'more' && (selectedVal.length !== 0)) {
      //高亮
      newTitleSelectedStatus[type] = true
    } else {
      newTitleSelectedStatus[type] = false
    }

    // 组装筛选条件 --------------------------

    // 根据最新的selectedValues组装筛选条件
    // area  subway 根据区域数据数组中的第一个元素
    // more 将选中的值转化为以,分割的字符串

    const newSelectedValues = {
      ...this.state.selectedValues,
      //只更新当前的type对应的选中值
      [type]: value
    }

    const { area, mode, price, more } = newSelectedValues
    //筛选条件数据
    const filters = {}
    //区域
    const areaKey = area[0]
    let areaValue = 'null'
    if (area.length === 3) {
      areaValue = area[2] !== 'null' ? area[2] : area[1]
    }

    filters[areaKey] = areaValue
    console.log('=====',newSelectedValues)

    //方式 和 租金

    filters.mode = mode[0]
    filters.price = price[0]
    

    //更多筛选
    filters.more = more.join(',')

    console.log(filters)

    //数据已经准备好
    this.props.onFilter(filters)

    //隐藏对话框
    this.setState({
      openType: '',
      //更新title高亮数据
      titleSelectedStatus: newTitleSelectedStatus,
      selectedValues: newSelectedValues

    })

  }

  renderFilterPicker = () => {
    // 数据  openType  selectedValue

    const {
      openType,
      filtersData: { area, subway, rentType, price },
      selectedValues
    } = this.state
    //  以openType做筛选条件
    if (openType !== 'area' && openType !== 'mode' && openType !== 'price') {
      return null
    }

    let data = []
    let cols = 3
    let defaultValue = selectedValues[openType]

    switch (openType) {
      case 'area' :
        //区域  获取数据
        data = [area, subway]
        cols = 3
        break
      case 'mode':
        data = rentType
        cols = 1
        break
      case 'price':
        data = price
        cols = 1
        break
      default:
        break
    }

    return (
      // cancel ok data type  defaultValue cols
      <FilterPicker
        key={openType}
        onSave={this.onSave}
        onCancel={this.onCancel}
        data={data}
        cols={cols}
        type={openType}
        defaultValue={defaultValue}
      />
    )

  }
  renderFilterMore = () => {
    const {
      openType,
      selectedValues,
      filtersData: { roomType, characteristic, floor, oriented }
    } = this.state

    const data = {
      roomType, characteristic, floor, oriented
    }

    const defaultValue = selectedValues.more

    return (
      <FilterMore
        data={data}
        type={openType}
        onSave={this.onSave}
        onCancel={this.onCancel}
        defaultValue={defaultValue}
      />
    )

  }

  renderMask () {
    //  遮罩层
    const { openType } = this.state

    //判断是否显示隐藏
    const isHide = openType === 'more' || openType === ''

    return (
      <Spring from={{ opacity: 0 }} to={{ opacity: isHide ? 0 : 1 }}>
        {
          props => {
            //  遮罩是否存在
            if (props.opacity === 0) {
              return null
            }

            return (
              <div
                style={props}
                className={styles.mask}
                onClick={() => this.onCancel(openType)}
              />
            )
          }
        }
      </Spring>
    )
  }

  render () {
    const { titleSelectedStatus } = this.state
    return (
      <div className={styles.root}>
        {/*  遮罩层 */}
        {this.renderMask()}
        <div className={styles.content}>
          {/*  标题栏 */}
          <FilterTitle titleSelectedStatus={titleSelectedStatus} onClick={this.onTitleClick}/>

          {/* 前三个菜单所对应的内容 picker */}

          {this.renderFilterPicker()}

          {/* 最后一个菜单所对应的内容 more */}

          {this.renderFilterMore()}
        </div>
      </div>
    )
  }
}

