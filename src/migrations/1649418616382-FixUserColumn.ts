import {MigrationInterface, QueryRunner} from "typeorm";

export class FixUserColumn1649418616382 implements MigrationInterface {
    name = 'FixUserColumn1649418616382'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "Core" ("PK" SERIAL NOT NULL, "CREATE_AT" TIMESTAMP NOT NULL DEFAULT now(), "UPDATE_AT" TIMESTAMP NOT NULL DEFAULT now(), "DELETE_AT" TIMESTAMP, CONSTRAINT "PK_f067d95f2dd80a7aa6cccc819fc" PRIMARY KEY ("PK"))`);
        await queryRunner.query(`CREATE TABLE "User" ("PK" SERIAL NOT NULL, "CREATE_AT" TIMESTAMP NOT NULL DEFAULT now(), "UPDATE_AT" TIMESTAMP NOT NULL DEFAULT now(), "DELETE_AT" TIMESTAMP, "EMAIL" character varying NOT NULL, "PASSWORD" character varying NOT NULL, "NICKNAME" character varying NOT NULL, "AVATAR_IMAGE" character varying, "SOCIAL" character varying, CONSTRAINT "UQ_4735d3ef14d0b24d46d37eac100" UNIQUE ("EMAIL"), CONSTRAINT "UQ_02dc11589562aea698b9c9c3bf1" UNIQUE ("PASSWORD"), CONSTRAINT "UQ_921b017ff21d27ef9896e59ea67" UNIQUE ("NICKNAME"), CONSTRAINT "PK_40c454fc4cc61820071e183bedb" PRIMARY KEY ("PK"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "User"`);
        await queryRunner.query(`DROP TABLE "Core"`);
    }

}
