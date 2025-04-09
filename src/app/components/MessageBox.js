const MessageBox = ({ message, isVisible, type }) => {
    if (!isVisible || !message) return null;
    const bgColor =
        type === 'error'
            ? 'bg-red-600'
            : type === 'warning'
                ? 'bg-yellow-500 text-yellow-900'
                : 'bg-indigo-700';

    return (
        <div className={`fixed top-5 left-1/2 transform -translate-x-1/2 px-5 py-3 rounded-lg shadow-md text-white text-sm font-medium z-[100] ${bgColor}`} role="alert">
            {message}
        </div>
    );
};

export default MessageBox;
