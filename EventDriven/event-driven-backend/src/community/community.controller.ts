import { Body, Controller, Get, Post, Put, Query } from '@nestjs/common';
import { CommunityService } from './community.service';

@Controller('community')
export class CommunityController {
    constructor(private communityService: CommunityService) {}
    
    @Get('get-for-user')
<<<<<<< HEAD
    async getUserCommunities(@Query('userId') userId: number) {
        return await this.communityService.getUserCommunities(userId);
=======
    async getUserCommunities(@Query('userId') userId: string) {
        const res = await this.communityService.getUserCommunities(parseInt(userId));
        console.log(res);
        return res;
>>>>>>> main
    }

    @Get('get-community')
    async getCommunity(@Query('id') id: string) {
        return await this.communityService.getCommunity(parseInt(id));
    }

    @Put('join')
    async joinCommunity(@Body('userId') userId: number, @Body('communityCode') communityCode: string) {
        return await this.communityService.joinCommunity(userId, communityCode);
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
