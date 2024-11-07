/* eslint-disable prettier/prettier */
import { Entity, Column, PrimaryGeneratedColumn, Index } from 'typeorm';
import { BaseEntity } from './base.entity';

@Entity('devices')
@Index('IDX_device_id', ['id'])
export class Device extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 50, unique: true })
  code: string;

  @Column({ type: 'varchar', length: 17, unique: true })
  macAddress: string;

  @Column({ type: 'json', nullable: true })
  registeredLocation: Record<string, any>;

  @Column({ type: 'boolean', default: false })
  isOnBoard: boolean;
}
