import {MigrationInterface, QueryRunner} from "typeorm";

export class CreateComment1650454643244 implements MigrationInterface {
    name = 'CreateComment1650454643244'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "Comment" ("PK" SERIAL NOT NULL, "CREATE_AT" TIMESTAMP NOT NULL DEFAULT now(), "UPDATE_AT" TIMESTAMP NOT NULL DEFAULT now(), "DELETE_AT" TIMESTAMP, "CONTENT" character varying NOT NULL, "ownerPk" integer, "recipePk" integer, CONSTRAINT "PK_2a73dae0b58d5ba61abdd61da16" PRIMARY KEY ("PK"))`);
        await queryRunner.query(`ALTER TABLE "Comment" ADD CONSTRAINT "FK_78ddaab16245838eb80c135c285" FOREIGN KEY ("ownerPk") REFERENCES "User"("PK") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "Comment" ADD CONSTRAINT "FK_8019b234c475278714ec59c753c" FOREIGN KEY ("recipePk") REFERENCES "Recipe"("PK") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Comment" DROP CONSTRAINT "FK_8019b234c475278714ec59c753c"`);
        await queryRunner.query(`ALTER TABLE "Comment" DROP CONSTRAINT "FK_78ddaab16245838eb80c135c285"`);
        await queryRunner.query(`DROP TABLE "Comment"`);
    }

}
