import StepNavigation from "@/app/components/StepNavigation";
import StepContainer from "@/app/components/StepContainer";

const Step3_Assign = ({ items, people, onAssignClick, onCalculate, onPrev, calculateDisabled }) => {
    return (
        <StepContainer title="Step 3: Assign Items">
            {items.length === 0 ? <p className="text-sm text-gray-500 dark:text-gray-400 italic text-center py-4">No items found or processed from the receipt.</p> : <div id="item-list" className="space-y-3 max-h-[50vh] overflow-y-auto pr-2 -mr-2">{items.map(item => <ItemCard key={item.id} item={item} people={people} onAssignClick={onAssignClick} />)}</div>}
            {items.length > 0 && <p className="text-sm text-gray-500 dark:text-gray-400 mt-5 italic">Click Assign on an item to select who shared it.</p>}
            <StepNavigation onPrev={onPrev} isLastStep={true} onCalculate={onCalculate} calculateDisabled={calculateDisabled || items.length === 0 || people.length === 0} />
        </StepContainer>
    );
};

export default Step3_Assign;