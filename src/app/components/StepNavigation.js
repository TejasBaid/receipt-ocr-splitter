import { Camera, UserPlus, X, Calculator, RotateCcw, AlertTriangle, Info, Check, UploadCloud, Sun, Moon, ArrowRight, ArrowLeft } from 'lucide-react';

const StepNavigation = ({ onNext, onPrev, nextDisabled = false, prevDisabled = false, nextLabel = "Next", isLastStep = false, onCalculate, calculateDisabled = false }) => (
    <div className={`flex ${onPrev ? 'justify-between' : 'justify-end'} items-center mt-8`}>
        {onPrev && (
            <button
                onClick={onPrev}
                disabled={prevDisabled}
                className="inline-flex items-center px-5 py-2 bg-gray-500 text-white text-sm font-medium rounded-lg shadow-sm hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
            >
                <ArrowLeft className="mr-1.5 h-4 w-4" /> Previous
            </button>
        )}
        {!isLastStep && onNext && (
            <button
                onClick={onNext}
                disabled={nextDisabled}
                className="inline-flex items-center px-5 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {nextLabel} <ArrowRight className="ml-1.5 h-4 w-4" />
            </button>
        )}
        {isLastStep && onCalculate && (
            <button
                onClick={onCalculate}
                disabled={calculateDisabled}
                className="inline-flex items-center px-6 py-2.5 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-150 ease-in-out transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                <Calculator className="mr-2 h-5 w-5" /> Calculate Split
            </button>
        )}
    </div>
);

export default StepNavigation;