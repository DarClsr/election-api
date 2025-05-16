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
  Patch,
  Query,
} from '@nestjs/common';
import { ElectionService } from './election.service';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from 'src/roles.decorator';
import { RolesGuard } from 'src/roles.guard';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateElectionDto } from './dto/create-election.dto';
import { ActiveElectionDto } from './dto/active-election.dto';
import { CurrentUser } from 'src/auth/user.decorator';
import { UpdateElectionDto } from './dto/update-election.dto';

@ApiTags('选举')
@Controller('elections')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class ElectionController {
  constructor(private readonly electionService: ElectionService) {}

  @ApiOperation({ summary: '创建选举' })
  @Post()
  @Roles('admin')
  create(
    @Body(new ValidationPipe()) body: CreateElectionDto,
    @CurrentUser() user,
  ) {
    return this.electionService.create(body, user);
  }

  @ApiOperation({ summary: '获取选举列表' })
  @Get()
  @Roles('admin')
  findAll(@Query() query) {
    return this.electionService.findAll(query);
  }
  @ApiOperation({ summary: '获取单个选举' })
  @Get(':code')
  findOne(@Param('code') code: string) {
    return this.electionService.findOne(code);
  }
  @ApiOperation({ summary: '修改选举' })
  @Put(':id')
  @Roles('admin')
  update(
    @Param('id') id: string,
    @Body(new ValidationPipe()) body: UpdateElectionDto,
  ) {
    return this.electionService.update(id, body);
  }
  @ApiOperation({ summary: '删除选举' })
  @Delete(':id')
  @Roles('admin')
  remove(@Param('id') id: string) {
    return this.electionService.delete(id);
  }

  @ApiOperation({ summary: '开启或者关闭选举' })
  @Patch(':id/status')
  @Roles('admin')
  async active(
    @Param('id') id: string,
    @Body(new ValidationPipe()) body: ActiveElectionDto,
  ) {
    return await this.electionService.active(id, body.status);
  }

  @ApiOperation({ summary: '投票结果' })
  @Roles('admin')
  @Get(':electionId/results')
  async getResults(@Param('electionId') electionId: string) {
    return this.electionService.getResults(electionId);
  }
}
