// src/backend/src/models/Schedule.ts

import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../db/sequelize';

interface ScheduleAttributes {
  id: string;
  userId: string;
  title: string;
  content?: string;
  remindAt: Date;
  repeat?: object;
  completed: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

interface ScheduleCreationAttributes extends Optional<ScheduleAttributes, 'id'> {}

export class Schedule extends Model<ScheduleAttributes, ScheduleCreationAttributes> implements ScheduleAttributes {
  public id!: string;
  public userId!: string;
  public title!: string;
  public content?: string;
  public remindAt!: Date;
  public repeat?: object;
  public completed!: boolean;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Schedule.init(
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
    title: {
      type: DataTypes.STRING(128),
      allowNull: false,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    remindAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    repeat: {
      type: DataTypes.JSON,
      allowNull: true,
      // { type: 'daily' | 'weekly' | 'monthly', endDate?: Date }
    },
    completed: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    sequelize,
    tableName: 'schedules',
    timestamps: true,
    indexes: [
      {
        fields: ['userId', 'remindAt', 'completed'],
      },
    ],
  }
);
