import { Entity, JoinColumn, ManyToMany } from 'typeorm';
import { AbstractEntity } from './abstract.entity';
import { User } from './user.entity';
import { Group } from './group.entity';

@Entity({ name: 'user_group' })
export class UserGroup extends AbstractEntity {
  @ManyToMany(() => User, (user) => user.id)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToMany(() => Group, (group) => group.id)
  @JoinColumn({ name: 'group_id' })
  group: Group;
}
