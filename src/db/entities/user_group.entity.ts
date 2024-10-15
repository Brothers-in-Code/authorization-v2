import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { AbstractEntity } from './abstract.entity';
import { User } from './user.entity';
import { Group } from './group.entity';

//  TODO добавить колонку is_scan
@Entity({ name: 'user_group' })
export class UserGroup extends AbstractEntity {
  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Group, (group) => group.id)
  @JoinColumn({ name: 'group_id' })
  group: Group;

  @Column({ default: 0 })
  is_scan: number;
}
