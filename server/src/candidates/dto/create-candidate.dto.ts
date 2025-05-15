import { IsString, IsOptional, IsNotEmpty } from 'class-validator';

export class CreateCandidateDto {
  @IsString()
  @IsNotEmpty({message:"名字不能为空"})
  readonly name: string;

  @IsString()
  @IsNotEmpty({message:"描述不能为空"})
  readonly description?: string;
}    