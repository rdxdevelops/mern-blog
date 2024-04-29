import { errorHandler } from "../utils/error.js";
import Comment from "../models/comment.model.js";

export const createComment = async (req, res, next) => {
  try {
    const { postId, content, userId } = req.body;
    if (req.user.id !== userId) {
      return next(errorHandler(403, "You are not allowed to add this comment"));
    }

    const newComment = await Comment.create({
      content,
      postId,
      userId,
    });

    res.status(201).json(newComment);
  } catch (error) {
    next(error);
  }
};

export const getPostComments = async (req, res, next) => {
  try {
    const comments = await Comment.find({ postId: req.params.postId }).sort({createdAt: -1});
    res.status(200).json(comments);
  } catch (error) {
    next(error);
  }
};
