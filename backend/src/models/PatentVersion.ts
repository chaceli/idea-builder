// src/backend/src/models/PatentVersion.ts

import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../db/sequelize';

interface PatentVersionAttributes {
  id: number;
  patentId: number;
  version: number;
  content?: string;
  claims?: string;
  changeLog?: string;
  createdAt?: Date;
}

interface PatentVersionCreationAttributes extends Optional<PatentVersionAttributes, 'id' | 'content' | 'claims' | 'changeLog'> {}

export class PatentVersion extends Model<PatentVersionAttributes, PatentVersionCreationAttributes> implements PatentVersionAttributes {
  public id!: number;
  public patentId!: number;
  public version!: number;
  public content?: string;
  public claims?: string;
  public changeLog?: string;
  public readonly createdAt!: Date;
}

PatentVersion.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
      comment: '版本ID'
    },
    patentId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      comment: '专利ID',
      references: {
        model: 'patents',
        key: 'id'
      }
    },
    version: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      comment: '版本号'
    },
    content: {
      type: DataTypes.TEXT('long') as any,
      allowNull: true,
      comment: '专利内容'
    },
    claims: {
      type: DataTypes.TEXT('long') as any,
      allowNull: true,
      comment: '权利要求书'
    },
    changeLog: {
      type: DataTypes.STRING(500),
      allowNull: true,
      comment: '变更说明'
    }
  },
  {
    sequelize,
    tableName: 'patent_versions',
    timestamps: true,
    comment: '专利版本表',
    indexes: [
      { fields: ['patent_id'] },
      { fields: ['version'] }
    ]
  }
);

export default PatentVersion;
