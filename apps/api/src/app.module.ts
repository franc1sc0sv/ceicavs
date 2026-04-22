import { Module } from '@nestjs/common'
import { GraphQLModule } from '@nestjs/graphql'
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo'
import { CqrsModule } from '@nestjs/cqrs'
import { join } from 'path'
import { DatabaseModule } from './common/database/database.module'
import { EventModule } from './common/events/event.module'
import { MailModule } from './common/mail/mail.module'
import { AuthModule } from './modules/auth/auth.module'
import { DashboardModule } from './modules/dashboard/dashboard.module'
import { AttendanceModule } from './modules/attendance/attendance.module'
import { PeopleModule } from './modules/people/people.module'
import { BlogModule } from './modules/blog/blog.module'
import { ToolsModule } from './modules/tools/tools.module'
import { TranscriptionModule } from './modules/transcription/transcription.module'
import { ActivityModule } from './modules/activity/activity.module'

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      sortSchema: true,
    }),
    CqrsModule.forRoot(),
    DatabaseModule,
    EventModule,
    MailModule,
    AuthModule,
    DashboardModule,
    AttendanceModule,
    PeopleModule,
    BlogModule,
    ToolsModule,
    TranscriptionModule,
    ActivityModule,
  ],
})
export class AppModule {}
