import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { validate } from './common/dotenv.dto';
import { SharedModule } from './shared/shared.module';
import { AuthModule } from './modules/auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ApiConfigService } from './shared/services/api-config.service';
import { UserModule } from './modules/user/user.module';
import { EventModule } from './modules/event/event.module';
import { ReporterModule } from './modules/report/report.module';

@Module({
  imports: [
    AuthModule,
    EventModule,
    ReporterModule,
    UserModule,
    SharedModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      validate,
    }),
    MongooseModule.forRootAsync({
      useFactory: async (configService: ApiConfigService) => ({
        uri: configService.database.url,
      }),
      inject: [ApiConfigService],
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
