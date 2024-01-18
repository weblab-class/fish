import mongoose from "mongoose";

// defaults provided by https://lucia-auth.com/database-adapters/mongoose/
const userSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      required: true,
    },
  } as const,
  { _id: false },
);
const User = mongoose.models.User || mongoose.model("User", userSchema);

const keySchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      required: true,
    },
    user_id: {
      type: String,
      required: true,
    },
    hashed_password: String,
  } as const,
  { _id: false },
);

const Key = mongoose.models.Key || mongoose.model("Key", keySchema);

const sessionSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      required: true,
    },
    user_id: {
      type: String,
      required: true,
    },
    active_expires: {
      type: Number,
      required: true,
    },
    idle_expires: {
      type: Number,
      required: true,
    },
  } as const,
  { _id: false },
);
const Session = mongoose.models.Session || mongoose.model("Session", sessionSchema);

export { User, Key, Session };
