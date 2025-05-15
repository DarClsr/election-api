import {
  IsString,
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsIn,
} from "class-validator";

export class ActiveElectionDto {
  @IsNumber({}, { message: "status必须是数字" })
  @IsIn([0, 1], { message: "status只能是0或1" })
  status: number;
}
