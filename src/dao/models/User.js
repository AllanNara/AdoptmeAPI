import mongoose from "mongoose";
import { documentUserFields } from "../../utils/index.js";

const collection = "Users";

const schema = new mongoose.Schema(
  {
    first_name: {
      type: String,
      required: true,
    },
    last_name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      default: "user",
    },
    pets: {
      type: [
        {
          _id: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: "Pets",
          },
        },
      ],
      default: [],
    },
    documents: {
      type: [
        new mongoose.Schema(
          {
            name: {
              type: String,
              enum: documentUserFields,
            },
            reference: String,
          },
          { _id: false }
        ),
      ],
      default: [],
    },
    last_connection: {
      type: Date,
      default: new Date(),
    },
  },
  { versionKey: false }
);

const userModel = mongoose.model(collection, schema);

export default userModel;
