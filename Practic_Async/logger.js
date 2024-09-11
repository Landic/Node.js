import fs from 'fs';

export default class Logger {
  constructor(filename) {
    this.filename = filename;
    this.logLevels = ['INFO', 'WARN', 'ERROR'];
  }

  _formatLog(level, message) {
    return `[${new Date().toISOString()}] ${level}: ${message}\n`;
  }

  _validateLevel(level) {
    if (!this.logLevels.includes(level.toUpperCase())) {
      throw new Error(`Invalid log level. Use one of ${this.logLevels.join(', ')}`);
    }
  }

  logSync(level, message) {
    this._validateLevel(level);
    const logEntry = this._formatLog(level.toUpperCase(), message);
    fs.appendFileSync(this.filename, logEntry);
  }

  log(level, message) {
    return new Promise((resolve, reject) => {
      this._validateLevel(level);
      const logEntry = this._formatLog(level.toUpperCase(), message);
      fs.appendFile(this.filename, logEntry, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  }

  readLogsSync() {
    return fs.readFileSync(this.filename, 'utf8');
  }

  readLogs() {
    return new Promise((resolve, reject) => {
      fs.readFile(this.filename, 'utf8', (err, data) => {
        if (err) reject(err);
        else resolve(data);
      });
    });
  }

  info(message) {
    return this.log('INFO', message);
  }

  warn(message) {
    return this.log('WARN', message);
  }

  error(message) {
    return this.log('ERROR', message);
  }
}
