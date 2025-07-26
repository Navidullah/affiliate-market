import mongoose from "mongoose";

const SavedKeywordSchema = new mongoose.Schema(
  {
    keyword: String,
    userEmail: String,
    related_questions: [Object],
    related_searches: [Object],
    organic_results: [Object],
  },
  { timestamps: true }
);

export default mongoose.models.SavedKeyword ||
  mongoose.model("SavedKeyword", SavedKeywordSchema);
