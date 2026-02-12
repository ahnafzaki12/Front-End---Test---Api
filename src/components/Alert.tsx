interface AlertProps {
  msg: string;
  type: 'success' | 'error';
}

export default function Alert({ msg, type }: AlertProps) {
  return (
    <div className={`mb-6 flex items-center gap-3 p-4 rounded-xl border animate-in fade-in slide-in-from-top-2 duration-300 
      ${type === 'success' 
        ? 'bg-green-50 dark:bg-green-900/20 border-green-100 dark:border-green-800' 
        : 'bg-red-50 dark:bg-red-900/20 border-red-100 dark:border-red-800'}`}>
      <p className={`text-sm font-medium 
        ${type === 'success' ? 'text-green-700 dark:text-green-400' : 'text-red-700 dark:text-red-400'}`}>
        {msg}
      </p>
    </div>
  )
}