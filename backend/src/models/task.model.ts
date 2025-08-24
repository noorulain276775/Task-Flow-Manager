// src/models/task.model.ts
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from "typeorm";
import { Project } from "./project.model.js";
import { User } from "./user.model.js";

export type TaskStatus = "pending" | "in-progress" | "done";
export type TaskPriority = "low" | "medium" | "high";

@Entity()
export class Task {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  title!: string;

  @Column({ nullable: true })
  description?: string;

  @Column({ type: "enum", enum: ["low", "medium", "high"], default: "medium" })
  priority!: TaskPriority;

  @Column({ type: "enum", enum: ["pending", "in-progress", "done"], default: "pending" })
  status!: TaskStatus;

  @Column({ nullable: true })
  projectId?: string;

  @Column({ nullable: true })
  assignedTo?: string;

  @Column({ nullable: true })
  dueDate?: Date;

  @ManyToOne(() => Project, project => project.tasks)
  @JoinColumn({ name: "projectId" })
  project?: Project;

  @ManyToOne(() => User)
  @JoinColumn({ name: "assignedTo" })
  assignee?: User;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
