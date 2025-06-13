import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Benchmark {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    benchmarkName: string;

    @Column({ type: 'date' })
    benchmarkYear: Date

    @Column()
    benchmarkDescription: string;

    @Column()
    benchmarkLink: string;

    @Column()
    benchmarkType: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @DeleteDateColumn()
    deletedAt: Date;

}
