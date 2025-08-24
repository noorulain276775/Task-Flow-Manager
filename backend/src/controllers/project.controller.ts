// src/controllers/project.controller.ts
import { Request, Response } from "express";
import { AppDataSource } from "../utils/dataSource.js";
import { Project } from "../models/project.model.js";

const projectRepo = AppDataSource.getRepository(Project);

export const getProjects = async (req: Request, res: Response): Promise<void> => {
  try {
    const projects = await projectRepo.find({
      relations: ["tasks"]
    });
    res.json(projects);
  } catch (error) {
    console.error("Error fetching projects:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const createProject = async (req: Request, res: Response): Promise<void> => {
  try {
    const project = projectRepo.create(req.body);
    const saved = await projectRepo.save(project);
    res.status(201).json(saved);
  } catch (error) {
    console.error("Error creating project:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateProject = async (req: Request, res: Response): Promise<void> => {
  try {
    const project = await projectRepo.findOneBy({ id: req.params.id });
    if (!project) {
      res.status(404).json({ message: "Project not found" });
      return;
    }

    Object.assign(project, req.body);
    const saved = await projectRepo.save(project);
    res.json(saved);
  } catch (error) {
    console.error("Error updating project:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteProject = async (req: Request, res: Response): Promise<void> => {
  try {
    const project = await projectRepo.findOneBy({ id: req.params.id });
    if (!project) {
      res.status(404).json({ message: "Project not found" });
      return;
    }

    await projectRepo.remove(project);
    res.json({ message: "Project deleted successfully" });
  } catch (error) {
    console.error("Error deleting project:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
