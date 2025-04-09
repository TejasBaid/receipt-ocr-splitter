'use client';
import StepContainer from "@/app/components/StepContainer";
import { Camera, UserPlus, X, Calculator, RotateCcw, AlertTriangle, Info, Check, UploadCloud, Sun, Moon, ArrowRight, ArrowLeft } from 'lucide-react';
import StepNavigation from "@/app/components/StepNavigation";
const Step2_People = ({ people, onAddPerson, onRemovePerson, onNext, onPrev, scanComplete }) => {
    const [nameInput, setNameInput] = useState('');
    const handleAddClick = () => { if (nameInput.trim()) { onAddPerson(nameInput.trim()); setNameInput(''); } };
    const handleKeyPress = (event) => { if (event.key === 'Enter') { handleAddClick(); } };

    return (
        <StepContainer title="Step 2: Add People">
            <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 mb-5">
                <input type="text" placeholder="Enter person's name" value={nameInput} onChange={(e) => setNameInput(e.target.value)} onKeyPress={handleKeyPress} className="flex-grow w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition duration-150 ease-in-out shadow-sm text-gray-900 dark:text-gray-100" />
                <button onClick={handleAddClick} className="w-full sm:w-auto inline-flex justify-center items-center px-5 py-2.5 bg-emerald-500 text-white font-semibold rounded-lg shadow-md hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition duration-150 ease-in-out transform hover:-translate-y-0.5 active:translate-y-0">
                    <UserPlus className="mr-2 h-4 w-4" /> Add Person
                </button>
            </div>
            <div className="min-h-[60px] mt-5 flex flex-wrap gap-2 items-start">
                {people.length === 0 ? <p className="text-sm text-gray-500 dark:text-gray-400 italic w-full text-center py-2">No people added yet.</p> : people.map(person => (
                    <span key={person.id} className="person-tag inline-flex items-center bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200 text-sm font-medium pl-3 pr-2 py-1 rounded-full transition-colors duration-200">
                {person.name}
                        <button className="ml-1.5 text-indigo-500 dark:text-indigo-300 hover:text-indigo-700 dark:hover:text-indigo-100 focus:outline-none opacity-60 hover:opacity-100 transition-opacity duration-200" onClick={() => onRemovePerson(person.id)} title={`Remove ${person.name}`} aria-label={`Remove ${person.name}`}>
                  <X className="h-3.5 w-3.5" />
                </button>
              </span>
                ))}
            </div>
            <StepNavigation onPrev={onPrev} onNext={onNext} nextDisabled={people.length === 0 || !scanComplete} nextLabel="Assign Items" />
            {!scanComplete && <p className="text-xs text-center text-gray-500 dark:text-gray-400 mt-3 italic">Waiting for receipt scan to complete before assigning items...</p>}
        </StepContainer>
    );
};

export default Step2_People;