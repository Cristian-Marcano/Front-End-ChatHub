const Card = ({ title, children, className = "max-w-sm" }) => (
  <div className="flex justify-center items-center min-h-screen p-4">
    <div className={`w-full p-8 bg-gray-200 border-4 border-black rounded-sm shadow-[8px_8px_0px_0px_#000] flex flex-col items-center ${className}`}>
      <h2 className="mb-8 text-3xl font-black text-black text-center uppercase tracking-wide">
        {title}
      </h2>
      <div className="w-full">
        {children}
      </div>
    </div>
  </div>
);

export default Card;
