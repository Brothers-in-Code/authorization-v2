import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class ScanServiceService {
  @Cron('0 12 * * *')
  async run() {
    // params from config
    const groups: { id: string }[] = []; // extract groups
    for (let i = 0; i < groups.length; i++) {
      const groupId = groups[i].id;
      const token = ''; // update token
      await this.scanGroup(token, groupId, 'week');
    }
  }
  async scanGroup(token: string, groupID: string, time: string) {
    const lastDat = new Date() - Number(time);
    let currentDate = new Date();
    while (currentDate > lastDat) {
      const posts = []; // load posts from VK
      for (let i = 0; i < posts.length; i++) {
        console.log('Save post to db');
      }

      const lastPost = posts[posts.length - 1];
      lastDat = lastPost.date;
    }
  }
}
