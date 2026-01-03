import mongoose from 'mongoose'

const boardTileSchema = new mongoose.Schema({
  index: { type: Number, required: true, unique: true }, // 0–39
  type: {
    type: String,
    enum: [
      'GO',
      'PROPERTY',
      'STATION',
      'UTILITY',
      'CARD',
      'TAX',
      'JAIL',
      'FREE_PARKING',
      'GO_TO_JAIL',
    ],
    required: true,
  },
  property: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Property',
    default: null,
  },
})

const BoardTile = mongoose.model('BoardTile', boardTileSchema)
export default BoardTile
