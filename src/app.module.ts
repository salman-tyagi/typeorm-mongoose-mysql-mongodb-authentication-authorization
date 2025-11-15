import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { MailerModule } from '@nestjs-modules/mailer';
import { EjsAdapter } from '@nestjs-modules/mailer/dist/adapters/ejs.adapter';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { User } from './users/user.entity';

import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      async useFactory(configService: ConfigService) {
        return {
          type: 'mongodb',
          url: configService.get<string>('DEV_MONGO_DB'),
          entities: [User],
          synchronize: true,
          logging: true,
        };
      },
    }),

    JwtModule.registerAsync({
      global: true,
      inject: [ConfigService],
      async useFactory(configService: ConfigService) {
        return {
          secret: configService.get('ACCESS_TOKEN_SECRET'),
          signOptions: {
            expiresIn: configService.get('ACCESS_TOKEN_EXPIRES_IN'),
          },
        };
      },
    }),

    MailerModule.forRootAsync({
      inject: [ConfigService],

      async useFactory(configService: ConfigService) {
        return {
          transport: {
            host: configService.get<string>('MAIL_HOST'),
            port: configService.get<number>('MAIL_PORT'),
            auth: {
              user: configService.get<string>('MAIL_USER'),
              pass: configService.get<string>('MAIL_PASS'),
            },
          },

          defaults: {
            from: `${configService.get<string>('MAIL_FROM')} <${configService.get<string>(
              'MAIL_FROM_EMAIL'
            )}>`,
          },

          template: {
            dir: 'src/templates',
            adapter: new EjsAdapter(),
            options: { strict: false },
          },
        };
      },
    }),

    UsersModule,
    AuthModule,
  ],

  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
