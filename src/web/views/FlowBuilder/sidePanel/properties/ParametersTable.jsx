import React, { Component } from 'react'
import { Table } from 'react-bootstrap'
import classnames from 'classnames'
import _ from 'lodash'

const style = require('./parameters.scss')

export default class ParametersTable extends Component {
  constructor(props) {
    super(props)
    this.state = { arguments: this.transformArguments(props.value) }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ arguments: this.transformArguments(nextProps.value) })
  }

  transformArguments(args) {
    const valuesArray = [..._.map(args, (value, key) => ({ key, value })), { key: '', value: '' }]
    return _.fromPairs(valuesArray.map((el, i) => [i, el]))
  }

  getValues() {
    return this.state.arguments
  }

  onChanged() {
    setImmediate(() => {
      this.props.onChange && this.props.onChange(this.state.arguments)
    })
  }

  render() {
    const renderRow = id => {
      const args = this.state.arguments

      const regenerateEmptyRowIfNeeded = () => {
        if (args[id].key === '' && args[id].value === '') {
          args[new Date().getTime()] = { key: '', value: '' }
        }
      }

      const deleteDuplicatedEmptyRows = () => {
        let count = 0
        for (const id in this.state.arguments) {
          const v = this.state.arguments[id]
          if (v.key === '' && v.value === '') {
            count++
          }
          if (count > 1) {
            const clone = { ...this.state.arguments }
            delete clone[id]
            return this.setState({
              arguments: clone
            })
          }
        }
      }

      const editKey = evt => {
        if (evt.target.value !== '') {
          regenerateEmptyRowIfNeeded()
        } else {
          if (this.state.arguments[id].value === '') {
            setTimeout(deleteDuplicatedEmptyRows, 100)
          }
        }

        this.setState({
          arguments: { ...args, [id]: { key: evt.target.value, value: args[id].value } }
        })

        this.onChanged()
      }

      const editValue = evt => {
        if (evt.target.value !== '') {
          regenerateEmptyRowIfNeeded()
        } else {
          if (this.state.arguments[id].key === '') {
            setTimeout(deleteDuplicatedEmptyRows, 100)
          }
        }

        this.setState({
          arguments: { ...args, [id]: { value: evt.target.value, key: args[id].key } }
        })

        this.onChanged()
      }

      const isKeyValid = args[id].key.length > 0 || !args[id].value.length
      const keyClass = classnames({ [style.invalid]: !isKeyValid })

      return (
        <tr key={id}>
          <td className={keyClass}>
            <input type="text" value={args[id].key} onChange={editKey} />
          </td>
          <td>
            <input type="text" value={args[id].value} onChange={editValue} />
          </td>
        </tr>
      )
    }

    return (
      <Table className={classnames(style.table, this.props.className)}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Value</th>
          </tr>
        </thead>
        <tbody>{_.orderBy(_.keys(this.state.arguments), x => x).map(renderRow)}</tbody>
      </Table>
    )
  }
}
