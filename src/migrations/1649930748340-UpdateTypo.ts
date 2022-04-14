import {MigrationInterface, QueryRunner} from "typeorm";

export class UpdateTypo1649930748340 implements MigrationInterface {
    name = 'UpdateTypo1649930748340'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Recipe" DROP CONSTRAINT "FK_f39b41bc99317562b4eb2507a3d"`);
        await queryRunner.query(`CREATE TABLE "Category" ("PK" SERIAL NOT NULL, "CREATE_AT" TIMESTAMP NOT NULL DEFAULT now(), "UPDATE_AT" TIMESTAMP NOT NULL DEFAULT now(), "DELETE_AT" TIMESTAMP, "VALUE" character varying NOT NULL, CONSTRAINT "PK_4dd484a6d3f057660e96ccb7491" PRIMARY KEY ("PK"))`);
        await queryRunner.query(`ALTER TABLE "Recipe" ADD CONSTRAINT "FK_f39b41bc99317562b4eb2507a3d" FOREIGN KEY ("categoryPk") REFERENCES "Category"("PK") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Recipe" DROP CONSTRAINT "FK_f39b41bc99317562b4eb2507a3d"`);
        await queryRunner.query(`DROP TABLE "Category"`);
        await queryRunner.query(`ALTER TABLE "Recipe" ADD CONSTRAINT "FK_f39b41bc99317562b4eb2507a3d" FOREIGN KEY ("categoryPk") REFERENCES "CATEGORY"("PK") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
