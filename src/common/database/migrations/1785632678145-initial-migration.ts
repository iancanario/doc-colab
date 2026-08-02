import type { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialMigration1785632678145 implements MigrationInterface {
    name = 'InitialMigration1785632678145'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "employees" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "email" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, CONSTRAINT "UQ_765bc1ac8967533a04c74a9f6af" UNIQUE ("email"), CONSTRAINT "PK_b9535a98350d5b26e7eb0c26af4" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "employee_document" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "document_url" character varying NOT NULL, "version" integer NOT NULL, "is_active" boolean NOT NULL DEFAULT true, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "requirement_id" integer, CONSTRAINT "PK_3d42008c12e986e37ee3bdebbd2" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_employee_documents_active_requirement" ON "employee_document"  ("requirement_id") WHERE "is_active" = true AND "deleted_at" IS NULL`);
        await queryRunner.query(`CREATE TABLE "employee_document_requirements" ("id" SERIAL NOT NULL, "status" "public"."employee_document_requirements_status_enum" NOT NULL DEFAULT 'PENDING', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "employee_id" uuid, "document_type_id" integer, CONSTRAINT "PK_8d36d53418b49891b90ab27ecf8" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "UQ_requirements_active_employee_document_type" ON "employee_document_requirements"  ("employee_id", "document_type_id") WHERE "deleted_at" IS NULL`);
        await queryRunner.query(`CREATE INDEX "IDX_requirements_pending_document_type" ON "employee_document_requirements"  ("document_type_id") WHERE "status" = 'PENDING' AND "deleted_at" IS NULL`);
        await queryRunner.query(`CREATE INDEX "IDX_requirements_pending_employee" ON "employee_document_requirements"  ("employee_id") WHERE "status" = 'PENDING' AND "deleted_at" IS NULL`);
        await queryRunner.query(`CREATE TABLE "document_types" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "code" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, CONSTRAINT "PK_d467d7eeb7c8ce216e90e8494aa" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "employee_document" ADD CONSTRAINT "FK_2f213f3c2754aca9743af00cba9" FOREIGN KEY ("requirement_id") REFERENCES "employee_document_requirements"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "employee_document_requirements" ADD CONSTRAINT "FK_6a39f396268e4fae22e95a36128" FOREIGN KEY ("employee_id") REFERENCES "employees"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "employee_document_requirements" ADD CONSTRAINT "FK_00465131681dfc2c32eae6c8a28" FOREIGN KEY ("document_type_id") REFERENCES "document_types"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "employee_document_requirements" DROP CONSTRAINT "FK_00465131681dfc2c32eae6c8a28"`);
        await queryRunner.query(`ALTER TABLE "employee_document_requirements" DROP CONSTRAINT "FK_6a39f396268e4fae22e95a36128"`);
        await queryRunner.query(`ALTER TABLE "employee_document" DROP CONSTRAINT "FK_2f213f3c2754aca9743af00cba9"`);
        await queryRunner.query(`DROP TABLE "document_types"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_requirements_pending_employee"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_requirements_pending_document_type"`);
        await queryRunner.query(`DROP INDEX "public"."UQ_requirements_active_employee_document_type"`);
        await queryRunner.query(`DROP TABLE "employee_document_requirements"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_employee_documents_active_requirement"`);
        await queryRunner.query(`DROP TABLE "employee_document"`);
        await queryRunner.query(`DROP TABLE "employees"`);
    }

}
