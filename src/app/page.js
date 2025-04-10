'use client';
import React, { useState, useCallback, useEffect, useMemo, useRef } from 'react';
import { Camera, UserPlus, X, Calculator, RotateCcw, AlertTriangle, Info, Check, UploadCloud, Sun, Moon, ArrowRight, ArrowLeft } from 'lucide-react';
import axios from 'axios';

let nextIdCounter = 0;
const generateId = () => nextIdCounter++;

function useTheme() {
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    const storedTheme = localStorage.getItem('receiptSplitterTheme') || 'light';
    setTheme(storedTheme);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('s');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('receiptSplitterTheme', theme);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  }, []);

  return { theme, toggleTheme };
}

const uploadFileToCloudinaryUnsigned = async (file) => {
  const CLOUDINARY_CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME; // Your Cloudinary cloud name
  const CLOUDINARY_UPLOAD_PRESET = 'receipt_upload_preset'; // Your UNSIGNED preset name
  const UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;
  console.log(`Attempting UNSIGNED upload of ${file.name} to Cloudinary...`);
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
  try {
    const response = await axios.post(UPLOAD_URL, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
    if (response.data && response.data.secure_url) {
      console.log('Unsigned upload successful. URL:', response.data.secure_url);
      return response.data.secure_url;
    } else { throw new Error('Cloudinary upload succeeded but no secure_url found.'); }
  } catch (error) {
    console.error('Error uploading file to Cloudinary (unsigned):', error.response ? error.response.data : error.message);
    return null;
  }
};


const MessageBox = ({ message, isVisible, type = 'info' }) => {
  if (!isVisible || !message) return null;
  const bgColor = type === 'error' ? 'bg-red-600' : type === 'warning' ? 'bg-yellow-500 text-yellow-900' : 'bg-indigo-700';
  return ( <div className={`fixed top-5 left-1/2 transform -translate-x-1/2 px-5 py-3 rounded-lg shadow-md text-white text-sm font-medium z-[100] transition-all duration-300 ease-in-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-5'} ${bgColor}`} role="alert">{message}</div> );
};

const ThemeToggle = ({ theme, toggleTheme }) => {
  return (
      <button
          onClick={toggleTheme}
          className="absolute top-4 right-4 p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200"
          aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
      >
        {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
      </button>
  );
};

const Layout = ({ children }) => {
  const { theme, toggleTheme } = useTheme();
  return (
      <div className={`min-h-screen w-full bg-gray-800 p-4 sm:p-8`}>
        <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
        <div className="max-w-2xl mx-auto">
          {children}
        </div>
      </div>
  );
};

const StepContainer = ({ title, children }) => (
    <div className="relative bg-white/60 dark:bg-black/40 backdrop-filter backdrop-blur-lg border border-white/20 dark:border-white/10 p-6 sm:p-8 md:p-10 rounded-2xl shadow-xl mb-8">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6 text-center tracking-tight">{title}</h2>
      {children}
    </div>
);

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

const Step1_Upload = ({ onScanStart, onScanComplete, isLoading, scanStatus, onNext }) => {
  const fileInputRef = useRef(null);

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (fileInputRef.current) { fileInputRef.current.value = null; }

    if (file) {
      onScanStart(); // Notify App component: processing starts

      try {
        const uploadedFileUrl = await uploadFileToCloudinaryUnsigned(file);
        if (!uploadedFileUrl) { throw new Error('upload_failed'); } // Use custom error message
        console.log("File uploaded via Unsigned Preset, URL:", uploadedFileUrl);

        // --- Step 2: Prepare Veryfi API Call ---
        const dataPayload = JSON.stringify({ "file_url": uploadedFileUrl });

        const response = await axios.post('/api/scan-receipt', {
          file_url: uploadedFileUrl,
        });

        console.log('Veryfi API success:', response.data);
        onScanComplete(response.data);


      } catch (error) {
        console.error('Error during scan process:', error);
        let userErrorMessage = 'An unexpected error occurred.';
        if (axios.isAxiosError(error)) {
          if (error.response) { // Error from API (less likely due to CORS block)
            const apiErrorMsg = error.response.data?.error || error.response.data?.message || error.response.statusText;
            userErrorMessage = `API Error: ${apiErrorMsg || 'Unknown API error'}`;
          } else if (error.request) { // CORS block usually triggers this (Network Error)
            console.error('API No Response (Likely CORS):', error.request);
            userErrorMessage = 'Network Error: Could not connect to scanning service (check CORS/proxy).';
          } else { // Setup error
            userErrorMessage = `Error setting up API request: ${error.message}`;
          }
        } else if (error.message === 'upload_failed') { // Custom error from upload function
          userErrorMessage = 'Failed to upload receipt image.';
        }
        onScanComplete(null, userErrorMessage);
      }
    } else { console.log("No file selected."); }
  };

  return (
      <StepContainer title="Step 1: Upload Receipt">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-400 mb-6 text-sm max-w-md mx-auto">
            Upload a clear image of your receipt. Processing happens in the background, you can proceed to add people.
          </p>
          <label
              htmlFor="receipt-upload"
              className={`inline-flex items-center px-7 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition duration-200 ease-in-out transform hover:-translate-y-0.5 active:translate-y-0 ${isLoading ? 'opacity-50 cursor-not-allowed animate-pulse' : 'cursor-pointer'}`}
          >
            <UploadCloud className="mr-2 h-5 w-5" />
            {isLoading ? 'Processing...' : 'Upload / Scan Receipt'}
          </label>
          <input id="receipt-upload" ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} disabled={isLoading} className="hidden" />
          {scanStatus && <p className={`text-sm mt-4 font-medium ${scanStatus.startsWith('Error') ? 'text-red-600 dark:text-red-400' : 'text-indigo-700 dark:text-indigo-300'}`}>{scanStatus}</p>}
        </div>
        <StepNavigation onNext={onNext} nextLabel="Add People" />
      </StepContainer>
  );
};

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

const Step3_Assign = ({ items, people, onAssignClick, onCalculate, onPrev, calculateDisabled }) => {
  return (
      <StepContainer title="Step 3: Assign Items">
        {items.length === 0 ? <p className="text-sm text-gray-500 dark:text-gray-400 italic text-center py-4">No items found or processed from the receipt.</p> : <div id="item-list" className="space-y-3 max-h-[50vh] overflow-y-auto pr-2 -mr-2">{items.map(item => <ItemCard key={item.id} item={item} people={people} onAssignClick={onAssignClick} />)}</div>}
        {items.length > 0 && <p className="text-sm text-gray-500 dark:text-gray-400 mt-5 italic">Click Assign on an item to select who shared it.</p>}
        <StepNavigation onPrev={onPrev} isLastStep={true} onCalculate={onCalculate} calculateDisabled={calculateDisabled || items.length === 0 || people.length === 0} />
      </StepContainer>
  );
};

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

const AssignmentModal = ({ isOpen, onClose, onSave, item, people }) => {
  const [selectedPeople, setSelectedPeople] = useState(new Set());
  useEffect(() => { if (isOpen && item) { setSelectedPeople(new Set(item.sharedBy)); } else { setSelectedPeople(new Set()); } }, [isOpen, item]);
  if (!isOpen || !item) return null;
  const handleCheckboxChange = (personId) => { setSelectedPeople(prev => { const next = new Set(prev); if (next.has(personId)) { next.delete(personId); } else { next.add(personId); } return next; }); };
  const handleSave = () => { onSave(item.id, Array.from(selectedPeople)); };
  return (
      <div id="assignment-modal" className={`fixed inset-0 flex items-center justify-center p-4 z-50 transition-opacity duration-300 ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`} aria-labelledby="modal-title" role="dialog" aria-modal="true" onClick={onClose}>
        {/* Backdrop */}
        <div className="absolute inset-0 bg-black/60 backdrop-filter backdrop-blur-sm"></div>
        {/* Modal Content */}
        <div id="assignment-modal-content" className={`relative bg-white/80 dark:bg-gray-900/80 backdrop-filter backdrop-blur-lg border border-white/20 dark:border-gray-700 rounded-xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all duration-300 ${isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`} onClick={e => e.stopPropagation()}>
          <div className="p-6"><h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2" id="modal-title">Assign Item</h3><p className="text-sm text-gray-600 dark:text-gray-300 mb-1" id="modal-item-name">{item.name}</p><p className="text-sm font-medium text-indigo-600 dark:text-indigo-400 mb-5" id="modal-item-price">₹{item.price.toFixed(2)}</p><h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">Shared by:</h4><div id="modal-people-list" className="space-y-3 max-h-60 overflow-y-auto pr-2 -mr-2">{people.length === 0 ? <p className="text-sm text-gray-500 dark:text-gray-400 italic">No people have been added yet.</p> : people.map(person => <label key={person.id} className="flex items-center space-x-3 p-2 rounded hover:bg-gray-100/50 dark:hover:bg-gray-700/50 cursor-pointer"><input type="checkbox" value={person.id} checked={selectedPeople.has(person.id)} onChange={() => handleCheckboxChange(person.id)} className="custom-checkbox h-4 w-4 text-indigo-600 border-gray-300 dark:border-gray-600 rounded focus:ring-indigo-500 bg-white dark:bg-gray-800" /><span className="text-sm text-gray-700 dark:text-gray-200">{person.name}</span></label>)}</div></div>
          <div className="bg-gray-50/50 dark:bg-gray-800/50 px-6 py-4 flex flex-col sm:flex-row-reverse sm:gap-3 gap-2 border-t border-gray-200 dark:border-gray-700"><button id="modal-save-button" type="button" onClick={handleSave} disabled={people.length === 0} className={`w-full sm:w-auto inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out ${people.length === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}>Save</button><button id="modal-cancel-button" type="button" onClick={onClose} className="w-full sm:w-auto inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 shadow-sm px-4 py-2 bg-white dark:bg-gray-700 text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out">Cancel</button></div>
        </div>
      </div>
  );
};


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


function App() {
  const [currentStep, setCurrentStep] = useState(1);
  const [people, setPeople] = useState([]);
  const [items, setItems] = useState([]);
  const [receiptTax, setReceiptTax] = useState(0);
  const [isLoading, setIsLoading] = useState(false); // For API call
  const [scanStatus, setScanStatus] = useState(''); // Feedback from scanning
  const [scanComplete, setScanComplete] = useState(false); // Flag if scan finished (success or error)
  const [scanErrorOccurred, setScanErrorOccurred] = useState(false);
  const [message, setMessage] = useState({ text: '', type: 'info', isVisible: false });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItemId, setEditingItemId] = useState(null);
  const [results, setResults] = useState(null); // { totals: [], grandTotal: 0, taxTotal: 0, warning: null }

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, 4));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));
  const goToStep = (step) => setCurrentStep(step);

  const showAppMessage = useCallback((text, type = 'info', duration = 3000) => {
    setMessage({ text, type, isVisible: true });
    if (window.messageTimeout) clearTimeout(window.messageTimeout);
    window.messageTimeout = setTimeout(() => setMessage(prev => ({ ...prev, isVisible: false })), duration);
  }, []);

  const resetState = useCallback((showMsg = true) => {
    setPeople([]);
    setItems([]);
    setReceiptTax(0);
    setIsLoading(false);
    setScanStatus('');
    setScanComplete(false);
    setScanErrorOccurred(false);
    setIsModalOpen(false);
    setEditingItemId(null);
    setResults(null);
    setCurrentStep(1); // Go back to first step
    if (showMsg) showAppMessage('App reset.', 'info', 2500);
  }, [showAppMessage]);

  const handleScanStart = useCallback(() => {
    setIsLoading(true);
    setScanStatus('Processing receipt...');
    setScanComplete(false); // Mark scan as not complete yet
    setScanErrorOccurred(false);
    setItems([]); // Clear previous items
    setReceiptTax(0);
    setResults(null); // Clear previous results
  }, []);

  const handleScanComplete = useCallback((apiData, errorMsg = null) => {
    setIsLoading(false);
    setScanComplete(true); // Mark scan as finished, regardless of success/error
    if (errorMsg) {
      setScanStatus(`Error: ${errorMsg}`);
      setScanErrorOccurred(true);
      showAppMessage(errorMsg, 'error', 5000); // Show error longer
      setItems([]); // Ensure items are empty on error
      setReceiptTax(0);
      return;
    }
    if (apiData) {
      const processedItems = [];
      if (apiData.line_items) {
        apiData.line_items.forEach(item => {
          if (item.description && typeof item.total === 'number' && item.total >= 0) {
            const quantity = typeof item.quantity === 'number' && item.quantity > 0 ? item.quantity : 1;
            const pricePerUnit = quantity > 0 ? item.total / quantity : 0; // Avoid division by zero
            if (quantity === 1) {
              processedItems.push({ id: item.id || generateId(), name: item.description.trim(), price: pricePerUnit, sharedBy: [], originalItemId: item.id });
            } else {
              for (let i = 0; i < quantity; i++) { processedItems.push({ id: generateId(), name: `${item.description.trim()} (${i + 1}/${quantity})`, price: pricePerUnit, sharedBy: [], originalItemId: item.id }); }
            }
          }
        });
      }
      setItems(processedItems);
      setReceiptTax(typeof apiData.tax === 'number' ? apiData.tax : 0);
      setScanStatus('Scan complete! Proceed to assign items.');
      setScanErrorOccurred(false);
      showAppMessage('Receipt processed successfully!', 'success');

    } else {
      setScanStatus('Scan finished, but no usable data found.');
      setScanErrorOccurred(true);
      showAppMessage('Could not find line items in the response.', 'warning');
      setItems([]);
      setReceiptTax(0);
    }
  }, [showAppMessage]); // Removed currentStep, nextStep dependency for manual navigation

  const handleAddPerson = useCallback((name) => { if (people.some(p => p.name.toLowerCase() === name.toLowerCase())) { showAppMessage(`${name} is already on the list.`, 'warning', 2000); return; } setPeople(prev => [...prev, { id: generateId(), name }]); showAppMessage(`${name} added!`, 'info', 2000); setResults(null); }, [people, showAppMessage]);
  const handleRemovePerson = useCallback((idToRemove) => { const personToRemove = people.find(p => p.id === idToRemove); setPeople(prev => prev.filter(p => p.id !== idToRemove)); setItems(prevItems => prevItems.map(item => ({ ...item, sharedBy: item.sharedBy.filter(personId => personId !== idToRemove) }))); if (personToRemove) showAppMessage(`${personToRemove.name} removed.`, 'info', 2000); setResults(null); }, [people, showAppMessage]);

  const handleOpenModal = useCallback((itemId) => { setEditingItemId(itemId); setIsModalOpen(true); }, []);
  const handleCloseModal = useCallback(() => { setIsModalOpen(false); setEditingItemId(null); }, []);
  const handleSaveAssignment = useCallback((itemId, assignedPersonIds) => { setItems(prevItems => prevItems.map(item => item.id === itemId ? { ...item, sharedBy: assignedPersonIds } : item)); const item = items.find(i => i.id === itemId); if(item) showAppMessage(`${item.name} assignment updated.`, 'info', 1500); handleCloseModal(); setResults(null); }, [handleCloseModal, showAppMessage, items]);
  const itemToEdit = useMemo(() => items.find(item => item.id === editingItemId), [items, editingItemId]);

  const handleCalculateSplit = useCallback(() => {
    if (people.length === 0) { showAppMessage('Add at least one person.', 'warning', 3000); return; }
    if (items.length === 0) { showAppMessage('No items found.', 'warning', 3000); return; }
    const personTotals = people.map(p => ({ ...p, total: 0 }));
    let calculatedSubTotal = 0; let unassignedItemsExist = false; let itemsWithAssignments = 0;
    items.forEach(item => { const numSharing = item.sharedBy.length; if (numSharing > 0) { itemsWithAssignments++; calculatedSubTotal += item.price; const pricePerPerson = item.price / numSharing; item.sharedBy.forEach(personId => { const personTotal = personTotals.find(p => p.id === personId); if (personTotal) personTotal.total += pricePerPerson; }); } else { unassignedItemsExist = true; } });
    const calculatedGrandTotal = items.reduce((sum, item) => sum + item.price, 0) + receiptTax;
    if (itemsWithAssignments === 0 && items.length > 0) { showAppMessage('Assign items before calculating.', 'warning', 4000); setResults({ totals: personTotals, grandTotal: calculatedGrandTotal, taxTotal: receiptTax, warning: null }); setCurrentStep(4); return; } // Go to results even if nothing assigned
    let warning = null; const sumOfIndividualItemTotals = personTotals.reduce((sum, p) => sum + p.total, 0);
    if (unassignedItemsExist) { warning = { type: 'warning', message: `Warning: Some items weren't assigned. Their cost isn't included in individual totals.` }; showAppMessage('Warning: Some items not assigned.', 'warning', 4000); } else if (Math.abs(sumOfIndividualItemTotals - calculatedSubTotal) > 0.01) { warning = { type: 'info', message: `Note: Slight rounding differences may occur.` }; }
    setResults({ totals: personTotals, grandTotal: calculatedGrandTotal, taxTotal: receiptTax, warning: warning });
    setCurrentStep(4); // Navigate to results step
  }, [people, items, receiptTax, showAppMessage]);

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <Step1_Upload onScanStart={handleScanStart} onScanComplete={handleScanComplete} isLoading={isLoading} scanStatus={scanStatus} onNext={nextStep} />;
      case 2:
        return <Step2_People people={people} onAddPerson={handleAddPerson} onRemovePerson={handleRemovePerson} onNext={nextStep} onPrev={prevStep} scanComplete={scanComplete && !scanErrorOccurred} />;
      case 3:
        if (!scanComplete || scanErrorOccurred) {
          goToStep(scanErrorOccurred ? 1 : 2);
          return null;
        }
        return <Step3_Assign items={items} people={people} onAssignClick={handleOpenModal} onCalculate={handleCalculateSplit} onPrev={prevStep} calculateDisabled={isLoading} />;
      case 4:
        return <Step4_Results results={results?.totals} grandTotal={results?.grandTotal} taxTotal={results?.taxTotal} calculationWarning={results?.warning} onPrev={prevStep} onStartOver={resetState} />;
      default:
        return <Step1_Upload onScanStart={handleScanStart} onScanComplete={handleScanComplete} isLoading={isLoading} scanStatus={scanStatus} onNext={nextStep} />;
    }
  };

  return (
      <Layout>
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 dark:text-gray-100 mb-6 text-center tracking-tight">SPLIT YOUR BILL</h1>
        <MessageBox message={message.text} isVisible={message.isVisible} type={message.type} />
        {renderStep()}
        <AssignmentModal isOpen={isModalOpen} onClose={handleCloseModal} onSave={handleSaveAssignment} item={itemToEdit} people={people} />
        <style jsx global>{`
        input[type="checkbox"].custom-checkbox { appearance: none; background-color: transparent; margin: 0; font: inherit; color: currentColor; width: 1.15em; height: 1.15em; border: 0.1em solid #9ca3af; border-radius: 0.25rem; transform: translateY(-0.075em); display: inline-grid; place-content: center; cursor: pointer; transition: background-color 0.2s ease-in-out, border-color 0.2s ease-in-out; }
        input[type="checkbox"].custom-checkbox::before { content: ""; width: 0.65em; height: 0.65em; transform: scale(0); transition: 120ms transform ease-in-out; box-shadow: inset 1em 1em #4f46e5; transform-origin: bottom left; clip-path: polygon(14% 44%, 0 65%, 50% 100%, 100% 16%, 80% 0%, 43% 62%); }
        input[type="checkbox"].custom-checkbox:checked { border-color: #4f46e5; }
        .dark input[type="checkbox"].custom-checkbox:checked { border-color: #6366f1; }
        .dark input[type="checkbox"].custom-checkbox::before { box-shadow: inset 1em 1em #6366f1; }
        input[type="checkbox"].custom-checkbox:checked::before { transform: scale(1); }
        input[type="checkbox"].custom-checkbox:focus { outline: 2px solid #a5b4fc; outline-offset: 2px; }
        input[type="checkbox"].custom-checkbox:disabled { border-color: #e5e7eb; cursor: not-allowed; }
        .dark input[type="checkbox"].custom-checkbox:disabled { border-color: #4b5563; }
      `}</style>
      </Layout>
  );
}

export default App;

