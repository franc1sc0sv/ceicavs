import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { IAuthRepository } from "./repositories/auth.repository.abstract";
import { AuthRepository } from "./repositories/auth.repository";
import { AuthResolver } from "./resolvers/auth.resolver";
import { LoginHandler } from "./commands/login/login.handler";
import { RefreshTokenHandler } from "./commands/refresh-token/refresh-token.handler";
import { GetMeHandler } from "./queries/get-me/get-me.handler";
import { JwtStrategy } from "./strategies/jwt.strategy";

@Module({
  imports: [
    CqrsModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET!,
    }),
    PassportModule,
  ],
  providers: [
    AuthResolver,
    { provide: IAuthRepository, useClass: AuthRepository },
    LoginHandler,
    RefreshTokenHandler,
    GetMeHandler,
    JwtStrategy,
  ],
})
export class AuthModule {}
