import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateProfilesTable1698480000002 implements MigrationInterface {
  name = 'CreateProfilesTable1698480000002';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE \`profiles\` (
        \`id\` INT NOT NULL AUTO_INCREMENT,
        \`bio\` TEXT NULL,
        \`queue_status\` VARCHAR(100) NULL DEFAULT 'idle',
        \`version\` INT NULL DEFAULT NULL,
        \`last_processed_at\` DATETIME NULL DEFAULT NULL,
        \`next_run_at\` DATETIME NULL DEFAULT NULL,
        \`project_id\` INT NULL,
        \`created_at\` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        \`updated_at\` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (\`id\`),
        INDEX \`idx_profiles_last_processed_at\` (\`last_processed_at\`),
        INDEX \`idx_profiles_next_run_at\` (\`next_run_at\`),
        CONSTRAINT \`fk_profiles_project_id\`
          FOREIGN KEY (\`project_id\`)
          REFERENCES \`projects\`(\`id\`)
          ON DELETE CASCADE
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE \`profiles\` DROP FOREIGN KEY \`fk_profiles_project_id\`;
    `);
    await queryRunner.query(`DROP TABLE \`profiles\``);
  }
}
