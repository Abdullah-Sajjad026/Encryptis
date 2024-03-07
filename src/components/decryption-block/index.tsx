import {Label} from "@/components/ui/label"
import {Input} from "@/components/ui/input"
import {Button} from "@/components/ui/button"
import {useState} from "react";
import toast from "react-hot-toast";
import axios from "axios";


const decryptFile = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await axios.post('http://localhost:8080/api/v1/decrypt', formData, {
    responseType: 'blob',
  });

  return response.data;
}


export default function DecryptionBlock() {
  const [toDecryptFile, setToDecryptFile] = useState<File | null>(null)
  const [decryptedFile, setDecryptedFile] = useState<File | Blob | null>(null)

  const decrypt = () => {
    // with proper error handling, react-hot-toast and loading states etc
    if (!toDecryptFile)
      return toast.error('Please select a file to decrypt');

    try {
      toast.promise(
        decryptFile(toDecryptFile),
        {
          loading: "decrypting file...",
          success: (data) => {
            setDecryptedFile(data);
            return "File decrypted successfully";
          },
          error: (error) => {
            console.error("Decryption failed:", error);
            return "Decryption failed. Please try again.";
          }
        },
      );
    } catch (error) {
      console.error("Decryption failed:", error);
      toast.error("Decryption failed. Please try again.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-3xl font-bold">Decrypt</h2>
        <p className="text-gray-500">
          Select an encrypted file to decrypt. The file will be decrypted using AES Decryption and the decrypted file
          will be downloaded.
        </p>
      </div>
      <div className="space-y-2">
        <Label htmlFor="file-decrypt">Select Encrypted File</Label>
        <Input accept="*" id="file-decrypt" type="file"
               onChange={(event) => {
                 const file = event.target.files?.[0]
                 if (file) {
                   setDecryptedFile(null);
                   setToDecryptFile(file);
                 }
               }}
        />
      </div>
      <Button
        className="w-full"
        onClick={decrypt}
      >
        Decrypt
      </Button>
      {
        decryptedFile && (
          <Button className="w-full mt-4" onClick={() => {
            const url = URL.createObjectURL(decryptedFile)
            const a = document.createElement('a')
            a.href = url
            a.download = `decrypted-${new Date().getTime()}.${decryptedFile.type.split('/')[1]}`
            a.click()
          }}>
            Download Decrypted File
          </Button>
        )
      }
    </div>
  )
}

