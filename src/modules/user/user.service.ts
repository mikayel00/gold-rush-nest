import { Injectable } from '@nestjs/common';
import { User, UserDocument } from './user.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { UserTypeEnum } from '../../constants';
import { UserDto } from './dto/user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  async getOneByEmail(email: string): Promise<UserDto | null> {
    const userEntity = await this.userModel.findOne({ email: email }).exec();

    if (!userEntity) {
      return null;
    }
    return new UserDto(userEntity);
  }

  async create(data: CreateUserDto): Promise<UserDto> {
    const user = {
      ...data,
      type: this.getRandomUserType(),
    };
    const createdUser = new this.userModel(user);
    await createdUser.save();

    return new UserDto(createdUser);
  }

  private getRandomUserType(): UserTypeEnum {
    const userTypes = Object.values(UserTypeEnum);
    const randomIndex = Math.floor(Math.random() * userTypes.length);
    return userTypes[randomIndex];
  }
}
