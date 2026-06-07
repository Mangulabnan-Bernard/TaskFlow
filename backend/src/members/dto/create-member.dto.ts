import { IsString, MaxLength, MinLength } from 'class-validator';

export class CreateMemberDto {
  @IsString()
  @MinLength(1)
  @MaxLength(80)
  name: string;

  @IsString()
  @MinLength(1)
  @MaxLength(60)
  role: string;
}
