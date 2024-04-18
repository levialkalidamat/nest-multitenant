import mongoose, { Document } from 'mongoose';
import { Post } from './Post.Schema';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true })
  name: string;

  @Prop({ unique: true, required: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Post' })
  posts: Post[];
}

export const UserSchema = SchemaFactory.createForClass(User);
