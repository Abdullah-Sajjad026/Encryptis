import EncryptionBlock from "./components/encryption-block";
import DecryptionBlock from "./components/decryption-block";
import { Toaster } from 'react-hot-toast';

export default function App() {
  return (
    <main className="bg-gradient-to-r from-violet-100-100 to-emerald-100 py-24">
      <div className="container">
        <div className="p-4 flex items-center justify-center min-h-24 bg-gradient-to-r from-slate-900 to-slate-700 mb-12 rounded shadow-sm">
          <h1 className="text-5xl font-bold text-white">AES Encryption & Decryption</h1>
        </div>
        <div className="grid gap-8 lg:grid-cols-2 items-start">
          <EncryptionBlock/>
          <DecryptionBlock/>
        </div>
      </div>
      <Toaster />
    </main>
  )
}

