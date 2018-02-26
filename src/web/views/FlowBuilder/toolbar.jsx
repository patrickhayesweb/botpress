import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Button, OverlayTrigger, Tooltip, DropdownButton, MenuItem } from 'react-bootstrap'

import _ from 'lodash'

import { updateGlobalStyle } from '~/actions'

const style = require('./toolbar.scss')

class Toolbar extends React.Component {
  state = {}

  componentDidMount() {
    this.props.updateGlobalStyle({
      'bp-navbar': {
        borderBottom: 'none'
      }
    })
  }

  componentWillUnmount() {
    this.props.updateGlobalStyle({
      'bp-navbar': {}
    })
  }

  render() {
    const createTooltip = (name, text) => <Tooltip id={name}>{text}</Tooltip>

    const hasUnsavedChanges = !_.isEmpty(this.props.dirtyFlows)

    const isInsertNodeMode = this.props.currentDiagramAction === 'insert_node'

    const toggleInsertMode = action => element => {
      this.props.setDiagramAction(this.props.currentDiagramAction === action ? null : action)
    }

    const canMakeStartNode = () => {
      const current = this.props.currentFlow && this.props.currentFlow.startNode
      const potential = this.props.currentFlowNode && this.props.currentFlowNode.name
      return current && potential && current !== potential
    }

    const setAsCurrentNode = () => {
      this.props.updateFlow({
        startNode: this.props.currentFlowNode.name
      })
    }

    const promptNewFlow = () => {
      let name = prompt('Enter the name of the new flow')

      if (!name) {
        return
      }

      name = name.replace(/\.flow\.json$/i, '')

      if (/[^A-Z0-9-_\/]/i.test(name)) {
        return alert('ERROR: The flow name can only contain letters, numbers, underscores and hyphens.')
      }

      if (_.includes(this.props.flowsNames, name + '.flow.json')) {
        return alert('ERROR: This flow already exists')
      }

      this.props.onCreateFlow(name)
    }

    const noSkills = (
      <MenuItem eventKey="1" disabled={true}>
        No skills installed
      </MenuItem>
    )

    const insertSkillsDropdown = (
      <DropdownButton title="Insert skill" id="toolbarInsertSkill">
        <MenuItem header>Installed skills</MenuItem>
        {!this.props.skills.length && noSkills}
        {this.props.skills.map((skill, i) => {
          return (
            <MenuItem key={i} eventKey={i} onClick={() => this.props.buildSkill(skill.id)}>
              {skill.name}
            </MenuItem>
          )
        })}
      </DropdownButton>
    )

    return (
      <div className={style.wrapper}>
        <div className={style.toolbar}>
          <Button className={style.btn} bsStyle="default" onClick={promptNewFlow}>
            <OverlayTrigger placement="bottom" overlay={createTooltip('addFlow', 'Create new flow')}>
              <i className="material-icons">create_new_folder</i>
            </OverlayTrigger>
          </Button>

          <div className={style.separator} />

          <Button
            className={style.btn}
            bsStyle="default"
            disabled={!hasUnsavedChanges}
            onClick={() => this.props.onSaveAllFlows && this.props.onSaveAllFlows()}
          >
            <OverlayTrigger placement="bottom" overlay={createTooltip('saveAll', 'Save all')}>
              <i className="material-icons">save</i>
            </OverlayTrigger>
          </Button>

          <div className={style.separator} />

          <Button className={style.btn} bsStyle="default" disabled={!this.props.canUndo} onClick={this.props.undo}>
            <OverlayTrigger placement="bottom" overlay={createTooltip('undo', 'Undo')}>
              <i className="material-icons">undo</i>
            </OverlayTrigger>
          </Button>

          <Button className={style.btn} bsStyle="default" disabled={!this.props.canRedo} onClick={this.props.redo}>
            <OverlayTrigger placement="bottom" overlay={createTooltip('redo', 'Redo')}>
              <i className="material-icons">redo</i>
            </OverlayTrigger>
          </Button>

          <Button className={style.btn} bsStyle="default" onClick={this.props.onCopy}>
            <OverlayTrigger placement="bottom" overlay={createTooltip('copy', 'Copy')}>
              <i className="material-icons">content_copy</i>
            </OverlayTrigger>
          </Button>

          <Button
            className={style.btn}
            bsStyle="default"
            onClick={this.props.onPaste}
            disabled={!this.props.canPasteNode}
          >
            <OverlayTrigger placement="bottom" overlay={createTooltip('paste', 'Paste')}>
              <i className="material-icons">content_paste</i>
            </OverlayTrigger>
          </Button>

          <div className={style.separator} />

          <Button
            className={style.btn}
            bsStyle="default"
            active={isInsertNodeMode}
            onClick={toggleInsertMode('insert_node')}
          >
            <OverlayTrigger placement="bottom" overlay={createTooltip('addNode', 'Insert New Node')}>
              <i className="material-icons">add_box</i>
            </OverlayTrigger>
          </Button>

          {insertSkillsDropdown}

          <div className={style.separator} />

          <Button className={style.btn} bsStyle="default" disabled={!canMakeStartNode()} onClick={setAsCurrentNode}>
            <OverlayTrigger placement="bottom" overlay={createTooltip('makeStartNode', 'Set as Start node')}>
              <i className="material-icons">stars</i>
            </OverlayTrigger>
          </Button>

          <Button className={style.btn} bsStyle="default" onClick={this.props.onDelete}>
            <OverlayTrigger placement="bottom" overlay={createTooltip('delete', 'Delete')}>
              <i className="material-icons">delete</i>
            </OverlayTrigger>
          </Button>
        </div>
      </div>
    )
  }
}

const mapDispatchToProps = dispatch => bindActionCreators({ updateGlobalStyle }, dispatch)

export default connect(null, mapDispatchToProps)(Toolbar)
