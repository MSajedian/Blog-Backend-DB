import express from "express"
import createError from "http-errors"

import BlogpostModel from "./schema.js"

const blogpostsRouter = express.Router()

blogpostsRouter.post("/", async (req, res, next) => {
  try {
    const newBlogpost = new BlogpostModel(req.body)
    const { _id } = await newBlogpost.save()

    res.status(201).send(_id)
  } catch (error) {
    console.log(error)
    if (error.name === "ValidationError") {
      next(createError(400, error))
    } else {
      next(createError(500, "An error occurred while saving blogpost"))
    }
  }
})

blogpostsRouter.get("/", async (req, res, next) => {
  try {
    const blogposts = await BlogpostModel.find()
    res.send(blogposts)
  } catch (error) {
    console.log(error)
    next(createError(500, "An error occurred while getting blogposts"))
  }
})

blogpostsRouter.get("/:id", async (req, res, next) => {
  try {
    const id = req.params.id
    const blogpost = await BlogpostModel.findById(id)
    if (blogpost) {
      res.send(blogpost)
    } else {
      next(createError(404, `Blogpost ${req.params.id} not found`))
    }
  } catch (error) {
    console.log(error)
    next(createError(500, "An error occurred while getting blogpost"))
  }
})

blogpostsRouter.put("/:id", async (req, res, next) => {
  try {
    const blogpost = await BlogpostModel.findByIdAndUpdate(req.params.id, req.body, {
      runValidators: true,
      new: true,
    })
    if (blogpost) {
      res.send(blogpost)
    } else {
      next(createError(404, `Blogpost ${req.params.id} not found`))
    }
  } catch (error) {
    console.log(error)
    next(createError(500, "An error occurred while modifying blogpost"))
  }
})

blogpostsRouter.delete("/:id", async (req, res, next) => {
  try {
    const blogpost = await BlogpostModel.findByIdAndDelete(req.params.id)
    if (blogpost) {
      res.status(204).send()
    } else {
      next(createError(404, `Blogpost ${req.params.id} not found`))
    }
  } catch (error) {
    console.log(error)
    next(createError(500, "An error occurred while deleting blogpost"))
  }
})

export default blogpostsRouter
