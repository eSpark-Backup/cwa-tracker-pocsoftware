/* eslint-disable prettier/prettier */
import { Entity, PrimaryGeneratedColumn, Column, Index } from 'typeorm';
import { BaseEntity } from './base.entity';

@Entity()
@Index(['id', 'email']) // Create a composite index on both id and email
export class User extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  @Index() // Single index on the user ID
  id: string;

  @Column({ type: 'varchar', length: 100, unique: true })
  name: string;

  @Column({ type: 'varchar', length: 100, unique: true })
  @Index() // Single index on the email
  email: string;

  @Column({ type: 'varchar', length: 255 })
  password: string;

  @Column({ type: 'varchar', length: 50 })
  role: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  secret: string;

  @Column({ type: 'boolean', default: false })
  is2FA: boolean;
}
