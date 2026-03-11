// js/storage.js - localStorage 操作封装

import { STORAGE_KEYS } from './config.js';

// 通用存储操作
export const Storage = {
  get(key, defaultValue = null) {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : defaultValue;
    } catch {
      return defaultValue;
    }
  },

  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch {
      return false;
    }
  },

  remove(key) {
    localStorage.removeItem(key);
  },

  clear() {
    localStorage.clear();
  }
};

// 项目数据专用方法
export const ProjectStorage = {
  getAll() {
    return Storage.get(STORAGE_KEYS.PROJECTS, []);
  },

  save(projects) {
    Storage.set(STORAGE_KEYS.PROJECTS, projects);
  },

  add(project) {
    const projects = this.getAll();
    projects.unshift(project);
    this.save(projects);
    return project;
  },

  update(id, data) {
    const projects = this.getAll();
    const index = projects.findIndex(p => p.id === id);
    if (index !== -1) {
      projects[index] = { ...projects[index], ...data };
      this.save(projects);
      return projects[index];
    }
    return null;
  },

  delete(id) {
    const projects = this.getAll().filter(p => p.id !== id);
    this.save(projects);
  },

  getById(id) {
    return this.getAll().find(p => p.id === id);
  },

  generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
  }
};