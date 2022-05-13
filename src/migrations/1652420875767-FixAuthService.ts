import {MigrationInterface, QueryRunner} from "typeorm";

export class FixAuthService1652420875767 implements MigrationInterface {
    name = 'FixAuthService1652420875767'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "Core" ("PK" SERIAL NOT NULL, "CREATE_AT" TIMESTAMP NOT NULL DEFAULT now(), "UPDATE_AT" TIMESTAMP NOT NULL DEFAULT now(), "DELETE_AT" TIMESTAMP, CONSTRAINT "PK_f067d95f2dd80a7aa6cccc819fc" PRIMARY KEY ("PK"))`);
        await queryRunner.query(`CREATE TABLE "Category" ("PK" SERIAL NOT NULL, "CREATE_AT" TIMESTAMP NOT NULL DEFAULT now(), "UPDATE_AT" TIMESTAMP NOT NULL DEFAULT now(), "DELETE_AT" TIMESTAMP, "VALUE" character varying NOT NULL, CONSTRAINT "PK_4dd484a6d3f057660e96ccb7491" PRIMARY KEY ("PK"))`);
        await queryRunner.query(`CREATE TABLE "Comment" ("PK" SERIAL NOT NULL, "CREATE_AT" TIMESTAMP NOT NULL DEFAULT now(), "UPDATE_AT" TIMESTAMP NOT NULL DEFAULT now(), "DELETE_AT" TIMESTAMP, "CONTENT" character varying NOT NULL, "ownerPk" integer, "recipePk" integer, CONSTRAINT "PK_2a73dae0b58d5ba61abdd61da16" PRIMARY KEY ("PK"))`);
        await queryRunner.query(`CREATE TABLE "Like" ("PK" SERIAL NOT NULL, "CREATE_AT" TIMESTAMP NOT NULL DEFAULT now(), "UPDATE_AT" TIMESTAMP NOT NULL DEFAULT now(), "DELETE_AT" TIMESTAMP, "ownerPk" integer, "recipePk" integer, CONSTRAINT "PK_cc011c7a5073684f5100e7edbc2" PRIMARY KEY ("PK"))`);
        await queryRunner.query(`CREATE TABLE "Recipe" ("PK" SERIAL NOT NULL, "CREATE_AT" TIMESTAMP NOT NULL DEFAULT now(), "UPDATE_AT" TIMESTAMP NOT NULL DEFAULT now(), "DELETE_AT" TIMESTAMP, "TITLE" character varying NOT NULL, "DESCRIPTION" character varying NOT NULL, "MAIN_TEXT" character varying NOT NULL, "COOK_IMAGES" json NOT NULL, "LIKES_COUNT" integer DEFAULT '0', "categoryPk" integer, "ownerPk" integer, CONSTRAINT "PK_1658c02c48a2134a40d979bc8f3" PRIMARY KEY ("PK"))`);
        await queryRunner.query(`CREATE TABLE "User" ("PK" SERIAL NOT NULL, "CREATE_AT" TIMESTAMP NOT NULL DEFAULT now(), "UPDATE_AT" TIMESTAMP NOT NULL DEFAULT now(), "DELETE_AT" TIMESTAMP, "EMAIL" character varying NOT NULL, "PASSWORD" character varying NOT NULL, "NICKNAME" character varying NOT NULL, "AVATAR_IMAGE" character varying, "SOCIAL" character varying, CONSTRAINT "UQ_4735d3ef14d0b24d46d37eac100" UNIQUE ("EMAIL"), CONSTRAINT "UQ_02dc11589562aea698b9c9c3bf1" UNIQUE ("PASSWORD"), CONSTRAINT "UQ_921b017ff21d27ef9896e59ea67" UNIQUE ("NICKNAME"), CONSTRAINT "PK_40c454fc4cc61820071e183bedb" PRIMARY KEY ("PK"))`);
        await queryRunner.query(`ALTER TABLE "Comment" ADD CONSTRAINT "FK_78ddaab16245838eb80c135c285" FOREIGN KEY ("ownerPk") REFERENCES "User"("PK") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "Comment" ADD CONSTRAINT "FK_8019b234c475278714ec59c753c" FOREIGN KEY ("recipePk") REFERENCES "Recipe"("PK") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "Like" ADD CONSTRAINT "FK_f0088f968362f2bb58b2f9e2705" FOREIGN KEY ("ownerPk") REFERENCES "User"("PK") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "Like" ADD CONSTRAINT "FK_9d69872c7ad561707c26e5bf9c1" FOREIGN KEY ("recipePk") REFERENCES "Recipe"("PK") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "Recipe" ADD CONSTRAINT "FK_f39b41bc99317562b4eb2507a3d" FOREIGN KEY ("categoryPk") REFERENCES "Category"("PK") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "Recipe" ADD CONSTRAINT "FK_e7b03eab10b0abe0944ad10acc9" FOREIGN KEY ("ownerPk") REFERENCES "User"("PK") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Recipe" DROP CONSTRAINT "FK_e7b03eab10b0abe0944ad10acc9"`);
        await queryRunner.query(`ALTER TABLE "Recipe" DROP CONSTRAINT "FK_f39b41bc99317562b4eb2507a3d"`);
        await queryRunner.query(`ALTER TABLE "Like" DROP CONSTRAINT "FK_9d69872c7ad561707c26e5bf9c1"`);
        await queryRunner.query(`ALTER TABLE "Like" DROP CONSTRAINT "FK_f0088f968362f2bb58b2f9e2705"`);
        await queryRunner.query(`ALTER TABLE "Comment" DROP CONSTRAINT "FK_8019b234c475278714ec59c753c"`);
        await queryRunner.query(`ALTER TABLE "Comment" DROP CONSTRAINT "FK_78ddaab16245838eb80c135c285"`);
        await queryRunner.query(`DROP TABLE "User"`);
        await queryRunner.query(`DROP TABLE "Recipe"`);
        await queryRunner.query(`DROP TABLE "Like"`);
        await queryRunner.query(`DROP TABLE "Comment"`);
        await queryRunner.query(`DROP TABLE "Category"`);
        await queryRunner.query(`DROP TABLE "Core"`);
    }

}
