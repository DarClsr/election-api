import { ArrayMinSize, IsArray, IsMongoId, IsNotEmpty } from "class-validator";

export class CreateVoteDto {
  @IsMongoId()
  @IsNotEmpty({ message: "选举id不能为空" })
  electionId: string;

  @IsArray()
  @IsMongoId({ each: true })
  @ArrayMinSize(2, { message: "候选人不能少于两个" })
  candidateIds: string[];
}
