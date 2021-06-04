import mongoose from "mongoose"
import createError from "http-errors"

const { Schema, model } = mongoose

const AuthorSchema = new Schema({
  name: { type: String, required: true },
  surname: { type: String, required: true },
  avatar: { type: String, required: true, },
  blogposts: [{ type: Schema.Types.ObjectId, required: true, ref: "Blogpost" }],
})

AuthorSchema.post("validate", function (error, doc, next) {
  if (error) {
    const err = createError(400, error)
    next(err)
  } else {
    next()
  }
})

AuthorSchema.static("findAuthorWithBlogposts", async function (id) {
  const author = await this.findById(id).populate("blogposts")
  return author
})

AuthorSchema.static("findAuthorsWithBlogposts", async function (query) {
  const total = await this.countDocuments(query.criteria)
  const authors = await this.find(query.criteria, query.options.fields)
    .skip(query.options.skip)
    .limit(query.options.limit)
    .sort(query.options.sort)
  return { total, authors }
})

export default model("Author", AuthorSchema)
