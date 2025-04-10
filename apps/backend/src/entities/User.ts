import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm'

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id!: number

  @Column({ unique: true })
  username!: string

  @Column({ unique: true })
  email!: string

  @Column()
  password!: string

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  createdAt!: Date

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  updatedAt!: Date

  @BeforeInsert()
  setCreatedAt() {
    const currentDate = new Date()
    this.createdAt = currentDate
    this.updatedAt = currentDate
  }

  @BeforeUpdate()
  setUpdatedAt() {
    this.updatedAt = new Date()
  }
}
