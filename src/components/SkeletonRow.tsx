import React from 'react';

const SkeletonRow = () => {
  return (
    <tr className="border-b border-slate-700/50">
      <td className="p-4">
        <div className="h-4 w-20 bg-slate-700 rounded animate-pulse"></div>
      </td>
      <td className="p-4">
        <div className="h-2 w-full max-w-[100px] bg-slate-700 rounded-full animate-pulse"></div>
      </td>
      <td className="p-4">
        <div className="h-6 w-20 bg-slate-700 rounded-full animate-pulse"></div>
      </td>
      <td className="p-4">
        <div className="h-5 w-16 bg-slate-700 rounded animate-pulse"></div>
      </td>
    </tr>
  );
};

export default SkeletonRow;

// Inconsequential change for repo health
