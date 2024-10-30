export interface Medicine {
    id: number;
    name: string;
    useCase: string;
    dosage: string;
    status: boolean;
}

export interface Prescription {
    id: number;
    name: string;
    note: string | null;
    frequency: number;
    startDate: Date;
    endDate: Date;
    patient: {
        id: number;
        name: string;
    };
    medicine: {
        id: number;
        name: string;
        useCase: string;
        dosage: string;
    };
}

export interface Dependents {
    id: number;
    name: string;
    email: string;
}

export interface History {
    medicineId: number;
    medicineName: string;
    dosage: string;
    useCase: string;
    notes: string;
    frequencyHours: number;
    startDate: string;
    logs: {
        id: number;
        dateIngestion: string;
    }[];
}