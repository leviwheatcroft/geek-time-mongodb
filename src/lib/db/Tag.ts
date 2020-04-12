import mongoose from 'mongoose'
import asyncPool from 'tiny-async-pool'

const {
  Types: { ObjectId }
} = mongoose

const tagSchema = new mongoose.Schema(
  {
    name: String,
    archived: Boolean,
    deleted: Boolean,
  },
  {
    timestamps: true
  }
)

async function resolveTags(table: mongoose.Table): Promise<void> {
  const cache = {}
  await asyncPool(16, table, async ({ data, meta }) => {
    const tags = []
    for await (const name of meta.tagNames) {
      if (!cache[name]) {
        const tag = await TagModel.findOneAndUpdate(
          { name },
          { name },
          {
            new: true,
            upsert: true,
          }
        )
        cache[name] = tag._id
      }
      tags.push(cache[name])

    }
    meta.tags = tags
  })
}

Object.assign(tagSchema.statics, {
  resolveTags
})

export const TagModel = mongoose.model('Tag', tagSchema) as mongoose.TagModel
