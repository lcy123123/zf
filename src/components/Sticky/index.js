import React, { Component , createRef } from 'react'
import PropTypes from 'prop-types'
import styles from './index.module.css'

/*
* 1.  封装 Sticky组件  实现吸附功能
* 2.  使用在HouseList中
* 3.  将Filter组件吸附置顶
*
* 4.  创建ref对象
* 5.  监听scroll事件
* */

class Sticky extends Component {
  //创建ref
  placeholder = createRef()
  content = createRef()

  handleScroll = () => {
    //scroll事件处理程序
    const { height } = this.props
    // 拿真实DOM
    const placeholderEl = this.placeholder.current
    const contentEl = this.content.current

    const { top } = placeholderEl.getBoundingClientRect()

    if (top < 0) {

      //吸顶
      contentEl.classList.add(styles.fixed)
      placeholderEl.style.height = `${height}px`

    } else {

      //取消吸顶
      contentEl.classList.remove(styles.fixed)
      placeholderEl.style.height = '0px'
    }
  }

  componentDidMount () {
    //监听scroll事件
    window.addEventListener('scroll', this.handleScroll)
  }

  componentWillUnmount () {
    window.removeEventListener('scroll', this.handleScroll)
  }

  render () {
    return (
      <div>
        {/*  占位元素*/}
        <div ref={this.placeholder}/>
        {/*内容元素*/}
        <div ref={this.content}>{this.props.children}</div>
      </div>
    )
  }

}

Sticky.propTypes = {
  height: PropTypes.number.isRequired
}

export default Sticky




















