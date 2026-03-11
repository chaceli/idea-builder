// src/backend/src/models/User.ts

import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../db/sequelize';

interface UserAttributes {
  id: string;
  openid: string;
  nickname: string;
  avatar: string;
  personality: object;
  // AI 配置字段
  aiModelId?: string;           // 用户选择的模型 ID
  aiApiKey?: string;            // 用户的 API Key（加密存储）
  aiProvider?: string;          // AI 提供商
  createdAt?: Date;
  updatedAt?: Date;
}

interface UserCreationAttributes extends Optional<UserAttributes, 'id'> {}

export class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  public id!: string;
  public openid!: string;
  public nickname!: string;
  public avatar!: string;
  public personality!: object;
  public aiModelId?: string;
  public aiApiKey?: string;
  public aiProvider?: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

User.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    openid: {
      type: DataTypes.STRING(64),
      allowNull: false,
      unique: true,
    },
    nickname: {
      type: DataTypes.STRING(64),
      defaultValue: '微信用户',
    },
    avatar: {
      type: DataTypes.STRING(255),
      defaultValue: '',
    },
    personality: {
      type: DataTypes.JSON,
      defaultValue: {
        type: 'default',
        tone: 'warm',
        greeting: '你好呀~我是小桃！',
      },
    },
    aiModelId: {
      type: DataTypes.STRING(64),
      allowNull: true,
      defaultValue: 'MiniMax-M2.5',
      comment: '用户选择的 AI 模型',
    },
    aiApiKey: {
      type: DataTypes.STRING(512),
      allowNull: true,
      comment: '用户的 API Key（建议加密存储）',
    },
    aiProvider: {
      type: DataTypes.STRING(32),
      allowNull: true,
      defaultValue: 'minimax',
      comment: 'AI 提供商: minimax, openai, anthropic, gemini',
    },
  },
  {
    sequelize,
    tableName: 'users',
    timestamps: true,
  }
);
