import {FC} from "react";
import {useReview} from "@/context/ReviewContext";
import Collapsable from "@/components/Collapsable";
import ReviewItemComponent from "@/components/review/ReviewItemComponent";


interface CategoryComponentProps {
    categoryName: string;
}

const CategoryComponent: FC<CategoryComponentProps> = ({categoryName}) => {
    const {sortedCategories, review} = useReview();
    const reviewItems = sortedCategories[categoryName] || [];

    //count how many reviews are not 'Not reviewd" or 'Not applicable'
    const count = reviewItems.filter((item) => item.status !== 'not reviewed').length;

    return (
        <Collapsable border ButtonPadding={"p-3"} _isOpen={review?.status === 'incomplete'} title={categoryName + ` ${count}/${reviewItems.length}`}>
            <div className="mb-6">
                <ul className="space-y-4 divide-y divide-neutral-200 gap-5">
                    {reviewItems.map((item, index) => (
                        <ReviewItemComponent key={index + "ReviewItemComponent"} reviewItem={item}/>
                    ))}
                </ul>
            </div>
        </Collapsable>
    );
};

export default CategoryComponent;
