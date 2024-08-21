"use client"
import React, { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import { Image as AImage } from 'antd'
import './ContentLoader.scss'
import light from '@/assets/light.png'
import share from '@/assets/share.png'
interface JsonData {
  title: string
  url: string
  content: string
  images: string
}

interface ContentLoaderProps {
  jsonData: JsonData
}

type ItemsRef = Record<number, HTMLDivElement | null>;

const ContentLoader: React.FC<ContentLoaderProps> = ({ jsonData:data }) => {
  const [titles, setTitles] = useState<string[]>([])
  const [scrolledTitles, setScrolledTitles] = useState<number[]>([])
  const itemsRef = useRef<ItemsRef>({})
  // title
  const extractTitles = (content: string): string[] => {
    const regexHeader = /^(?:!\[Image \d+|###(?!\s*\d)|[\u4e00-\u9fa5a-zA-Z]).*$/;
    const titles = content
      .split('\n\n')
      .filter((line) => regexHeader.test(line))
      .map((item) => item.replace(/!\[([^\]]+)\]\([^)]+\)/g, '$1'))
    titles.shift()
    titles.pop()
    return titles
  };
  // content
  const handleContent = (content: string) => {
    let data = content.split('\n\n')
    const processedData = []
    let skipNextImage = false
    data = data.filter(item => !item.startsWith("[View Page]"))
    for (let i = 0; i < data.length; i++) {
      if (skipNextImage) {
        skipNextImage = false
        continue
      }
      if (data[i]?.startsWith('### ') && data[i + 1]?.startsWith('![Image')) {
        processedData.push({
          step: data[i],
          image: data[i + 1],
        });
        skipNextImage = true
      } else {
        processedData.push(data[i])
      }
    }
    processedData.shift()
    processedData.pop()
    return processedData
  };

  const handleScroll = () => {
    const newScrolledTitles: number[] = []
    const keys = Object.keys(itemsRef.current)
    for (const key of keys) {
      const item = itemsRef.current[parseInt(key)]
      if (item) {
        const rect = item.getBoundingClientRect()
        if (rect.bottom < window.innerHeight) {
          newScrolledTitles.push(parseInt(key))
        }
      }
    }
    setScrolledTitles(newScrolledTitles)
  };

  useEffect(() => {
    setTitles(extractTitles(data.content))
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [data.content])

  const renderNavItems = (titles: string[]) => {
    const scrollToTarget = (index: number) => {
      const item = itemsRef.current[index]
      if (item) {
        item.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    };
    return (
      <ul>
        {titles.map((item, index) => {
          const isActive = scrolledTitles.includes(index)
          const className1 = isActive ? 'active_title_big' : 'title_big'
          const className2 = isActive ? 'active_title_number' : 'title_number'
          const className3 = isActive ? 'active_num_img' : 'num_img'
          if (item.startsWith('###')) {
            return (
              <li key={index} className="left_title_big" onClick={() => scrollToTarget(index)}>
                <span className={className1}>{item.slice(3).trim()}</span>
              </li>
            )
          } else if (item.startsWith('Image')) {
            const number = item.match(/Image (\d+): (.+)/)
            return (
              <li key={index} className="left_image_title" onClick={() => scrollToTarget(index)}>
                <span className={className2}>{number ? number[1] : null}</span>
                <span className="title_text">{item.replace(/Image \d+:/, '').trim()}</span>
              </li>
            );
          } else {
            return (
              <li key={index} className="link_title" onClick={() => scrollToTarget(index)}>
                <span className={className3}>
                  <Image src={light} alt='light' style={{width: '24px'}} />
                </span>
                <span className="img_title_text">{item}</span>
              </li>
            );
          }
        })}
      </ul>
    );
  };

  const renderContent = () => {
    const contents = handleContent(data.content);
    return (
      <div>
        {contents.map((item, index) => {
          if (typeof item === 'string') {
            if (item.startsWith('###')) {
              return (
                <div key={index} className="content_title" ref={(el) => {(itemsRef.current[index] = el)}}>
                  {item.slice(3).trim()}
                </div>
              );
            } else {
              return (
                <div key={index} className="url_box" ref={(el) => {(itemsRef.current[index] = el)}}>
                  {item}
                </div>
              );
            }
          } else if (typeof item === 'object') {
            const title = item.image?.match(/!\[Image \d+: ([^\]]+)\]\([^)]+\)/);
            const number = item.image?.match(/!\[Image (\d+): (.+)/);
            const image = item.image?.match(/\]\(([^)]+)\)/);
            const linkUrl = item.step?.match(/\]\(([^)]+)\)/);
            return (
              <div key={index} ref={(el) => {(itemsRef.current[index] = el)}} className="image_box">
                <div className="image_title">
                  <div className='left_title_wrap'>
                    <span className="number_style">{number ? number[1] : null}</span>
                    <span className="text">{title ? title[1] : null}</span>
                  </div>
                  <div className="share_box">
                    <span className="share_text" onClick={() => window.open(linkUrl![1], '_blank')}>
                      VIEW PAGE
                    </span>
                    <Image src={share} alt='share' className="share_icon" />
                  </div>
                </div>
                <div className="image_content">
                  <AImage src={image ? image[1]! : ''} alt={title ? title[1]! : ''} />
                </div>
              </div>
            );
          } else {
            return <div key={index}>....</div>;
          }
        })}
      </div>
    );
  };

  return (
    <div className="markdown_viewer_box">
      <div className="main">
        <div className="nav_left">
          <h2>{data.title}</h2>
          {renderNavItems(titles)}
        </div>
        <div className="main_content">
          <div className='main_content_w'>
            <h1>{data.title}</h1>
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContentLoader;
