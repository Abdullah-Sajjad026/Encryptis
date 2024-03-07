import {Label} from "@/components/ui/label"
import {Input} from "@/components/ui/input"
import {Button} from "@/components/ui/button"
import {useState} from "react";
import toast from "react-hot-toast";


const encryptFile = async (file: File, keySize: number = 256) => {

  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`http://localhost:8080/api/v1/encrypt?keySize=${keySize}`, {
    method: 'POST',
    body: formData,
  })

  if (!response.ok) {
    throw new Error(
      `Failed to encrypt file: ${response.status} ${response.statusText}`
    )
  }
  // Create a blob from the response data
 return await response.blob();
}


export default function EncryptionBlock() {
  const [toEncryptFile, setToEncryptFile] = useState<File | null>(null)
  const [encryptedFile, setEncryptedFile] = useState<Blob | null>(null)

  const encrypt = () => {
    // with proper error handling, react-hot-toast and loading states etc
    if (!toEncryptFile)
      return toast.error('Please select a file to encrypt');

    try {
      toast.promise(
        encryptFile(toEncryptFile),
        {
          loading: "Encrypting file...",
          success: (data) => {
            setEncryptedFile(data);
            return "File encrypted successfully";
          },
          error: (error) => {
            console.error("Encryption failed:", error);
            return "Encryption failed. Please try again.";
          }
        },
      );
    } catch (error) {
      console.error("Encryption failed:", error);
      toast.error("Encryption failed. Please try again.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-3xl font-bold">Encrypt</h2>
        <p className="text-gray-500">
          Select a file to encrypt. The file will be encrypted using AES encryption and the encrypted file will be
          downloaded.
        </p>
      </div>
      <div className="space-y-2">
        <Label htmlFor="file-encrypt">Select File</Label>
        <Input accept="*" id="file-encrypt" type="file"
               onChange={(event) => {
                 const file = event.target.files?.[0]
                 if (file){
                    // 500 mb max
                   if(file.size > 500 * 1024 * 1024) {
                     toast.error(`Max File Size: 500Mb`);
                     setEncryptedFile(null);
                     setToEncryptFile(null)
                     return;
                   }
                    setEncryptedFile(null);
                    setToEncryptFile(file)
                  }
               }}
        />
      </div>
      <Button
        className="w-full"
        onClick={encrypt}
      >
        Encrypt
      </Button>
      {
        encryptedFile && (
          <Button className="w-full mt-4" onClick={() => {
            const url = URL.createObjectURL(encryptedFile)
            const a = document.createElement('a')
            a.href = url
            a.download = "EncryptedFile.zip"
            a.click()
          }}>
            Download Encrypted File
          </Button>
        )
      }
    </div>
  )
}
