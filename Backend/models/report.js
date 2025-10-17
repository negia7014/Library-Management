// models/Report.js
const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema(
  {
    generatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    filter: {
      status: { type: String },
      startDate: { type: Date },
      endDate: { type: Date },
    },
    transactions: [{ type: mongoose.Schema.Types.ObjectId, ref: "Transaction" }],
    fileType: { type: String, enum: ["csv", "pdf", "xlsx"], default: "csv" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("report", reportSchema);
