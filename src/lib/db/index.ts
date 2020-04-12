import mongoose from 'mongoose'
export {
  RowModel
} from './Row'
export {
  TagModel
} from './Tag'

let instance: Promise<typeof mongoose>

/**
 * ## connect
 * this fn is unusual in that it's not declared as an `async` function, but
 * it still returns a promise, therefore it can be called with `await connect()`
 * note that it returns a mongoose instance, so if you want the mongo db
 * connection, you need to `connection = (await db.connect()).connection`
 */
export function connect(uri: string) {
  if (instance) return instance
  mongoose.set('useFindAndModify', false)
  mongoose.set('useCreateIndex', true)
  mongoose.set('useNewUrlParser', true)
  mongoose.set('useUnifiedTopology', true)

  // you can't simply `connection = await mongoost.connect()` because in that
  // case the global `connection` would remain undefined until the promise
  // is resolved
  instance = mongoose.connect(uri)
  instance.catch((err) => {
    console.error(err)
    console.log('MongooseDB connection error.')
    process.exit()
  })

  return instance
}

export function disconnect() {
  return instance.then((connection) => connection.disconnect())
}