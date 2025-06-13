import { Module } from "@nestjs/common";
import { APP_GUARD } from "@nestjs/core";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "modules/user/entities/user.entity";
import { UserModule } from "modules/user/user.module";
import { jwtConstants } from "./jwt/constants";
import { AuthService } from "./auth.service";
import { LocalStrategy } from "./jwt/local.strategy";
import { JwtStrategy } from "./jwt/jwt.strategy";
import { JwtAuthGuard } from "./jwt/jwt-auth.guard";
import { AuthController } from "./auth.controller";
import { GoogleStrategy } from "./jwt/googleStrategy";
import { RolesGuard } from "./jwt/roles.guard";

@Module({
    imports: [
        TypeOrmModule.forFeature([User]),
        UserModule,
        PassportModule,
        JwtModule.register({
            secret: jwtConstants.secret,
            signOptions: { expiresIn: '10h' },
        }),
    ],
    providers: [
        AuthService,
        LocalStrategy,
        JwtStrategy,
        GoogleStrategy,
        {
            provide: APP_GUARD,
            useClass: JwtAuthGuard,
        },
        {
            provide: APP_GUARD,
            useClass: RolesGuard,
        }
    ],
    controllers:  [AuthController],
    exports: [AuthService],
})

export class AuthModule {}