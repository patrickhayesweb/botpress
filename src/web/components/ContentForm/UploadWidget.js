import React, { Component } from 'react'
import { Button, FormGroup, InputGroup, FormControl } from 'react-bootstrap'

class UploadWidget extends Component {
  constructor(props) {
    super(props)

    this.state = {
      expanded: !props.value
    }
  }

  componentWillReceiveProps(newProps) {
    if (!newProps.value && !this.state.expanded) {
      this.setState({ expanded: true })
    }
  }

  handleChange = filename => {
    this.props.onChange(filename)
  }

  expand = () => {
    this.setState({ expanded: true })
  }

  collapse = () => {
    this.setState({ expanded: false })
  }

  startUpload = () => {}

  render() {
    const { $filter: filter, $subtype: subtype, type } = this.props.schema
    if (type !== 'string' || subtype !== 'media') {
      return null
    }

    const { expanded } = this.state

    return (
      <div>
        <FormGroup>
          <InputGroup>
            <FormControl
              type="text"
              placeholder="No file picket yet"
              value={this.props.value}
              disabled
              className="form-control"
              id={this.props.id}
            />
            <InputGroup.Button>
              {!expanded ? (
                <Button onClick={this.expand}>{this.props.value ? 'Change...' : 'Pick...'}</Button>
              ) : (
                <Button onClick={this.collapse}>Cancel</Button>
              )}
            </InputGroup.Button>
          </InputGroup>
        </FormGroup>
        {expanded && (
          <FormGroup>
            <InputGroup>
              <FormControl
                type="file"
                accept={filter || '*'}
                placeholder={this.props.placeholder || 'Pick file to upload'}
              />
              <InputGroup.Button>
                <Button bsColor="success">Upload...</Button>
              </InputGroup.Button>
            </InputGroup>
          </FormGroup>
        )}
      </div>
    )
  }
}

export default UploadWidget
