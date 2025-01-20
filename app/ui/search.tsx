'use client';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import { useDebouncedCallback } from 'use-debounce';

export default function Search({ placeholder }: { placeholder: string }) {
  
  const searchParams = useSearchParams(); //added userSearchParams hook
  const pathname = usePathname(); //added usePathname hook
  const { replace } = useRouter(); //added useRouter hook to use replace function

  const handleSearch = useDebouncedCallback((term) => {
    console.log('searching... ${term}'); //added console.log to check if the search is working
    const param = new URLSearchParams(searchParams); // added new URLSearchParams instance
    param.set('page', '1'); //added to ensure that the page number is reset to 1 when a new search is made
    if (term) {
      param.set('query', term); //if i get empty string, i will remove the search param
    } else {
      param.delete('query'); //if 'search' doesn't work, change it to 'query'
    }
    replace('${pathname}?${param.toString()}'); //replace the current url with the new one
  }, 300);
  return (
    <div className="relative flex flex-1 flex-shrink-0">
      <label htmlFor="search" className="sr-only">
        Search
      </label>
      <input
        className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
        placeholder={placeholder}
        onChange={(e) => {
          handleSearch(e.target.value); //added handleSearch function to handle the search
        }}
        defaultValue={searchParams.get('query')?.toString()} //added defaultValue to ensure input value is always in sync with the URL
      />
      <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
    </div>
  );
}
