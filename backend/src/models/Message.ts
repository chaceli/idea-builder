// src/backend/src/models/Message.ts

import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../db/sequelize';

interface MessageAttributes {
  id: string;
  userId: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  voiceUrl?: string;
  emotion?: string;
  metadata?: object;
  createdAt?: Date;
}

interface MessageCreationAttributes extends Optional<MessageAttributes, 'id'> {}

export class Message extends Model<MessageAttributes, MessageCreationAttributes> implements MessageAttributes {
  public id!: string;
  public userId!: string;
  public role!: 'user' | 'assistant' | 'system';
  public content!: string;
  public voiceUrl?: string;
  public emotion?: string;
  public metadata?: object;
  public readonly createdAt!: Date;
}

Message.init(
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
    role: {
      type: DataTypes.ENUM('user', 'assistant', 'system'),
      allowNull: false,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    voiceUrl: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    emotion: {
      type: DataTypes.STRING(32),
      allowNull: true,
    },
    metadata: {
      type: DataTypes.JSON,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'messages',
    timestamps: true,
    indexes: [
      {
        fields: ['userId', 'createdAt'],
      },
    ],
  }
);
