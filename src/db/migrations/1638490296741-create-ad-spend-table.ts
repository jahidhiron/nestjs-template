import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateAdSpendTable1638490296741 implements MigrationInterface {
  name = 'CreateAdSpendTable1638490296741';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create the ad_cost table
    await queryRunner.query(`
      CREATE TABLE \`ad_cost\` (
        \`id\` int NOT NULL AUTO_INCREMENT,
        \`date\` date NULL,
        \`source\` varchar(255) NOT NULL,
        \`total\` double NOT NULL,
        \`country\` varchar(255) NOT NULL,
        \`language\` varchar(255) NOT NULL,
        PRIMARY KEY (\`id\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // Add index on date column
    await queryRunner.query(`
      CREATE INDEX \`ad_cost_date\` ON \`ad_cost\` (\`date\`);
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop index first
    await queryRunner.query(`
      DROP INDEX \`ad_cost_date\` ON \`ad_cost\`;
    `);

    // Drop the ad_cost table
    await queryRunner.query(`
      DROP TABLE \`ad_cost\`;
    `);
  }
}
