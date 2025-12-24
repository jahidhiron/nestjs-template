import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateAdSpendInvoiceTable1638490296741 implements MigrationInterface {
  name = 'CreateAdSpendInvoiceTable1638490296741';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create the ad_spend_invoice table
    await queryRunner.query(`
      CREATE TABLE \`ad_spend_invoice\` (
        \`id\` int NOT NULL AUTO_INCREMENT,
        \`source\` varchar(255) NOT NULL,
        \`total\` double NOT NULL,
        \`year\` int NOT NULL,
        \`month\` int NOT NULL,
        PRIMARY KEY (\`id\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // Add index on year and month columns
    await queryRunner.query(`
      CREATE INDEX \`ad_spend_invoice_year_month\` ON \`ad_spend_invoice\` (\`year\`, \`month\`);
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop index first
    await queryRunner.query(`
      DROP INDEX \`ad_spend_invoice_year_month\` ON \`ad_spend_invoice\`;
    `);

    // Drop the ad_spend_invoice table
    await queryRunner.query(`
      DROP TABLE \`ad_spend_invoice\`;
    `);
  }
}
