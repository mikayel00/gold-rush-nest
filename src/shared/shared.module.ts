import { Global, Module } from '@nestjs/common';
import { ApiConfigService } from './services/api-config.service';
import { UtilsService } from './services/utils.service';

const providers = [ApiConfigService, UtilsService];

@Global()
@Module({
  imports: [],
  controllers: [],
  providers,
  exports: providers,
})
export class SharedModule {}
