// src/backend/src/models/Memory.ts

import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../db/sequelize';

interface MemoryAttributes {
  id: string;
  userId: string;
  type: 'short-term' | 'long-term' | 'fact';
  content: string;
  importance: number;
  embedding?: number[];
  createdAt?: Date;
  updatedAt?: Date;
}

interface MemoryCreationAttributes extends Optional<MemoryAttributes, 'id'> {}

export class Memory extends Model<MemoryAttributes, MemoryCreationAttributes> implements MemoryAttributes {
  public id!: string;
  public userId!: string;
  public type!: 'short-term' | 'long-term' | 'fact';
  public content!: string;
  public importance!: number;
  public embedding?: number[];
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Memory.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    type: {
      type: DataTypes.ENUM('short-term', 'long-term', 'fact'),
      allowNull: false,
      defaultValue: 'short-term',
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    importance: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
      validate: {
        min: 1,
        max: 5,
      },
    },
    embedding: {
      type: DataTypes.JSON, // 存储向量
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'memories',
    timestamps: true,
    indexes: [
      {
        fields: ['userId', 'type'],
      },
      {
        fields: ['userId', 'createdAt'],
      },
    ],
  }
);
