import { GetFileIcon } from "../utils";

export default function File({ file,fullname, Theme, ...props }) {
//   content: "const sum = (a, b) => a + b;";
//   ext: ".js";
//   file: "javascript";
//   fullname: "sum.js";

  return (
    <div
      {...props}
      className={`file flex justify-start items-center px-2 gap-1 rounded-md ${
        Theme === "dark"
          ? "bg-gray-800 hover:bg-gray-700"
          : "bg-gray-500 hover:bg-gray-400"
      } duration-100 cursor-pointer w-full h-[40px]`}
    >
      {GetFileIcon(file)}
      <p
        className={` ${fullname.length > 10 ? 'text-sm' : fullname.length > 5  ? 'text-md' :  'text-xl'} ${Theme === "dark" ? "text-white" : "text-black"}`}
      >
        {fullname}
      </p>
    </div>
  );
}
