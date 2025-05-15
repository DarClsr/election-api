import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { RolesGuard } from 'src/roles.guard';
import { UsersService } from './users.service';
import { Roles } from 'src/roles.decorator';

@ApiTags("用户")
@Controller('users')
@UseGuards(AuthGuard("jwt"), RolesGuard)
@Roles("admin")
export class UsersController {
       constructor(private readonly userService: UsersService) {}
     

      @ApiOperation({ summary: "获取用户列表" })
      @Get()
      findAll(@Query() query) {
        return this.userService.findAll(query);
      }
    
}
