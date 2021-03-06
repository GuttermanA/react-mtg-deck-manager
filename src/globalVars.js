import uuid from 'uuid'

export const API_ROOT = 'https://api-spellbook.herokuapp.com'
// export const API_ROOT = 'http://localhost:3000'

export const types = ['Creature', 'Instant', 'Sorcery', 'Land', 'Artifact', 'Enchantment', 'Planeswalker']

export const archtypeOptions = [
  {key: uuid(), text: 'Aggro', value: 'Aggro'},
  {key: uuid(), text: 'Control', value: 'Control'},
  {key: uuid(), text: 'Midrange', value: 'Midrange'},
  {key: uuid(), text: 'Tribal', value: 'Tribal'},
  {key: uuid(), text: 'Tempo', value: 'Tempo'},
  {key: uuid(), text: 'Combo', value: 'Combo'},
  {key: uuid(), text: 'Ramp', value: 'Ramp'},
]

export const archtypeRenderLabel = (label) => ({
  color: 'blue',
  content: label.text,
  icon: 'check',
})

export const conditionOptions = [
  {key: uuid(), text: 'Near Mint', value: 'NM'},
  {key: uuid(), text: 'Lightly Played', value: 'LP'},
  {key: uuid(), text: 'Moderately Played', value: 'MP'},
  {key: uuid(), text: 'Heavily Played', value: 'HP'},
  {key: uuid(), text: 'Damaged', value: 'D'},
]

export const keysForDeckShow = {
  Creature: uuid(),
  Instant: uuid(),
  Sorcery: uuid(),
  Land: uuid(),
  Artifact: uuid(),
  Enchantment: uuid(),
  Planeswalker: uuid(),
  Sideboard: uuid()
}
