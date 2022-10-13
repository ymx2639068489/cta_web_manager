import { Module } from '@nestjs/common';
import appConfig from './config/app.config';
import {
  UserModule,
  AdminModule,
  AuthModule,
  RoutersModule,
  EmailModule,
  RecruitmentModule,
  ActiveTimeModule,
  GxaModule,
  JournalismModule,
  UserController,
  BannerModule
} from './modules';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './common/guard/jwt.guard';
import { RolesGuard } from './common/guard';
import { ScheduleModule } from '@nestjs/schedule';
import { TasksModule } from './modules/tasks/tasks.module';
import { ReplacementModule } from './modules/replacement/replacement.module';
import { ComputerCompetitionModule } from './modules/computer-competition/computer-competition.module';
import { PreviousWinnersModule } from './modules/previous-winners/previous-winners.module';
import { AlgorithmIntegralModule } from './modules/algorithm-integral/algorithm-integral.module';
// console.log(process.env.DATABASE_HOST);

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [appConfig],
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DATABASE_HOST,
      port: +process.env.DATABASE_PORT,
      username: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      autoLoadEntities: true, // 自动加载模块，而不是指定实体数组, 开发环境谨慎使用
      synchronize: true, // 同步数据库，如果不存在则创自动创建, 开发环境谨慎使用
    }),
    ScheduleModule.forRoot(),
    AuthModule,
    UserModule,
    AdminModule,
    RoutersModule,
    EmailModule,
    RecruitmentModule,
    ActiveTimeModule,
    GxaModule,
    JournalismModule,
    TasksModule,
    ReplacementModule,
    BannerModule,
    ComputerCompetitionModule,
    PreviousWinnersModule,
    AlgorithmIntegralModule
  ],
  controllers: [UserController],
  providers: [
    // 全局使用jwt验证
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    // 全局使用权限认证
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    }
  ],
})
export class AppModule {}
