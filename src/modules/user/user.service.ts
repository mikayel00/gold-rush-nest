import { Injectable } from '@nestjs/common';
import { User, UserDocument } from './user.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { UserTypeEnum } from '../../constants';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  async getOneByEmail(email: string): Promise<UserDocument | null> {
    const userEntity = await this.userModel.findOne({ email: email }).exec();

    if (!userEntity) {
      return null;
    }

    return userEntity;
  }

  async create(data: CreateUserDto): Promise<UserDocument> {
    const user = {
      ...data,
      type: this.getRandomUserType(),
    };
    const createdUser = new this.userModel(user);
    await createdUser.save();

    return createdUser;
  }

  private getRandomUserType(): UserTypeEnum {
    const userTypes = Object.values(UserTypeEnum);
    const randomIndex = Math.floor(Math.random() * userTypes.length);
    return userTypes[randomIndex];
  }

  async addPoints(email: string, points: number): Promise<void> {
    await this.userModel
      .findOneAndUpdate({ email: email }, { points: points })
      .exec();
  }
}
