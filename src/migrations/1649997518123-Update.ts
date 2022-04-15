import { MigrationInterface, QueryRunner } from 'typeorm'

export class Update1649997518123 implements MigrationInterface {
  name = 'Update1649997518123'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "Core" ("PK" SERIAL NOT NULL, "CREATE_AT" TIMESTAMP NOT NULL DEFAULT now(), "UPDATE_AT" TIMESTAMP NOT NULL DEFAULT now(), "DELETE_AT" TIMESTAMP, CONSTRAINT "PK_f067d95f2dd80a7aa6cccc819fc" PRIMARY KEY ("PK"))`,
    )
    await queryRunner.query(
      `CREATE TABLE "User" ("PK" SERIAL NOT NULL, "CREATE_AT" TIMESTAMP NOT NULL DEFAULT now(), "UPDATE_AT" TIMESTAMP NOT NULL DEFAULT now(), "DELETE_AT" TIMESTAMP, "EMAIL" character varying NOT NULL, "PASSWORD" character varying NOT NULL, "NICKNAME" character varying NOT NULL, "AVATAR_IMAGE" character varying, "SOCIAL" character varying, CONSTRAINT "UQ_4735d3ef14d0b24d46d37eac100" UNIQUE ("EMAIL"), CONSTRAINT "UQ_02dc11589562aea698b9c9c3bf1" UNIQUE ("PASSWORD"), CONSTRAINT "UQ_921b017ff21d27ef9896e59ea67" UNIQUE ("NICKNAME"), CONSTRAINT "PK_40c454fc4cc61820071e183bedb" PRIMARY KEY ("PK"))`,
    )
    await queryRunner.query(
      `CREATE TABLE "Recipe" ("PK" SERIAL NOT NULL, "CREATE_AT" TIMESTAMP NOT NULL DEFAULT now(), "UPDATE_AT" TIMESTAMP NOT NULL DEFAULT now(), "DELETE_AT" TIMESTAMP, "TITLE" character varying NOT NULL, "DESCRIPTION" character varying NOT NULL, "MAIN_TEXT" character varying NOT NULL, "COOK_IMAGES" json NOT NULL, "categoryPk" integer, "ownerPk" integer, CONSTRAINT "PK_1658c02c48a2134a40d979bc8f3" PRIMARY KEY ("PK"))`,
    )
    await queryRunner.query(
      `CREATE TABLE "Category" ("PK" SERIAL NOT NULL, "CREATE_AT" TIMESTAMP NOT NULL DEFAULT now(), "UPDATE_AT" TIMESTAMP NOT NULL DEFAULT now(), "DELETE_AT" TIMESTAMP, "VALUE" character varying NOT NULL, CONSTRAINT "PK_4dd484a6d3f057660e96ccb7491" PRIMARY KEY ("PK"))`,
    )
    await queryRunner.query(
      `ALTER TABLE "Recipe" ADD CONSTRAINT "FK_f39b41bc99317562b4eb2507a3d" FOREIGN KEY ("categoryPk") REFERENCES "Category"("PK") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE "Recipe" ADD CONSTRAINT "FK_e7b03eab10b0abe0944ad10acc9" FOREIGN KEY ("ownerPk") REFERENCES "User"("PK") ON DELETE CASCADE ON UPDATE NO ACTION`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "Recipe" DROP CONSTRAINT "FK_e7b03eab10b0abe0944ad10acc9"`,
    )
    await queryRunner.query(
      `ALTER TABLE "Recipe" DROP CONSTRAINT "FK_f39b41bc99317562b4eb2507a3d"`,
    )
    await queryRunner.query(`DROP TABLE "Category"`)
    await queryRunner.query(`DROP TABLE "Recipe"`)
    await queryRunner.query(`DROP TABLE "User"`)
    await queryRunner.query(`DROP TABLE "Core"`)
  }
}
