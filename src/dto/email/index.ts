import { DepartmentEnum } from "@/enum/roles";

export class SendVerifyEmailDto {
  qq: string; // 目标邮箱
  code: string; // 验证码
  sign: string; // 签名
  subject: string;
}

export class SendRecuritmentEmail {
  qq: string;
  username: string;
}

export class SendOfficeEmail {
  qq: string;
  username: string;
  department: DepartmentEnum;
}

export class SubmitGxaApplicationEmail {
  qq: string;
  teamName: string;
}
export class SubmitGxaWorksEmail {
  qq: string;
  teamName: string;
  url: string;
}