import { Body, Controller, Get, Post, Put, Query } from '@nestjs/common';
import { CommunityService } from './community.service';

@Controller('community')
export class CommunityController {
    constructor(private communityService: CommunityService) {}
    
    @Get('get-for-user')
    async getUserCommunities(@Query('userId') userId: number) {
        return await this.communityService.getUserCommunities(userId);
    }

    @Get('get-community')
    async getCommunity(@Query('id') id: number) {
        return await this.communityService.getCommunity(id);
    }

    @Put('join')
    async joinCommunity(@Body('userId') userId: number, @Body('communityId') communityId: number) {
        return await this.communityService.joinCommunity(userId, communityId);
    }

    @Put('leave')
    async leaveCommunity(@Body('userId') userId: number, @Body('communityId') communityId: number) {
        return await this.communityService.leaveCommunity(userId, communityId);
    }

    @Post('create')
    async createCommunity(
        @Body('name') name: string,
        @Body('userId') userId: number
    )
    {
        return await this.communityService.createCommunity(name, userId);
    }
}
