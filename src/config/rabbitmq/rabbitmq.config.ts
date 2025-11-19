import {
  RABBITMQ_DEFAULT_MANAGEMENT_UI_PORT,
  RABBITMQ_DEFAULT_QUEUE,
  RABBITMQ_DEFAULT_URI,
} from '@/common/constants';

export const rabbitmqConfig = () => ({
  rabbitmqUrl: process.env.RABBITMQ_URI || RABBITMQ_DEFAULT_URI,
  rabbitmqQueue: process.env.RABBITMQ_QUEUE || RABBITMQ_DEFAULT_QUEUE,
  rabbitmqManagementUIPort: parseInt(
    process.env.RABBITMQ_MANAGEMENT_UI_PORT ?? RABBITMQ_DEFAULT_MANAGEMENT_UI_PORT,
    10,
  ),
});
