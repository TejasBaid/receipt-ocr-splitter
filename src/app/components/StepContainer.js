const StepContainer = ({ title, children }) => (
    <div className="relative bg-white/60 dark:bg-black/40 backdrop-filter backdrop-blur-lg border border-white/20 dark:border-white/10 p-6 sm:p-8 md:p-10 rounded-2xl shadow-xl mb-8">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6 text-center tracking-tight">{title}</h2>
        {children}
    </div>
);

export default StepContainer;