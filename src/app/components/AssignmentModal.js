'use client';
import React, { useEffect, useState } from 'react';

const AssignmentModal = ({ isOpen, onClose, onSave, item, people }) => {
    const [selectedPeople, setSelectedPeople] = useState(new Set());

    useEffect(() => {
        if (isOpen && item) {
            setSelectedPeople(new Set(item.sharedBy));
        } else {
            setSelectedPeople(new Set());
        }
    }, [isOpen, item]);

    if (!isOpen || !item) return null;

    const handleCheckboxChange = (personId) => {
        setSelectedPeople((prev) => {
            const next = new Set(prev);
            if (next.has(personId)) {
                next.delete(personId);
            } else {
                next.add(personId);
            }
            return next;
        });
    };

    const handleSave = () => {
        onSave(item.id, Array.from(selectedPeople));
        onClose();
    };

    return (
        <div className="modal">
            {/* Modal content */}
        </div>
    );
};

export default AssignmentModal;
