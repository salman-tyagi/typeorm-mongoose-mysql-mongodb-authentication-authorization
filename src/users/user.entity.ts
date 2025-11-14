import { Entity, ObjectId, Column, ObjectIdColumn } from 'typeorm';

export enum Roles {
  USER = 'user',
  ADMIN = 'admin',
}

@Entity({ name: 'users' })
export class User {
  @ObjectIdColumn()
  _id: ObjectId;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  confirmPassword: string;

  @Column({
    type: 'enum',
    enum: Roles,
    default: Roles.USER,
  })
  role: Roles;

  @Column()
  createdAt: Date = new Date();
}
