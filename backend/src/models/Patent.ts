// src/backend/src/models/Patent.ts

import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../db/sequelize';

interface PatentAttributes {
  id: number;
  userId: number;
  title: string;
  type: 'invention' | 'utility' | 'design';
  field: string;
  description: string;
  content?: string;
  claims?: string;
  specification?: string;
  abstract?: string;
  status: 'draft' | 'generating' | 'completed' | 'failed';
  aiModel?: string;
  tokensUsed?: number;
  errorMessage?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface PatentCreationAttributes extends Optional<PatentAttributes, 'id' | 'content' | 'claims' | 'specification' | 'abstract' | 'status' | 'aiModel' | 'tokensUsed' | 'errorMessage'> {}

export class Patent extends Model<PatentAttributes, PatentCreationAttributes> implements PatentAttributes {
  public id!: number;
  public userId!: number;
  public title!: string;
  public type!: 'invention' | 'utility' | 'design';
  public field!: string;
  public description!: string;
  public content?: string;
  public claims?: string;
  public specification?: string;
  public abstract?: string;
  public status!: 'draft' | 'generating' | 'completed' | 'failed';
  public aiModel?: string;
  public tokensUsed?: number;
  public errorMessage?: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Patent.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
      comment: '专利ID'
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
    title: {
      type: DataTypes.STRING(200),
      allowNull: false,
      comment: '专利名称'
    },
    type: {
      type: DataTypes.ENUM('invention', 'utility', 'design'),
      allowNull: false,
      defaultValue: 'invention',
      comment: '专利类型: invention-发明专利 utility-实用新型 design-外观设计'
    },
    field: {
      type: DataTypes.STRING(100),
      allowNull: false,
      comment: '技术领域'
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
      comment: '发明描述'
    },
    content: {
      type: DataTypes.TEXT('long') as any,
      allowNull: true,
      comment: '生成的专利内容'
    },
    claims: {
      type: DataTypes.TEXT('long') as any,
      allowNull: true,
      comment: '权利要求书'
    },
    specification: {
      type: DataTypes.TEXT('long') as any,
      allowNull: true,
      comment: '说明书'
    },
    abstract: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: '摘要'
    },
    status: {
      type: DataTypes.ENUM('draft', 'generating', 'completed', 'failed'),
      allowNull: false,
      defaultValue: 'draft',
      comment: '状态'
    },
    aiModel: {
      type: DataTypes.STRING(50),
      allowNull: true,
      comment: '使用的AI模型'
    },
    tokensUsed: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true,
      defaultValue: 0,
      comment: '消耗的Token数'
    },
    errorMessage: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: '错误信息'
    }
  },
  {
    sequelize,
    tableName: 'patents',
    timestamps: true,
    comment: '专利表',
    indexes: [
      { fields: ['user_id'] },
      { fields: ['status'] },
      { fields: ['created_at'] }
    ]
  }
);

export default Patent;
