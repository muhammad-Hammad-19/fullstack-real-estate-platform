import mongoose from "mongoose";

const postDetailSchema = new mongoose.Schema(
  {
    description: {
      type: String,
      required: true,
    },

    utilities: {
      type: String,
    },

    petPolicy: {
      type: String,
    },

    incomePolicy: {
      type: String,
    },

    size: {
      type: Number,
    },

    // distances
    school: {
      type: String,
    },

    bus: {
      type: String,
    },

    restaurant: {
      type: String,
    },
  },
  { _id: false }
);

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    price: {
      type: Number,
      required: true,
    },

    images: {
      type: [String],
      default: [],
    },

    address: {
      type: String,
      required: true,
    },

    city: {
      type: String,
      required: true,
    },

    bedroom: {
      type: Number,
      required: true,
    },

    bathroom: {
      type: Number,
      required: true,
    },

    createdAt: {
      type: Date,
      default: Date.now,
    },

    // relation with user
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // additional details
    postDetail: postDetailSchema,
  }
);

const Post = mongoose.model("Post", postSchema);

export default Post;