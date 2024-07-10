import { Body, Controller, Delete, Get, Put, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { FullUserInfo } from 'src/dtos/full-user-info.dto';


@Controller('user')
export class UserController {
    constructor(private userService: UserService) {}

    @Get('get')
    async getUser(@Query('id') id: number) {
        return await this.userService.getUserById(id);
    }

    @Put('update')
    async updateUser(@Body() newUser: FullUserInfo) {
        return await this.userService.updateUser(newUser);
    }

    @Delete('delete')
    async deleteUser(@Query('id') id: number) {
        return await this.userService.deleteUser(id);
    }

    @Put('manage')
    async manageCommunity(@Body('userId') userId: number, @Body('communityId') communityId: number) {
        return await this.userService.manageCommunity(userId, communityId);
    }

    @Put('logout')
  async logout(@Query('id') id: number) {
    try {
      const numericId = Number(id); // Konvertuj u broj
      if (isNaN(numericId)) {
        throw new Error('Invalid user ID');
      }
      return await this.userService.logoutUser(numericId);
    } catch (error) {
      console.error('Logout error:', error);
      throw new Error('Logout failed');
    }
  }
}
