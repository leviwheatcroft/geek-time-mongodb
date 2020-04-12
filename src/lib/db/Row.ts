import mongoose from 'mongoose'
import asyncPool from 'tiny-async-pool'
// import {
//   isString,
//   isMongooseTagDocument,
//   isRow
// } from '@typeGuards'

const {
  Types: { ObjectId }
} = mongoose


const rowSchema = new mongoose.Schema(
  {
    meta: {
      date: Date,
      tags: [
        {
          type: ObjectId,
          ref: 'Tag'
        }
      ]
    },
    data: Object
  },
  {
    timestamps: true
  }
)

async function upsert (this: mongoose.RowDocument) {
  await RowModel.findOneAndUpdate(
    { _id: this._id },
    this,
    {
      upsert: true,
      new: true
    }
  )
}

async function upsertTable (
  table: mongoose.Table
): Promise<void> {
  await asyncPool(16, table, async (row) => {
    const doc = new RowModel(row)
    await doc.upsert()
  })
}

Object.assign(rowSchema.statics, {
  upsertTable
})
Object.assign(rowSchema.methods, {
  upsert
})

export const RowModel = mongoose.model('Row', rowSchema) as mongoose.RowModel
