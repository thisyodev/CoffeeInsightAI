import React from "react";

const Card = ({ children, className = "" }) => {
  return (
    <div
      className={`bg-gradient-to-br from-cream-100 to-latte-50 border-2 border-caramel-200 rounded-2xl p-5 md:p-6 xl:p-8 shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden hover:border-caramel-400 ${className}`}
    >
      {children}
    </div>
  );
};

export default Card;
