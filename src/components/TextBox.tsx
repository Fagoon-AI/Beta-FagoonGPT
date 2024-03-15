"use client";

interface TextBoxProps {
  children?: React.ReactNode;
  label: string;
}

export default function TextBox({ children, label }: TextBoxProps) {
  if (children)
    return (
      <div className="flex flex-col gap-3 items-center bg-[#2b2b30] md:px-6 md:py-4 px-5 py-3 rounded-2xl hover:bg-[#3d3d42] transition-colors duration-300 cursor-pointer">
        {children}
        <span className="w-[60px] md:text-sm text-xs text-center">{label}</span>
      </div>
    );

  return (
    <div className="w-full bg-[#2b2b30] px-4 py-3 rounded-2xl hover:bg-[#3d3d42] transition-colors duration-300 cursor-pointer md:text-sm text-xs">
      {label}
    </div>
  );
}
