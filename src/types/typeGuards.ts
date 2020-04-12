import {
  is
} from 'typescript-is'
import mongoose from 'mongoose'
import {
  TagModel
} from '@lib/db'

export function isString (value: any): value is string {
  return typeof value === 'string'
}
export function isTable (value: any): value is mongoose.Table {
  // TODO:
  // typescript-is complaining about classes?!
  // return is<mongoose.Table>(value)
  // throws an error:
  //   Error: Encountered a method declaration, but methods are not supported.
  //   Issue: https://github.com/woutervh-/typescript-is/issues/5
  if (Array.isArray(value)) return true
}
export function isMiddleware (value: any): value is Middleware {
  if (is<Middleware>(value)) return true
}
export function isMongooseTagDocument (
  value: any
): value is mongoose.TagDocument {
  return value instanceof TagModel
  // if (is<mongoose.Document>(value)) return true
}
// export function isRow (
//   value: any
// ): value is Row {
//   // TODO:
//   // typescript-is complaining about classes?!
//   // if (is<Row>(value)) return true
//   // throws an error about classes
//   return (
//     (Array.isArray(value._tags))
//   )
//   // return is<Row>(value)
// }