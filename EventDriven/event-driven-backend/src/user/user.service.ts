import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { FullUserInfo } from 'src/dtos/full-user-info.dto';

@Injectable()
export class UserService {
 constructor(private prisma: PrismaService) {}
 
 
 async updateUserStatus(userId: number, status: 'online' | 'offline' | 'idle' | 'working', currentDocument?: string) {
    try {
      const numericUserId = Number(userId); // Konvertuj u broj
      if (isNaN(numericUserId)) {
        throw new Error('Invalid user ID');
      }

      console.log(`Updating status for user ID: ${numericUserId} to ${status}`);
      const result = await this.prisma.user.update({
        where: { id: numericUserId },
        data: { status, currentDocument: status === 'working' ? currentDocument : null },
      });
      console.log('Status updated successfully:', result);
      return result;
    } catch (error) {
      console.error('Error updating user status:', error);
      throw error;
    }
  }

  async logoutUser(userId: number) {
    try {
      console.log(`Logging out user with ID: ${userId}`);
      const result = await this.updateUserStatus(userId, 'offline');
      console.log('User status updated to offline:', result);
      return result;
    } catch (error) {
      console.error('Error logging out user:', error);
      throw error;
    }
  }

 
 async getUserById(id: number) {
    try{
        const userId = Number(id);
        if (isNaN(userId)) {
            throw new Error('Invalid user id');
        }
        const user = await this.prisma.user.findUnique({
            where: {
                id: userId
            },
            select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                role: true,
                managingCommunities: {
                    select: {
                        id: true,
                        name: true,
                    }
                },
                createdCommunities: {
                    select: {
                        id: true,
                        name: true,
                    }
                },
                communities: {
                    select: {
                        id: true,
                        name: true,
                        members: {
                            select: {
                                id: true,
                                firstName: true,
                                lastName: true,
                                email: true,
                            }
                        }
                        }
                },
                documents: {
                    select: {
                        id: true,
                        name: true,
                        type: true,
                        day: true,
                    }
                }
                }
            });
        if (!user) {
            throw new NotFoundException('User not found');
        }
        return user;
    }
    catch(e) {
        console.log(e);
        throw e;
        }
    }

    async getUserByEmail(email: string) {
        try{
            const user = await this.prisma.user.findUnique({
                where: {
                    email
                },
                select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    email: true,
                }
            });
            if (!user) {
                throw new NotFoundException('User not found');
            }
            return user;
        }
        catch(e) {
            console.log(e);
            throw e;
        }
    }

    async deleteUser(id: number){
        try{
            const userId = Number(id);
            if (isNaN(userId)) {
                throw new Error('Invalid user id');
            }
            const user = await this.prisma.user.delete({
                where: {
                    id: userId
                }
            });
            if (!user) {
                throw new Error('User not found');
            }
            delete user.hashedPassword;
            return user;
        }
        catch(e) {
            console.log(e);
            throw e;
        }
    }


    async updateUser(newInfo: FullUserInfo){
        try{
            const user = await this.prisma.user.update({
                where: {
                    id: newInfo.id
                },
                data: {
                    firstName: newInfo.firstName,
                    lastName: newInfo.lastName,
                    email: newInfo.email,
                    role: newInfo.role,
                }
            });
            if (!user) {
                throw new NotFoundException('User not found');
            }
            return user;
        }
        catch(e) {
            console.log(e);
            throw e;
        }
    }

    async manageCommunity(userId: number, communityId: number){
        try{
            const user = await this.prisma.user.update({
                where: {
                    id: userId
                },
                data: {
                    managingCommunities: {
                        connect: {
                            id: communityId
                        }
                    }
                }
            });
            if (!user) {
                throw new NotFoundException('User not found');
            }
            return user;
        }
        catch(e) {
            console.log(e);
            throw e;
        }
    }
}