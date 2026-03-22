import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { User } from "./User";

@Entity()
export class Address extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column({ type: "float", nullable: true })
  lng: number;

  @Column({ type: "float", nullable: true })
  lat: number;

  @Column({ nullable: true })
  rating: number;

  @Column({ default: false })
  isPublic: boolean;

  @ManyToOne(() => User, (user) => user.addresses)
  user: User;

  @CreateDateColumn()
  createdAt: Date;
}
