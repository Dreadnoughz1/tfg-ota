import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GatewaysModule } from './gateways/gateways.module';
import { ConnectorsModule } from './connectors/connectors.module';
import { MachinesModule } from './machines/machines.module';
import { AttributeValuesModule } from './attribute-values/attribute-values.module';
import { IngestModule } from './ingest/ingest.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'admin',
      password: 'admin123',
      database: 'industrial_data',
      autoLoadEntities: true,
      synchronize: true,
    }),
    GatewaysModule,
    ConnectorsModule,
    MachinesModule,
    AttributeValuesModule,
    IngestModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
