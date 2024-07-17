import {IsNotEmpty, IsOptional} from 'class-validator';
import {ApiProperty} from "@nestjs/swagger";

export class LoginAdminDto {
  @ApiProperty({
    description: '用户名',
    example: 'admin',
    required: true,
  })
  @IsNotEmpty({message: '用户名不能为空'})
  username: string;

  @ApiProperty({
    description: '密码',
    example: '123456',
    required: true,
  })
  @IsNotEmpty({message: '密码不能为空'})
  password: string;

  @ApiProperty({
    description: '验证码',
    example: '123456',
    required: true,
  })
  @IsNotEmpty({message: '验证码不能为空'})
  captcha: string;

  @ApiProperty({
    description: '是否保持会话，0 表示不保持，1 表示保持',
    example: 1,
    required: false,
  })
  @IsOptional()
  remember: 0 | 1; // 0 不保持会话 1 保持会话
}
