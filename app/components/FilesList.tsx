"use client";

import { toast } from "react-toastify";

type Props = {
  files?: any[]
}

function FilesList({ files }: Props) {

  async function downloadFile(fileRef: string) {
    const response = await fetch(`/api/download-file/${fileRef}`);
    console.log(response)
    if (!response.ok) {
      toast.error('Si è verificato un errore');
      return;
    }
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    const fileName = response.headers.get('X-File-Name') || fileRef;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
  }

  return (files &&
    <div className="mt-8">
      <h3 className="text-2xl font-bold">Allegati</h3>
      <ul className="list-disc">
        {files.map((file, index) => (
          <li key={file._key}>
            <span className="font-semibold cursor-pointer hover:text-primary" onClick={()=>downloadFile(file.asset._ref)}>{file?.title ?? ("File_" + (index + 1))}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default FilesList