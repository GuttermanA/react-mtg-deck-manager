import React from 'react'
import DeckBuilderSimpleForm from '../DeckBuilderSimpleForm'
import { Sidebar, Button, Container } from 'semantic-ui-react'


export default function withBuilder(Component) {
  return (class extends React.Component {
    state = {
      visible: false,
      activeItem: '',
    }

    handleItemClick = (e, { name }) => {
      if (name === this.state.activeItem) {
        this.setState({
          activeItem: '',
          visible: false
        })
      } else {
        this.setState({
          activeItem: name,
          visible: true
        })
      }

    }

    render() {
      const { visible, activeItem } = this.state
      return (
      <div>
        <Button.Group>
          <Button name='craeteDeck' active={ activeItem === 'createDeck'} onClick={this.handleItemClick}>Build Deck</Button>
          <Button name='addToCollection' active={ activeItem === 'addToCollection'} onClick={this.handleItemClick}>Add to Collection</Button>
        </Button.Group>
        <Sidebar.Pushable as={Container}>
          <Sidebar animation='push' size='large' visible={visible} >
            <DeckBuilderSimpleForm />
          </Sidebar>
          <Sidebar.Pusher>
            <Component {...this.props}/>
          </Sidebar.Pusher>
        </Sidebar.Pushable>
      </div>
      )
    }
  })
}