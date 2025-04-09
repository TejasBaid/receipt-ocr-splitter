'use client';
import { Camera, UserPlus, X, Calculator, RotateCcw, AlertTriangle, Info, Check, UploadCloud, Sun, Moon, ArrowRight, ArrowLeft } from 'lucide-react';
import {useMemo} from "react";
const ItemCard = ({ item, people, onAssignClick }) => {
    const assignedPeopleNames = useMemo(() => item.sharedBy.map(personId => people.find(p => p.id === personId)?.name.split(' ')[0]).filter(Boolean), [item.sharedBy, people]);
    const displayAssigned = () => {
        if (assignedPeopleNames.length === 0) return <span className="italic text-gray-500 dark:text-gray-400">Not assigned</span>;
        if (assignedPeopleNames.length <= 3) return assignedPeopleNames.map((name, index) => <span key={index} className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-1.5 py-0.5 rounded text-xs mr-1 mb-1 inline-block">{name}</span>);
        return <span className="text-gray-600 dark:text-gray-400">Shared by {assignedPeopleNames.length} people</span>;
    };
    return (
        <div className="flex items-center justify-between p-3 sm:p-4 bg-white/80 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm">
            <div className="flex-grow mr-4 overflow-hidden"><span className="font-medium text-gray-800 dark:text-gray-100 block text-sm sm:text-base truncate" title={item.name}>{item.name}</span><span className="text-sm text-indigo-600 dark:text-indigo-400 font-medium block mt-0.5">₹{item.price.toFixed(2)}</span><div className="text-xs mt-1.5 flex flex-wrap gap-1">{displayAssigned()}</div></div>
            <button onClick={() => onAssignClick(item.id)} className="flex-shrink-0 inline-flex items-center px-3 py-1.5 bg-white dark:bg-gray-700 text-indigo-700 dark:text-indigo-300 text-sm font-medium rounded-md border border-indigo-300 dark:border-indigo-600 hover:bg-indigo-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800 transition duration-150 ease-in-out">
                <UserPlus className="mr-1.5 h-3.5 w-3.5" />Assign
            </button>
        </div>
    );
};

export default ItemCard;