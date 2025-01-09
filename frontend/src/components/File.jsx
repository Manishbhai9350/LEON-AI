import { GetFileIcon } from "../utils";

export default function File({ file,fullname,current,ext, setCurrent, idx, Theme, ...props }) {
  const Exts = ext?.split('.') || ''
  return (
    <div
      {...props}
      onClick={() => setCurrent(idx)}
      className={`file flex justify-start items-center px-2 gap-1 rounded-md ${
        Theme === "dark"
          ? `${current !== idx ? 'bg-gray-900 text-white' : 'bg-gray-700 text-white'}`
          : `${current == idx ? 'bg-zinc-800 text-white' : 'bg-gray-300 text-black'}`
      } duration-150 cursor-pointer w-full h-[50px]`}
    >
      {GetFileIcon(Exts[Exts.length - 1])}
      <p
        className={` ${fullname.length > 10 ? 'text-sm' : fullname.length > 5  ? 'text-md' :  'text-xl'} `}
      >
        {fullname}
      </p>
    </div>
  );
}
