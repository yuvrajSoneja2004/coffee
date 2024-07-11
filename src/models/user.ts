import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  role: {
    type: String,
    required: true,
  },
  sheetId: {
    type: String,
    required: true,
    unique: true,
  },
  subsheetsIds: {
    type: Object,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

// Use model function correctly
const User = mongoose.models.users || mongoose.model("users", userSchema);
export default User;
