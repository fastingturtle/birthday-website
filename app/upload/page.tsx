'use client';

import { useState } from 'react';
import axios from 'axios';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { useDropzone } from 'react-dropzone';
import html2canvas from 'html2canvas';
import Image from 'next/image';
import { db } from '../../firebase';
import { Heart, MessageCircle, Send, Bookmark } from 'lucide-react';

// Helper function for rendering Instagram card HTML
const renderInstagramCardToString = (image: string, caption: string, currentDate: string) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Instagram Card</title>
  <link href="https://cdnjs.cloudflare.com/ajax/libs/tailwindcss/2.2.19/tailwind.min.css" rel="stylesheet">
  <style>
    .instagram-card {
      width: 468px;
      background: white;
      border-radius: 8px;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    }
    .profile-image {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background: linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%);
      padding: 2px;
    }
    .profile-image-inner {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background: white;
      display: flex;
      align-items: center;
      justify-content: center;
      color: black;
      font-size: 12px;
    }
    .main-image {
      width: 100%;
      aspect-ratio: 1;
      object-fit: cover;
    }
    .engagement-icon {
      width: 24px;
      height: 24px;
    }
  </style>
</head>
<body class="flex items-center justify-center min-h-screen bg-gray-50 p-4">
  <div class="instagram-card">
    <!-- Header -->
    <div class="flex items-center p-3">
      <div class="profile-image">
        <div class="profile-image-inner">
          BW
        </div>
      </div>
      <div class="ml-3">
        <span class="font-semibold text-sm">birthday_wisher</span>
        <span class="text-gray-500 text-xs block">Original</span>
      </div>
      <div class="ml-auto">
        <svg aria-label="More options" color="rgb(115, 115, 115)" fill="rgb(115, 115, 115)" height="24" role="img" viewBox="0 0 24 24" width="24">
          <circle cx="12" cy="12" r="1.5"></circle>
          <circle cx="6" cy="12" r="1.5"></circle>
          <circle cx="18" cy="12" r="1.5"></circle>
        </svg>
      </div>
    </div>

    <!-- Image -->
    <img src="${image}" class="main-image" alt="Birthday post" />

    <!-- Engagement -->
    <div class="p-3">
      <div class="flex items-center justify-between mb-2">
        <div class="flex items-center space-x-4">
          <svg class="engagement-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
          </svg>
          <svg class="engagement-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
          </svg>
          <svg class="engagement-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="22" y1="2" x2="11" y2="13"></line>
            <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
          </svg>
        </div>
        <svg class="engagement-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
        </svg>
      </div>

      <!-- Likes -->
      <div class="text-sm font-semibold mb-2">
        1,024 likes
      </div>

      <!-- Caption -->
      <div class="text-sm mb-2">
        <span class="font-semibold mr-2">birthday_wisher</span>
        ${caption}
      </div>

      <!-- Date -->
      <div class="text-xs text-gray-500 uppercase">
        ${currentDate}
      </div>
    </div>
  </div>
</body>
</html>
`;

// Helper function for rendering Yearbook card HTML
const renderYearbookCardToString = (images: string[], text: string) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Yearbook Card</title>
  <link href="https://cdnjs.cloudflare.com/ajax/libs/tailwindcss/2.2.19/tailwind.min.css" rel="stylesheet">
  <style>
    .yearbook-card {
      width: 600px;
      background: white;
      border-radius: 0.75rem;
      overflow: hidden;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    }
    .header {
      background: linear-gradient(to right, #3b82f6, #9333ea);
      padding: 1.5rem;
      color: white;
    }
    .image-grid {
      display: grid;
      grid-template-columns: repeat(${images.length === 2 ? 2 : 3}, 1fr);
      gap: 1rem;
      padding: 1.5rem;
    }
    .image-wrapper {
      position: relative;
      aspect-ratio: 1;
      border-radius: 0.5rem;
      overflow: hidden;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    }
    .grid-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    ${images.length === 3 ? `
    .image-wrapper:first-child {
      grid-column: span 3;
    }
    ` : ''}
    ${images.length === 4 ? `
    .image-wrapper:first-child {
      grid-column: span 2;
    }
    ` : ''}
  </style>
</head>
<body class="flex items-center justify-center min-h-screen bg-gray-50 p-4">
  <div class="yearbook-card">
    <div class="header">
      <h2 class="text-center font-bold text-2xl mb-2">Class of 2024</h2>
      <p class="text-center opacity-90">${text}</p>
    </div>
    <div class="image-grid">
      ${images.map((img, i) => `
        <div class="image-wrapper">
          <img src="${img}" alt="Memory ${i + 1}" class="grid-image" />
        </div>
      `).join('')}
    </div>
    <div class="p-4 bg-gray-50 border-t text-center text-sm text-gray-600">
      <span class="font-semibold">Memories</span> • ${new Date().getFullYear()}
    </div>
  </div>
</body>
</html>
`;

type UploadedFile = {
  secure_url: string;
  original_filename: string;
};

type FileQueueItem = {
  file: File;
  progress: number;
  status: 'pending' | 'uploading' | 'completed' | 'failed';
  response?: UploadedFile | null;
};

function InstagramCard({ 
  image, 
  caption,
  exportCardAsImage,
  openCardInNewTab 
}: { 
  image: string; 
  caption: string;
  exportCardAsImage: () => Promise<void>;
  openCardInNewTab: () => void;
}) {
  const currentDate = new Date().toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="flex flex-col items-center">
      <div className="w-full max-w-[468px] mx-auto bg-white rounded-lg shadow-lg">
        {/* Post Header */}
        <div className="flex items-center p-3">
          <div className="h-8 w-8 relative rounded-full overflow-hidden bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500">
            <div className="absolute inset-[2px] rounded-full bg-white flex items-center justify-center">
              <span className="text-xs">BW</span>
            </div>
          </div>
          <div className="ml-3">
            <span className="font-semibold text-sm text-black">birthday_wisher</span>
            <span className="text-gray-500 text-[12px] block leading-none">Original</span>
          </div>
          <div className="ml-auto">
            <svg aria-label="More options" className="_ab6-" color="rgb(115, 115, 115)" fill="rgb(115, 115, 115)" height="24" role="img" viewBox="0 0 24 24" width="24">
              <circle cx="12" cy="12" r="1.5"></circle>
              <circle cx="6" cy="12" r="1.5"></circle>
              <circle cx="18" cy="12" r="1.5"></circle>
            </svg>
          </div>
        </div>

        {/* Image */}
        <div className="aspect-square w-full relative">
          <Image 
            src={image} 
            alt="Birthday post" 
            fill
            sizes="(max-width: 468px) 100vw, 468px"
            className="object-cover"
            priority
          />
        </div>

        {/* Engagement Buttons */}
        <div className="p-3">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-4">
              <Heart className="w-7 h-7 text-gray-900 hover:text-red-500 cursor-pointer transition-colors" />
              <MessageCircle className="w-7 h-7 text-gray-900 hover:text-gray-600 cursor-pointer transition-colors" />
              <Send className="w-7 h-7 text-gray-900 hover:text-gray-600 cursor-pointer transition-colors" />
            </div>
            <Bookmark className="w-7 h-7 text-gray-900 hover:text-gray-600 cursor-pointer transition-colors" />
          </div>

          {/* Likes */}
          <div className="text-sm font-semibold mb-2 text-black">
            1,024 likes
          </div>

          {/* Caption */}
          <div className="text-sm mb-2 text-black">
            <span className="font-semibold mr-2">birthday_wisher</span>
            {caption}
          </div>

          {/* Date */}
          <div className="text-[10px] text-gray-500 uppercase">
            {currentDate}
          </div>

          {/* Comment Input */}
          <div className="mt-3 pt-3 border-t flex items-center">
            <svg aria-label="Emoji" className="mr-4" color="rgb(115, 115, 115)" fill="rgb(115, 115, 115)" height="24" role="img" viewBox="0 0 24 24" width="24">
              <path d="M15.83 10.997a1.167 1.167 0 1 0 1.167 1.167 1.167 1.167 0 0 0-1.167-1.167Zm-6.5 1.167a1.167 1.167 0 1 0-1.166 1.167 1.167 1.167 0 0 0 1.166-1.167Zm5.163 3.24a3.406 3.406 0 0 1-4.982.007 1 1 0 1 0-1.557 1.256 5.397 5.397 0 0 0 8.09 0 1 1 0 0 0-1.55-1.263ZM12 .503a11.5 11.5 0 1 0 11.5 11.5A11.513 11.513 0 0 0 12 .503Zm0 21a9.5 9.5 0 1 1 9.5-9.5 9.51 9.51 0 0 1-9.5 9.5Z"></path>
            </svg>
            <input 
              type="text" 
              placeholder="Add a comment..." 
              className="flex-1 border-none outline-none text-sm text-black"
            />
            <button className="text-blue-500 font-semibold text-sm opacity-50">
              Post
            </button>
          </div>
        </div>
      </div>

      {/* Card Actions */}
      <div className="mt-4 flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:justify-center px-4">
        <button
          className="w-full sm:w-auto px-4 py-2 bg-green-500 text-white rounded shadow hover:bg-green-600 transition-colors"
          onClick={exportCardAsImage}
        >
          Download Card
        </button>
        <button
          className="w-full sm:w-auto px-4 py-2 bg-blue-500 text-white rounded shadow hover:bg-blue-600 transition-colors"
          onClick={openCardInNewTab}
        >
          Preview in New Tab
        </button>
      </div>
    </div>
  );
}

function YearbookCard({ 
  images, 
  text,
  exportCardAsImage,
  openCardInNewTab 
}: { 
  images: string[]; 
  text: string;
  exportCardAsImage: () => Promise<void>;
  openCardInNewTab: () => void;
}) {
  const getGridClass = (count: number) => {
    switch (count) {
      case 2: return 'grid-cols-1 sm:grid-cols-2';
      case 3: return 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3';
      case 4: return 'grid-cols-1 sm:grid-cols-2';
      default: return 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3';
    }
  };

  return (
    <div className="w-full">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Yearbook Header */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-4 sm:p-6">
          <h2 className="text-center text-white font-bold text-xl sm:text-2xl mb-2">
            Class of 2024
          </h2>
          <p className="text-center text-white/90 font-medium text-sm sm:text-base">
            {text}
          </p>
        </div>

        {/* Image Grid */}
        <div className="p-4 sm:p-6">
          <div className={`grid ${getGridClass(images.length)} gap-3 sm:gap-4`}>
            {images.map((image, index) => (
              <div 
                key={index} 
                className={`relative group ${
                  images.length === 3 && index === 0 ? 'md:col-span-3' : ''
                } ${
                  images.length === 4 && index === 0 ? 'sm:col-span-2' : ''
                }`}
              >
                <div className="aspect-square rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow">
                  <div className="relative w-full h-full">
                    <Image 
                      src={image} 
                      alt={`Memory ${index + 1}`} 
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 p-4 border-t">
          <div className="text-center text-sm text-gray-600">
            <span className="font-semibold">Memories</span> • {new Date().getFullYear()}
          </div>
        </div>
      </div>

      {/* Card Actions */}
      <div className="mt-4 flex flex-col sm:flex-row gap-3 sm:gap-4 px-4 sm:justify-center">
        <button
          className="w-full sm:w-auto px-4 py-2 bg-green-500 text-white rounded shadow hover:bg-green-600 transition-colors"
          onClick={exportCardAsImage}
        >
          Download Card
        </button>
        <button
          className="w-full sm:w-auto px-4 py-2 bg-blue-500 text-white rounded shadow hover:bg-blue-600 transition-colors"
          onClick={openCardInNewTab}
        >
          Preview in New Tab
        </button>
      </div>
    </div>
  );
}
  
export default function UploadPage() {
    const [fileQueue, setFileQueue] = useState<FileQueueItem[]>([]);
    const [customText, setCustomText] = useState('');
    const [generatedCard, setGeneratedCard] = useState<'instagram' | 'yearbook' | null>(null);
    const [isUploading, setIsUploading] = useState(false);
  
    const handleDrop = (acceptedFiles: File[]) => {
      const queueItems: FileQueueItem[] = acceptedFiles.map((file) => ({
        file,
        progress: 0,
        status: 'pending',
        response: null,
      }));
      setFileQueue((prevQueue) => [...prevQueue, ...queueItems]);
      uploadFiles(queueItems);
    };
  
    const { getRootProps, getInputProps, isDragActive } = useDropzone({
      onDrop: handleDrop,
      accept: {
        'image/*': [],
      },
    });
  
    const uploadFiles = async (files: FileQueueItem[]) => {
      setIsUploading(true);
      for (const item of files) {
        try {
          setFileQueue((prevQueue) =>
            prevQueue.map((fileItem) =>
              fileItem.file === item.file
                ? { ...fileItem, status: 'uploading' }
                : fileItem
            )
          );
  
          const formData = new FormData();
          formData.append('file', item.file);
          formData.append('upload_preset', 'birthday-preset');
  
          const response = await axios.post<UploadedFile>(
            'https://api.cloudinary.com/v1_1/dngnxkpgb/upload',
            formData,
            {
              onUploadProgress: (event) => {
                if (event.total) {
                  const progressPercentage = Math.round(
                    (event.loaded * 100) / event.total
                  );
                  setFileQueue((prevQueue) =>
                    prevQueue.map((fileItem) =>
                      fileItem.file === item.file
                        ? { ...fileItem, progress: progressPercentage }
                        : fileItem
                    )
                  );
                }
              },
            }
          );
  
          const fileData = {
            name: response.data.original_filename,
            url: response.data.secure_url,
            createdAt: Timestamp.now(),
          };
          await addDoc(collection(db, 'uploads'), fileData);
  
          setFileQueue((prevQueue) =>
            prevQueue.map((fileItem) =>
              fileItem.file === item.file
                ? { ...fileItem, status: 'completed', response: response.data }
                : fileItem
            )
          );
        } catch {
          setFileQueue((prevQueue) =>
            prevQueue.map((fileItem) =>
              fileItem.file === item.file
                ? { ...fileItem, status: 'failed' }
                : fileItem
            )
          );
        }
      }
      setIsUploading(false);
    };
  
    const handleGenerateCard = () => {
      const completedFiles = fileQueue.filter(item => item.status === 'completed');
      
      if (completedFiles.length === 0) {
        alert('Please upload at least one image.');
        return;
      }
  
      if (fileQueue.some(item => item.status === 'uploading')) {
        alert('Please wait for all files to finish uploading.');
        return;
      }
  
      setGeneratedCard(completedFiles.length === 1 ? 'instagram' : 'yearbook');
    };
  
    const exportCardAsImage = async () => {
      if (generatedCard === 'instagram') {
        const image = fileQueue[0]?.response?.secure_url;
        const caption = customText || 'Happy Birthday!';
        const currentDate = new Date().toLocaleDateString('en-US', {
          month: 'long',
          day: 'numeric',
        });
  
        if (!image) return;
  
        const newTab = window.open();
        if (newTab) {
          newTab.document.write(renderInstagramCardToString(image, caption, currentDate));
          await new Promise(resolve => setTimeout(resolve, 1000));
          const element = newTab.document.querySelector('.instagram-card') as HTMLElement;
          if (element) {
            try {
              const canvas = await html2canvas(element, {
                scale: 2,
                useCORS: true,
                allowTaint: true,
                backgroundColor: null,
              });
              const link = document.createElement('a');
              link.download = 'instagram-card.png';
              link.href = canvas.toDataURL('image/png');
              link.click();
              newTab.close();
            } catch (error) {
              console.error('Error exporting card:', error);
              alert('There was an error exporting the card. Please try again.');
            }
          }
        }
      } else if (generatedCard === 'yearbook') {
        const images = fileQueue
          .filter(item => item.status === 'completed' && item.response?.secure_url)
          .map(item => item.response!.secure_url);
        const text = customText || 'Happy Birthday!';
  
        if (images.length === 0) return;
  
        const newTab = window.open();
        if (newTab) {
          newTab.document.write(renderYearbookCardToString(images, text));
          await new Promise(resolve => setTimeout(resolve, 1000));
          const element = newTab.document.querySelector('.yearbook-card') as HTMLElement;
          if (element) {
            try {
              const canvas = await html2canvas(element, {
                scale: 2,
                useCORS: true,
                allowTaint: true,
                backgroundColor: null
                // ... previous code ...

            });
            const link = document.createElement('a');
            link.download = 'yearbook-card.png';
            link.href = canvas.toDataURL('image/png');
            link.click();
            newTab.close();
          } catch (error) {
            console.error('Error exporting card:', error);
            alert('There was an error exporting the card. Please try again.');
          }
        }
      }
    }
  };

  const openCardInNewTab = () => {
    if (generatedCard === 'instagram') {
      const image = fileQueue[0]?.response?.secure_url;
      const caption = customText || 'Happy Birthday!';
      const currentDate = new Date().toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
      });

      if (!image) return;

      const newTab = window.open();
      if (newTab) {
        newTab.document.write(renderInstagramCardToString(image, caption, currentDate));
      }
    } else if (generatedCard === 'yearbook') {
      const images = fileQueue
        .filter(item => item.status === 'completed' && item.response?.secure_url)
        .map(item => item.response!.secure_url);
      const text = customText || 'Happy Birthday!';

      if (images.length === 0) return;

      const newTab = window.open();
      if (newTab) {
        newTab.document.write(renderYearbookCardToString(images, text));
      }
    }
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 text-white p-4 sm:px-8">
      <div className="w-full max-w-4xl mx-auto">
        {/* Title */}
        <h1 className="text-3xl sm:text-5xl font-extrabold text-center mb-6 sm:mb-8">
          Upload Your Memories
        </h1>

        {/* Caption Input */}
        <div className="mb-4 w-full">
          <label className="block text-lg sm:text-xl font-semibold mb-2">
            Caption/Title
          </label>
          <input
            type="text"
            value={customText}
            onChange={(e) => setCustomText(e.target.value)}
            className="w-full px-4 py-2 text-black border border-gray-300 rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-blue-300"
            placeholder="Add a meaningful caption..."
          />
        </div>

        {/* Drag-and-Drop */}
        <div
          {...getRootProps()}
          className={`flex flex-col items-center justify-center w-full p-6 sm:p-8 border-2 border-dashed rounded-lg cursor-pointer transition-all duration-200 ${
            isDragActive
              ? 'bg-blue-200 border-blue-500'
              : 'hover:bg-blue-100 border-gray-300'
          }`}
        >
          <input {...getInputProps()} />
          <p className="text-lg font-medium text-gray-100">
            {isDragActive ? 'Drop files here...' : 'Drag & drop files or click to select'}
          </p>
          <p className="text-sm text-gray-400">(Images only)</p>
        </div>

        {/* File Queue */}
        {fileQueue.length > 0 && (
          <div className="mt-6">
            <h2 className="text-xl font-semibold mb-4">Upload Progress</h2>
            <ul className="space-y-4">
              {fileQueue.map((item, index) => (
                <li
                  key={index}
                  className="flex items-center p-4 bg-white rounded-lg shadow-md space-x-4"
                >
                  <div className="flex-1">
                    <p className="text-black text-sm sm:text-base truncate">{item.file.name}</p>
                    <p className="text-sm text-gray-500">{item.progress}%</p>
                  </div>
                  {item.response?.secure_url && (
                    <div className="relative w-12 h-12 rounded-md overflow-hidden">
                      <Image
                        src={item.response.secure_url}
                        alt={item.file.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Generate Button */}
        <button
          onClick={handleGenerateCard}
          disabled={isUploading}
          className={`mt-6 w-full sm:w-auto px-6 py-3 text-lg font-bold rounded-lg shadow-md transition ${
            isUploading
              ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
              : 'bg-gradient-to-r from-green-400 to-blue-500 hover:from-blue-500 hover:to-green-400 text-white'
          }`}
        >
          Generate Card
        </button>

        {/* Card Previews */}
        {generatedCard && (
          <div className="mt-8">
            <div className="card-preview">
              {generatedCard === 'instagram' && fileQueue[0]?.response?.secure_url && (
                <InstagramCard
                  image={fileQueue[0].response.secure_url}
                  caption={customText || 'Happy Birthday!'}
                  exportCardAsImage={exportCardAsImage}
                  openCardInNewTab={openCardInNewTab}
                />
              )}
              {generatedCard === 'yearbook' && (
                <YearbookCard
                  images={fileQueue
                    .filter((item) => item.status === 'completed' && item.response?.secure_url)
                    .map((item) => item.response!.secure_url)}
                  text={customText || 'Happy Birthday!'}
                  exportCardAsImage={exportCardAsImage}
                  openCardInNewTab={openCardInNewTab}
                />
              )}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}