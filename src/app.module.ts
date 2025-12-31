import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { ClassSerializerInterceptor, Module } from '@nestjs/common';

import configuration from './config/configuration';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { User } from 'src/user/entities/user.entity';
import { Task } from 'src/task/entities/task.entity';
import { Role } from 'src/role/entities/role.entity';

import { HealthModule } from './health/health.module';

import { UserModule } from './user/user.module';
import { RoleModule } from './role/role.module';
import { TaskModule } from './task/task.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    AuthModule,
    HealthModule,
    UserModule,
    RoleModule,
    TaskModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      envFilePath: process.env.NODE_ENV === 'production' ? '.env.production.local' : '.env.development.local',
    }),
    TypeOrmModule.forRootAsync({
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get<string>('database.host'),
        port: config.get<number>('database.port'),
        username: config.get<string>('database.user'),
        password: config.get<string>('database.password'),
        database: config.get<string>('database.database'),
        entities: [User, Task, Role],
        synchronize: true,
        retryAttempts: 4,
        retryDelay: 3000,
      }),
      inject: [ConfigService],
    }),
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: 60000,
          limit: 10,
        },
      ],
    }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor,
    },
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    }
  ],
})
export class AppModule { }
