'use client';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';

export default function Search({ placeholder }: { placeholder: string }) {
  const searchParams = useSearchParams(); //added userSearchParams hook
  const pathname = usePathname(); //added usePathname hook
  const { replace } = useRouter(); //added useRouter hook to use replace function
  function handleSearch(term: string) {
    console.log('searching... ${term}'); //added console.log to check if the search is working
    
    const param = new URLSearchParams(searchParams); // added new URLSearchParams instance
    if (term) {
      param.set('search', term); //if i get empty string, i will remove the search param
    }else{
      param.delete('search'); //if 'search' doesn't work, change it to 'query'
    }
    replace('${pathname}?${param.toString()}'); //replace the current url with the new one
    console.log(term);
  }
  return (
    <div className="relative flex flex-1 flex-shrink-0">
      <label htmlFor="search" className="sr-only">
        Search
      </label>
      <input
        className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
        placeholder={placeholder}
        onChange={(e) => {
          handleSearch(e.target.value);
        }}
        defaultValue={searchParams.get('search')?.toString()} //added defaultValue to ensure input value is always in sync with the URL
      />
      <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
    </div>
  );
}
