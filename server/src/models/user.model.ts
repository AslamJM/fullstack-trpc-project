import {
  prop,
  index,
  pre,
  DocumentType,
  getModelForClass,
} from "@typegoose/typegoose";
import bcrypt from "bcrypt";

@index({ email: 1 })
@pre<User>("save", async function () {
  if (!this.password) {
    return;
  }
  if (!this.isModified("password")) {
    return;
  }
  this.password = await bcrypt.hash(this.password, 12);
})
export class User {
  @prop({ unique: true })
  email: string;

  @prop()
  name: string;

  @prop()
  password: string;

  @prop()
  phone: string;

  @prop({ default: false })
  emailVerified: boolean;

  @prop({ default: () => Math.random().toString(36).substring(2, 15) })
  emailVerficationCode: string;

  @prop({ default: "" })
  passwordResetCode: string;

  async validatePassword(this: DocumentType<User>, inputPassword: string) {
    try {
      const validPW = await bcrypt.compare(inputPassword, this.password);
      return validPW;
    } catch (error) {
      return false;
    }
  }
}

export const UserModel = getModelForClass(User);
