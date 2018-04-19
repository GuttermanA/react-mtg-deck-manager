import React, { Component } from 'react'
import uuid from 'uuid'
import SegmentList from './SegmentList'
import withLoader from './hocs/withLoader'
import { withRouter, Redirect } from 'react-router-dom'
import { fetchDeck, deleteDeck, updateDeck, deleteFromDeck, createDeck } from  '../actions/decks'
import { connect } from 'react-redux'
import { Button, Container, Grid, Header, Segment, Label, Form } from 'semantic-ui-react'

class DeckShow extends Component {
  constructor(props) {
    super(props)
    this.state = {
      redirect: false,
      userDeck: false,
      editing: false,
      mainboard: {},
      sideboard: [],
    }
    this.cardsToUpdate = []
    this.cardsToDelete = []
    this.handleSubmit = this.handleSubmit.bind(this)
  }


  goBack = (event) => {
    this.props.history.goBack()
  }

  handleDelete = (event) => {
    this.setState({ redirect: true }, () => this.props.deleteDeck(this.props.selectedDeck.id, this.props.history, this.props.currentUser))
  }

  handleEdit = (event) => {
    if (this.props.history.location.pathname.includes(this.props.currentUser.name)) {
      this.setState({ editing: !this.state.editing })
    } else {
      let mainboard = this.props.selectedDeck.cards.mainboard
      let deck = {...this.props.selectedDeck, cards: {mainboard:[], sideboard:this.state.sideboard}}

      for(const type in mainboard) {
        for(const card of mainboard[type]) {
          deck.cards.mainboard.push(card)
        }
      }


      this.props.createDeck(deck, this.props.history, this.props.currentUser)
    }

  }

  handleChange = (event, cardRef) => {
    const { value, name } = event.target
    let found = this.cardsToUpdate.find(card => card.key === cardRef.key)
    if (found) {
      found[name] = value
    } else {
      this.cardsToUpdate.push({...cardRef, [name]: value})
    }
    console.log('cards to edit', this.cardsToUpdate);
  }

  handleSubmit(event) {
    event.preventDefault()
    if (this.cardsToUpdate.length || this.cardsToDelete.length) {
      this.props.updateDeck(this.props.selectedDeck.id, this.cardsToUpdate, this.cardsToDelete)
      this.setState({
        editing: false
      })
    } else {
      alert('No changes made, submission canceled')
    }


  }

  handleRemoveEdit = (event, cardRef) => {
    if (cardRef.id) {
      let found = this.cardsToUpdate.find(card => card.id === cardRef.id && card.sideboard === cardRef.sideboard)
      if (!found) {
        this.cardsToDelete.push(cardRef)
      }
      console.log('cards to delete', this.cardsToDelete);
    }
  }



  componentDidMount = () => {
    if (!Object.keys(this.props.selectedDeck).length) {
      this.props.fetchDeck(this.props.match.params.id)
    } else {
      console.log('mountingSelectedDeck',this.props.selectedDeck);
      const mainboard = this.props.selectedDeck.cards.mainboard
      for(const type in mainboard) {
        mainboard[type].map(card => card.key = uuid())
      }
      const sideboard = this.props.selectedDeck.cards.sideboard.map(card => {return {...card, key: uuid()}})
      if (this.props.match.params.username) {
        this.setState({ sideboard, mainboard, userDeck: true })
      } else {
        this.setState({ sideboard, mainboard, userDeck: false })
      }

    }
  }

  render() {
    const {
      sideboard,
      mainboard,
      userDeck,
      redirect,
      editing,
    } = this.state
    const { name, archtype, totalMainboard, totalSideboard, tournament, updatedAt } = this.props.selectedDeck
    const mainboardSegments = (() => {
      const segments = []
      for(const type in mainboard) {
        segments.push(<SegmentList handleRemoveEdit={this.handleRemoveEdit} handleChange={this.handleChange} key={uuid()} editing={this.state.editing} cards={mainboard[type]} type={type} board='mainboard'/>)
      }
      return segments
    })()
    const sideboardSegment = <SegmentList handleRemoveEdit={this.handleRemoveEdit} handleChange={this.handleChange} key={uuid()} editing={this.state.editing} cards={sideboard} board='sideboard'/>

    if (redirect) {
      return <Redirect exact to={`/${this.props.currentUser.name}/decks`} />
    } else {
      return (
        <Container>
          <Button.Group >
            <Button name='goBack' onClick={this.goBack}>Return to Search Results</Button>
            <Button name='edit' onClick={this.handleEdit}>{userDeck ? 'Edit' : 'Copy'}</Button>
            { userDeck && <Button name='delete' onClick={this.handleDelete}>Delete</Button>}

          </Button.Group>
          <Segment.Group  horizontal>
            <Segment>
              { tournament  && <Label icon='trophy'/>}
              Name: {name}
            </Segment>
            <Segment>
              Archtype: {archtype}
            </Segment>
          </Segment.Group >
          <Grid as={Form} columns={2} divided size='mini' >
            <Grid.Column width={11}>
              <Segment.Group>
                <Segment as={Header} content={`Mainboard (${totalMainboard})`} />
                {mainboardSegments}
              </Segment.Group>

            </Grid.Column>
            <Grid.Column width={5}>

                <Segment.Group content={sideboardSegment} totalsideboard={totalSideboard} compact/>

            </Grid.Column>
            { editing && <Button onClick={this.handleSubmit}>Update</Button>}
          </Grid>
        </Container>
      )
    }

  }
}

const mapStateToProps = (state) => {
  return {
    selectedDeck: state.decks.selected,
    loading: state.decks.loading,
    currentUser: state.auth.currentUser,
  }
}

export default withRouter(connect(mapStateToProps, { fetchDeck, deleteDeck, updateDeck, deleteFromDeck, createDeck })(withLoader(DeckShow)))
