export type ReviewStatus = 'incomplete' | 'complete';
export type ReviewItemStatusOptions = 'approved' | 'failed' | 'partially approved' | 'not reviewed';
export type ResultColor = 'red' | 'yellow' | 'green';


export interface Review {
    _id: string;
    department: string; // Might be Confidential, might be Random string then
    date: string;
    reviewer: string; //email
    location: string; // Might be Confidential, might be Random string then
    result?: ResultColor
    resultPercentage?: number;
    reviewItems: ReviewItem[];
    status: ReviewStatus;
    criticalCount?: number;
    resultDescription?: string;
}

export interface Category {
    name: string;
    description?: string;
}

export interface SubCategory {
    name: string;
    category: Category;
    description?: string;
}

export interface Question {
    _id: string;
    question: string;
    subcategory: SubCategory;
    critical: boolean;
    departments: string[];
    type: string;
}

export interface ReviewItem {
    question: Question;
    status: ReviewItemStatusOptions
    comment?: string;
    persons: Person[];
}

export interface Person {
    id: string;
    type: string;
    status: ReviewItemStatusOptions
    comment?: string;
}
