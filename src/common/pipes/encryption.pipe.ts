import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { decrypt } from '../utils/encryption';
@Injectable()
export class EncryptionPipe implements PipeTransform {
  transform(value: any, _metadata: ArgumentMetadata) {
    const temp = {
      password: value.password,
      studentId: value.studentId,
      contactNumber: value.contactNumber,
      campusCardAccountNumber: value.campusCardAccountNumber,
    };
    for (const key in temp) {
      temp[key] = decrypt(temp[key]);
      if (!temp[key]) {
        console.log(`${new Date()}解密失败，可能有人非法入侵`);
        throw new BadRequestException(`decrypt error`);
      }
    }
    value = {
      ...value,
      ...temp,
    };
    console.log(`解密成功`);
    return value;
  }
}
