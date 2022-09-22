import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { ISendMailOptions, MailerService } from '@nestjs-modules/mailer';
import { Result } from '@/common/interface/result';
import { formatDate } from '@/common/utils';
import { Cache } from 'cache-manager';
import { ForgotPasswordDto } from '@/dto/users';
import { EmailEnum } from '@/enum/email';
import {
  SendOfficeEmail,
  SendRecuritmentEmail,
  SubmitGxaApplicationEmail,
  SubmitGxaWorksEmail
} from '@/dto/email';
@Injectable()
export class EmailService {
  constructor(
    private readonly mailerService: MailerService,
    @Inject(CACHE_MANAGER)
    private readonly cacheService: Cache,
  ) {}

  async sendSubmitGxaWorksEmail(data: SubmitGxaWorksEmail) {
    try {
      const options = this.getMessageBody(
        EmailEnum.SubmitGxaWorksEmail,
        data,
      );
      await this.mailerService.sendMail(options);
    } catch (err) {
      console.error('发送邮件出错:', err);
      return { code: -1, message: err };
    }
  }
  async sendInterviewNoticeEmail(data: SendRecuritmentEmail) {
    try {
      const options = this.getMessageBody(
        EmailEnum.InterviewNoticeEmail,
        data
      );
      await this.mailerService.sendMail(options)
    } catch (err) {
      console.error('发送邮件出错:', err);
      return { code: -1, message: err };
    }
  }

  async sendAdmissionEmail(data: SendOfficeEmail) {
    try {
      await this.mailerService.sendMail(
        this.getMessageBody(
          EmailEnum.AdmissionEmail,
          data
        )
      )
    } catch (err) {
      console.error('发送邮件出错:', err);
    }
  }

  private getMessageBody(type: EmailEnum, data: any): ISendMailOptions {
    const sign = '四川轻化工大学计算机技术协会';
    const date = formatDate(new Date())
    switch(type) {
      case EmailEnum.VerifyEmail: {        
        return {
          to: `${data.qq}@qq.com`,
          subject: '邮箱验证',
          template: 'validate.code.ejs',
          context: {
            code: data.code,
            date,
            sign,
          }
        };
      }
      case EmailEnum.InterviewNoticeEmail: {
        return {
          to: data.qq + '@qq.com',
          subject: '面试通知',
          template: 'InterviewNoticeEmail.code.ejs',
          context: {
            username: data.username,
            date,
            sign
          }
        }
      }
      case EmailEnum.AdmissionEmail: {
        return {
          to: data.qq + '@qq.com',
          subject: '录取通知',
          template: 'access_recruitment.code.ejs',
          context: {
            username: data.username,
            date,
            department: data.department,
            sign
          }
        }
      }
    }
  }
}
