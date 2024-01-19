import mongoose, { mongo } from "mongoose";
import { prop, modelOptions, getModelForClass } from "@typegoose/typegoose";
import type { Ref as TypeRef } from "@typegoose/typegoose";
import type { Base } from "@typegoose/typegoose/lib/defaultClasses";

// defaults provided by https://lucia-auth.com/database-adapters/mongoose/

@modelOptions({ schemaOptions: { _id: false }, options: { customName: "User" }})
export class UserSchema {
  @prop({ required: true })
  public _id!: string;
}
const User: mongoose.Model<UserSchema> = mongoose.models.User || getModelForClass(UserSchema);

@modelOptions({ schemaOptions: { _id: false }, options: { customName: "Key"}})
class KeySchema {
  @prop({ required: true })
  public _id!: string;

  @prop({required: true})
  public user_id!: string;
  
  @prop()
  public hashed_password?: string;
}
const Key: mongoose.Model<KeySchema> = mongoose.models.Key || getModelForClass(KeySchema);

@modelOptions({ schemaOptions: { _id: false }, options: { customName: "Session"}})
class SessionSchema {
  @prop({ required: true })
  public _id!: string;

  @prop({required: true})
  public user_id!: string;

  @prop({ required: true })
  public active_expires!: number;

  @prop({ required: true })
  public idle_expires!: number;
}
const Session: mongoose.Model<SessionSchema> = mongoose.models.Session || getModelForClass(SessionSchema);

export { User, Key, Session };
