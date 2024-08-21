"use client";
import { useRouter } from 'next/navigation';
import { fetchMDfromJina } from "@/actions/create";
import { searchAll } from "@/actions/searchAll";
import { deleteItemfromTable } from '@/actions/delete'
import { useState, useRef, useEffect } from 'react';
import { Button, message } from 'antd';
import { isValidURL } from '@/utils/validateUrl'
type TabType = { id: number, title: string }
export default function HomePage() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false)
  const [delLoading, setDelLoading] = useState(false)
  const [tabList, setTabList] = useState<TabType[] | []>([])
  const handleClick = async () => {
    const inputValue = inputRef.current!.value
    if (!isValidURL(inputValue)) {
      void message.warning('Please enter the correct URL address')
      return
    }
    setLoading(true)
    await fetchMDfromJina(inputValue)
    setLoading(false)
    inputRef.current!.value = ''
    void message.success('Upload successful')
    void getTabList()
  };
  const router = useRouter();
  const handlePreview = (id: number) => { 
    router.push(`/docs/${id}`)
  }
  const handleDelete = async (id: number) => {
    setDelLoading(true)
    await deleteItemfromTable(id)
    setDelLoading(false)
    void message.success('Delete successful')
    void getTabList()
  }
  async function getTabList() { 
    const resData = await searchAll()
    setTabList(resData)
  }
  useEffect(() => {
    void getTabList()
  }, [])
  
  return (
    <main className="flex flex-col items-center h-screen">
      <h2 className="font-bold text-5xl mb-12 mt-12">Grab Docs Tool</h2>
      <div className="flex justify-center items-center w-screen">
        <input ref={inputRef} className="w-1/2 p-2 border border-gray-300 rounded-md mr-2" placeholder="Please Enter URL"/>
        <Button size="large" type="primary" loading={loading} onClick={handleClick}>Submit</Button>
      </div>
      {
        tabList.length > 0 && <ul className="flex flex-col mt-10 h-[65vh] overflow-y-auto">
          <li className="h-8 flex items-center px-2.5 border-b border-gray-300">
            <span className="w-[100px] text-center">key</span>
            <span className="w-[600px] overflow-hidden whitespace-nowrap overflow-ellipsis">title</span>
            <span>operation</span>
          </li>

          {
            tabList.map((item) => {
              return <li key={item.id} className="h-8 flex items-center px-2.5 border-b border-gray-300">
                <span className="w-[100px] text-center">{item.id}</span>
                <span className="w-[600px] overflow-hidden whitespace-nowrap overflow-ellipsis">{item.title}</span>
                <Button size="small" className="mr-2" type="primary" onClick={() => handlePreview(item.id)}>Preview</Button>
                <Button size="small" danger loading={delLoading} onClick={() => handleDelete(item.id)}>Delete</Button>
              </li>
            })
          }
      </ul>
      }
    </main>
  );
}
