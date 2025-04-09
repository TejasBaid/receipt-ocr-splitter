import StepContainer from "@/app/components/StepContainer";
import { Camera, UserPlus, X, Calculator, RotateCcw, AlertTriangle, Info, Check, UploadCloud, Sun, Moon, ArrowRight, ArrowLeft } from 'lucide-react';
const Step4_Results = ({ results, grandTotal, taxTotal, calculationWarning, onPrev, onStartOver }) => {
    if (!results) return <StepContainer title="Step 4: Results"><p className="text-center text-gray-500 dark:text-gray-400">Results not calculated yet.</p><StepNavigation onPrev={onPrev} /></StepContainer>;

    const taxPerPerson = (taxTotal && results.length > 0) ? (taxTotal / results.length) : 0;

    return (
        <StepContainer title="Step 4: Bill Split Results">
            <div id="results-output" className="space-y-3">
                {results.length === 0 ? <p className="text-gray-600 dark:text-gray-400 italic">No results to display.</p> : results.map(person => (
                    <div key={person.id} className="flex justify-between items-center p-3 bg-white/80 dark:bg-gray-800/80 rounded-md border border-gray-200 dark:border-gray-700">
                        <span className="font-medium text-gray-800 dark:text-gray-100">{person.name} owes:</span>
                        <span className="font-semibold text-indigo-700 dark:text-indigo-300 text-lg">
                ₹{(person.total + taxPerPerson).toFixed(2)}
                            {taxPerPerson > 0 && <span className="text-xs text-gray-500 dark:text-gray-400 font-normal ml-1">(incl. ₹{taxPerPerson.toFixed(2)} tax)</span>}
                </span>
                    </div>
                ))}
                {grandTotal !== null && results.length > 0 && (
                    <div className="flex justify-between items-center p-3 mt-4 border-t border-gray-300 dark:border-gray-600">
                        <span className="font-bold text-gray-800 dark:text-gray-100">Total Bill Amount:</span>
                        <span className="font-bold text-gray-800 dark:text-gray-100 text-lg">
                ₹{grandTotal.toFixed(2)}
                            {taxTotal > 0 && <span className="text-sm text-gray-600 dark:text-gray-400 font-normal ml-1">(incl. ₹{taxTotal.toFixed(2)} tax)</span>}
                </span>
                    </div>
                )}
                {taxTotal > 0 && results.length > 0 && ( <div className="text-xs text-center text-gray-500 dark:text-gray-400 mt-2">Total tax of ₹{taxTotal.toFixed(2)} was split equally (₹{taxPerPerson.toFixed(2)} per person).</div> )}
                {calculationWarning && ( <div className={`mt-3 p-3 text-xs rounded-md border ${calculationWarning.type === 'warning' ? 'bg-yellow-100/70 text-yellow-900 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-200 dark:border-yellow-700' : 'bg-blue-100/70 text-blue-900 border-blue-200 dark:bg-blue-900/30 dark:text-blue-200 dark:border-blue-700'}`}>{calculationWarning.type === 'warning' ? <AlertTriangle className="inline mr-1 h-3.5 w-3.5" /> : <Info className="inline mr-1 h-3.5 w-3.5" />} {calculationWarning.message}</div> )}
            </div>
            <div className="mt-8 flex justify-between items-center">
                <button onClick={onPrev} className="inline-flex items-center px-5 py-2 bg-gray-500 text-white text-sm font-medium rounded-lg shadow-sm hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition duration-150 ease-in-out">
                    <ArrowLeft className="mr-1.5 h-4 w-4" /> Back to Assign
                </button>
                <button onClick={onStartOver} className="inline-flex items-center px-5 py-2 bg-red-600 text-white text-sm font-medium rounded-lg shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition duration-150 ease-in-out">
                    <RotateCcw className="mr-1.5 h-4 w-4" /> Start Over
                </button>
            </div>
        </StepContainer>
    );
};

export default Step4_Results;