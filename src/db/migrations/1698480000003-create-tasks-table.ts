import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTasksTable1698480000003 implements MigrationInterface {
  name = 'CreateTasksTable1698480000003';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE \`tasks\` (
        \`id\` INT NOT NULL AUTO_INCREMENT,
        \`title\` VARCHAR(255) NOT NULL,
        \`description\` TEXT NULL,
        \`project_id\` INT NULL,
        \`created_at\` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        \`updated_at\` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (\`id\`),
        CONSTRAINT \`fk_tasks_project_id\`
          FOREIGN KEY (\`project_id\`)
          REFERENCES \`projects\`(\`id\`)
          ON DELETE CASCADE
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE \`tasks\` DROP FOREIGN KEY \`fk_tasks_project_id\`;
    `);
    await queryRunner.query(`DROP TABLE \`tasks\``);
  }
}
