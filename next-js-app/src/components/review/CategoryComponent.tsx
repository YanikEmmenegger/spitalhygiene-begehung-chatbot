import { FC } from "react"; // Importing Function Component type from React
import { useReview } from "@/context/ReviewContext"; // Custom hook to get review context
import Collapsable from "@/components/Collapsable"; // Component for collapsable UI sections
import ReviewItemComponent from "@/components/review/ReviewItemComponent"; // Component for individual review items

// Props type definition for CategoryComponent
interface CategoryComponentProps {
    categoryName: string; // Name of the category to be displayed
}

// Functional component for displaying review items within a category
const CategoryComponent: FC<CategoryComponentProps> = ({ categoryName }) => {
    // Get review context values
    const { sortedCategories, review } = useReview();

    // Retrieve review items for the given category
    const reviewItems = sortedCategories[categoryName] || [];

    // Count the number of review items that are not "not reviewed"
    const count = reviewItems.filter((item) => item.status !== 'not reviewed').length;

    return (
        <Collapsable
            border // Adds a border to the collapsable component
            ButtonPadding={"p-3"} // Sets padding for the collapsable button
            _isOpen={review?.status === 'incomplete'} // Default open state for incomplete reviews
            title={`${categoryName} ${count}/${reviewItems.length}`} // Title with progress indicator
        >
            <div className="mb-6">
                {/* List of review items */}
                <ul className="space-y-4 divide-y divide-neutral-200 gap-5">
                    {reviewItems.map((item, index) => (
                        <ReviewItemComponent
                            key={`${index}-ReviewItemComponent`} // Unique key for each review item
                            reviewItem={item} // Passes the review item data
                        />
                    ))}
                </ul>
            </div>
        </Collapsable>
    );
};

export default CategoryComponent; // Exporting the component for use in other parts of the application
