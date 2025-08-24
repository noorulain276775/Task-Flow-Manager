// src/models/project.model.ts
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from "typeorm";
import { Task } from "./task.model.js";

export type ProjectStatus = "active" | "completed" | "archived";

@Entity()
export class Project {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  name!: string;

  @Column({ nullable: true })
  description?: string;

  @Column({ type: "enum", enum: ["active", "completed", "archived"], default: "active" })
  status!: ProjectStatus;

  @Column({ nullable: true })
  startDate?: Date;

  @Column({ nullable: true })
  endDate?: Date;

  @Column({ nullable: true })
  ownerId?: string;

  @OneToMany(() => Task, task => task.project)
  tasks!: Task[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
