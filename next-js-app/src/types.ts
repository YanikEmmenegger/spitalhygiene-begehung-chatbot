import {Database} from './database.types';

type CategoryRow = Database['public']['Tables']['category']['Row'];
type SubcategoryRow = Database['public']['Tables']['subcategory']['Row'];
type QuestionRow = Database['public']['Tables']['question']['Row'];
type DepartmentRow = Database['public']['Tables']['department']['Row'];
type QuestionTypesEnum = Database['public']['Enums']['question_types'];
type PersonTypeRow = Database['public']['Tables']['person_types']['Row'];

export type ReviewStatus = 'incomplete' | 'complete';
export type ReviewItemStatusOptions = 'approved' | 'failed' | 'partially approved' | 'not reviewed';
export type ResultColor = 'red' | 'yellow' | 'green';

export type Category = CategoryRow

export interface SubCategory extends Omit<SubcategoryRow, 'category'> {
    category: Category;
}

export type Department = DepartmentRow

export type PersonType = PersonTypeRow

export interface Question extends Omit<QuestionRow, 'subcategory' | 'type'> {
    subcategory: SubCategory;
    departments: Department[];
    type: QuestionTypesEnum | null;
}

export interface Person {
    id: string;
    type: string;
    status: ReviewItemStatusOptions;
    comment?: string;
}

export interface ReviewItem {
    _id: string;
    question: Question;
    status: ReviewItemStatusOptions;
    comment?: string;
    persons: Person[];
}

export interface Review {
    _id: string;
    department: Department;
    date: string;
    reviewer: string;
    result?: ResultColor;
    resultPercentage?: number;
    reviewItems: ReviewItem[];
    status: ReviewStatus;
    criticalCount?: number;
    resultDescription?: string;
}
