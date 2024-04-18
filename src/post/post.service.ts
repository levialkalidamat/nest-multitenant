import { Inject, Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';
import { Post } from 'src/schemas/Post.Schema';
import { CreatePostDto } from './dtos/createPost.dto';
import { User } from 'src/schemas/User.Schema';

@Injectable()
export class PostService {
  constructor(
    //@InjectModel(Post.name) private postModel: Model<Post>,
    //@InjectModel(User.name) private userModel: Model<User>,
    //@InjectConnection() private connection: Connection,
    @Inject('POST_MODEL') private postModel: Model<Post>,
    @Inject('USER_MODEL') private userModel: Model<User>,
  ) {}

  async create(createPostDto: CreatePostDto, userId: string) {
    console.log(userId);
    const findUser = await this.userModel.findById(userId);
    //console.log(findUser);
    const data = Object.assign(createPostDto, { user: userId });
    const newPost = await this.postModel.create(data); // const newPost = await this.postModel.create(createPostDto); //

    await findUser.updateOne({
      $push: {
        posts: newPost._id,
      },
    });
    return {
      messge: 'Post created successfully',
      newPost,
    };
  }

  async getAll() {
    return await this.postModel.find() /* .populate({ path: 'user' }) */;
  }
}
