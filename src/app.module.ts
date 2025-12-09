import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GatewaysModule } from './gateways/gateways.module';
import { ConnectorsModule } from './connectors/connectors.module';
import { MachinesModule } from './machines/machines.module';
import { AttributeValuesModule } from './attribute-values/attribute-values.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: 5432,
      username: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASS || 'postgres',
      database: process.env.DB_NAME || 'mi_basedatos',
      autoLoadEntities: true,
      synchronize: true, // ⚠ Solo en desarrollo
    }),
    GatewaysModule,
    ConnectorsModule,
    MachinesModule,
    AttributeValuesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
