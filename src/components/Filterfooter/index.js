//确定取消按钮
import  React from 'react'
import {Flex} from 'antd-mobile'
import PropTypes from 'prop-types'
import styles from './index.module.css'

function FilterFooter ({onText='确定',cancelText='取消',onOk,onCancel,className,style}){
    return(
        <Flex style={style} className={[styles.root,className || ''].join(' ')}>
            {/* 取消按钮 */}
            <span className={[styles.btn,styles.cancel].join(' ')} onClick={onCancel}>{cancelText}</span>
            {/* 确定按钮 */}
            <span className={[styles.btn,styles.ok].join(' ')} onClick={onOk}>{onText}</span>
        </Flex>
    )
}

FilterFooter.propTypes={
    cancelText:PropTypes.string,
    onText:PropTypes.string,
    onOk:PropTypes.func,
    onCancel:PropTypes.func,
    style:PropTypes.object,
    className:PropTypes.string

}


export default FilterFooter