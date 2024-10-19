import { Entity, JoinColumn, ManyToOne } from 'typeorm';
import { AbstractEntity } from './abstract.entity';
import { User } from './user.entity';
import { Report } from './report.entity';

@Entity()
export class UserReport extends AbstractEntity {
  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Report, (report) => report.id)
  @JoinColumn({ name: 'report_id' })
  report: Report;
}
