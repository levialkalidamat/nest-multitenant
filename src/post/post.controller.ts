import {
  Body,
  Controller,
  Get,
  Inject,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dtos/createPost.dto';
import { AccessTokenGuard } from 'src/common/guards/accessToken.guards';
import { Request } from 'express';
//import { Connection } from 'mongoose';

@Controller('post')
export class PostController {
  constructor(
    private readonly postService: PostService,
    //@Inject('TENANT_CONNECTION') private tenantConnection: Connection,
  ) {}

  @UseGuards(AccessTokenGuard)
  @Post('')
  create(@Body() createPostDto: CreatePostDto, @Req() request: Request) {
    const userId = request.user['id'];
    console.log(userId);
    return this.postService.create(createPostDto, userId);
  }

  @Get('')
  getAll() {
    return this.postService.getAll();
  }
}
