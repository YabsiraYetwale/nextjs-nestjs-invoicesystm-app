/* eslint-disable prettier/prettier */
import { HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { Cron, CronExpression } from '@nestjs/schedule';
import { addDays } from 'date-fns';
@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {};

  async myProfile(userId: string) {
    const user = await this.prisma.User.findUnique({
      where: { id: userId },
      include: {
        roles: {
          select:{
            role:{
              select:{
                name:true,
              }
            }
          },
        },
        permissions: {
          select: {
            role: {
              select: {
                action: true,
              },
            },
          },
        },
        companies:{
          select:{
            company:true
          }
        }
      },
    });
    delete user.password;

    return user ;
  }

  async getAllUsers() {
    const users = await this.prisma.User.findMany({
      include: { 
        companies: {
        select:{
          company:true
        }
      }
    }});
    return users;
  }

  // deleted unverified users

  // async deleteUnverifiedUsers() {
  //   try {
  //     const thirtyDaysAgo = addDays(new Date(), -30);

  //     const unverifiedUsers = await this.prisma.User.findMany({
  //       where: {
  //         emailVerified: null,
  //         createdAt: {
  //           lt: thirtyDaysAgo,
  //         },
  //       },
  //     });

  //     for (const user of unverifiedUsers) {
  //       await this.prisma.User.delete({
  //         where: {
  //           id: user.id,
  //         },
  //       });
  //       console.log(`Deleted unverified user with ID ${user.id}`);
  //     }

  //     console.log('Deletion process completed.');
  //   } catch (error) {
  //     console.error('Error occurred while deleting unverified users:', error);
  //   }
  // }

  // @Cron(CronExpression.EVERY_5_SECONDS)
  // handleUnverifiedUsers() {
  //   console.log('Unverified users schedularly deleted');
  //   this.deleteUnverifiedUsers();
  // }



  async deleteUser(id: string) {
  
    const existingUser = await this.prisma.User.findUnique({ where: id  });
    if (!existingUser) {
      throw new HttpException("user doesn't exist", 404);
    }
    const deletedUser = await this.prisma.User.delete({ where: id  });
    if (!deletedUser) {
      throw new Error("Failed to delete user");
    } else {
      return { message: "user deleted successfully" }
    }
}
}
