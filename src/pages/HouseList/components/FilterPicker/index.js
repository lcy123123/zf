import React, { Component } from 'react'

import FilterFooter from '../../../../components/Filterfooter'

//选择器

import { PickerView } from 'antd-mobile'

export default class FilterPicker extends Component {
  state = {
    value: this.props.defaultValue
  }

  render () {
    const { onCancel, onSave, data, cols ,type} = this.props
    const value = this.state.value

    return (
      <div>
        <PickerView
          data={data}
          value={value}
          cols={cols}
          onChange={val => {
            this.setState({
              value: val
            })
          }}
        />
        {/*  确定和取消 组件  footer*/}

        <FilterFooter
          onCancel={() => onCancel(type)}
          onOk={() => { onSave(type, value)}}
        />
      </div>
    )
  }
}
