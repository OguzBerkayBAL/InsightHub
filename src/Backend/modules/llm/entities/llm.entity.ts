import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Llm {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    llmName: string;

    @Column()
    llmLink: string;

    @Column()
    llmDescription: string;

    @Column()
    llmType: string;

    @Column({ type: 'date' })
    llmYear: Date;

    @Column()
    parametersNumber: string;

    @Column()
    license: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @DeleteDateColumn()
    deletedAt: Date;

}
