const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Suggestion Schema
const suggestionSchema = new Schema(
  {
    userID: {
      type: mongoose.Schema.Types.ObjectId, //userSchema,
      ref: "User",
      required: [false, "user id is required!"],
    },
    interactionID: {
      type: mongoose.Schema.Types.ObjectId, //interactionSchema,
      ref: "Interaction",
      required: [false, "Interaction id is required!"],
    },
    initialQuestion: {
      type: String,
      required: [true, "user initial question is required!"],
    },
    //  Ai Suggest keywords to user
    suggestedKeywords: {
      type: Array,
      required: true,
    },
    created: {
      type: Date,
      default: Date.now,
    },
  },
  {
    collection: "suggestions", //name of the mongoDB collection where the documents will be stored
  }
);

module.exports = mongoose.model("Suggestion", suggestionSchema);
