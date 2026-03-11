// src/backend/src/utils/crypto.ts

import crypto from 'crypto';

/**
 * 加密工具类
 * 使用 AES-256-GCM 进行 API Key 加密存储
 */

// 加密算法配置
const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 16; // GCM 模式推荐 12 字节，这里用 16 保持兼容
const AUTH_TAG_LENGTH = 16;
const SALT_LENGTH = 32;
const KEY_LENGTH = 32; // 256 位

/**
 * 获取或生成主密钥
 * 主密钥从环境变量获取，如果未设置则使用默认密钥（仅用于开发环境）
 */
function getMasterKey(): Buffer {
  const masterKey = process.env.ENCRYPTION_MASTER_KEY;
  
  if (!masterKey) {
    // 开发环境警告
    console.warn('⚠️  未设置 ENCRYPTION_MASTER_KEY 环境变量，使用默认密钥（仅开发环境使用）');
    // 使用默认密钥（实际生产环境必须通过环境变量配置）
    return crypto.createHash('sha256').update('ai-companion-default-key-2026').digest();
  }
  
  // 确保密钥长度足够
  return crypto.createHash('sha256').update(masterKey).digest();
}

/**
 * 派生加密密钥
 * 使用 PBKDF2 从主密钥派生，确保安全性
 */
function deriveKey(salt: Buffer, masterKey: Buffer): Buffer {
  return crypto.pbkdf2Sync(masterKey, salt, 100000, KEY_LENGTH, 'sha256');
}

/**
 * 加密 API Key
 * @param plainText 要加密的明文
 * @returns 加密后的字符串 (base64: salt + iv + authTag + ciphertext)
 */
export function encryptApiKey(plainText: string): string {
  if (!plainText) {
    return '';
  }

  try {
    const masterKey = getMasterKey();
    const salt = crypto.randomBytes(SALT_LENGTH);
    const iv = crypto.randomBytes(IV_LENGTH);
    const key = deriveKey(salt, masterKey);

    const cipher = crypto.createCipheriv(ALGORITHM, key, iv, {
      authTagLength: AUTH_TAG_LENGTH,
    });

    let encrypted = cipher.update(plainText, 'utf8', 'base64');
    encrypted += cipher.final('base64');
    const authTag = cipher.getAuthTag();

    // 组装加密数据: salt + iv + authTag + ciphertext
    const result = Buffer.concat([
      salt,
      iv,
      authTag,
      Buffer.from(encrypted, 'base64'),
    ]);

    return result.toString('base64');
  } catch (error) {
    console.error('加密 API Key 失败:', error);
    throw new Error('加密失败');
  }
}

/**
 * 解密 API Key
 * @param encryptedText 加密后的字符串
 * @returns 解密后的明文
 */
export function decryptApiKey(encryptedText: string): string {
  if (!encryptedText) {
    return '';
  }

  try {
    const masterKey = getMasterKey();
    const buffer = Buffer.from(encryptedText, 'base64');

    // 解析加密数据
    const salt = buffer.subarray(0, SALT_LENGTH);
    const iv = buffer.subarray(SALT_LENGTH, SALT_LENGTH + IV_LENGTH);
    const authTag = buffer.subarray(SALT_LENGTH + IV_LENGTH, SALT_LENGTH + IV_LENGTH + AUTH_TAG_LENGTH);
    const ciphertext = buffer.subarray(SALT_LENGTH + IV_LENGTH + AUTH_TAG_LENGTH);

    const key = deriveKey(salt, masterKey);

    const decipher = crypto.createDecipheriv(ALGORITHM, key, iv, {
      authTagLength: AUTH_TAG_LENGTH,
    });
    decipher.setAuthTag(authTag);

    let decrypted = decipher.update(ciphertext.toString('base64'), 'base64', 'utf8');
    decrypted += decipher.final('utf8');

    return decrypted;
  } catch (error) {
    console.error('解密 API Key 失败:', error);
    throw new Error('解密失败，请检查密钥是否正确');
  }
}

/**
 * 验证 API Key 格式是否有效（不加密解密，仅格式检查）
 * @param apiKey 要验证的 API Key
 * @returns 是否为有效的加密格式
 */
export function isEncryptedApiKey(apiKey: string): boolean {
  if (!apiKey) {
    return false;
  }

  try {
    const buffer = Buffer.from(apiKey, 'base64');
    // 最小长度: salt(32) + iv(16) + authTag(16) + 最小密文(1)
    return buffer.length >= 65;
  } catch {
    return false;
  }
}

/**
 * 安全地隐藏 API Key（用于日志）
 * @param apiKey 原始 API Key
 * @returns 隐藏中间部分的字符串
 */
export function maskApiKey(apiKey: string): string {
  if (!apiKey) {
    return '';
  }

  // 如果是加密的，直接返回标记
  if (isEncryptedApiKey(apiKey)) {
    return '[ENCRYPTED]';
  }

  // 明文 key 隐藏中间部分
  if (apiKey.length <= 8) {
    return '****';
  }

  const prefix = apiKey.substring(0, 4);
  const suffix = apiKey.substring(apiKey.length - 4);
  return `${prefix}...${suffix}`;
}

/**
 * 生成随机 API Key（用于测试）
 * @returns 随机生成的密钥
 */
export function generateRandomKey(length: number = 32): string {
  return crypto.randomBytes(length).toString('base64').substring(0, length);
}
