import React from 'react'

export default function InputErrorMessage({errs}:{errs:[string]}) {
  return (
    <div className='w-full h-min flex flex-col gap-y-0.5'>
        {
            errs.map((err) => <p className="text-sm text-slate-500">{err}</p>)
        }
    </div>
  )
}
