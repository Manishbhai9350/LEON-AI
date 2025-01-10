import { FaRust } from "react-icons/fa";
import { DiCodeBadge } from "react-icons/di";
import { FaCss3 } from "react-icons/fa";
import { DiJsBadge } from "react-icons/di";
import { DiHtml5 } from "react-icons/di";
import { DiPhp } from "react-icons/di";
import { FaPython } from "react-icons/fa";
import { FaJava } from "react-icons/fa";
import { TbBrandCpp } from "react-icons/tb";
import { SiDotenv, SiThreedotjs, SiTypescript, SiWebgl } from "react-icons/si"; // Added for .env
import { IoLogoNodejs } from "react-icons/io5";


const SpecifigFileNames = {
    'three.js':{
        color: '', // Tailwind color for Python
        icon: SiThreedotjs,
        size: 24 // Size for Python icon
    }
}

const FileData = {
    python: {
        color: '', // Tailwind color for Python
        icon: FaPython,
        size: 24 // Size for Python icon
    },
    py: {
        color: '', // Tailwind color for Python
        icon: FaPython,
        size: 24 // Size for Python icon
    },
    javascript: {
        color: 'text-yellow-400', // Tailwind color for JavaScript
        icon: DiJsBadge,
        size: 24 // Size for JavaScript icon
    },
    typescript: {
        color: 'text-blue-500', // Tailwind color for JavaScript
        icon: SiTypescript,
        size: 24 // Size for JavaScript icon
    },
    ts: {
        color: 'text-blue-500', // Tailwind color for JavaScript
        icon: SiTypescript,
        size: 24 // Size for JavaScript icon
    },
    js: {
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
    asm: {
        color: 'text-gray-600', // Tailwind color for Assembly
        icon: DiCodeBadge,
        size: 24 // Size for Assembly icon
    },
    rust: {
        color: 'text-orange-600', // Tailwind color for Rust
        icon: FaRust,
        size: 24 // Size for Rust icon
    },
    php: {
        color: "", // Tailwind color for PHP
        icon: DiPhp,
        size: 24 // Size for PHP icon
    },
    json: {
        color: 'text-green-500', // Tailwind color for JSON
        icon: IoLogoNodejs,
        size: 24 // Size for JSON icon
    },
    glsl: {
        color: 'text-blue-500', // Tailwind color for JSON
        icon: SiWebgl,
        size: 24 // Size for JSON icon
    },
    env: {
        color: 'text-yellow-500', // Tailwind color for .env
        icon: SiDotenv,
        size: 24 // Size for .env icon
    }
}

export function GetFileIcon(file,fullname) {
    const fileType = file.split('.').pop().toLowerCase();
    const { icon: Icon, color, size } = SpecifigFileNames[fullname] || FileData[fileType] || { icon: null, color: '', size: 24 }; // Default size

    let MyIcon = Icon || DiCodeBadge

    return (
        <div className={`icon flex justify-center items-center ${color} `}>
            <MyIcon size={size} />
        </div>
    );
}