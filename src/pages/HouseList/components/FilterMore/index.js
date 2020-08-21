import React, { Component } from 'react'

//spring
import { Spring } from 'react-spring/renderprops'

import FilterFooter from '../../../../components/Filterfooter'

import styles from './index.module.css'
import { Item } from 'antd-mobile/es/tab-bar'

export default class FilterMore extends Component {

  state = {
    selectedValues: this.props.defaultValue
  }

  //标签点击事件
  onTagClick (value) {
    // 样式发生改变
    // 记录选中项,同步到state

    const { selectedValues } = this.state
    const newSelectedValues = [...selectedValues]

    if (newSelectedValues.indexOf(value) <= -1) {
      //没有当前标签
      newSelectedValues.push(value)
    } else {
      //有
      const index = newSelectedValues.findIndex(item => item == value)
      newSelectedValues.splice(index, 1)
    }

    this.setState({
      selectedValues: newSelectedValues
    })
  }

  //渲染标签
  renderFilters = (data) => {
    const { selectedValues } = this.state

    return data.map(item => {
      //默认选中  isSelected
      const isSelected = selectedValues.indexOf(item.value) > -1

      return (
        <span
          key={item.value}
          className={[styles.tag, isSelected ? styles.tagActive : ''].join(' ')}
          onClick={() => this.onTagClick(item.value)}>
          {item.label}
        </span>
      )

    })
    //每个标签被点击事件
  }

  //点击确定
  onOk = () => {
    // 保留我们的标签 , 当作筛选条件
    // onSava 是父组件中的方法
    const { onSave, type } = this.props
    onSave(type, this.state.selectedValues)
  }

  //点击取消
  onCancel = () => {
    this.setState({
      selectedValues: []
    })
  }

  render () {

    // more 的状态 是否展示

    const {
      type, onCancel, data: {
        roomType, oriented, floor, characteristic
      }
    } = this.props

    const isOpen = type === 'more'

    return (
      <div className={styles.root}>

        {/*  遮罩层*/}
        <Spring to={{ opacity: isOpen ? 1 : 0 }}>
          {/*Spring 内部需要方法实现*/}
          {props => {

            if (props.opacity === 0) {
              return null
            }
            return (
              <div style={props} className={styles.mask} onClick={() => {onCancel(type)}}/>
            )
          }}

        </Spring>
        {/*内容*/}
        <Spring to={{ transform: `translate(${isOpen ? '0px' : '100%'} , 0px)` }}>
          {props => {
            return (
              <>
                {/*条件内容*/}
                <div style={props} className={styles.tags}>
                  <dl className={styles.dl}>
                    <dt className={styles.dt}>户型</dt>
                    <dd className={styles.dd}>
                      {/*户型*/}
                      {this.renderFilters(roomType)}
                    </dd>
                    <dt className={styles.dt}>朝向</dt>
                    <dd className={styles.dd}>
                      {/*朝向*/}
                      {this.renderFilters(oriented)}
                    </dd>
                    <dt className={styles.dt}>楼层</dt>
                    <dd className={styles.dd}>
                      {/*楼层*/}
                      {this.renderFilters(floor)}
                    </dd>
                    <dt className={styles.dt}>房屋特点</dt>
                    <dd className={styles.dd}>
                      {/*特点*/}
                      {this.renderFilters(characteristic)}
                    </dd>
                  </dl>
                </div>
                {/*底部按钮*/}
                <FilterFooter
                  style={props}
                  className={styles.footer}
                  cancelText="清除"
                  onCancel={this.onCancel}
                  onOk={this.onOk}
                />
              </>
            )
          }}

        </Spring>


      </div>
    )
  }
}
















