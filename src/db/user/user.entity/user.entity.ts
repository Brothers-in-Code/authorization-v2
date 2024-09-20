import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryColumn()
  id: number;

  @Column()
  user_id: number;

  @Column()
  access_token: string;

  @Column()
  refresh_token: string;

  @Column()
  expires_date: Date;
}
