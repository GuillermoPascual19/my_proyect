import { Request, Response } from 'express';
import { User } from '../models/user';

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong' });
  }
};

export const createUser = async (req: Request, res: Response) => {
  try {
    const user = await User.create(req.body);
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong' });
  }
};

