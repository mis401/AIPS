import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { FullUserInfo } from 'src/dtos/full-user-info.dto';
import { Server } from 'socket.io';

@Injectable()
export class UserService {
  private server: Server;

  constructor(private prisma: PrismaService) {}

  setServer(server: Server) {
    this.server = server;
  }
 
  async updateUserStatus(userId: number, status: 'online' | 'offline', communityId?: number) {
    try {
      const numericUserId = Number(userId); 
      if (isNaN(numericUserId)) {
        throw new Error('Invalid user ID');
      }

      console.log(`Updating status for user ID: ${numericUserId} to ${status}`);
      const result = await this.prisma.user.update({
        where: { id: numericUserId },
        data: { status },
      });

      // Emit to specific community if provided
      if (communityId) {
        this.server.to(`community_${communityId}`).emit('userStatus', {
          userId: numericUserId,
          status: result.status,
          currentDocument: result.currentDocument,
        });
      } else {
        this.server.emit('userStatus', {
          userId: numericUserId,
          status: result.status,
          currentDocument: result.currentDocument,
        });
      }

      console.log('Status updated successfully:', result);
      return result;
    } catch (error) {
      console.error('Error updating user status:', error);
      throw error;
    }
  }

  async logoutUser(userId: number, communityId?: number) {
    try {
      console.log(`Logging out user with ID: ${userId}`);
      const result = await this.updateUserStatus(userId, 'offline', communityId);
      console.log('User status updated to offline:', result);
      return result;
    } catch (error) {
      console.error('Error logging out user:', error);
      throw error;
    }
  }

  async updateUserCurrentDocument(userId: number, document: string | null) {
    const numericUserId = Number(userId);
    if (isNaN(numericUserId)) {
      throw new Error('Invalid user ID');
    }
  
    const updatedUser = await this.prisma.user.update({
      where: { id: numericUserId },
      data: { currentDocument: document },
    });
  
    // Emit the user status update to inform others of the document change
    this.server.emit('userStatus', {
      userId: numericUserId,
      status: updatedUser.status,
      currentDocument: updatedUser.currentDocument,
    });
  
    console.log('Updated user:', updatedUser);
    return updatedUser;
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
