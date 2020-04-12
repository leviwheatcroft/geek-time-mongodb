import mongoose from 'mongoose'
import {
  RowModel,
  TagModel,
  connect,
  disconnect
} from './db'
import debug from 'debug'
const dbg = debug('gt')

export const name = 'mongodb'

export async function store (ctx: mongoose.Context) {
  const {
    table,
    pluginOptions: {
      mongoDbUri
    }
  } = ctx
  await connect(mongoDbUri)
  await TagModel.resolveTags(table)
  await RowModel.upsertTable(table)
  await disconnect()
}

export async function retrieve (ctx: mongoose.Context) {
  const {
    table,
    pluginOptions: {
      mongoDbUri,
      includeTags,
      excludeTags
    }
  } = ctx
  await connect(mongoDbUri)
  const includeTagIds = await TagModel.find(
    {
      name: { $in: includeTags }
    },
    '_id',
    {
      lean: true
    }
  ) as Array<{ _id: string }> 

  const excludeTagIds = await TagModel.find(
    {
      name: { $in: excludeTags }
    },
    '_id',
    {
      lean: true
    }
  ) as Array<{ _id: string }> 

  const docs = await RowModel.find(
    {
      'meta.tags': {
        $in: includeTagIds,
        $nin: excludeTagIds
      }
    }
  )
  dbg('retrieve', docs)
}

export const defaultOptions = {
  mongoDbUri: '',
  includeTags: '',
  excludeTags: ''
}

export function checkOptions (ctx) {
  const {
    pluginOptions: {
      mongoDbUri,
      includeTags,
      excludeTags
    },
    is
  } = ctx
  const errors = []
  if (!is.string(mongoDbUri))
    errors.push('mongoDbUri must be a string')
  if (!mongoDbUri.length)
    errors.push('mongoDbUri must be provided')
  if (!is.string(includeTags))
    errors.push('includeTags must be a string, comma separated')
  if (!is.string(excludeTags))
    errors.push('excludeTags must be a string, comma separated')
}
