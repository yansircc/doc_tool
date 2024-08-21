"use client"
import { useParams } from 'next/navigation';
import ContentLoader from '@/components/ContentLoader';
import { searchItemfromTable } from '@/actions/searchItem'
import { useState, useEffect } from 'react';
interface JsonData {
  title: string;
  url: string;
  content: string;
  images: string;
}
const Docs = () => {
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  const [jsonData, setJsonData] = useState<JsonData | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      if (typeof id === 'string') {
        try {
          const resData = await searchItemfromTable(id);
          setJsonData(resData);
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      } else {
        console.error("Invalid ID parameter");
      }
    };
    void fetchData();
  }, [id]);
  if (!jsonData) {
    return <div className='pt-5 pl-5'>Loading...</div>;
  }
  return (
    <div>
      <ContentLoader jsonData={jsonData} />
    </div>
  )
}
export default Docs;