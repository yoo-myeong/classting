import { Configuration } from '@app/common-config/config/Configuration';

// eslint-disable-next-line max-lines-per-function
export const getConfiguration = (): { [key in Configuration]: string } => {
  return {
    // API
    EXTERNAL_API_URL: process.env.EXTERNAL_API_URL,
    EXTERNAL_API_PORT: process.env.EXTERNAL_API_PORT,

    // MYSQL
    MYSQL_HOST: process.env.MYSQL_HOST,
    MYSQL_PORT: process.env.MYSQL_PORT,
    MYSQL_USERNAME: process.env.MYSQL_USERNAME,
    MYSQL_PASSWORD: process.env.MYSQL_PASSWORD,
    MYSQL_DATABASE: process.env.MYSQL_DATABASE,
  };
};
