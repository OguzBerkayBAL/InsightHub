import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class DataSet {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    datasetName: string;

    @Column()
    datasetLink: string;

    @Column()
    datasetDescription: string;

    @Column()
    datasetType: string;

    @Column({ type: 'date' })
    datasetYear: Date;

    @Column()
    datasetFormat: string;

    @Column()
    language: string;

    @Column()
    size: string;

    @Column()
    license: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @DeleteDateColumn()
    deletedAt: Date;
}
