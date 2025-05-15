import {
  Controller,
  Post,
  Body,
  UseGuards,
  Req,
  Get,
  Param,
  ValidationPipe,
} from "@nestjs/common";
import { VoteService } from "./vote.service";
import { CreateVoteDto } from "./dto/create-vote.dto";
import { AuthGuard } from "@nestjs/passport";
import { Roles } from "src/roles.decorator";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { RolesGuard } from "src/roles.guard";

@ApiTags("投票")
@Controller("vote")
@UseGuards(AuthGuard("jwt"), RolesGuard)
export class VoteController {
  constructor(private readonly voteService: VoteService) {}
  @ApiOperation({ summary: "用户投票" })
  @Roles("user")
  @Post()
  async vote(@Body(new ValidationPipe()) dto: CreateVoteDto, @Req() req) {
    return this.voteService.create(req.user._id, dto);
  }
 
}
