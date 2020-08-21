import React from 'react'
import {Flex} from 'antd-mobile'
import styles from './index.module.css'

//条件筛选标题数据
const titleList=[
    {title:'区域',type:'area'},
    {title:'方式',type:'mode'},
    {title:'租金',type:'price'},
    {title:'筛选',type:'more'},
]

//被选中的有高亮 遍历已经存在的数据
//点击事件 在事件中调用父组件传过来的方法
//父组件判断type



//向组件中传入参数和方法
export default function FilterTitle ({titleSelectedStatus,onClick}){
   return(
       //使用弹性布局 布局四个标题
        <Flex className={styles.root}>
            {/* 遍历数 */}
            {titleList.map(item=>{
                // 对遍历出来的item.type进行判断(将唯一的type对应的item赋值给isSelected)
                const isSelected=titleSelectedStatus[item.type]
                return(
                    //
                    <Flex.Item key={item.type} onClick={() => onClick(item.type)}>
                    {/*被选中的  selected*/}
                    <span className={[styles.dropdown, isSelected ? styles.selected : ''].join(' ')}>
                    {/*<span className={styles.dropdown}>*/}
                      <span>{item.title}</span>
                      <i className='iconfont icon-arrow'/>
                    </span>
                  </Flex.Item>
                )
            })}
        </Flex>
    )
}