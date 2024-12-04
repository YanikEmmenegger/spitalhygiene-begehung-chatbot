import {FC} from "react";
import {Question} from "@/types";

interface QuestionBlockProps {
    question: Question;
    isSelected: boolean;
    onClick: () => void;
}

const QuestionBlock: FC<QuestionBlockProps> = ({question, isSelected, onClick}) => {
    return (
        <div
            onClick={onClick}
            className={`p-4 border rounded-lg cursor-pointer ${
                isSelected ? "border-lightGreen bg-green-50" : "border-gray-300"
            }`}
        >
            <p className="font-medium text-gray-700">{question.question}</p>
            <p className="text-sm text-gray-500">{question.subcategory.name}</p>
        </div>
    );
};

export default QuestionBlock;
