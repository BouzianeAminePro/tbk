import { Module } from '@nestjs/common';
import { AlgoService } from './algo.service';

@Module({
  exports: [AlgoService],
  providers: [AlgoService],
})
export class AlgoModule {}
