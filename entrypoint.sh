#!/bin/sh

set -e

# Function to wait for a service to be ready
wait_for_service() {
  host=$1
  port=$2

  echo "Waiting for $host:$port to be available..."

  until nc -z -v -w30 $host $port
  do
    echo "$host:$port is unavailable - sleeping"
    sleep 1
  done

  echo "$host:$port is available - continuing"
}

# Wait for MySQL to be ready
echo "Waiting for MySQL to be ready..."
wait_for_service mysql 3306

# Wait for RabbitMQ to be ready
echo "Waiting for RabbitMQ to be ready..."
wait_for_service rabbitmq 5672

# Start the NestJS application once both services are ready
echo "Starting NestJS application..."
npm start
