// src/backend/src/models/ApiConfig.ts

import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../db/sequelize';

interface ApiConfigAttributes {
  id: number;
  userId: number;
  provider: string;
  apiKey: string;
  apiSecret?: string;
  isDefault: boolean;
  status: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

interface ApiConfigCreationAttributes extends Optional<ApiConfigAttributes, 'id' | 'apiSecret' | 'isDefault' | 'status'> {}

export class ApiConfig extends Model<ApiConfigAttributes, ApiConfigCreationAttributes> implements ApiConfigAttributes {
  public id!: number;
  public userId!: number;
  public provider!: string;
  public apiKey!: string;
  public apiSecret?: string;
  public isDefault!: boolean;
  public status!: boolean;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

ApiConfig.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
      comment: '配置ID'
    },
    userId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      comment: '用户ID',
      references: {
        model: 'users',
        key: 'id'
      }
    },
    provider: {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: 'minimax',
      comment: 'AI提供商: minimax/openai/anthropic'
    },
    apiKey: {
      type: DataTypes.STRING(255),
      allowNull: false,
      comment: 'API Key'
    },
    apiSecret: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: 'API Secret'
    },
    isDefault: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      comment: '是否默认配置'
    },
    status: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
      comment: '状态: 0-禁用 1-启用'
    }
  },
  {
    sequelize,
    tableName: 'api_configs',
    timestamps: true,
    comment: 'AI API配置表',
    indexes: [
      { fields: ['user_id'] },
      { unique: true, fields: ['user_id', 'provider'] }
    ]
  }
);

export default ApiConfig;
