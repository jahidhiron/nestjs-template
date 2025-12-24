import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateAdSpendSourceTable1638490296741 implements MigrationInterface {
  name = 'CreateAdSpendSourceTable1638490296741';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create the ad_spend_source table
    await queryRunner.query(`
      CREATE TABLE \`ad_spend_source\` (
        \`id\` int NOT NULL AUTO_INCREMENT,
        \`title\` varchar(255) NOT NULL,
        \`source\` varchar(255) NOT NULL,
        PRIMARY KEY (\`id\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop the ad_spend_source table
    await queryRunner.query(`
      DROP TABLE \`ad_spend_source\`;
    `);
  }
}
