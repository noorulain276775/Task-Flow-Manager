// src/controllers/task.controller.ts
import { Request, Response } from "express";
import { AppDataSource } from "../utils/dataSource.js";
import { Task } from "../models/task.model.js";
import wsService from "../services/websocket.js";

const taskRepo = AppDataSource.getRepository(Task);

export const getTasks = async (req: Request, res: Response): Promise<void> => {
  try {
    const tasks = await taskRepo.find({
      relations: ["project", "assignee"]
    });
    res.json(tasks);
  } catch (error) {
    console.error("Error fetching tasks:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const createTask = async (req: Request, res: Response): Promise<void> => {
  try {
    const task = taskRepo.create(req.body);
    const saved = await taskRepo.save(task);

    // Emit WebSocket event
    wsService.broadcast({
      type: "task_update",
      data: saved
    });

    res.status(201).json(saved);
  } catch (error) {
    console.error("Error creating task:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateTask = async (req: Request, res: Response): Promise<void> => {
  try {
    const task = await taskRepo.findOneBy({ id: req.params.id });
    if (!task) {
      res.status(404).json({ message: "Task not found" });
      return;
    }

    Object.assign(task, req.body);
    const saved = await taskRepo.save(task);

    wsService.broadcast({
      type: "task_update",
      data: saved
    });

    res.json(saved);
  } catch (error) {
    console.error("Error updating task:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteTask = async (req: Request, res: Response): Promise<void> => {
  try {
    const task = await taskRepo.findOneBy({ id: req.params.id });
    if (!task) {
      res.status(404).json({ message: "Task not found" });
      return;
    }

    await taskRepo.remove(task);

    wsService.broadcast({
      type: "task_update",
      data: { id: req.params.id, deleted: true }
    });

    res.json({ message: "Task deleted successfully" });
  } catch (error) {
    console.error("Error deleting task:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
