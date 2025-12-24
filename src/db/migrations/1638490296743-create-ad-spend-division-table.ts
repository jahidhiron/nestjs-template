import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateAdSpendDivisionTable1638490296741 implements MigrationInterface {
  name = 'CreateAdSpendDivisionTable1638490296741';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create the ad_spend_division table
    await queryRunner.query(`
      CREATE TABLE \`ad_spend_division\` (
        \`id\` int NOT NULL AUTO_INCREMENT,
        \`source\` varchar(255) NOT NULL,
        \`year\` int NOT NULL,
        \`month\` int NOT NULL,
        \`division\` json NOT NULL,
        PRIMARY KEY (\`id\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // Add index on year and month columns
    await queryRunner.query(`
      CREATE INDEX \`ad_spend_division_date\` ON \`ad_spend_division\` (\`year\`, \`month\`);
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop index first
    await queryRunner.query(`
      DROP INDEX \`ad_spend_division_date\` ON \`ad_spend_division\`;
    `);

    // Drop the ad_spend_division table
    await queryRunner.query(`
      DROP TABLE \`ad_spend_division\`;
    `);
  }
}
