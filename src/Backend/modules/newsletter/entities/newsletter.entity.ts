import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Newsletter {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true })
    email: string;

    @Column({
        type: 'enum',
        enum: ['daily', 'weekly', 'monthly'],
        default: 'weekly'
    })
    frequency: string;

    @Column({ default: false })
    isActive: boolean;

    @Column({ nullable: true })
    confirmationToken: string;

    @Column({ nullable: true })
    lastSentAt: Date;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @DeleteDateColumn()
    deletedAt: Date;
} 