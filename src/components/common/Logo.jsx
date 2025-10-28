import React from "react";
import PropTypes from "prop-types";

export function Logo({
  size = "md",
  className = "",
  showText = true,
  textClassName = "",
  variant = "default",
}) {
  const sizeClasses = {
    sm: "w-6 h-6",
    md: "w-8 h-8",
    lg: "w-10 h-10",
    xl: "w-12 h-12",
  };

  const textSizes = {
    sm: "text-sm",
    md: "text-lg",
    lg: "text-xl",
    xl: "text-2xl",
  };

  const getTextColor = () => {
    if (textClassName) return textClassName;

    switch (variant) {
      case "white":
        return "text-white";
      case "dark":
        return "text-gray-900";
      default:
        return "text-gray-900 dark:text-white";
    }
  };

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <div
        className={`${sizeClasses[size]} flex items-center justify-center flex-shrink-0`}
      >
        <img
          src="/Agriweb.png"
          alt="AgriiWeb Logo"
          className="w-full h-full object-contain"
        />
      </div>

      {showText && (
        <span className={`font-semibold ${textSizes[size]} ${getTextColor()}`}>
          AgriiWeb
        </span>
      )}
    </div>
  );
}

Logo.propTypes = {
  size: PropTypes.oneOf(["sm", "md", "lg", "xl"]),
  className: PropTypes.string,
  showText: PropTypes.bool,
  textClassName: PropTypes.string,
  variant: PropTypes.oneOf(["default", "white", "dark"]),
};

export function LogoIcon({ size = "md", className = "" }) {
  return <Logo size={size} className={className} showText={false} />;
}

LogoIcon.propTypes = {
  size: PropTypes.oneOf(["sm", "md", "lg", "xl"]),
  className: PropTypes.string,
};

export function LogoWithText({
  size = "md",
  className = "",
  textClassName = "",
  variant = "default",
}) {
  return (
    <Logo
      size={size}
      className={className}
      showText={true}
      textClassName={textClassName}
      variant={variant}
    />
  );
}

LogoWithText.propTypes = {
  size: PropTypes.oneOf(["sm", "md", "lg", "xl"]),
  className: PropTypes.string,
  textClassName: PropTypes.string,
  variant: PropTypes.oneOf(["default", "white", "dark"]),
};
