import {
  IsDateString,
  IsNotEmpty,
  IsArray,
  ArrayNotEmpty,
  ArrayMinSize,
  IsMongoId,
} from "class-validator";

export class CreateElectionDto {
  @IsNotEmpty({ message: "名字不能为空" })
  title?: string;

  @IsNotEmpty({ message: "描述不能为空" })
  description?: string;

  @IsArray({ message: "时间格式不正确，应为数组" })
  @ArrayNotEmpty({ message: "时间不能为空" })
  @IsDateString(
    {},
    {
      each: true,
      message: "时间项必须是有效的日期字符串",
    }
  )
   @ArrayMinSize(2, { message: '时间至少需要两个时间点' })
  times?: string[];

  @IsArray({ message: "候选人格式不正确，应为数组" })
  @ArrayNotEmpty({ message: "候选人不能为空" })
   @ArrayMinSize(2, { message: '候选人至少需要两个' })
  @IsMongoId({ each: true, message: '每个候选人ID必须是合法的ID' })
  candidates?: string[];
}
