export const rabbitmqConfig = () => ({
  rabbitmqUrl: process.env.RABBITMQ_URI || 'amqp://admin:admin@localhost:5672',
  rabbitmqQueue: process.env.RABBITMQ_QUEUE || 'nest_template_queue',
});
