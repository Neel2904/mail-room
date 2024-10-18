import mongoose from "mongoose";

const mailSchema = new mongoose.Schema(
  {
    from: { type: String },
    to: { type: String },
    subject: { type: String },
    body: { type: String },
    attachments: [{ type: String }],
  },
  { timestamps: true }
);

export default mongoose.model("Mail", mailSchema, "mails");
