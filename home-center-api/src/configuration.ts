import { readFileSync } from 'fs';
import { load } from 'js-yaml';
import { join } from 'path';

export default () => {
  if(process.env.MEDIA_CENTER_SANDBOX_CONFIG) {
    return load(
      process.env.MEDIA_CENTER_SANDBOX_CONFIG
    ) as Record<string, any>;
  } else {
    const MEDIA_CENTER_CONFIG_FILE = process.env.MEDIA_CENTER_CONFIG_FILE || join(__dirname, '../config/application.yaml');
    return load(
      readFileSync(MEDIA_CENTER_CONFIG_FILE, 'utf8'),
    ) as Record<string, any>;
  }
};