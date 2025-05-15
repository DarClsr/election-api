import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  ValidationPipe,
  Query,
} from "@nestjs/common";
import { CandidatesService } from "./candidates.service";
import { ApiTags, ApiOperation, ApiBearerAuth } from "@nestjs/swagger";
import { CreateCandidateDto } from "./dto/create-candidate.dto";
import { UpdateCandidateDto } from "./dto/update-candidate.dto";
import { AuthGuard } from "@nestjs/passport";
import { RolesGuard } from "src/roles.guard";
import { Roles } from "src/roles.decorator";
import { query } from "express";

@ApiTags("候选人")
@Controller("candidates")
@UseGuards(AuthGuard("jwt"), RolesGuard)
export class CandidatesController {
  constructor(private readonly candidatesService: CandidatesService) {}
  @ApiOperation({ summary: "创建候选人" })
  @ApiBearerAuth()
  @Post()
  @Roles("admin")
  create(@Body(new ValidationPipe()) createCandidateDto: CreateCandidateDto) {
    return this.candidatesService.create(createCandidateDto);
  }

  @ApiOperation({ summary: "获取所有候选人 options" })
  @Get("options")
  @Roles("admin")
  getOptions() {
    return this.candidatesService.getOptions();
  }

  @ApiOperation({ summary: "获取所有候选人" })
  @Get()
  @Roles("admin")
  findAll(@Query() query) {
    return this.candidatesService.findAll(query);
  }

  @ApiOperation({ summary: "获取单个候选人" })
  @Roles("admin")
  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.candidatesService.findOne(id);
  }

  @ApiOperation({ summary: "更新候选人" })
  @ApiBearerAuth()
  @Roles("admin")
  @Put(":id")
  update(
    @Param("id") id: string,
    @Body(new ValidationPipe()) updateCandidateDto: UpdateCandidateDto
  ) {
    return this.candidatesService.update(id, updateCandidateDto);
  }

  @ApiOperation({ summary: "删除候选人" })
  @ApiBearerAuth()
  @Delete(":id")
  @Roles("admin")
  remove(@Param("id") id: string) {
    return this.candidatesService.remove(id);
  }
}
