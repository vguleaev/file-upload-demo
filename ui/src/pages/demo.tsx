import { useCallback, useState } from 'react';
import axios from 'axios';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import './demo.css';
import uploadIcon from '../assets/upload-icon.svg';
import { useDropzone } from 'react-dropzone';
import fileIcon from '../assets/file-icon.svg';
import trashIcon from '../assets/trash-icon.svg';
import clsx from 'clsx';
import prettyBytes from 'pretty-bytes';

const API_DOMAIN_NAME = import.meta.env.VITE_API_URL;

type FileWithId = File & { id: string };

type FileUploadState = {
  progress: number;
  isUploading: boolean;
  isSuccessful: boolean;
  error: string;
};

const Demo = () => {
  const [progressMap, setProgressMap] = useState<Record<string, FileUploadState>>({});
  const [isUploading, setIsUploading] = useState(false);
  const [files, setFiles] = useState<FileWithId[]>([]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const mappedFiles = acceptedFiles.map(
      (file) => Object.assign(file, { id: Math.random().toString(36).substr(2, 9) }) as FileWithId
    );
    setFiles((prev) => [...prev, ...mappedFiles]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const handleSingleFileUpload = async (file: FileWithId) => {
    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      setProgressMap((prev) => ({
        ...prev,
        [file.id]: { progress: 0, isSuccessful: false, error: '', isUploading: true } as FileUploadState,
      }));

      const response = await axios.post(`${API_DOMAIN_NAME}/api/upload`, formData, {
        onUploadProgress: (progressEvent) => {
          setProgressMap((prev) => ({
            ...prev,
            [file.id]: {
              ...prev[file.id],
              progress: Math.round((progressEvent.loaded / (progressEvent.total ?? 0)) * 100),
            } as FileUploadState,
          }));
        },
      });
      console.log('File uploaded successfully: ', response.data);
      setProgressMap((prev) => ({
        ...prev,
        [file.id]: { progress: 100, isSuccessful: true, error: '', isUploading: false },
      }));
    } catch (error) {
      setProgressMap((prev) => ({
        ...prev,
        [file.id]: { progress: 0, isSuccessful: false, error: 'Error uploading file.', isUploading: false },
      }));
    } finally {
      setIsUploading(false);
    }
  };

  const handleUpload = async () => {
    if (!files.length) {
      return;
    }
    await Promise.all(files.map((file) => handleSingleFileUpload(file)));
  };

  const dropZoneClassName = clsx(
    'mb-4 border-dashed border-2 border-[2px] rounded-md w-full h-[200px] flex items-center justify-center transition-colors duration-300 ease-in-out',
    {
      'border-gray-200': !isDragActive,
      'border-red-500': isDragActive,
    }
  );

  const fileUploadIconClassName = clsx('w-7 h-7 opacity-50', {
    'animate-jiggle': isDragActive,
  });

  return (
    <div className="flex flex-col items-center">
      <span className="text-5xl font-bold main-header-text">File Upload Demo</span>
      <div className="mt-10 w-full flex justify-center">
        <Card className="mt-5 p-5 min-w-[700px]">
          <CardHeader>
            <CardTitle className="text-base font-medium">Drag and drop your files</CardTitle>
            <CardDescription>JPEG, PNG, PDF up to 50MB</CardDescription>
          </CardHeader>

          <div {...getRootProps()} className={dropZoneClassName}>
            <input {...getInputProps()} />
            <div className="flex flex-col items-center gap-1.5">
              <img src={uploadIcon} className={fileUploadIconClassName} alt="" />
              <Button size="sm" variant="outline">
                Select files
                <Input className="sr-only" multiple type="file" />
              </Button>
            </div>
          </div>

          <div className="grid gap-2.5">
            {files.map((file) => (
              <div key={file.id}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <img src={fileIcon} className="h-6 w-6" />
                    <div className="text-sm font-medium">{file.name}</div>
                    <div className="text-sm text-gray-500">{prettyBytes(file.size)}</div>
                  </div>
                  <Button size="sm" variant="ghost" onClick={() => setFiles(files.filter((f) => f.id !== file.id))}>
                    <img src={trashIcon} className="h-4 w-4" />
                    <span className="sr-only">Remove</span>
                  </Button>
                </div>
                {progressMap[file.id]?.isUploading && (
                  <div className="flex flex-row items-center">
                    <Progress className="h-2" value={progressMap[file.id].progress} />
                    <div className="w-[50px] text-right text-sm">{progressMap[file.id].progress}%</div>
                  </div>
                )}
                {progressMap[file.id]?.error && (
                  <div className="text-red-500 text-sm text-left">{progressMap[file.id].error}</div>
                )}
                {progressMap[file.id]?.isSuccessful && (
                  <div className="text-green-500 text-sm text-left">File uploaded successfully.</div>
                )}
              </div>
            ))}
          </div>
          {files.length > 0 && (
            <Button onClick={handleUpload} disabled={isUploading} className="mt-5">
              Upload Files
            </Button>
          )}
        </Card>
      </div>
    </div>
  );
};

export default Demo;
