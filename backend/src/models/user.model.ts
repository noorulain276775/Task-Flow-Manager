// src/models/user.model.ts
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from "typeorm";
import { Project } from "./project.model.js";

export type UserRole = "admin" | "user" | "manager";

@Entity()
export class User {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ unique: true })
  email!: string;

  @Column()
  password!: string;

  @Column()
  name!: string;

  @Column({ type: "enum", enum: ["admin", "user", "manager"], default: "user" })
  role!: UserRole;

  @Column({ nullable: true })
  avatar?: string;

  @Column({ default: true })
  isActive!: boolean;

  @OneToMany(() => Project, project => project.ownerId)
  projects!: Project[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
