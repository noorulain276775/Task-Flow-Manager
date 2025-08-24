// src/controllers/user.controller.ts
import { Request, Response } from "express";
import { AppDataSource } from "../utils/dataSource.js";
import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const userRepo = AppDataSource.getRepository(User);

export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await userRepo.find({
      select: ["id", "email", "name", "role", "avatar", "isActive", "createdAt"]
    });
    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const createUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password, name, role } = req.body;

    // Check if user already exists
    const existingUser = await userRepo.findOneBy({ email });
    if (existingUser) {
      res.status(400).json({ message: "User already exists" });
      return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    const user = userRepo.create({
      email,
      password: hashedPassword,
      name,
      role: role || "user"
    });

    const saved = await userRepo.save(user);
    const { password: _, ...userWithoutPassword } = saved;
    res.status(201).json(userWithoutPassword);
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    const user = await userRepo.findOneBy({ email });
    if (!user) {
      res.status(401).json({ message: "Invalid credentials" });
      return;
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      res.status(401).json({ message: "Invalid credentials" });
      return;
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || "your-secret-key",
      { expiresIn: "24h" }
    );

    const { password: _, ...userWithoutPassword } = user;
    res.json({ user: userWithoutPassword, token });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await userRepo.findOneBy({ id: req.params.id });
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    // Hash password if it's being updated
    if (req.body.password) {
      req.body.password = await bcrypt.hash(req.body.password, 12);
    }

    Object.assign(user, req.body);
    const saved = await userRepo.save(user);
    
    const { password: _, ...userWithoutPassword } = saved;
    res.json(userWithoutPassword);
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await userRepo.findOneBy({ id: req.params.id });
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    await userRepo.remove(user);
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
