import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { AbstractEntity } from '../entities/abstract.entity';

@Entity()
export class Report extends AbstractEntity {
  @Column({
    type: 'varchar',
    length: 100,
    default: Date.now().toLocaleString('ru-RU'),
  })
  name: string;

  @Column({
    type: 'varchar',
    length: 1000,
  })
  description: string;

  @Column({ type: 'date', default: null })
  start_date_period: Date;

  @Column({ type: 'date', default: null })
  end_date_period: Date;
}
