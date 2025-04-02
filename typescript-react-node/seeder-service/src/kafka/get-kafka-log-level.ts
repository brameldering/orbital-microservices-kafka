import { logLevel } from 'kafkajs';

const logLevelKeys = Object.keys(logLevel)
  .filter((key) => isNaN(Number(key))) // Filter out numeric keys
  .map((key) => `'${key}'`); // Map to format each key as 'Key'

const commaSeparatedString = logLevelKeys.join(', ');

export const getKafkaLogLevel = (level: string): logLevel => {
  const logLvl = logLevel[level as keyof typeof logLevel];
  if (!logLvl) {
    console.error(
      `getLogLevel Error, log level: ${level} not valid, valid values are: ${commaSeparatedString}`
    );
    throw Error(
      `getLogLevel Error, log level: ${level} not valid, valid values are: ${commaSeparatedString}`
    );
  }
  return logLvl;
};
