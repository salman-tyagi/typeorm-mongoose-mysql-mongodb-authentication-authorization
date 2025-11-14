import {
  Entity,
  ObjectId,
  Column,
  ObjectIdColumn,
  AfterInsert,
  AfterUpdate,
  AfterRemove,
} from 'typeorm';

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

  @Column({
    type: 'enum',
    enum: Roles,
    default: Roles.USER,
  })
  role: Roles = Roles.USER;

  @Column()
  createdAt: Date = new Date();

  @AfterInsert()
  logInsert() {
    console.log(`inserted document with id, ${this._id}`);
  }

  @AfterUpdate()
  logUpdate() {
    console.log(`updated document with id, ${this._id}`);
  }

  @AfterRemove()
  logRemove() {
    console.log(`removed document with id, ${this._id}`);
  }
}
