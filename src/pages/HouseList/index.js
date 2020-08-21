import React, { Component } from 'react'
import { Flex, Toast } from 'antd-mobile'
import SearchHeader from '../../components/SearchHeader'
import {
  List,
  InfiniteLoader,  // 滚动加载
  WindowScroller,
  AutoSizer
} from 'react-virtualized'
import Filter from './components/Filter/index'
import HouseItem from '../../components/HouseItem'
import { BASE_URL, getCurrentCity } from '../../utils'
import {API} from '../../utils/api'
import NoHouse from '../../components/NoHouse'
import styles from './index.module.css'
import Sticky from '../../components/Sticky'




export default class HouseList extends Component {
  state = {
    list: [],
    // 总条数
    count: 0,
    //loading
    isLoading: false
  }

  //地区初始化值
  label = ''
  //初始化实例属性
  filters = {}

  async componentDidMount () {
    // 获取当前城市id
    const { label, value } = await getCurrentCity()
    this.label = label
    this.value = value

    await this.searchHouseList()
  }

  async searchHouseList () {
    // 接口获取数据
    this.setState({

      isLoading: true
    })

    Toast.loading('加载中....', 0, null, false)

    const res = await API.get('http://localhost:8080/houses', {
      params: {
        cityId: this.value,
        ...this.filters,
        start: 1,
        end: 20
      }
    })
    // console.log(res.data.body)
    const { count, list } = res.data.body
    Toast.hide()

    if (count !== 0) {
      Toast.info(`共找到${count}条房源信息`, 2, null, false)
    }

    this.setState({
      count: count,
      list: list,
      isLoading: false
    })

  }

  onFilter = filters => {
    //接收Filter组件中的筛选条件数据

    this.filters = filters
     // 重新获取数据
    this.searchHouseList()
   
  }

  //判断列表中的每一行是否都加载完成了
  isRowLoaded = ({ index }) => {
    // 数据完整
    return !!this.state.list[index]
  }

  // 用来获取更多房屋列表数据
  // 注意 该方法返回Promise对象并且 这个对象应该在数据加载完成时 来调用resolve 让Promise的状态变为 已完成
  loadMoreRows = ({ startIndex, stopIndex }) => {
    return new Promise(resolve => {
      API.get('http://localhost:8080/houses', {
        params: {
          ...this.filters,
          cityId: this.value,
          start: startIndex,
          end: stopIndex
        }
      }).then(res => {

        this.setState({
          list: [...this.state.list, ...res.data.body.list]
        })

        // console.log('-=-=-=-=-=',this.state.list)

        //数据加载完成时 来调用resolve 让Promise的状态变为 已完成
        resolve()
      })
    })
  }

  //渲染房屋列表项 Item
  renderHouseList = ({ key, index, style }) => {

    // List
    const { list } = this.state
    const house = list[index]
// console.log('--------',list)
    //保证houseImg存在再继续
    if (!house) {
      return (
        <div key={key} style={style}>
          <p className={styles.loading}/>
        </div>
      )
    }

    return (
      <HouseItem
        key={key}
        // onClick={} // 详情页
        style={style}
        src={'http://localhost:8080' + house.houseImg}
       onClick={()=>{this.props.history.push(`/detail/${house.houseCode}`)}}
        title={house.title}
        desc={house.desc}
        tags={house.tags}
        price={house.price}
      />
    )
  }

  //  渲染列表数据
  renderList () {
    // 没有数据的情况 loading count  list
    const { count, isLoading } = this.state

    if (count === 0 && !isLoading) {
      return <NoHouse>没有找到房源 , 请您换个条件试试吧~</NoHouse>
    }

    return (
      <InfiniteLoader
        rowCount={count}   //个数
        isRowLoaded={this.isRowLoaded}
        loadMoreRows={this.loadMoreRows}
      >
        {/*func*/}
        {({ onRowsRendered, registerChild }) => (
          <WindowScroller>
            {({ height, isScrolling, scrollTop }) => (
              <AutoSizer>
                {({ width }) => (
                  <List
                    width={width}//视口宽
                    height={height}//视口高
                    rowCount={count}//list列表项的行数
                    onRowsRendered={onRowsRendered}
                    ref={registerChild}
                    rowHeight={120}//每一行的高
                    rowRenderer={this.renderHouseList} // 渲染每一个列表项
                    isScrolling={isScrolling}
                    scrollTop={scrollTop}
                    autoHeight
                  />
                )}

              </AutoSizer>
            )}
          </WindowScroller>
        )}

      </InfiniteLoader>
    )
  }

  render () {
    return (
      <div className={styles.root}>
        {/*顶部搜索栏*/}
        <Flex className={styles.header}>
          <i className='iconfont icon-back' onClick={() => this.props.history.go(-1)}/>
          <SearchHeader cityName={this.label} className={styles.searchHeader}/>
        </Flex>
        {/*  条件筛选栏*/}
        {/*固定未解决*/}
      <Sticky height={40}> <Filter onFilter={this.onFilter}/></Sticky>
       

        {/*房屋列表*/}
        <div className={styles.houseItems}>{this.renderList()}</div>
      </div>
    )
  }
}
















