import { getModelForClass, pre, prop } from "@typegoose/typegoose";
import type { Ref as TypeRef } from "@typegoose/typegoose";
import mongoose, { Error } from "mongoose";

import { Player } from ".";

const MAX_CHARS = 400;

@pre<Mail>("save", function (next) {
  if (this.content.length > MAX_CHARS) {
    const err = new Error(`Content exceeded ${MAX_CHARS} character limit.`);
    next(err);
  }
})
export class Mail {
  @prop({ required: true, ref: () => Player, type: () => String })
  public senderId!: TypeRef<Player, string>;

  @prop({ required: true, ref: () => Player, type: () => String })
  public recieverId!: TypeRef<Player, string>;

  @prop({ required: true })
  public content!: string;
}

export const MailModel: mongoose.Model<Mail> = mongoose.models.Mail || getModelForClass(Mail);