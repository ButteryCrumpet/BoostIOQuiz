import mongoose from "mongoose";
import { Balance } from "../domain/balance";

export type BalanceDocument = mongoose.Document & Balance

const userSchema = new mongoose.Schema({
  _id: String,
  amount: Number,
  createdAt: Date
});


export const BalanceModel = mongoose.model<BalanceDocument>("Balance", userSchema);
