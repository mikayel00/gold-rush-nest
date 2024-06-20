import { Global, Module } from '@nestjs/common';
import { ApiConfigService } from './services/api-config.service';

const providers = [ApiConfigService];

@Global()
@Module({
  imports: [],
  controllers: [],
  providers,
  exports: providers,
})
export class SharedModule {}
