import { FaRust } from "react-icons/fa";
import { DiCodeBadge } from "react-icons/di";
import { FaCss3 } from "react-icons/fa";
import { DiJsBadge } from "react-icons/di";
import { DiHtml5 } from "react-icons/di";
import { DiPhp } from "react-icons/di";
import { FaPython } from "react-icons/fa";
import { FaJava } from "react-icons/fa";
import { TbBrandCpp } from "react-icons/tb";

const FileData = {
    python: {
        color: '', // Tailwind color for Python
        icon: FaPython,
        size: 24 // Size for Python icon
    },
    javascript: {
        color: 'text-yellow-400', // Tailwind color for JavaScript
        icon: DiJsBadge,
        size: 24 // Size for JavaScript icon
    },
    java: {
        color: 'text-blue-700', // Tailwind color for Java
        icon: FaJava,
        size: 24 // Size for Java icon
    },
    html: {
        color: 'text-red-600', // Tailwind color for HTML
        icon: DiHtml5,
        size: 24 // Size for HTML icon
    },
    css: {
        color: 'text-blue-600', // Tailwind color for CSS
        icon: FaCss3,
        size: 24 // Size for CSS icon
    },
    cpp: {
        color: 'text-blue-500', // Tailwind color for C++
        icon: TbBrandCpp,
        size: 24 // Size for C++ icon
    },
    c: {
        color: 'text-green-600', // Tailwind color for C
        icon: TbBrandCpp,
        size: 24 // Size for C icon
    },
    assembly: {
        color: 'text-gray-600', // Tailwind color for Assembly
        icon: DiCodeBadge,
        size: 24 // Size for Assembly icon
    },
    rust: {
        color: 'text-orange-600', // Tailwind color for Rust
        icon: FaRust,
        size: 24 // Size for Rust icon
    },
    php:{
        color:"",
        icon:DiPhp,
        size:24
    }
}

export function GetFileIcon(file) {
    const fileType = file.split('.').pop().toLowerCase();
    const { icon: Icon, color, size } = FileData[fileType] || { icon: null, color: '', size: 24 }; // Default size

    return (
        <div className={`icon flex justify-center items-center ${color} `}>
            <Icon size={size} />
        </div>
    );
}