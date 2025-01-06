import {FC} from "react";
import {Question} from "@/types";

interface QuestionBlockProps {
    question: Question; // The question data to display
    isSelected: boolean; // Indicates if the block is selected
    onClick: () => void; // Callback triggered when the block is clicked
}

const QuestionBlock: FC<QuestionBlockProps> = ({question, isSelected, onClick}) => {
    return (
        <div
            onClick={onClick} // Trigger the onClick callback when clicked
            className={`p-4 border rounded-lg cursor-pointer transition ${
                isSelected ? "border-lightGreen bg-green-50" : "border-gray-300 hover:border-gray-400"
            }`}
        >
            {/* Question text */}
            <p className="font-medium text-gray-700">{question.question}</p>
            {/* Subcategory name */}
            <p className="text-sm text-gray-500">{question.subcategory.name}</p>
        </div>
    );
};

export default QuestionBlock;
