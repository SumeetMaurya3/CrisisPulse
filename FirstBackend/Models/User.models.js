import mongoose, { Schema } from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
    },
    avatar: {
      type: String,
      required: [true, "Avatar is required"],
    },
    organizationName: {
      type: String
    },

    organizationID: String,

    password: {
      type: String,
      required: [true, "Password is required"],
    },
    emerContacts: [
      {
        type: String,
      },
    ],
    role: {
      type: String,
      default: "user",
    },
  },
  { timestamps: true }
);

const virtual = UserSchema.virtual("id");
virtual.get(function () {
  return this._id;
});
UserSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
  },
});

const User = mongoose.model("User", UserSchema);
export default User;
