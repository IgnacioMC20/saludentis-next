export interface Face {
    id: string;
    name: string;
    state: string;
}

export interface Tooth {
    id: number;
    name: string;
    status: boolean | 'extraction';
    faces: Face[];
    css?: string;
}

export interface DentalArch {
    adult: Tooth[];
    child: Tooth[];
}

export interface ToolbarOption {
    name: string;
    color: string;
}

export interface Toolbar {
    options: ToolbarOption[];
}

export interface Marked {
    selected: string;
    color: string;
}

export interface Store {
    marked: Marked;
    toolbar: Toolbar;
    dentalArch: DentalArch;
}