// src/backend/src/services/TTSService.ts

import axios from 'axios';
import { config } from '../config';
import { v4 as uuidv4 } from 'uuid';
import * as fs from 'fs';
import * as path from 'path';

export class TTSService {
  private voiceDir = '/tmp/voices';

  constructor() {
    // 确保目录存在
    if (!fs.existsSync(this.voiceDir)) {
      fs.mkdirSync(this.voiceDir, { recursive: true });
    }
  }

  // 文字转语音
  async synthesize(text: string): Promise<string> {
    try {
      const response = await axios.post(
        `${config.ai.baseUrl}/t2a_v2`,
        {
          model: 'speech-01-turbo',
          text,
          voice_setting: {
            voice_id: 'male-qn-qingse',
          },
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${config.ai.apiKey}`,
          },
          responseType: 'arraybuffer',
        }
      );

      // 保存文件
      const filename = `${uuidv4()}.mp3`;
      const filepath = path.join(this.voiceDir, filename);
      fs.writeFileSync(filepath, response.data);

      // 返回文件路径（实际应该返回 CDN URL）
      return filepath;
    } catch (error) {
      console.error('TTS 合成失败:', error);
      throw new Error('语音合成失败');
    }
  }

  // 语音转文字（ASR）
  async recognize(audioUrl: string): Promise<string> {
    try {
      // 下载音频文件
      const audioResponse = await axios.get(audioUrl, { responseType: 'arraybuffer' });
      const audioBuffer = Buffer.from(audioResponse.data);

      const response = await axios.post(
        `${config.ai.baseUrl}/a2a_v2`,
        {
          model: 'paraformer-realtime-v2',
          file: audioBuffer.toString('base64'),
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${config.ai.apiKey}`,
          },
        }
      );

      return response.data.text || '';
    } catch (error) {
      console.error('ASR 识别失败:', error);
      throw new Error('语音识别失败');
    }
  }
}
